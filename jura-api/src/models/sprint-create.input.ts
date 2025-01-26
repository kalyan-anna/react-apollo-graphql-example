import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SprintCreateInput {
  @Field(() => String, { nullable: false })
  projectId!: string;

  @Field(() => String, { nullable: false })
  name!: string;

  @Field(() => String, { nullable: false })
  goal!: string;

  @Field(() => Date, { nullable: true })
  startDate?: Date;

  @Field(() => Date, { nullable: true })
  endDate?: Date;
}
