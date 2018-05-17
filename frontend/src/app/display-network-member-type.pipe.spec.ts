import { DisplayNetworkMemberTypePipe } from './display-network-member-type.pipe';

describe('DisplayNetworkMemberTypePipe', () => {
  it('should translate network member type', () => {
    const pipe = new DisplayNetworkMemberTypePipe();
    expect(pipe.transform('DOCTOR')).toBe('Médecin');
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform('foobar')).toBe('???foobar???');
  });
});
