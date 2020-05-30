import { PipeTransform } from '@angular/core';

export class BaseEnumPipe implements PipeTransform {
  constructor(private translations: Array<{ key: string; translation: string }>) {}

  transform(key: string): string {
    if (!key) {
      return '';
    }

    const element = this.translations.find(t => t.key === key);
    return element ? element.translation : `???${key}???`;
  }
}
