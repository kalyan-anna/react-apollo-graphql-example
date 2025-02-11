import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { NotificationStatus } from 'src/models/enums';
import { IssueCreateInput } from 'src/models/issue-create.input';
import { IssueUpdateInput } from 'src/models/issue-update.input';
import { Issue } from 'src/models/issue.model';
import { IssueService } from 'src/services/issue.service';
import { NotificationService } from 'src/services/notification.service';
import { ProjectService } from 'src/services/project.service';
import { SprintService } from 'src/services/sprint.service';
import { UserService } from 'src/services/user.service';

@Resolver(() => Issue)
export class IssueResolver {
  constructor(
    private readonly issueService: IssueService,
    private readonly sprintService: SprintService,
    private readonly userService: UserService,
    private readonly projectService: ProjectService,
    private readonly notificationService: NotificationService,
  ) {}

  @Query(() => [Issue])
  async issues(
    @Args('projectId', { type: () => String }) projectId: string,
    @Args('sprintId', { type: () => String, nullable: true })
    sprintId?: string,
  ) {
    return await this.issueService.issues({
      projectId: Number(projectId),
      sprintId: sprintId && Number(sprintId),
    });
  }

  @ResolveField()
  async sprint(@Parent() issue: Issue) {
    const { id } = issue;
    return this.sprintService.sprint({ id: Number(id) });
  }

  @ResolveField()
  async assignee(@Parent() issue: Issue) {
    const { id } = issue;
    return this.userService.findUserAssignedToIssue(Number(id));
  }

  @ResolveField()
  async reporter(@Parent() issue: Issue) {
    const { id } = issue;
    return this.userService.findUserReportedTheIssue(Number(id));
  }

  @Mutation(() => Issue)
  async updateIssue(
    @Args('issueUpdateInput')
    issueUpdateInput: IssueUpdateInput,
  ) {
    const {
      id,
      sprintId,
      assigneeUserId,
      reporterUserId,
      orderIndex,
      ...dataToUpdate
    } = issueUpdateInput;

    const oldIssue = await this.issueService.issue({ id: Number(id) });
    if (assigneeUserId) {
      if (oldIssue.assigneeUserId !== Number(assigneeUserId)) {
        this.notificationService.createNotification({
          data: {
            message: `${oldIssue.issueNumber} has been assigned to you.`,
            status: NotificationStatus.UNREAD,
            User: {
              connect: {
                id: Number(assigneeUserId),
              },
            },
          },
        });
      }
    }

    let newOrderIndex = orderIndex ?? oldIssue.orderIndex;
    if (
      sprintId === null ||
      (sprintId && oldIssue.sprintId !== Number(sprintId))
    ) {
      const highestOrderIndex = await this.issueService.highestOrderIndex({
        ...(sprintId && { sprintId: Number(sprintId) }),
        projectId: oldIssue.projectId,
      });
      newOrderIndex = highestOrderIndex + 1;
    }

    return this.issueService.updateIssue({
      where: {
        id: Number(id),
      },
      data: {
        ...dataToUpdate,
        orderIndex: newOrderIndex,
        ...(sprintId && { sprintId: Number(sprintId) }),
        ...(assigneeUserId && { assigneeUserId: Number(assigneeUserId) }),
        ...(reporterUserId && { reporterUserId: Number(reporterUserId) }),
      },
    });
  }

  @Mutation(() => Issue)
  async createIssue(
    @Args('issueCreateInput')
    issueCreateInput: IssueCreateInput,
  ) {
    const {
      sprintId,
      projectId,
      assigneeUserId,
      reporterUserId,
      ...dataToCreate
    } = issueCreateInput;

    const project = await this.projectService.project({
      id: Number(projectId),
    });
    const highestIssueNumber = await this.issueService.highestIssueNumber(
      Number(projectId),
    );
    const issueNumber = `${project.name.slice(0, 2).toUpperCase()}${highestIssueNumber + 1}`;

    if (assigneeUserId) {
      this.notificationService.createNotification({
        data: {
          message: `${issueNumber} has been assigned to you.`,
          status: NotificationStatus.UNREAD,
          User: {
            connect: {
              id: Number(assigneeUserId),
            },
          },
        },
      });
    }

    const highestOrderIndex = await this.issueService.highestOrderIndex({
      projectId: Number(projectId),
      sprintId: Number(sprintId),
    });

    return this.issueService.createIssue({
      data: {
        ...dataToCreate,
        issueNumber,
        orderIndex: highestOrderIndex + 1,
        Project: {
          connect: {
            id: Number(projectId),
          },
        },
        Reporter: {
          connect: {
            id: Number(reporterUserId),
          },
        },
        ...(sprintId && {
          Sprint: {
            connect: {
              id: Number(sprintId),
            },
          },
        }),
        ...(assigneeUserId && {
          Assignee: {
            connect: {
              id: Number(assigneeUserId),
            },
          },
        }),
      },
    });
  }

  @Mutation(() => Boolean)
  async deleteIssue(
    @Args('id', { type: () => String })
    id: string,
  ) {
    await this.issueService.deleteIssue({ where: { id: Number(id) } });
    return true;
  }
}
