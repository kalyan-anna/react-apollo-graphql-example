import * as yup from 'yup';

import { Issue, IssueStatus, IssueType } from '@generated/graphql';
import { Button, Dialog, DialogBody, DialogHeader, IconButton, Input, Option, Select, Textarea, Typography } from '@material-tailwind/react';
import { useCreateIssueMutation, useDeleteIssueMutation, useUpdateIssueMutation } from '../state/issue';
import { useUnCompletedSprintsQuery } from '../state/sprint';

import { XMarkIcon } from '@heroicons/react/24/outline';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router';
import { issueDialog } from '../state/ui-dialog';
import { useUsersQuery } from '../state/user';
import { ISSUE_TYPE_COLOR } from '../utils/constants';
import { Divider } from './design-system/Divider';
import { UserSelect } from './design-system/UserSelect';

const IssueTypeLabel = {
  [IssueType.Bug]: 'Bug',
  [IssueType.Story]: 'Story'
};

const IssueStatusLabel = {
  [IssueStatus.ToDo]: 'To Do',
  [IssueStatus.InProgress]: 'In Progress',
  [IssueStatus.Review]: 'Review',
  [IssueStatus.Done]: 'Done'
};

const schema = yup.object({
  summary: yup.string().required('Summary is required'),
  description: yup.string().nullable(),
  reporterUserId: yup.string().required('Report cannot be unassigned'),
  assigneeUserId: yup.string().nullable(),
  sprintId: yup.string().nullable(),
  storyPoints: yup
    .number()
    .nullable()
    .transform((value, originalValue) => (String(originalValue).trim() === '' ? null : value)),
  type: yup
    .mixed()
    .oneOf(Object.values(IssueType), `Type must be one of: ${Object.values(IssueType).join(', ')}`)
    .required('Type is required')
    .default(IssueType.Story),
  status: yup
    .mixed()
    .oneOf(Object.values(IssueStatus), `Status must be one of: ${Object.values(IssueStatus).join(', ')}`)
    .required('Status is required')
    .default(IssueStatus.ToDo)
});

type FormValues = yup.InferType<typeof schema>;

