import { FontColor, ReadMore } from './text.model';

/*
 * This takes an HTMLElement (the container) & truncates its text content on
 * word boundary at the end of the bounding box
 */
export class MaxLinesHelper {
  // container max height
  private maxHeight: number;

  constructor(
    private container: HTMLElement,
    private callback?: (isTruncated: boolean) => any,
  ) {}

  /**
   * Start the truncate process.
   * Takes the maximum line count before starting to truncate.
   */
  truncate(
    lineCount: number,
    readMoreStyle = ReadMore.NONE,
    fontColor: FontColor = FontColor.DARK,
  ) {
    const button = this.container.querySelector('button.ReadMoreButton');
    if (button) {
      this.container.removeChild(button);
    }

    const lineHeight = getComputedStyle(this.container).getPropertyValue(
      'line-height',
    );

    this.maxHeight = parseFloat(lineHeight) * lineCount;

    // Truncate the text.
    if (!this.fits()) {
      if (readMoreStyle === ReadMore.LINK) {
        // Append read more button
        const readMoreButton = document.createElement('button');
        readMoreButton.textContent = 'Read more';
        readMoreButton.classList.add('ReadMoreButton');
        readMoreButton.onclick = () => this.restore();
        this.container.append(readMoreButton);
      } else if (readMoreStyle === ReadMore.ICON) {
        // Append a dropdown icon to the right.

        // Obtain the parent of the text container.
        const parentContainer = this.container.parentNode as HTMLElement;
        // Only add icon if not yet exists.
        if (!parentContainer.querySelector('div.ExpandIcon')) {
          // Deploy the icon container to the DOM.
          const iconContainer = document.createElement('div');
          iconContainer.classList.add('ExpandIcon');
          (this.container.parentNode as HTMLElement).append(iconContainer);

          // Insert the icon into the icon container.
          const svg = `
            <svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
              <g stroke="none" stroke-width="1" fill-rule="evenodd">
                <polygon fill="none" opacity="0" points="2 2 22 2 22 22 2 22"></polygon>
                <polygon fill-rule="nonzero" points="19.65 6 12 13.6333333 4.35 6 2 8.35 12 18.35 22 8.35"></polygon>
              </g>
            </svg>
          `;
          iconContainer.insertAdjacentHTML('afterbegin', svg);

          // Set the size of the icon.
          const icon = iconContainer.firstElementChild as HTMLElement;
          icon.setAttribute('width', '16px');
          icon.setAttribute('height', '16px');

          // Set the icon color to match the font color.
          icon.setAttribute('fill', this.getReadMoreStyleIconColor(fontColor));

          // Setup animation and click handler.
          icon.style.transition = 'all 0.15s linear';
          icon.onclick = () => {
            if (icon.classList.contains('isActive')) {
              icon.classList.remove('isActive');
              icon.style.transform = 'rotate(0deg)';

              // Truncate the text again.
              this.truncateToNode(this.container);
              if (this.callback) {
                this.callback(true);
              }
            } else {
              icon.classList.add('isActive');
              icon.style.transform = 'rotate(180deg)';

              // Restore to original text.
              this.restore();
            }
          };

          // Reserving enough space for the icon when it is being loaded.
          iconContainer.style.minWidth = '16px';

          // Apply styles  to the icon container.
          iconContainer.style.cursor = 'pointer';
          iconContainer.style.marginLeft = '8px';
        }
      }
      // Do truncate
      this.truncateToNode(this.container);
      if (this.callback) {
        this.callback(true);
      }
    }
  }

  /*
   * Truncate an element by removing elements from the end.
   */
  private truncateToNode(element: HTMLElement) {
    // replace all contents with comments
    const placeholders: CharacterData[] = [];
    const elements: Node[] = [];
    Array.prototype.slice.call(element.childNodes).forEach(node => {
      // Skip comments and Read more
      if (node.nodeType !== Node.COMMENT_NODE && node.nodeName !== 'BUTTON') {
        const placeholder = document.createTextNode('');
        node.replaceWith(placeholder);
        elements.push(node);
        placeholders.push(placeholder);
      }
    });

    if (!elements.length) {
      return;
    }

    // replace placeholders with contents until it doesn't fit anymore.
    let index;
    for (index = 0; index < elements.length; index++) {
      placeholders[index].replaceWith(elements[index]);
      const ellipsis = document.createTextNode('\u2026 ');
      const el = elements[index];
      if (this.isElementNode(el)) {
        el.append(ellipsis);
      } else if (this.isTextNode(el)) {
        el.after(ellipsis);
      }

      const fits = this.fits();
      (ellipsis.parentNode as Node).removeChild(ellipsis);

      if (!fits) {
        break;
      }
    }

    // The element that overflows.
    const lastElement =
      elements[Math.max(0, Math.min(index, elements.length - 1))];

    // Proceed inside last element.
    if (this.isElementNode(lastElement)) {
      this.truncateToNode(lastElement);
      if (!this.isAnyTextNodeLeft(lastElement)) {
        lastElement.replaceWith(document.createTextNode('\u2026 '));
      }
    } else if (this.isTextNode(lastElement)) {
      this.truncateToWord(lastElement);
    }
  }

