import { Prisma, Project } from '@prisma/client';

import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  async project(
    projectWhereUniqueInput: Prisma.ProjectWhereUniqueInput,
  ): Promise<Project | null> {
    return this.prisma.project.findUnique({
      where: projectWhereUniqueInput,
    });
  }

  // Get all the projects the user owns or has an issue assigned or reported
  async projectsByUserId(id: number): Promise<Project[] | null> {
    const issues = await this.prisma.issue.findMany({
      where: {
        OR: [{ assigneeUserId: id }, { reporterUserId: id }],
      },
    });
    const sprintIds = issues.map((i) => i.sprintId).filter(Boolean);
    return this.prisma.project.findMany({
      where: {
        OR: [{ ownerId: id }, { Sprints: { some: { id: { in: sprintIds } } } }],
      },
    });
  }
}
