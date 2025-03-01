import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('empty')
export class EmptyDto {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