  /*
   * Truncate a sentence by removing words from the end.
   */
  private truncateToWord(element: Text) {
    if (!element.textContent) {
      return;
    }

    const words = element.textContent
      // add a space after newlines so we can split after them
      .replace(/\n/g, ' \n')
      .split(' ');

    if (words.filter(t => t).length < 2) {
      // If the sentence is a single word, fallback to letter-based truncation
      return this.truncateToLetter(element);
    }

    for (let a = 0; a <= words.length; a++) {
      element.textContent = this.addEllipsis(words.slice(0, a).join(' '));
      if (!this.fits()) {
        element.textContent = this.addEllipsis(words.slice(0, a - 1).join(' '));
        break;
      }
    }
  }

  /*
   * Truncate a word by removing letters from the end.
   */
  truncateToLetter(element: Text) {
    if (!element.textContent) {
      return;
    }

    const letters = element.textContent.split('');
    let text = '';

    for (let a = letters.length; a >= 0; a--) {
      text = letters.slice(0, a).join('');

      if (text.length) {
        element.textContent = this.addEllipsis(text);

        if (this.fits()) {
          break;
        } else {
          element.textContent = '';
        }
      }
    }
  }

  /**
   * Test if the content fits in the container.
   * `scrollHeight` is a rounded value so we need to round max height too
   * to avoid false positives
   */
  private fits(): boolean {
    const roundedMaxHeight = Math.round(this.maxHeight);
    const roundedScrollHeight = Math.round(this.container.scrollHeight);

    return roundedScrollHeight <= roundedMaxHeight;
  }

  /**
   * Add the ellipsis to a text.
   */
  private addEllipsis(text: string): string {
    const charsToRemove = new RegExp(/[,;.!?\s]/);
    let textCopy = text;

    while (textCopy.slice(-1).match(charsToRemove)) {
      textCopy = textCopy.slice(0, -1);
    }
    textCopy += '\u2026 ';

    return textCopy;
  }

  /*
   * Restore the orignal content, i.e. expand the text
   */
  private restore() {
    const button = this.container.querySelector('button.ReadMoreButton');
    if (button) {
      this.container.removeChild(button);
    }
    if (this.callback) {
      this.callback(false);
    }
  }

  private isElementNode(node: Node): node is HTMLElement {
    return node.nodeType === Node.ELEMENT_NODE;
  }

  private isTextNode(node: Node): node is Text {
    return node.nodeType === Node.TEXT_NODE;
  }

  // Convert the font color into icon color for the toggle icon.
  private getReadMoreStyleIconColor(fontColor: FontColor): string {
    // Colors from _colors-generic.scss
    switch (fontColor) {
      case FontColor.DARK:
        return '#0e1724';
      case FontColor.MID:
        return '#4d525b';
      case FontColor.LIGHT:
        return '#F7F7F7';
      case FontColor.ERROR:
        return '#eb3730';
      case FontColor.SUCCESS:
        return '#5dc26a';
      case FontColor.WARNING:
        return '#f0ad4e';
      case FontColor.INHERIT:
        return 'currentColor';
      case FontColor.PROMO:
        return '#e02a28';
      case FontColor.RECRUITER:
        return '#9743ef';
      default:
        // Default to dark color.
        return '#0e1724';
    }
  }

  private isAnyTextNodeLeft(element: Node): boolean {
    const { childNodes } = element;
    for (let i = 0; i < childNodes.length; i++) {
      const node = childNodes.item(i);
      if (this.isTextNode(node)) {
        return true;
      }

      const result = this.isAnyTextNodeLeft(node);
      if (result) {
        return true;
      }
    }

    return false;
  }
}
