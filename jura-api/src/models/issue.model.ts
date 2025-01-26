import { ID, Int, ObjectType } from '@nestjs/graphql';
import { IssueStatus, IssueType } from './enums';

import { Field } from '@nestjs/graphql';
import { Sprint } from './sprint.model';
import { User } from './user.model';

@ObjectType()
export class Issue {
  @Field(() => ID, { nullable: false })
  id!: string;

  @Field(() => String, { nullable: false })
  issueNumber!: string;

  @Field(() => String, { nullable: false })
  summary!: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => IssueType, { nullable: false })
  type!: IssueType;

  @Field(() => Int, { nullable: true })
  storyPoints?: number;

  @Field(() => String, { nullable: false })
  projectId!: string;

  @Field(() => IssueStatus, { nullable: false })
  status!: IssueStatus;

  @Field(() => String, { nullable: true })
  sprintId?: string;

  @Field(() => Sprint, { nullable: true })
  sprint?: Sprint;

  @Field(() => String, { nullable: true })
  assigneeUserId?: string;

  @Field(() => User, { nullable: true })
  assignee?: User;

  @Field(() => String, { nullable: false })
  reporterUserId: string;

  @Field(() => User, { nullable: false })
  reporter: User;
}
