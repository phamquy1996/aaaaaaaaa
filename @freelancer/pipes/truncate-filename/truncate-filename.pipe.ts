import { Pipe, PipeTransform } from '@angular/core';

/**
 * Truncates a string in the middle and adds a separator `...`
 * in place of the removed characters.
 *
 * The separator length and the file extension (if any)
 * is included in the maximum character count.
 *
 * Usage:
 *   value | truncateFilename: maxLength
 *
 * Example:
 *   {{ 'lorem-ipsum-dolor.png' | truncateFilename: 15 }}
 *   formats to: lore...olor.png
 */
@Pipe({ name: 'truncateFilename' })
export class TruncateFilenamePipe implements PipeTransform {
  readonly SEPARATOR = '...';

  transform(value: string, maxLength: number) {
    if (!maxLength || value.length <= maxLength) {
      return value;
    }

    const fileExtensionIndex = value.lastIndexOf('.');
    const fileExtension =
      fileExtensionIndex >= 0 ? value.slice(fileExtensionIndex) : '';

    if (fileExtension.length + this.SEPARATOR.length >= maxLength) {
      return value;
    }

    const newLength = maxLength - fileExtension.length - this.SEPARATOR.length;
    const middle = newLength / 2;
    const firstHalf = value.slice(0, Math.ceil(middle));
    const secondHalf = value.slice(
      value.length - fileExtension.length - Math.floor(middle),
    );

    return `${firstHalf}${this.SEPARATOR}${secondHalf}`;
  }
}
