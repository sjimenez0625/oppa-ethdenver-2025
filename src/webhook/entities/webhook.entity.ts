import { ApiProperty } from '@dataui/crud/lib/crud';
import { IsNotEmpty } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { WebhookLog } from '../../webhook_log/entities/webhook_log.entity';

@Entity('webhook')
export class Webhook {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @IsNotEmpty()
  @Column({ nullable: true, length: 2048 })
  url: string;

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

  @OneToMany(() => WebhookLog, (webhookLog) => webhookLog.webhook)
  webhookLogs: WebhookLog[];
}
