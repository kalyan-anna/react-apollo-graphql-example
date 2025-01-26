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
    const { id, sprintId, assigneeUserId, reporterUserId, ...dataToUpdate } =
      issueUpdateInput;

    if (assigneeUserId) {
      const prevIssue = await this.issueService.issue({ id: Number(id) });
      if (prevIssue.assigneeUserId !== Number(assigneeUserId)) {
        this.notificationService.createNotification({
          data: {
            message: `${prevIssue.issueNumber} has been assigned to you.`,
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

    return this.issueService.updateIssue({
      where: {
        id: Number(id),
      },
      data: {
        ...dataToUpdate,
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

    return this.issueService.createIssue({
      data: {
        ...dataToCreate,
        issueNumber,
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
