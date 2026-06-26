export { User } from './user.entity';
export { RefreshToken } from './refresh-token.entity';
export { Group } from './group.entity';
export { GroupMember } from './group-member.entity';
export { Event } from './event.entity';
export { EventAssignee } from './event-assignee.entity';
export { AuditLog } from './audit-log.entity';

import { User } from './user.entity';
import { RefreshToken } from './refresh-token.entity';
import { Group } from './group.entity';
import { GroupMember } from './group-member.entity';
import { Event } from './event.entity';
import { EventAssignee } from './event-assignee.entity';
import { AuditLog } from './audit-log.entity';

export const entities = [
  User,
  RefreshToken,
  Group,
  GroupMember,
  Event,
  EventAssignee,
  AuditLog,
];
