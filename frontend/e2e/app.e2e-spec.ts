import { Globe42Page } from './app.po';

describe('globe42 App', () => {
  let page: Globe42Page;

  beforeEach(() => {
    page = new Globe42Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('gl works!');
  });
});
