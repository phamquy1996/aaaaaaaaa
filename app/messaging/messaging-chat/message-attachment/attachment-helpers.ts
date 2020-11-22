export function isImageFile(filename: string): boolean {
  if (!filename) {
    return false;
  }
  const lowerCaseFilename = filename.toLowerCase();
  return !!(
    lowerCaseFilename &&
    (lowerCaseFilename.endsWith('jpg') ||
      lowerCaseFilename.endsWith('png') ||
      lowerCaseFilename.endsWith('gif') ||
      lowerCaseFilename.endsWith('jpeg'))
  );
}

// FIXME: We're not using freelancerHttp.getBaseServiceUrl here because of domains
// getBaseServiceUrl returns the url for the .com domain, which we redirect to.
// If you are cookie-authed into a non-.com domain, the auth won't work on redirect.
export function getAttachmentPath(messageId: number, filename: string): string {
  return `/api/messages/0.1/messages/${messageId}/${encodeURIComponent(
    filename,
  )}`;
}

export enum ImageAttachmentThumbnailHeight {
  CHAT_MESSAGE = 220,
  ATTACHMENT_SIDEBAR = 48,
}

export enum ImageAttachmentThumbnailWidth {
  CHAT_MESSAGE = 330,
  ATTACHMENT_SIDEBAR = 48,
}

export type ThumbnailResizeMethod = 'fill' | 'crop' | 'fit';

export interface ThumbnailResizeOptions {
  height: number;
  width: number;
  method?: ThumbnailResizeMethod;
}

export function getAttachmentThumbnail(
  messageId: number,
  filename: string,
  options: ThumbnailResizeOptions,
): string {
  const url = `/api/messages/0.1/messages/${messageId}/${encodeURIComponent(
    filename,
  )}/thumbnail?height=${options.height}&width=${options.width}`;

  return options.method ? `${url}&resizing_method=${options.method}` : url;
}
