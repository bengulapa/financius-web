import { ColorHexPipe } from './color-hex.pipe';

describe('ColorPipe', () => {
  it('create an instance', () => {
    const pipe = new ColorHexPipe();
    expect(pipe).toBeTruthy();
  });
});
