import { flatten } from '@freelancer/utils';
import { randomiseList } from './random';

export const paragraphs = {
  prideAndPrejudice: [
    'It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.',
    'However little known the feelings or views of such a man may be on his first entering a neighbourhood, this truth is so well fixed in the minds of the surrounding families, that he is considered the rightful property of some one or other of their daughters.',
    '"My dear Mr. Bennet," said his lady to him one day, "have you heard that Netherfield Park is let at last?"',
    'Mr. Bennet replied that he had not.',
    '"But it is," returned she; "for Mrs. Long has just been here, and she told me all about it."',
    'Mr. Bennet made no answer.',
    '"Do you not want to know who has taken it?" cried his wife impatiently.',
    '"You want to tell me, and I have no objection to hearing it."',
    'This was invitation enough.',
    '"Why, my dear, you must know, Mrs. Long says that Netherfield is taken by a young man of large fortune from the north of England; that he came down on Monday in a chaise and four to see the place, and was so much delighted with it, that he agreed with Mr. Morris immediately; that he is to take possession before Michaelmas, and some of his servants are to be in the house by the end of next week."',
    '"What is his name?"',
    '"Bingley."',
    '"Is he married or single?"',
    '"Oh! Single, my dear, to be sure! A single man of large fortune; four or five thousand a year. What a fine thing for our girls!"',
    '"How so? How can it affect them?"',
    '"My dear Mr. Bennet," replied his wife, "how can you be so tiresome! You must know that I am thinking of his marrying one of them."',
    '"Is that his design in settling here?"',
    '"Design! Nonsense, how can you talk so! But it is very likely that he may fall in love with one of them, and therefore you must visit him as soon as he comes."',
    '"I see no occasion for that. You and the girls may go, or you may send them by themselves, which perhaps will be still better, for as you are as handsome as any of them, Mr. Bingley may like you the best of the party."',
    '"My dear, you flatter me. I certainly have had my share of beauty, but I do not pretend to be anything extraordinary now. When a woman has five grown-up daughters, she ought to give over thinking of her own beauty."',
    '"In such cases, a woman has not often much beauty to think of."',
    '"But, my dear, you must indeed go and see Mr. Bingley when he comes into the neighbourhood."',
    '"It is more than I engage for, I assure you."',
    '"But consider your daughters. Only think what an establishment it would be for one of them. Sir William and Lady Lucas are determined to go, merely on that account, for in general, you know, they visit no newcomers. Indeed you must go, for it will be impossible for us to visit him if you do not."',
    '"You are over-scrupulous, surely. I dare say Mr. Bingley will be very glad to see you; and I will send a few lines by you to assure him of my hearty consent to his marrying whichever he chooses of the girls; though I must throw in a good word for my little Lizzy."',
    '"I desire you will do no such thing. Lizzy is not a bit better than the others; and I am sure she is not half so handsome as Jane, nor half so good-humoured as Lydia. But you are always giving her the preference."',
    '"They have none of them much to recommend them," replied he; "they are all silly and ignorant like other girls; but Lizzy has something more of quickness than her sisters."',
    '"Mr. Bennet, how can you abuse your own children in such a way? You take delight in vexing me. You have no compassion for my poor nerves."',
    '"You mistake me, my dear. I have a high respect for your nerves. They are my old friends. I have heard you mention them with consideration these last twenty years at least."',
    '"Ah, you do not know what I suffer."',
    '"But I hope you will get over it, and live to see many young men of four thousand a year come into the neighbourhood."',
    '"It will be no use to us, if twenty such should come, since you will not visit them."',
    '"Depend upon it, my dear, that when there are twenty, I will visit them all."',
    'Mr. Bennet was so odd a mixture of quick parts, sarcastic humour, reserve, and caprice, that the experience of three-and-twenty years had been insufficient to make his wife understand his character. Her mind was less difficult to develop. She was a woman of mean understanding, little information, and uncertain temper. When she was discontented, she fancied herself nervous. The business of her life was to get her daughters married; its solace was visiting and news',
  ],
  aTaleOfTwoCities: [
    'It was the best of times,',
    'it was the worst of times,',
    'it was the age of wisdom,',
    'it was the age of foolishness,',
    'it was the epoch of belief,',
    'it was the epoch of incredulity,',
    'it was the season of Light,',
    'it was the season of Darkness,',
    'it was the spring of hope,',
    'it was the winter of despair,',
  ],
  theAdventuresOfTomSawyer: [
    '"TOM!"',
    'No answer.',
    '"TOM!"',
    'No answer.',
    '"What\'s gone with that boy,  I wonder? You TOM!"',
    'No answer.',
    'The old lady pulled her spectacles down and looked over them about the room; then she put them up and looked out under them. She seldom or never looked through them for so small a thing as a boy; they were her state pair, the pride of her heart, and were built for "style," not service—she could have seen through a pair of stove-lids just as well. She looked perplexed for a moment, and then said, not fiercely, but still loud enough for the furniture to hear:',
    '"Well, I lay if I get hold of you I\'ll—"',
    'She did not finish, for by this time she was bending down and punching under the bed with the broom, and so she needed breath to punctuate the punches with. She resurrected nothing but the cat.',
    '"I never did see the beat of that boy!"',
    'She went to the open door and stood in it and looked out among the tomato vines and "jimpson" weeds that constituted the garden. No Tom. So she lifted up her voice at an angle calculated for distance and shouted:',
    '"Y-o-u-u TOM!"',
    'There was a slight noise behind her and she turned just in time to seize a small boy by the slack of his roundabout and arrest his flight.',
    '"There! I might \'a\' thought of that closet. What you been doing in there?"',
    '"Nothing."',
    '"Nothing! Look at your hands. And look at your mouth. What is that truck?"',
    '"I don\'t know, aunt."',
    "\"Well, I know. It's jam—that's what it is. Forty times I've said if you didn't let that jam alone I'd skin you. Hand me that switch.\"",
    'The switch hovered in the air—the peril was desperate—',
    '"My! Look behind you, aunt!"',
    'The old lady whirled round, and snatched her skirts out of danger. The lad fled on the instant, scrambled up the high board-fence, and disappeared over it.',
  ],
  huckleberryFinn: [
    'YOU don’t know about me without you have read a book by the name of The Adventures of Tom Sawyer; but that ain’t no matter.',
    'That book was made by Mr. Mark Twain, and he told the truth, mainly.',
    'There was things which he stretched, but mainly he told the truth.',
    'That is nothing.',
    'I never seen anybody but lied one time or another, without it was Aunt Polly, or the widow, or maybe Mary.',
    'Aunt Polly—Tom’s Aunt Polly, she is—and Mary, and the Widow Douglas is all told about in that book, which is mostly a true book, with some stretchers, as I said before.',
  ],
  theLionTheWitchAndTheWardrobe: [
    'Once there were four children whose names were Peter, Susan, Edmund and Lucy.',
    'This story is about something that happened to them when they were sent away from London during the war because of the air-raids.',
    'They were sent to the house of an old Professor who lived in the heart of the country, ten miles from the nearest railway station and two miles from the nearest post office.',
    'He had no wife and he lived in a very large house with a housekeeper called Mrs. Macready and three servants.',
    '(Their names were Ivy, Margaret and Betty, but they do not come into the story much.)',
    'He himself was a very old man with shaggy white hair, which grew over most of his face as well as on his head, and they liked him almost at once; but on the first evening when he came out to meet them at the front door he was so odd-looking that Lucy (who was the youngest) was a little afraid of him, and Edmund (who was the next youngest) wanted to laugh and had to keep on pretending he was blowing his nose to hide it.',
  ],
  loveSongOfPrufrock: [
    'Let us go then, you and I',
    'When the evening is spread out against the sky',
    'Like a patient etherized upon a table;',
    'Let us go, through certain half-deserted streets',
    'The muttering retreats',
    'Of restless nights in one-night cheap hotels',
    'And sawdust restaurants with oyster-shells:',
    'Streets that follow like a tedious argument',
    'Of insidious intent',
    'To lead you to an overwhelming question ...',
    'Oh, do not ask, “What is it?”',
    'Let us go and make our visit.',
    'In the room the women come and go',
    'Talking of Michelangelo.',
    'The yellow fog that rubs its back upon the window-panes',
    'The yellow smoke that rubs its muzzle on the window-panes',
    'Licked its tongue into the corners of the evening',
    'Lingered upon the pools that stand in drains',
    'Let fall upon its back the soot that falls from chimneys',
    'Slipped by the terrace, made a sudden leap',
    'And seeing that it was a soft October night',
    'Curled once about the house, and fell asleep.',
  ],
};

