import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class UserUpdateInput {
  @Field(() => ID, { nullable: false })
  id!: string;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  password?: string;
}
