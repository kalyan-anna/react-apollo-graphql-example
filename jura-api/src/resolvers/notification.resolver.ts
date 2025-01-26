import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from '@prisma/client';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { NotificationStatus } from 'src/models/enums';
import { Notification } from 'src/models/notification.model';
import { NotificationService } from 'src/services/notification.service';

@Resolver()
export class NotificationResolver {
  constructor(private readonly notificationService: NotificationService) {}

  @Query(() => [Notification])
  async notifications(@CurrentUser() user: User) {
    return await this.notificationService.notifications({
      userId: user.id,
    });
  }

  @Mutation(() => Notification)
  async updateNotification(
    @Args('id', { type: () => String }) id: string,
    @Args('status', { type: () => NotificationStatus })
    status: NotificationStatus,
  ) {
    return this.notificationService.updateNotification({
      where: {
        id: Number(id),
      },
      data: {
        status,
      },
    });
  }
}
