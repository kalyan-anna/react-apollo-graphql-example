import { Prisma, User } from '@prisma/client';

import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async users(userWhereInput?: Prisma.UserWhereInput): Promise<User[]> {
    return this.prisma.user.findMany({
      where: userWhereInput,
    });
  }

  async findUser(userWhereInput: Prisma.UserWhereInput): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: userWhereInput,
    });
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where,
    });
  }

  async findUserAssignedToIssue(issueId: number) {
    return this.findUser({
      AssignedIssues: {
        some: {
          id: issueId,
        },
      },
    });
  }

  async findUserReportedTheIssue(issueId: number) {
    return this.findUser({
      ReportedIssues: {
        some: {
          id: issueId,
        },
      },
    });
  }
}
