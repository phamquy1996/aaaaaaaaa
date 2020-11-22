import {
  DashboardPollsBackendModel,
  PollAnswerTypeResponse,
  PollTypeResponse,
} from './dashboard-polls.backend-model';
import { DashboardPoll, PollAnswerType } from './dashboard-polls.model';

export function transformDashboardPolls(
  poll: DashboardPollsBackendModel,
): DashboardPoll {
  return {
    id: poll.poll_id,
    question: poll.question,
    pollAnswerType: transformPollAnswerType(poll.poll_type, poll.answer_type),
    answered: poll.answered ? !!parseInt(poll.answered, 10) : false,
    options: poll.options.map(a => ({
      id: parseInt(a.id, 10),
      pollId: a.poll_id,
      answer: a.answer,
      isOtherField: !!parseInt(a.other, 10),
      orderId: a.order_id,
    })),
  };
}

function transformPollAnswerType(
  pollType: PollTypeResponse,
  answerType: PollAnswerTypeResponse,
): PollAnswerType | undefined {
  if (pollType === PollTypeResponse.PLAIN) {
    return PollAnswerType.INPUT;
  }

  if (
    pollType === PollTypeResponse.SINGLE &&
    answerType === PollAnswerTypeResponse.RADIO
  ) {
    return PollAnswerType.RADIO;
  }

  if (
    pollType === PollTypeResponse.SINGLE &&
    answerType === PollAnswerTypeResponse.CHECKBOX
  ) {
    return PollAnswerType.CHECKBOX;
  }

  if (pollType === PollTypeResponse.TEXT) {
    return PollAnswerType.TEXT_AREA;
  }
}
