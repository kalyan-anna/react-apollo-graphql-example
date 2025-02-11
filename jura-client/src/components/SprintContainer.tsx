import { Issue, IssueStatus, SprintStatus } from '@generated/graphql';
import { Button, Chip, Typography } from '@material-tailwind/react';

import { closestCenter, DndContext, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import cx from 'classnames';
import { format } from 'date-fns';
import { useParams } from 'react-router';
import { useUpdateIssueOrderMutation } from '../state/issue';
import { useActiveSprintQuery } from '../state/sprint';
import { useCompleteSprintMutation, useStartSprintMutation } from '../state/sprint/mutations';
import { sprintCompleteWarningDialog, sprintStartWarningDialog } from '../state/ui-dialog';
import { SprintIssueSortableItem } from './SprintIssueSortableItem';

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
  const { openDialog: openCompleteWarningDialog } = sprintCompleteWarningDialog.useDialogState();
  const { openDialog: openStartWarningDialog } = sprintStartWarningDialog.useDialogState();
  const [completeSprint, { loading: loadingCompelte }] = useCompleteSprintMutation();
  const [startSprint, { loading: loadingStart }] = useStartSprintMutation();
  const { projectId = '' } = useParams();
  const { data } = useActiveSprintQuery({ projectId });
  const [updateIssueOrder] = useUpdateIssueOrderMutation();

  const handleCompleteSprint = () => {
    const hasPendingIssues = issues?.some(issue => issue.status !== IssueStatus.Done) ?? false;
    if (hasPendingIssues) {
      openCompleteWarningDialog();
    } else {
      completeSprint(sprintId ?? '');
    }
  };

  const handleStartSprint = () => {
    if (data) {
      openStartWarningDialog();
    } else {
      startSprint(sprintId ?? '');
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }
    updateIssueOrder({ activeIssueId: String(active.id), overIssueId: String(over.id), issues: issues ?? [] });
  };

  return (
    <div
      className={cx('p-4 bg-gray-200 flex flex-col gap-1', {
        'text-gray-500': status === SprintStatus.Completed
      })}
    >
      <div className="text-sm flex gap-3">
        <Typography as="h3" className={cx('text-sm font-semibold tracking-wider m-0')}>
          {name}
        </Typography>
        {startDate && endDate && (
          <div className="flex gap-1 text-sm">
            <Typography className="text-sm">{format(startDate, 'dd MMM')}</Typography>
            <Typography className="text-sm"> - </Typography>
            <Typography className="text-sm">{format(endDate, 'dd MMM')}</Typography>
          </div>
        )}
        {status === SprintStatus.Active && <Chip variant="ghost" value="Active" size="sm" color="brown" className="ml-8" />}
        {status === SprintStatus.Completed && <Chip variant="ghost" value="Completed" size="sm" color="blue-gray" className="ml-8 text-gray-500" />}
        {status === SprintStatus.Active && (
          <Button size="sm" variant="outlined" className="ml-auto" onClick={handleCompleteSprint} loading={loadingCompelte}>
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
      {issues && (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={issues.map(issue => issue.id)} strategy={verticalListSortingStrategy} disabled={status === SprintStatus.Completed}>
            <table
              className={cx('w-full min-w-max table-auto text-left mt-4', {
                'text-gray-500': status === SprintStatus.Completed
              })}
            >
              <tbody>
                {issues?.map((issue, index) => {
                  const isLast = issues?.length ?? 0 - 1 === index;
                  const classes = isLast ? 'py-4' : 'py-4 border-b border-gray-500';
                  return <SprintIssueSortableItem key={issue.id} issue={issue} classes={classes} />;
                })}
              </tbody>
            </table>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
};
