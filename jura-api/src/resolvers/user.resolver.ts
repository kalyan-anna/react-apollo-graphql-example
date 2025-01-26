import { Query, Resolver } from '@nestjs/graphql';

import { User } from 'src/models/user.model';
import { UserService } from 'src/services/user.service';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [User])
  async users() {
    return await this.userService.users();
  }
}
