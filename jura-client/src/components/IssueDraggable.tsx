import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Issue } from "@generated/graphql";
import { Typography } from "@material-tailwind/react";
import Avatar from "react-avatar";
import { ISSUE_TYPE_COLOR } from "../utils/constants";
import { issueDialog } from "../state/ui-dialog";

export interface IssueDraggableProps {
  issue: Issue;
}

export const IssueDraggable = ({ issue }: IssueDraggableProps) => {
  const { id, summary, assignee, issueNumber, storyPoints, type } = issue;
  const { attributes, listeners, setNodeRef, transform, isDragging } = useSortable({
    id,
  });
  const { openDialog } = issueDialog.useDialogState();

  const handleDbClick = () => {
    openDialog(issue);
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`p-3 bg-white border border-gray-300  cursor-pointer flex flex-col gap-3 rounded-md shadow-md  ${
        isDragging ? "opacity-50 border-1 border-dashed border-gray-500" : ""
      }`}
      style={{
        transform: CSS.Transform.toString(transform),
        marginBottom: "10px",
      }}
      onDoubleClick={handleDbClick}
    >
      <Typography className="text-md tracking-wide">{summary}</Typography>
      {assignee?.name && <Typography className="text-xs text-blue-gray-800">{assignee?.name}</Typography>}
      <div className="flex w-full">
        <div className="flex gap-2 items-center">
          <div className={`w-3 h-3 ${ISSUE_TYPE_COLOR[type]}`} />
          <Typography className="text-xs">{issueNumber}</Typography>
        </div>
        <div className="ml-auto flex gap-3 items-center">
          {storyPoints && (
            <Typography className="w-4 h-4 bg-gray-500 text-white rounded-full flex items-center justify-center text-[0.6rem]">
              {storyPoints}
            </Typography>
          )}
          <Avatar name={assignee?.name ?? "Unassigned"} size="20" round={true} />
        </div>
      </div>
    </div>
  );
};