const UpsertIssueForm = ({ issue }: { issue?: Issue }) => {
  const { closeDialog } = issueDialog.useDialogState();
  const { projectId = '' } = useParams();
  const { data: usersData, loading: usersLoading } = useUsersQuery();
  const { data: sprintsData, loading: sprintLoading } = useUnCompletedSprintsQuery({
    projectId: projectId ?? ''
  });
  const [updateIssue, { loading: loadingUpdate }] = useUpdateIssueMutation();
  const [deleteIssue, { loading: loadingDelete }] = useDeleteIssueMutation();
  const [createIssue, { loading: loadingCreate }] = useCreateIssueMutation();

  const loading = loadingUpdate || loadingDelete || loadingCreate;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    getValues
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      assigneeUserId: issue?.assigneeUserId,
      description: issue?.description,
      reporterUserId: issue?.reporterUserId,
      sprintId: issue?.sprintId,
      status: issue?.status ?? IssueStatus.ToDo,
      storyPoints: issue?.storyPoints,
      summary: issue?.summary,
      type: issue?.type ?? IssueType.Story
    },
    disabled: loading
  });

  const selectedReporterId = watch('reporterUserId');
  const selectedAssigneeUserId = watch('assigneeUserId');
  const selectedSprintId = watch('sprintId');
  const selectedType = watch('type');
  const selectedStatus = watch('status');

  const onSubmit = (data: FormValues) => {
    if (issue?.id) {
      handleUpdateClick(data);
    } else {
      handleCreateClick(data);
    }
  };

  const handleCreateClick = (data: FormValues) => {
    createIssue({
      ...data,
      projectId,
      status: data.status as IssueStatus,
      type: data.type as IssueType
    });
  };

  const handleUpdateClick = (data: FormValues) => {
    updateIssue(
      {
        ...data,
        status: data.status as IssueStatus,
        type: data.type as IssueType,
        id: issue?.id ?? '',
        assigneeUserId: data.assigneeUserId || null,
        sprintId: data.sprintId || null
      },
      issue
    );
  };

  const handleDeleteClick = () => {
    deleteIssue(issue);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="false">
      <DialogHeader className="relative m-0 block">
        {issue?.type && (
          <div className="flex gap-2 items-center h-full mb-3">
            <div className={`w-5 h-5 ${ISSUE_TYPE_COLOR[getValues().type as IssueType]}`} />
            <Typography>{issue?.issueNumber}</Typography>
          </div>
        )}
        <Typography variant="h4" color="blue-gray">
          {issue?.id ? 'Update' : 'Create'} Issue
        </Typography>
        <IconButton size="sm" variant="text" className="!absolute right-3.5 top-3.5" onClick={closeDialog} disabled={loading}>
          <XMarkIcon className="h-4 w-4 stroke-2" />
        </IconButton>
      </DialogHeader>
      <DialogBody className="space-y-8 pb-6">
        <div>
          <Input label="Summary" error={!!errors.summary} {...register('summary')} containerProps={{ className: 'min-w-full' }} />
          {errors?.summary && <p className="text-sm text-red-500 mt-2">{errors.summary?.message}</p>}
        </div>

        <div>
          {!usersLoading && (
            <UserSelect
              label="Reporter"
              users={usersData?.users ?? []}
              value={selectedReporterId ?? ''}
              onChange={value => setValue('reporterUserId', value ?? '')}
              error={!!errors.reporterUserId}
              disabled={loading}
            />
          )}
          {usersLoading && (
            <Typography as="div" variant="paragraph" className="mb-2 h-10 w-full rounded-md bg-gray-300">
              &nbsp;
            </Typography>
          )}
          {errors?.reporterUserId && <p className="text-sm text-red-500 mt-2">{errors.reporterUserId?.message}</p>}
        </div>

        <div>
          {!usersLoading && (
            <UserSelect
              label="Assignee"
              users={usersData?.users ?? []}
              value={selectedAssigneeUserId ?? ''}
              onChange={value => setValue('assigneeUserId', value)}
              error={!!errors.assigneeUserId}
              disabled={loading}
            />
          )}
          {usersLoading && (
            <Typography as="div" variant="paragraph" className="mb-2 h-10 w-full rounded-md bg-gray-300">
              &nbsp;
            </Typography>
          )}
          {errors?.assigneeUserId && <p className="text-sm text-red-500 mt-2">{errors.assigneeUserId?.message}</p>}
        </div>

        <div>
          <Textarea
            rows={7}
            label="Description"
            error={!!errors.description}
            {...register('description')}
            containerProps={{ className: 'min-w-full' }}
          />
          {errors?.description && <p className="text-sm text-red-500 mt-2">{errors.description?.message}</p>}
        </div>

        <div>
          {!sprintLoading && (
            <Select
              label="Sprint"
              value={selectedSprintId ?? ''}
              onChange={value => setValue('sprintId', value)}
              error={!!errors.sprintId}
              selected={() => sprintsData?.find(s => s.id === selectedSprintId)?.name}
              disabled={loading}
              containerProps={{ className: 'min-w-full' }}
            >
              <Option value={undefined} className="h-8">
                {' '}
              </Option>
              {sprintsData?.map(sprint => (
                <Option key={sprint.id} value={sprint.id}>
                  {sprint.name}
                </Option>
              ))}
            </Select>
          )}
          {sprintLoading && (
            <Typography as="div" variant="paragraph" className="mb-2 h-10 w-full rounded-md bg-gray-300">
              &nbsp;
            </Typography>
          )}

          {errors?.assigneeUserId && <p className="text-sm text-red-500 mt-2">{errors.assigneeUserId?.message}</p>}
        </div>

        <div className="flex gap-2">
          <div>
            <Input label="Story points" error={!!errors.storyPoints} {...register('storyPoints')} containerProps={{ className: 'min-w-full' }} />
            {errors?.storyPoints && <p className="text-sm text-red-500 mt-2">{errors.storyPoints?.message}</p>}
          </div>
          <div>
            <Select
              label="Type"
              value={selectedType as string}
              onChange={value => setValue('type', value as IssueType)}
              error={!!errors.type}
              selected={() => IssueTypeLabel[selectedType as IssueType]}
              disabled={loading}
              containerProps={{ className: 'min-w-20 md:min-w-40' }}
            >
              <Option value={IssueType.Story}>{IssueTypeLabel[IssueType.Story]}</Option>
              <Option value={IssueType.Bug}>{IssueTypeLabel[IssueType.Bug]}</Option>
            </Select>
          </div>
          <div>
            <Select
              label="Status"
              value={selectedStatus as string}
              onChange={value => setValue('status', value as IssueStatus)}
              error={!!errors.type}
              selected={() => IssueStatusLabel[selectedStatus as IssueStatus]}
              disabled={loading}
              containerProps={{ className: 'min-w-20 md:min-w-40' }}
            >
              {Object.entries(IssueStatusLabel).map(([key, label]) => (
                <Option value={key} key={key}>
                  {label}
                </Option>
              ))}
            </Select>
          </div>
        </div>

        <div className="flex gap-4 justify-end">
          <Button onClick={closeDialog} variant="text" disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" loading={loadingUpdate || loadingCreate} disabled={loading}>
            {issue?.id ? 'Save  ' : 'Create'}
          </Button>
        </div>

        {issue?.id && (
          <>
            <Divider />

            <div className="flex">
              <Button
                variant="outlined"
                className="ml-auto flex items-center gap-2"
                loading={loadingDelete}
                disabled={loading}
                onClick={handleDeleteClick}
              >
                Delete
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
                  <path
                    fillRule="evenodd"
                    d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
                    clipRule="evenodd"
                  />
                </svg>
              </Button>
            </div>
          </>
        )}
      </DialogBody>
    </form>
  );
};

export function IssueUpsertDialog() {
  const { isOpen, data, closeDialog } = issueDialog.useDialogState();

  return (
    <Dialog size="sm" open={isOpen} handler={closeDialog} className="p-4" dismiss={{ outsidePress: false }}>
      <UpsertIssueForm issue={data} />
    </Dialog>
  );
}
