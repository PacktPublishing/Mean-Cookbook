import { MyAngular4ProjectPage } from './app.po';

describe('my-angular4-project App', () => {
  let page: MyAngular4ProjectPage;

  beforeEach(() => {
    page = new MyAngular4ProjectPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
