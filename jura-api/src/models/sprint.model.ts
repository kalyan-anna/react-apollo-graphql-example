import { Field } from '@nestjs/graphql';

import { ID, ObjectType } from '@nestjs/graphql';
import { SprintStatus } from './enums';
import { Issue } from './issue.model';

@ObjectType()
export class Sprint {
  @Field(() => ID, { nullable: false })
  id!: string;

  @Field(() => String, { nullable: false })
  projectId!: string;

  @Field(() => String, { nullable: false })
  name!: string;

  @Field(() => String, { nullable: false })
  goal!: string;

  @Field(() => SprintStatus, { nullable: false })
  status!: SprintStatus;

  @Field(() => Date, { nullable: true })
  startDate?: Date;

  @Field(() => Date, { nullable: true })
  endDate?: Date;

  @Field(() => [Issue], { nullable: true })
  issues?: Issue[];
}
