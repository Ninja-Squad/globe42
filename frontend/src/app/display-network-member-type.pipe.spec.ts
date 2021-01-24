import { DisplayNetworkMemberTypePipe } from './display-network-member-type.pipe';
import { NetworkMemberType } from './models/network-member.model';

describe('DisplayNetworkMemberTypePipe', () => {
  it('should translate network member type', () => {
    const pipe = new DisplayNetworkMemberTypePipe();
    expect(pipe.transform('DOCTOR')).toBe('Médecin');
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform('foobar' as NetworkMemberType)).toBe('???foobar???');
  });
});
