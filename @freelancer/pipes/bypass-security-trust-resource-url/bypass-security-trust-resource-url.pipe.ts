import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

/**
 * This pipe marks a string URL as safe to load executable code from,
 * like <object src>.
 *
 * WARNING: Using this pipe with untrusted data can expose our application
 * to XSS security risks. Make sure to consult Security before using this pipe
 * and to only use it with URLs we generate.
 *
 * Usage: `{{ url | bypassSecurityTrustResourceUrl }}`
 */
@Pipe({ name: 'bypassSecurityTrustResourceUrl' })
export class BypassSecurityTrustResourceUrlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
