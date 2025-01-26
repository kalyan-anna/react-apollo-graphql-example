import { GraphQLError } from 'graphql';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UserService } from '../services/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.user({ email });
    if (!user || user.password !== password) {
      throw new GraphQLError('Invalid username or password.', {
        extensions: {
          code: 'BAD_USER_INPUT',
        },
      });
    }
    return user;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    const payload = { userId: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload); // Generate JWT token
    return { user, accessToken };
  }
}
