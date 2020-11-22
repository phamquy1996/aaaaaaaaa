import { TitleCasePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

/**
 * This pipe provides a conversion from a kebab-case or snake_case to
 * PascalCase. The use case for this is when we want to create dynamic
 * tracking label, we can use this pipe to transform the string.
 *
 * Example:
 *  - controller
 *  ```
 *  this.kebabString = 'wira-tjo';
 *  this.snakeString = 'wira_tjo';
 *  ```
 *  - template
 *  ```
 *  <fl-text> My name is {{ kebabString | flPascalCase }}</fl-text>
 *  <fl-text> My name is {{ snakeString | flPascalCase }}</fl-text>
 *  ```
 *  - output
 *  ```
 *  My name is WiraTjo
 *  My name is WiraTjo
 *  ```
 */
@Pipe({ name: 'pascalCase' })
export class PascalCasePipe implements PipeTransform {
  transform(s: string | null): string | null {
    if (s === null) {
      // safety guard for undefined when template is loading
      return null;
    }

    return new TitleCasePipe()
      .transform(s.replace(/[_-]+/g, ' '))
      .replace(/\s+/g, '');
  }
}
