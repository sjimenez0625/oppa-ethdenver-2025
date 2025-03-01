import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true, length: 100 })
  firstname: string;

  @Column({ nullable: true, length: 100 })
  lastname: string;

  @Column({ nullable: true })
  profilePicture: string;

  @Column({ nullable: true })
  password: string;

  @Unique('username', ['username'])
  @Column({ nullable: true, length: 200 })
  username: string;

  @Column('simple-array')
  roles: string[];

  @Column({ default: false })
  isAccountDisabled: boolean;

  @Unique('email', ['email'])
  @Column({ nullable: true, length: 200 })
  email: string;

  @Column({ nullable: false, default: 'local' })
  authId: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  dob: Date;

  @CreateDateColumn({
    name: 'createdAt',
    nullable: false,
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updatedAt',
    nullable: false,
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
