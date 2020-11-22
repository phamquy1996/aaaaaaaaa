import { generateId } from '@freelancer/datastore/testing';
import {
  ContextTypeApi,
  SourceTypeApi,
} from 'api-typings/messages/messages_types';
import { Bid } from '../bids/bids.model';
import { Thread } from '../threads/threads.model';
import { User } from '../users/users.model';
import { Message, MessageSendStatus } from './messages.model';
import { RichMessage } from './rich-message.model';

export interface GenerateMessagesOptions {
  readonly fromUserId: number;
  readonly thread: Thread;
  readonly messages: ReadonlyArray<string>;
}

export function generateMessages({
  fromUserId,
  thread,
  messages,
}: GenerateMessagesOptions): ReadonlyArray<Message> {
  return messages.map(message =>
    generateMessage({ fromUserId, thread, message }),
  );
}

export interface GenerateMessageOptions {
  readonly message: string;
  readonly richMessage?: RichMessage;
  readonly thread: Thread;
  readonly fromUserId: number;
  readonly bid?: Bid;
}

export function generateMessage({
  fromUserId,
  thread,
  message,
  richMessage,
}: GenerateMessageOptions): Message {
  return {
    id: generateId(),
    attachments: [],
    fromUser: fromUserId,
    message,
    messageSource: SourceTypeApi.BOT,
    richMessage,
    threadId: thread.id,
    timeCreated: Date.now(),
    sendStatus: MessageSendStatus.SENDING,
  };
}

// #region Mixins

/**
 * Generate a rich message for an awarded project.
 *
 * FIXME: Support custom budgets and some of the other 10 different
 * combinations of messages from consumers/AcceptRichMessageConsumer.php
 */
export function awardProjectRichMessage({
  thread,
  freelancerBotUser,
  bidId,
}: {
  readonly thread: Thread;
  readonly freelancerBotUser: User;
  readonly bidId: number;
}): GenerateMessageOptions {
  if (thread.context.type !== ContextTypeApi.PROJECT) {
    throw new Error('Thread does not belong to a project context.');
  }

  return {
    fromUserId: freelancerBotUser.id,
    thread,
    message: `You've been awarded! This project has a budget of $300.00 USD and you will be charged a project commission of $30.00 USD. To accept click here https://www.syd1.fln-dev.net/projects/${thread.context.id}.html`,
    richMessage: {
      category: `ACCEPT_CTA_${thread.context.id}`,
      long: [
        [
          {
            text: 'Congratulations, your bid has been awarded!',
            type: 'heading',
          },
        ],
        [
          {
            text: 'Click the Accept button below to start working.',
            type: 'body',
          },
        ],
        [
          {
            text:
              'This project has a budget of $300.00 USD and you will be charged a project commission of $30.00 USD.',
            style: 'small',
            type: 'body',
          },
        ],
        [
          {
            action: 'PATCH',
            type: 'button',
            label: 'Accept',
            request: {
              url: `https://www.syd1.fln-dev.net/api/projects/0.1/bids/${bidId}/`,
              payload: { action: 'ACCEPT' },
              contentType: 'application/x-www-form-urlencoded',
            },
            displayType: 'green',
          },
        ],
      ],
      short: [],
      email: {
        text: `Follow the link below to accept this project and start working!<br/><br/>https://www.syd1.fln-dev.net/api/projects/0.1/bids/${bidId}/`,
        type: 'email-copy',
        heading: 'Congratulations, your bid has been awarded!',
      },
    },
  };
}

