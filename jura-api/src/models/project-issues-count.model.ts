import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ProjectIssuesCount {
  @Field(() => String)
  projectId: string;

  @Field(() => Int)
  issuesCount: number;
}
