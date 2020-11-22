const canonicalEmojiMap: {
  [key: string]: { altText: string; longname: string; shortnames: string[] };
} = {
  slightly_smiling_face: {
    altText: 'slightly smiling face emoji',
    longname: ':slightly_smiling_face:',
    shortnames: [':)'],
  },
  smile: {
    altText: 'smile emoji',
    longname: ':smile:',
    shortnames: [':D'],
  },
  smiley: {
    altText: 'smiley emoji',
    longname: ':smiley:',
    shortnames: ['=D'],
  },
  upside_down_face: {
    altText: 'upside down face emoji',
    longname: ':upside_down_face:',
    shortnames: [],
  },
  stuck_out_tongue: {
    altText: 'stuck out tongue emoji',
    longname: ':stuck_out_tongue:',
    shortnames: [':p', ':P'],
  },
  sunglasses: {
    altText: 'sunglasses emoji',
    longname: ':sunglasses:',
    shortnames: ['B)'],
  },
  thinking_face: {
    altText: 'thinking face emoji',
    longname: ':thinking_face:',
    shortnames: [],
  },
  white_frowning_face: {
    altText: 'white frowning face emoji',
    longname: ':white_frowning_face:',
    shortnames: [':('],
  },
  cry: {
    altText: 'cry emoji',
    longname: ':cry:',
    shortnames: [":'(", ':&#039;('],
  },
  sob: {
    altText: 'sob emoji',
    longname: ':sob:',
    shortnames: [],
  },
  angry: {
    altText: 'angry emoji',
    longname: ':angry:',
    shortnames: ['>:[', '&gt;:['],
  },
  rage: {
    altText: 'rage emoji',
    longname: ':rage:',
    shortnames: [],
  },
  ok: {
    altText: 'ok emoji',
    longname: ':ok:',
    shortnames: [],
  },
  thumbsup: {
    altText: 'thumbs up emoji',
    longname: ':thumbsup:',
    shortnames: [],
  },
  clap: {
    altText: 'clap emoji',
    longname: ':clap:',
    shortnames: [],
  },
  heart: {
    altText: 'heart emoji',
    longname: ':heart:',
    shortnames: ['&lt;3', '<3'],
  },
};

const emojiKeyToAltText: { [key: string]: string } = {};
const emojiKeyToImageMap: { [key: string]: string } = {};
const emojiLongnameToImageMap: { [key: string]: string } = {};
const emojiLongnameList: string[] = [];
const emojiShortnameList: string[] = [];

Object.keys(canonicalEmojiMap).forEach(key => {
  const emojiDetails = canonicalEmojiMap[key];
  const emojiAltText = emojiDetails.altText;
  const emojiLongname = emojiDetails.longname;
  const emojiFilename = `${key}.png`;

  emojiLongnameList.push(emojiLongname);
  emojiLongnameToImageMap[emojiLongname] = emojiFilename;
  emojiKeyToAltText[emojiLongname] = emojiAltText;
  emojiKeyToImageMap[emojiLongname] = emojiFilename;

  emojiDetails.shortnames.forEach((name: string) => {
    emojiKeyToAltText[name] = emojiAltText;
    emojiKeyToImageMap[name] = emojiFilename;
    emojiShortnameList.push(name);
  });
});

export {
  emojiLongnameToImageMap,
  emojiKeyToAltText,
  emojiKeyToImageMap,
  emojiLongnameList,
  emojiShortnameList,
};
