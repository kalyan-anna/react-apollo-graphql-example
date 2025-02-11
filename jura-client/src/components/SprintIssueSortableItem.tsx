import { Issue } from "@generated/graphql";
import { issueDialog } from "../state/ui-dialog";
import { ISSUE_TYPE_COLOR } from "../utils/constants";
import { Typography } from "@material-tailwind/react";
import Avatar from "react-avatar";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SprintIssueItemProps {
  issue: Issue;
  classes: string;
}

export const SprintIssueSortableItem = ({ issue, classes }: SprintIssueItemProps) => {
  const { summary, issueNumber, status, assignee, storyPoints } = issue;
  const { openDialog } = issueDialog.useDialogState();
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: issue.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleIssueDbClick = () => {
    openDialog(issue);
  };

  return (
    <tr
      ref={setNodeRef}
      className="hover:bg-gray-50 cursor-pointer"
      onDoubleClick={handleIssueDbClick}
      style={style}
      {...attributes}
      {...listeners}
    >
      <td className={`${classes} w-1/3 flex gap-2 items-center`}>
        <div className={`w-3 h-3 ${ISSUE_TYPE_COLOR[issue?.type]}`} />
        <Typography variant="small" className="font-normal">
          {issueNumber}
        </Typography>
      </td>
      <td className={`${classes} w-1/2`}>
        <Typography variant="small" className="font-normal">
          {summary}
        </Typography>
      </td>
      <td className={`${classes}  w-1/6`}>
        <Typography variant="small" className="font-normal">
          {status}
        </Typography>
      </td>
      <td className={`${classes}  w-1/8`}>
        <Avatar name={assignee?.name ?? "Unassigned"} size="20" round={true} />
      </td>
      <td className={`${classes}  w-1/8`}>
        <div>
          <Typography
            variant="small"
            color="blue-gray"
            className="font-normal bg-gray-500 w-6 text-center rounded-full"
          >
            {storyPoints ?? 0}
          </Typography>
        </div>
      </td>
    </tr>
  );
};
