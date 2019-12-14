import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { tryCatch } from 'rxjs/internal-compatibility';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import * as bcryptjs from 'bcryptjs';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;

    let user = new User;
    user.username = username;
    user.salt = await bcryptjs.genSalt();
    user.password = await this.hashPassword(password, user.salt);

    try {
      await user.save();
    } catch (err) {
      if (err.code == '23505') { // duplicate username
        throw new ConflictException('Username alredy exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async hashPassword(password: string, salt: string): Promise<string> {
    return await bcryptjs.hash(password, salt);
  }

  async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<string | null> {
    const { username, password } = authCredentialsDto;
    let user = await this.findOne({ username });

    if (user && await user.verifyPassword(password)) {
      return user.username;
    } else return null;
  }
}
