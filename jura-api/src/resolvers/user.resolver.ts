import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserUpdateInput } from 'src/models/user-update.input';

import { User } from 'src/models/user.model';
import { UserService } from 'src/services/user.service';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [User])
  async users() {
    return await this.userService.users();
  }

  @Query(() => User)
  async user(
    @Args('id', { type: () => String })
    id: string,
  ) {
    return await this.userService.user({ id: Number(id) });
  }

  @Mutation(() => User)
  async updateUser(
    @Args('userUpdateInput')
    userUpdateInput: UserUpdateInput,
  ) {
    const { id, ...dataToUpdate } = userUpdateInput;
    return this.userService.updateUser({
      where: {
        id: Number(id),
      },
      data: {
        ...dataToUpdate,
      },
    });
  }
}
