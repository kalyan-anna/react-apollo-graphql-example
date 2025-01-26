import { registerEnumType } from '@nestjs/graphql';

export enum IssueStatus {
  TO_DO = 'TO_DO',
  IN_PROGRESS = 'IN_PROGRESS',
  REVIEW = 'REVIEW',
  DONE = 'DONE',
}

export enum IssueType {
  STORY = 'STORY',
  BUG = 'BUG',
}

registerEnumType(IssueStatus, {
  name: 'IssueStatus',
});

registerEnumType(IssueType, {
  name: 'IssueType',
});

export enum SprintStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  PLANNED = 'PLANNED',
}

registerEnumType(SprintStatus, {
  name: 'SprintStatus',
});

export enum NotificationStatus {
  READ = 'READ',
  UNREAD = 'UNREAD',
}

registerEnumType(NotificationStatus, {
  name: 'NotificationStatus',
});
