import { Field, ID, ObjectType } from '@nestjs/graphql';
import { NotificationStatus } from './enums';

@ObjectType()
export class Notification {
  @Field(() => ID, { nullable: false })
  id!: string;

  @Field(() => String, { nullable: false })
  message!: string;

  @Field(() => NotificationStatus, { nullable: false })
  status!: NotificationStatus;
}