const corpus = flatten(Object.values(paragraphs));

export function getNovelLine(novel: keyof typeof paragraphs, index: number) {
  return paragraphs[novel][index % paragraphs[novel].length];
}

export function getTitleText(index: number) {
  return paragraphs.loveSongOfPrufrock[
    index % paragraphs.loveSongOfPrufrock.length
  ];
}

export function getRandomText(min = 10, max = Number.POSITIVE_INFINITY) {
  const lines = randomiseList(corpus, `randomText${min}-${max}`);
  let text = '';
  for (let i = 0; i < lines.length; i++) {
    if (text.length < min) {
      text += `${lines[i]} `;
    } else {
      break;
    }
  }

  if (text.length > max) {
    return text.slice(0, max).trimRight();
  }

  return text.trimRight();
}

export const people: ReadonlyArray<string> = [
  'Hamlet',
  'Claudius',
  'Gertrude',
  'Polonius',
  'Horatio',
  'Ophelia',
  'Laertes',
  'Fortinbras',
  'The Ghost',
  'Rosencrantz',
  'Guildenstern',
  'Osric',
  'Voltimand',
  'Cornelius',
  'Marcellus',
  'Bernardo',
  'Francisco',
  'Reynaldo',
];

export const peopleWithSurnames: ReadonlyArray<string> = [
  'Han Solo',
  'Darth Vader',
  'Boba Fett',
  'Master Yoda',
  'Princess Leia',
  'Luke Skywalker',
  'R2 D2',
  'Obi-Wan Kenobi',
  'Darth Maul',
  'C 3PO',
  'Lando Calrissian',
  'Jabba theHut',
  'Mace Windu',
  'The Emperor',
  'Chirrut Îmwe',
  'Kylo Ren',
  'Admiral Ackbar',
  'Bib Fortuna',
  'Qui-Gon Jinn',
  'General Grievous',
  'Poe Dameron',
  'Wicket WWarrick',
  'Enfys Nest',
  'Salacious Crumb',
  'Max Rebo',
  'Ponda Baba',
  'Nien Nunb',
  'Count Dooku',
  'Mon Mothma',
  'Admiral Holdo',
  'Wedge Antilles',
  'Firmus Piett',
  'Uncle Owen',
  'Admiral Motti',
  'Padmé Amidala',
  'Jango Fett',
];

export function camelCase(s: string): string {
  return s
    .split(' ')
    .map((element, index) =>
      index === 0
        ? element.charAt(0).toLowerCase() + element.slice(1)
        : element.charAt(0).toUpperCase() + element.slice(1),
    )
    .join('');
}
