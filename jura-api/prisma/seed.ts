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

async function createIssues() {
  await prisma.issue.createMany({
    data: issuesData,
  });
  issuesData.forEach(async (issue) => {
    if (issue.assigneeUserId) {
      await prisma.notification.create({
        data: {
          message: `${issue.issueNumber} has been assigned to you.`,
          userId: issue.assigneeUserId,
          status: 'UNREAD',
        },
      });
    }
  });
}

createUsers().then(async () => {
  await createProjects();
  await createSprints();
  await createIssues();
});
