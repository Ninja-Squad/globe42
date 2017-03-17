import { browser, element, by } from 'protractor';

export class Globe42Page {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('gl-root h1')).getText();
  }
}
