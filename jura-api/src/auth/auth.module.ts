import { APP_GUARD } from '@nestjs/core';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { GqlAuthGuard } from './auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt-strategy.service';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from 'src/services/prisma.service';
import { UserService } from '../services/user.service';
import { jwtConstants } from './constants';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1h' },
    }),
    PassportModule,
  ],
  providers: [
    AuthService,
    AuthResolver,
    UserService,
    PrismaService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: GqlAuthGuard,
    },
  ],
})
export class AuthModule {}
