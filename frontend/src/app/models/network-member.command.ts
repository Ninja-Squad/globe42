import { NetworkMemberType } from './network-member.model';

export interface NetworkMemberCommand {
  type: NetworkMemberType;
  text: string;
}
