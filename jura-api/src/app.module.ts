import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { IssueResolver } from './resolvers/issue.resolver';
import { IssueService } from './services/issue.service';
import { Module } from '@nestjs/common';
import { PrismaService } from './services/prisma.service';
import { ProjectResolver } from './resolvers/project.resolver';
import { ProjectService } from './services/project.service';
import { SprintResolver } from './resolvers/sprint.resolver';
import { SprintService } from './services/sprint.service';
import { UserResolver } from './resolvers/user.resolver';
import { UserService } from './services/user.service';
import { NotificationService } from './services/notification.service';
import { NotificationResolver } from './resolvers/notification.resolver';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: true,
      context: ({ req }) => ({ req }),
    }),
    AuthModule,
  ],
  controllers: [],
  providers: [
    PrismaService,
    UserService,
    ProjectResolver,
    ProjectService,
    IssueService,
    IssueResolver,
    SprintService,
    SprintResolver,
    UserResolver,
    NotificationService,
    NotificationResolver,
  ],
  exports: [],
})
export class AppModule {}
