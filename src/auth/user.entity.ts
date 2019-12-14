import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';
import * as bcryptjs from 'bcryptjs';

@Entity()
@Unique(['username'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  salt: string;

  @Column()
  password: string;

  async verifyPassword(password: string): Promise<boolean> {
    let hash = await bcryptjs.hash(password, this.salt);
    return hash === this.password;
  }
}
