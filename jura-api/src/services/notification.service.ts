import { Notification, Prisma } from '@prisma/client';

import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  async notifications(
    notificationWhereInput: Prisma.NotificationWhereInput,
  ): Promise<Notification[]> {
    return this.prisma.notification.findMany({
      where: notificationWhereInput,
    });
  }

  async updateNotification({
    where,
    data,
  }: {
    where: Prisma.NotificationWhereUniqueInput;
    data: Prisma.NotificationUncheckedUpdateInput;
  }): Promise<Notification> {
    return this.prisma.notification.update({
      where,
      data,
    });
  }

  async createNotification({
    data,
  }: {
    data: Prisma.NotificationCreateInput;
  }): Promise<Notification> {
    return this.prisma.notification.create({
      data,
    });
  }
}
