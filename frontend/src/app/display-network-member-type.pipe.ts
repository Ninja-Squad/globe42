import { Pipe, PipeTransform } from '@angular/core';
import { BaseEnumPipe } from './base-enum-pipe';
import { NetworkMemberType } from './models/network-member.model';

const NETWORK_MEMBER_TYPE_TRANSLATIONS: Record<NetworkMemberType, string> = {
  DOCTOR: 'Médecin',
  LAWYER: 'Avocat',
  PERSON_TO_WARN: 'Personne à prévenir',
  HELPER: 'Aidant',
  SOCIAL_ASSISTANT: 'Assistant social',
  OTHER: 'Autre'
};

@Pipe({
  name: 'displayNetworkMemberType'
})
export class DisplayNetworkMemberTypePipe
  extends BaseEnumPipe<NetworkMemberType>
  implements PipeTransform {
  constructor() {
    super(NETWORK_MEMBER_TYPE_TRANSLATIONS);
  }
}
