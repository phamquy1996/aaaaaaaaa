import { Pipe, PipeTransform } from '@angular/core';
import { isNumeric } from '@freelancer/utils';

/**
 * Converts a file size to a human readable format.
 *
 * Usage: `{{ file.size | fileSize }}`
 */
@Pipe({ name: 'fileSize' })
export class FileSizePipe implements PipeTransform {
  private units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];

  transform(bytes: number | string = 0, precision: number = 2): string {
    if (!isNumeric(bytes)) {
      return '';
    }

    let unit = 0;
    let numericBytes = Number(bytes);

    while (numericBytes >= 1024 && unit < this.units.length - 1) {
      numericBytes /= 1024;
      unit++;
    }

    if (unit) {
      return `${numericBytes.toFixed(precision)} ${this.units[unit]}`;
    }
    return `${numericBytes} ${this.units[unit]}`;
  }
}
