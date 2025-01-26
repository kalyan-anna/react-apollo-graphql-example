import { Project } from 'src/models/project.model';
import { Query, Resolver } from '@nestjs/graphql';
import { User } from '@prisma/client';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { ProjectService } from 'src/services/project.service';

@Resolver()
export class ProjectResolver {
  constructor(private readonly projectService: ProjectService) {}

  @Query(() => [Project])
  async projects(@CurrentUser() user: User) {
    return await this.projectService.projectsByUserId(user.id);
  }
}
