import { ContestPollApi } from 'api-typings/contests/contests';
import { ContestPoll } from './contest-polls.model';

export function transformContestPolls(
  contestPoll: ContestPollApi,
): ContestPoll {
  if (
    !contestPoll.id ||
    !contestPoll.contest_id ||
    !contestPoll.poll_number ||
    !contestPoll.date_created ||
    contestPoll.votes === undefined
  ) {
    throw new ReferenceError(`Missing a required contest poll field.`);
  }

  return {
    id: contestPoll.id,
    contestId: contestPoll.contest_id,
    pollNumber: contestPoll.poll_number,
    dateCreated: contestPoll.date_created * 1000,
    votes: contestPoll.votes,
  };
}
