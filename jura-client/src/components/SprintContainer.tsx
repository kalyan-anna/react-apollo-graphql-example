import { Issue, IssueStatus, SprintStatus } from "@generated/graphql";
import { Button, Chip, Typography } from "@material-tailwind/react";

import { format } from "date-fns";
import Avatar from "react-avatar";
import { ISSUE_TYPE_COLOR } from "../utils/constants";
import cx from "classnames";
import { issueDialog, sprintCompleteWarningDialog, sprintStartWarningDialog } from "../state/ui-dialog";
import { useCompleteSprintMutation, useStartSprintMutation } from "../state/sprint/mutations";
import { useActiveSprintQuery } from "../state/sprint";
import { useParams } from "react-router";

interface SprintContainerProps {
  sprintId?: string;
  name: string;
  startDate?: Date;
  endDate?: Date;
  goal?: string;
  issues?: Issue[] | null;
  status?: SprintStatus;
}

export const SprintContainer = ({ name, startDate, endDate, goal, issues, status, sprintId }: SprintContainerProps) => {
  const { openDialog } = issueDialog.useDialogState();
  const { openDialog: openCompleteWarningDialog } = sprintCompleteWarningDialog.useDialogState();
  const { openDialog: openStartWarningDialog } = sprintStartWarningDialog.useDialogState();
  const [completeSprint, { loading: loadingCompelte }] = useCompleteSprintMutation();
  const [startSprint, { loading: loadingStart }] = useStartSprintMutation();
  const { projectId = "" } = useParams();
  const { data } = useActiveSprintQuery({ projectId });

  const handleIssueClick = (issue: Issue) => {
    openDialog(issue);
  };

  const handleCompleteSprint = () => {
    const hasPendingIssues = issues?.some((issue) => issue.status !== IssueStatus.Done) ?? false;
    if (hasPendingIssues) {
      openCompleteWarningDialog();
    } else {
      completeSprint(sprintId ?? "");
    }
  };

  const handleStartSprint = () => {
    if (data) {
      openStartWarningDialog();
    } else {
      startSprint(sprintId ?? "");
    }
  };

  return (
    <div
      className={cx("p-4 bg-gray-200 flex flex-col gap-1", {
        "text-gray-500": status === SprintStatus.Completed,
      })}
    >
      <div className="text-sm flex gap-3">
        <Typography as="h3" className={cx("text-sm font-semibold tracking-wider m-0")}>
          {name}
        </Typography>
        {startDate && endDate && (
          <div className="flex gap-1 text-sm">
            <Typography className="text-sm">{format(startDate, "dd MMM")}</Typography>
            <Typography className="text-sm"> - </Typography>
            <Typography className="text-sm">{format(endDate, "dd MMM")}</Typography>
          </div>
        )}
        {status === SprintStatus.Active && (
          <Chip variant="ghost" value="Active" size="sm" color="brown" className="ml-8" />
        )}
        {status === SprintStatus.Completed && (
          <Chip variant="ghost" value="Completed" size="sm" color="blue-gray" className="ml-8 text-gray-500" />
        )}
        {status === SprintStatus.Active && (
          <Button
            size="sm"
            variant="outlined"
            className="ml-auto"
            onClick={handleCompleteSprint}
            loading={loadingCompelte}
          >
            Complete Sprint
          </Button>
        )}
        {status === SprintStatus.Planned && (
          <Button size="sm" variant="outlined" className="ml-auto" onClick={handleStartSprint} loading={loadingStart}>
            Start Sprint
          </Button>
        )}
      </div>
      {goal && <Typography className="text-[0.75rem] italic">{goal}</Typography>}
      {issues?.length === 0 && <Typography className="mt-4 text-[0.75rem]">No issues found.</Typography>}
      <table
        className={cx("w-full min-w-max table-auto text-left mt-4", {
          "text-gray-500": status === SprintStatus.Completed,
        })}
      >
        <tbody>
          {issues?.map((issue, index) => {
            const { summary, issueNumber, status, assignee, storyPoints } = issue;
            const isLast = issues?.length ?? 0 - 1 === index;
            const classes = isLast ? "py-4" : "py-4 border-b border-gray-500";

            return (
              <tr key={issueNumber} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleIssueClick(issue)}>
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
          })}
        </tbody>
      </table>
    </div>
  );
};
