import { PipeTransform } from '@angular/core';

export class BaseEnumPipe<E extends string> implements PipeTransform {
  constructor(private translations: Record<E, string>) {}

  transform(key: E): string {
    if (!key) {
      return '';
    }

    const translation = this.translations[key];
    return translation ?? `???${key}???`;
  }
}
