import { Field, Float, ID, InputType, Int } from '@nestjs/graphql';
import { IssueStatus, IssueType } from './enums';

@InputType()
export class IssueUpdateInput {
  @Field(() => ID, { nullable: false })
  id: string;

  @Field(() => String, { nullable: true })
  summary?: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => Float, { nullable: true })
  orderIndex?: number;

  @Field(() => String, { nullable: true })
  assigneeUserId?: string;

  @Field(() => String, { nullable: true })
  reporterUserId?: string;

  @Field(() => IssueType, { nullable: true })
  type?: IssueType;

  @Field(() => Int, { nullable: true })
  storyPoints?: number;

  @Field(() => IssueStatus, { nullable: true })
  status?: IssueStatus;

  @Field(() => String, { nullable: true })
  sprintId?: string;
}
