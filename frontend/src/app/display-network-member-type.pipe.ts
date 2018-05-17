import { Pipe, PipeTransform } from '@angular/core';
import { BaseEnumPipe } from './base-enum-pipe';
import { NetworkMemberType } from './models/network-member.model';

export const NETWORK_MEMBER_TYPE_TRANSLATIONS: Array<{ key: NetworkMemberType; translation: string; }> = [
  {key: 'DOCTOR', translation: 'Médecin'},
  {key: 'LAWYER', translation: 'Avocat'},
  {key: 'PERSON_TO_WARN', translation: 'Personne à prévenir'},
  {key: 'HELPER', translation: 'Aidant'},
  {key: 'SOCIAL_ASSISTANT', translation: 'Assistant social'},
  {key: 'OTHER', translation: 'Autre'}
];

@Pipe({
  name: 'displayNetworkMemberType'
})
export class DisplayNetworkMemberTypePipe extends BaseEnumPipe implements PipeTransform {

  constructor() {
    super(NETWORK_MEMBER_TYPE_TRANSLATIONS);
  }
}
