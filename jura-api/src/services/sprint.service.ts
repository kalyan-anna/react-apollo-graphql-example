import { Prisma, Sprint } from '@prisma/client';

import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class SprintService {
  constructor(private prisma: PrismaService) {}

  async sprint(
    sprintWhereUniqueInput: Prisma.SprintWhereUniqueInput,
  ): Promise<Sprint | null> {
    return this.prisma.sprint.findUnique({
      where: sprintWhereUniqueInput,
    });
  }

  async sprints(sprintWhereInput: Prisma.SprintWhereInput): Promise<Sprint[]> {
    return this.prisma.sprint.findMany({
      where: sprintWhereInput,
    });
  }

  async updateSprint({
    where,
    data,
  }: {
    where: Prisma.SprintWhereUniqueInput;
    data: Prisma.SprintUncheckedUpdateInput;
  }): Promise<Sprint> {
    return this.prisma.sprint.update({
      where,
      data,
    });
  }

  async createSprint({
    data,
  }: {
    data: Prisma.SprintCreateInput;
  }): Promise<Sprint> {
    return this.prisma.sprint.create({
      data,
    });
  }
}
