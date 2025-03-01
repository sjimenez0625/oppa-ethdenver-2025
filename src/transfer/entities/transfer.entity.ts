import { ApiProperty } from '@dataui/crud/lib/crud';
import { IsEnum, IsNotEmpty } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { TRANSFER_STATUS } from '../constants/transfer.constant';

@Entity('transfer')
export class Transfer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @IsNotEmpty()
  @Column({ nullable: true, length: 100 })
  txHash: string;

  @ApiProperty()
  @IsNotEmpty()
  @Column()
  @IsEnum(TRANSFER_STATUS)
  status: TRANSFER_STATUS;

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

  @ManyToOne(() => User, (user) => user.transfers, {
    eager: true,
  })
  @JoinColumn({ name: 'userId' })
  user: User;
}
