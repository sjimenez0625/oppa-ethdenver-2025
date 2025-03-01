import { User } from '../../user/entities/user.entity';

export interface OidcAuth {
  authId: string;
  user: User;
}
