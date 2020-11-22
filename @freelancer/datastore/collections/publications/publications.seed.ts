import { generateId } from '@freelancer/datastore/testing';
import { Publication } from './publications.model';

export interface GeneratePublicationOptions {
  readonly userId: number;
  readonly title?: string;
  readonly publisher?: string;
  readonly author?: string;
  readonly summary?: string;
  readonly publishDate?: number;
}

export function generatePublicationObject({
  userId,
  title = 'Transatlanticism',
  publisher = 'Less Tab for Duty',
  author,
  summary = 'The distance is quite simply much too far for me to row',
  publishDate,
}: GeneratePublicationOptions): Publication {
  return {
    id: generateId(),
    userId,
    title,
    publisher,
    author, // seems to be unused
    summary,
    publishDate, // seems to be unused
  };
}
