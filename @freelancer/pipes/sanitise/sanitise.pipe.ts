import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'sanitise' })
export class SanitisePipe implements PipeTransform {
  transform(value: string) {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}
