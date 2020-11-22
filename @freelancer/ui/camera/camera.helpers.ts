export function readImageDataIntoFile(
  data: string,
  imageFileName?: string,
): File {
  const dataArray = data.split(',');
  const mimeString = dataArray[0].split(';')[0].split(':')[1];
  const decoded = atob(dataArray[1]);
  const byteArray = new Uint8Array(decoded.length);
  for (let i = 0; i < decoded.length; i++) {
    byteArray[i] = decoded.charCodeAt(i);
  }

  let filename: string;
  if (imageFileName) {
    filename = imageFileName;
  } else {
    // Assign current timestamp as default filename
    // e.g. 30-04-2019-055340.png
    const formattedDateString = new Date()
      .toLocaleString('en-GB')
      .replace(/[^ -~]/g, '')
      .replace(/[:,]/g, '')
      .replace(/[/ ]/g, '-');
    filename = `${formattedDateString}.${mimeString.split('/')[1]}`;
  }

  try {
    return new File([byteArray], filename, { type: mimeString });
  } catch (error) {
    /**
     * Browsers like Edge and IE don't support the File() constructor so we
     * resort to Blob for initialization
     */
    const image: any = new Blob([byteArray], {
      type: mimeString,
    });
    const lastModifiedDate = new Date();
    image.lastModified = lastModifiedDate.getTime();
    image.lastModifiedDate = lastModifiedDate;
    image.name = filename;

    return image as File;
  }
}
