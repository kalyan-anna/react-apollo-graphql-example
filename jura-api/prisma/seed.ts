import { PrismaClient } from '@prisma/client';
import issuesData from './mock/issues.json';
import projectData from './mock/projects.json';
import sprintsData from './mock/sprints.json';
import usersData from './mock/users.json';

const prisma = new PrismaClient();

async function createUsers() {
  await prisma.user.createMany({
    data: usersData,
  });
}

async function createProjects() {
  await prisma.project.createMany({
    data: projectData,
  });
}

async function createSprints() {
  await prisma.sprint.createMany({
    data: sprintsData,
  });
}

async function highestOrderIndex(projectId: number, sprintId?: number) {
  const data = await prisma.issue.findFirst({
    where: {
      projectId,
      sprintId,
    },
    orderBy: { orderIndex: 'desc' },
    select: { orderIndex: true },
  });
  return data?.orderIndex ?? 0;
}

async function createIssues() {
  for (const issue of issuesData) {
    const highestindex = await highestOrderIndex(
      issue.projectId,
      issue.sprintId,
    );
    await prisma.issue.create({
      data: {
        ...issue,
        orderIndex: highestindex + 1,
      },
    });
    if (issue.assigneeUserId) {
      await prisma.notification.create({
        data: {
          message: `${issue.issueNumber} has been assigned to you.`,
          userId: issue.assigneeUserId,
          status: 'UNREAD',
        },
      });
    }
  }
}

createUsers().then(async () => {
  await createProjects();
  await createSprints();
  await createIssues();
});
