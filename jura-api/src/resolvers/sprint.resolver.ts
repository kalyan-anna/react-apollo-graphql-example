import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { SprintStatus } from 'src/models/enums';
import { SprintCreateInput } from 'src/models/sprint-create.input';
import { SprintUpdateInput } from 'src/models/sprint-update.input';
import { Sprint } from 'src/models/sprint.model';
import { IssueService } from 'src/services/issue.service';
import { SprintService } from 'src/services/sprint.service';

@Resolver(() => Sprint)
export class SprintResolver {
  constructor(
    private readonly issueService: IssueService,
    private readonly sprintService: SprintService,
  ) {}

  @Query(() => [Sprint])
  async sprints(@Args('projectId', { type: () => String }) projectId: string) {
    return await this.sprintService.sprints({ projectId: Number(projectId) });
  }

  @ResolveField()
  async issues(@Parent() sprint: Sprint) {
    const { id } = sprint;
    return this.issueService.issues({ sprintId: Number(id) });
  }

  @Mutation(() => Sprint)
  async createSprint(
    @Args('sprintCreateInput')
    sprintCreateInput: SprintCreateInput,
  ) {
    const { projectId, ...dataToCreate } = sprintCreateInput;

    return this.sprintService.createSprint({
      data: {
        ...dataToCreate,
        status: SprintStatus.PLANNED,
        Project: {
          connect: {
            id: Number(projectId),
          },
        },
      },
    });
  }

  @Mutation(() => Sprint)
  async updateSprint(
    @Args('sprintUpdateInput')
    sprintUpdateInput: SprintUpdateInput,
  ) {
    const { id, ...dataToUpdate } = sprintUpdateInput;

    return this.sprintService.updateSprint({
      where: {
        id: Number(id),
      },
      data: {
        ...dataToUpdate,
      },
    });
  }
}
