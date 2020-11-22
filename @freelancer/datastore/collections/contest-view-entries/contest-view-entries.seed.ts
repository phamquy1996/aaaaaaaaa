import { generateId } from '@freelancer/datastore/testing';
import { EntryUpgradesApi } from 'api-typings/contests/contests';
import { ContestEntry } from '../contest-entries/contest-entries.model';
import {
  ContestEntryFile,
  ContestEntryHasFeedbackStatus,
  ContestViewEntry,
} from './contest-view-entries.model';
import { mapStatusTextToNumber } from './contest-view-entries.transformers';

export interface GenerateContestViewEntriesOptions {
  readonly entries: ReadonlyArray<ContestEntry>;

  readonly isLiked?: boolean;
  readonly upgrades?: EntryUpgradesApi;
  readonly files?: ReadonlyArray<ContestEntryFile>;
  readonly hasFeedback?: ContestEntryHasFeedbackStatus;
  readonly commentCount?: number;
}

export function generateContestViewEntryObjects({
  entries,
  isLiked = false,
  upgrades = {
    sealed: false,
    highlight: false,
  },
  files = [],
  hasFeedback = ContestEntryHasFeedbackStatus.NO,
  commentCount = 0,
}: GenerateContestViewEntriesOptions): ReadonlyArray<ContestViewEntry> {
  return entries.map(entry => ({
    ...entry,
    isLiked,
    upgrades,
    hasFeedback,
    commentCount,
    files: files.length ? files : generateFiles(),
    seoUrl: `contest/${entry.contestId}`, // FIXME: real seoUrl has contest title
    statusNumber: mapStatusTextToNumber(entry.status),
    rating: entry.rating ?? 0, // default values from transformer
    likeCount: entry.likeCount ?? 0,
    freelancerRating: 0, // FIXME
  }));
}

export function generateFiles(): ReadonlyArray<ContestEntryFile> {
  const id = generateId();
  return [
    {
      id,
      name: `Contest file ${id}`,
      fileUrl: 'assets/freelancer-logo-open-graph.png',
      thumbnailUrl: 'assets/freelancer-logo-open-graph.png',
      thumbnail420Url: 'assets/freelancer-logo-open-graph.png',
      thumbnail900Url: 'assets/freelancer-logo-open-graph.png',
      thumbnail80Url: 'assets/freelancer-logo-open-graph.png',
      thumbnail80FixUrl: 'assets/freelancer-logo-open-graph.png',
      thumbnailDigestUrl: 'assets/freelancer-logo-open-graph.png',
      thumbnailPreview: 'assets/freelancer-logo-open-graph.png',
    },
  ];
}

// --- Mixins ---
