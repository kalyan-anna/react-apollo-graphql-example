import { Issue, Prisma } from '@prisma/client';

import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class IssueService {
  constructor(private prisma: PrismaService) {}

  async issue(
    issueWhereUniqueInput: Prisma.IssueWhereUniqueInput,
  ): Promise<Issue | null> {
    return this.prisma.issue.findUnique({
      where: issueWhereUniqueInput,
    });
  }

  async issues(issueWhereInput: Prisma.IssueWhereInput): Promise<Issue[]> {
    return this.prisma.issue.findMany({
      where: issueWhereInput,
    });
  }

  async updateIssue({
    where,
    data,
  }: {
    where: Prisma.IssueWhereUniqueInput;
    data: Prisma.IssueUncheckedUpdateInput;
  }): Promise<Issue> {
    return this.prisma.issue.update({
      where,
      data,
    });
  }

  async createIssue({
    data,
  }: {
    data: Prisma.IssueCreateInput;
  }): Promise<Issue> {
    return this.prisma.issue.create({
      data,
    });
  }

  async deleteIssue({
    where,
  }: {
    where: Prisma.IssueWhereUniqueInput;
  }): Promise<Issue> {
    return this.prisma.issue.delete({
      where,
    });
  }

  async highestIssueNumber(projectId: number) {
    const highestIssue = await this.prisma.issue.findMany({
      select: {
        issueNumber: true,
      },
      orderBy: {
        issueNumber: 'desc',
      },
      where: {
        projectId,
      },
      take: 1,
    });

    return highestIssue[0]
      ? parseInt(highestIssue[0]?.issueNumber?.slice(2))
      : 1000;
  }
}
