import { Field, InputType, Int } from '@nestjs/graphql';
import { IssueStatus, IssueType } from './enums';

@InputType()
export class IssueCreateInput {
  @Field(() => String, { nullable: false })
  projectId: string;

  @Field(() => String, { nullable: false })
  summary: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => String, { nullable: true })
  assigneeUserId?: string;

  @Field(() => String, { nullable: true })
  reporterUserId?: string;

  @Field(() => IssueType, { nullable: false })
  type: IssueType;

  @Field(() => Int, { nullable: true })
  storyPoints?: number;

  @Field(() => IssueStatus, { nullable: false })
  status: IssueStatus;

  @Field(() => String, { nullable: true })
  sprintId?: string;
}
