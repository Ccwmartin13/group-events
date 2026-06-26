import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RefreshToken } from './refresh-token.entity';
import { Group } from './group.entity';
import { GroupMember } from './group-member.entity';
import { Event } from './event.entity';
import { EventAssignee } from './event-assignee.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  @Column({ name: 'password_hash', type: 'varchar', length: 255 })
  passwordHash!: string;

  @Column({ type: 'varchar', length: 32, nullable: true })
  phone!: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;

  @OneToMany(() => RefreshToken, (token) => token.user)
  refreshTokens!: RefreshToken[];

  @OneToMany(() => Group, (group) => group.owner)
  ownedGroups!: Group[];

  @OneToMany(() => GroupMember, (member) => member.user)
  groupMemberships!: GroupMember[];

  @OneToMany(() => Event, (event) => event.createdBy)
  createdEvents!: Event[];

  @OneToMany(() => EventAssignee, (assignee) => assignee.user)
  eventAssignments!: EventAssignee[];
}
