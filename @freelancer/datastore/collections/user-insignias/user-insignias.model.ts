/**
 * Stores the user insignia (badges)
 * id - combined value of insigniaId and userId
 */

export interface UserInsignias {
  readonly id: string;
  readonly insigniaId: number;
  readonly userId: number;
  readonly name: string;
  readonly description: string;
}

export enum InsigniaType {
  DO_GOODER = 'do-gooder',
}