export function contestAcceptOfferFreelancerRichMessage({
  thread,
  freelancerBotUser,
  buyerPublicName,
  contestId,
  entryNumber,
  entryId,
  offeredPriceFormatted,
}: {
  readonly thread: Thread;
  readonly freelancerBotUser: User;
  readonly buyerPublicName: string;
  readonly entryId: number;
  readonly entryNumber: number;
  readonly contestId: number;
  readonly offeredPriceFormatted: string;
}): GenerateMessageOptions {
  return {
    fromUserId: freelancerBotUser.id,
    thread,
    message: 'FIXME',
    richMessage: {
      category: `CONTEST_ACCEPTOFFER_${entryId}`,
      long: [
        [
          {
            type: 'button',
            action: 'REDIRECT',
            displayType: 'link-heading' as any,
            label: `You were offered ${offeredPriceFormatted} for Entry ${entryNumber}`,
            request: {
              url: `/contest/${contestId}.html?tab=entries&acceptOfferForEntry=${entryId}`,
              payload: {},
            },
          },
        ],
        [
          {
            type: 'body',
            text: `${buyerPublicName} offered to buy your entry for ${offeredPriceFormatted}. You can accept this on the entry's card in the contest's page, or by clicking the button below.`,
          },
        ],
        [
          {
            type: 'button',
            action: 'REDIRECT',
            displayType: 'success',
            label: 'Accept Offer',
            request: {
              url: `/contest/${contestId}.html?tab=entries&acceptOfferForEntry=${entryId}`,
              payload: {},
            },
          },
        ],
      ],
      short: [],
      email: {} as any,
    },
  };
}
export function contestAcceptOfferEmployerRichMessage({
  thread,
  freelancerBotUser,
  contestId,
  sellerPublicName,
  entryId,
  entryNumber,
  offeredPriceFormatted,
}: {
  readonly thread: Thread;
  readonly freelancerBotUser: User;
  readonly sellerPublicName: string;
  readonly entryId: number;
  readonly entryNumber: number;
  readonly contestId: number;
  readonly offeredPriceFormatted: string;
}): GenerateMessageOptions {
  return {
    fromUserId: freelancerBotUser.id,
    thread,
    message: 'FIXME',
    richMessage: {
      category: `CONTEST_ACCEPTOFFER_${entryId}`,
      long: [
        [
          {
            type: 'body',
            text: `${sellerPublicName} accepted to sell their Entry #${entryNumber} for '${offeredPriceFormatted}! Buy the entry now to proceed with handover.`,
          },
        ],
        [
          {
            type: 'button',
            action: 'REDIRECT',
            displayType: 'success' as any,
            label: `Buy Now for ${offeredPriceFormatted}`,
            request: {
              url: `/contest/${contestId}.html?tab=entries&buyEntry=${entryId}`,
              payload: {},
            },
          },
        ],
      ],
      short: [],
      email: {} as any,
    },
  };
}
export function offsitingMessageReminderFreelancerRichMessage({
  thread,
  freelancerBotUser,
  offsiteMessageId = generateId(),
}: {
  readonly thread: Thread;
  readonly freelancerBotUser: User;
  readonly offsiteMessageId?: number;
}): GenerateMessageOptions {
  return {
    fromUserId: freelancerBotUser.id,
    thread,
    message: 'FIXME',
    richMessage: {
      category: `OFFSITING_MESSAGE_REMINDER_FREELANCER_${offsiteMessageId}`,
      long: [
        [
          {
            type: 'heading',
            text: 'Always communicate and make payments through Freelancer.com',
          },
        ],
        [
          {
            type: 'body',
            text:
              'Stay protected from scams and ensure you get paid by only communicating using the Freelancer.com chat system.',
          },
        ],
        [
          {
            type: 'body',
            style: 'italic',
            text:
              'Communicating or receiving payments outside Freelancer.com is a violation of our Terms and Conditions. Heavy penalties will apply.',
          },
        ],
        [
          {
            type: 'button',
            displayType: 'success' as any,
            label: 'View Terms and Conditions',
            action: 'REDIRECT',
            request: {
              url: '/about/terms/',
              payload: {},
            },
          },
        ],
      ],
      short: [],
      email: {} as any,
    },
  };
}

// #endregion
