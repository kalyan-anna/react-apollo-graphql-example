import { Field, InputType } from '@nestjs/graphql';

import { ID } from '@nestjs/graphql';
import { SprintStatus } from './enums';

@InputType()
export class SprintUpdateInput {
  @Field(() => ID, { nullable: false })
  id!: string;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  goal?: string;

  @Field(() => SprintStatus, { nullable: true })
  status?: SprintStatus;

  @Field(() => Date, { nullable: true })
  startDate?: Date;

  @Field(() => Date, { nullable: true })
  endDate?: Date;
}
