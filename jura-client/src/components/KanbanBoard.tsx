import {
  Active,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  KeyboardSensor,
  Over,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { Breadcrumbs, Button, Typography } from "@material-tailwind/react";
import { useActiveSprintIssuesQuery, useActiveSprintQuery } from "../state/sprint";

import { useDroppable } from "@dnd-kit/core";
import { IssueStatus } from "@generated/graphql";
import { FC } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useUpdateIssueCache, useUpdateIssueMutation } from "../state/issue";
import { useProjectQuery } from "../state/project";
import { useCompleteSprintMutation } from "../state/sprint/mutations";
import { issueDialog, sprintCompleteWarningDialog } from "../state/ui-dialog";
import { IssueDraggable } from "./IssueDraggable";

const COLUMNS = [
  {
    id: IssueStatus.ToDo,
    title: "To Do",
  },
  {
    id: IssueStatus.InProgress,
    title: "In Progress",
  },
  {
    id: IssueStatus.Review,
    title: "Review",
  },
  {
    id: IssueStatus.Done,
    title: "Done",
  },
];

export type ColumnDroppableProps = {
  id: IssueStatus;
  title: string;
  projectId: string;
};

const ColumnDroppable: FC<ColumnDroppableProps> = ({ id, title, projectId }) => {
  const { data: issues } = useActiveSprintIssuesQuery({
    projectId,
    status: id,
  });
  const { setNodeRef } = useDroppable({ id: id });

  return (
    <SortableContext id={id} items={issues ?? []} strategy={rectSortingStrategy}>
      <div ref={setNodeRef} className="flex flex-col w-1/3 bg-gray-100 rounded-lg p-4 shadow-md">
        <h4 className="text-lg font-bold mb-4 capitalize text-gray-700">{title}</h4>
        {issues?.map((card) => (
          <IssueDraggable key={card.id} issue={card} />
        ))}
      </div>
    </SortableContext>
  );
};

export function KanbanBoard() {
  const { projectId = "" } = useParams();
  const { data } = useActiveSprintQuery({ projectId: projectId ?? "" });
  const [updateIssue] = useUpdateIssueMutation({ showNotificationOnUpdate: false });
  const { updateIssueCache } = useUpdateIssueCache();
  const { openDialog: openWarningDialog } = sprintCompleteWarningDialog.useDialogState();
  const [completeSprint, { loading }] = useCompleteSprintMutation();
  const navigate = useNavigate();
  const { openDialog: openUpsertIssueDialog } = issueDialog.useDialogState();
  const selectedProject = useProjectQuery(projectId);

  const findColumnId = (unique: string | null) => {
    if (!unique) {
      return null;
    }
    const matchingColumn = COLUMNS.find((c) => c.id === unique);
    if (matchingColumn) {
      return matchingColumn.id;
    }
    const matchingIssue = data?.issues?.find((c) => c.id === unique);
    if (matchingIssue) {
      return matchingIssue.status;
    }
  };

  const updateLocalCache = (active: Active, over: Over | null) => {
    const activeId = String(active.id);
    const overId = over ? String(over.id) : null;
    if (activeId === overId) {
      return;
    }

    const overColumnId = findColumnId(overId);
    const activeColumnId = findColumnId(activeId);
    if (!overColumnId) {
      return;
    }
    if (activeColumnId === overColumnId) {
      return;
    }
    const matchingIssue = data?.issues?.find((i) => i.id === activeId);
    if (!matchingIssue) {
      return;
    }
    updateIssueCache(matchingIssue, overColumnId);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    updateLocalCache(active, over);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    updateLocalCache(active, over);
    const activeId = String(active.id);
    const columnId = findColumnId(activeId);
    if (columnId) {
      updateIssue({
        id: activeId,
        status: columnId,
      });
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleCompleteSprint = () => {
    const hasPendingIssues = data?.issues?.some((issue) => issue.status !== IssueStatus.Done) ?? false;
    if (hasPendingIssues) {
      openWarningDialog();
    } else {
      completeSprint(data?.id ?? "", { onCompleted: () => navigate("../issues") });
    }
  };

  const handleCreateIssue = () => {
    openUpsertIssueDialog();
  };

  return (
    <div className="h-full w-full">
      <Breadcrumbs className="mb-2">
        <Link to="/">Projects</Link>
        <span>{selectedProject?.data?.name}</span>
        <span>Active Sprint</span>
      </Breadcrumbs>
      <div className="flex items-center w-full">
        <div>
          <Typography variant="h3">{data?.name}</Typography>
          <Typography variant="lead" className="text-gray-500 text-md">
            {data?.goal}
          </Typography>
        </div>
        <div className="ml-auto flex gap-4">
          <Button variant="filled" onClick={handleCreateIssue}>
            Create Issue
          </Button>
          <Button variant="outlined" onClick={handleCompleteSprint} loading={loading}>
            Complete Sprint
          </Button>
        </div>
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 mt-6 h-full">
          {COLUMNS.map((column) => (
            <ColumnDroppable key={column.id} id={column.id} title={column.title} projectId={projectId ?? ""} />
          ))}
        </div>
      </DndContext>
    </div>
  );
}
