import { PublicationApi } from 'api-typings/users/users';
import { Publication } from './publications.model';

export function transformPublication(publication: PublicationApi): Publication {
  return {
    id: publication.id,
    userId: publication.user_id,
    title: publication.title,
    publisher: publication.publisher,
    author: publication.author,
    summary: publication.summary,
    publishDate: publication.publish_date
      ? publication.publish_date * 1000
      : undefined,
  };
}
