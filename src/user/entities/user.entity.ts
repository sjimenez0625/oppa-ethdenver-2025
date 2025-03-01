import { ApiProperty } from '@dataui/crud/lib/crud';
import { IsNotEmpty } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Identity } from './identity.entity';
import { Transfer } from '../../transfer/entities/transfer.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @IsNotEmpty()
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

  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
    },
  })
  @IsNotEmpty()
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

  @OneToOne(() => Identity, (identity) => identity.user, { cascade: true })
  identity: Identity;

  @OneToMany(() => Transfer, (transfer) => transfer.user)
  transfers: Transfer[];
}
