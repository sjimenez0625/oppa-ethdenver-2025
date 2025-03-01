import { ApiProperty } from '@dataui/crud/lib/crud';
import { IsNotEmpty } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity('identity')
export class Identity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @IsNotEmpty()
  @Unique('accountId', ['accountId'])
  @Column({ nullable: true, length: 100 })
  accountId: string;

  @ApiProperty()
  @IsNotEmpty()
  @Column({ nullable: true, length: 100 })
  principal: string;

  @ApiProperty()
  @IsNotEmpty()
  @Column({ nullable: true, length: 100 })
  privateKey: string;

  @ApiProperty()
  @IsNotEmpty()
  @Column({ nullable: true, length: 100 })
  publicKey: string;

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
