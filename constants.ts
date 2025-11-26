import { Family } from './types';

export const INITIAL_FAMILY: Family = {
  id: 'fam_001',
  name: 'The McCallisters',
  code: 'KEVIN',
  adminEmail: 'kate@mccallister.com',
  password: 'password', // Simple for demo
  subFamilies: ["Peter & Kate's House", "Frank & Leslie's House"],
  isPremium: false,
  members: [
    {
      id: 'm1',
      name: 'Kevin',
      subFamily: "Peter & Kate's House",
      childGroup: "The Kids",
      photoUrl: 'https://picsum.photos/seed/kevin/400/600',
      greeting: "Merry Christmas, ya filthy animals! I successfully defended the house again this year.",
      updates: [
        { category: 'School', text: 'Top of the class in trap design.' },
        { category: 'Travel', text: 'Went to New York... alone.' }
      ],
      reactions: { '😱': 12, '🎄': 8 },
      comments: []
    },
    {
      id: 'm2',
      name: 'Buzz',
      subFamily: "Peter & Kate's House",
      childGroup: "The Kids",
      photoUrl: 'https://picsum.photos/seed/buzz/400/600',
      greeting: "I wouldn't let you sleep in my room if you were growing on my",
      updates: [
        { category: 'Pet', text: 'My tarantula fits in my pocket now.' }
      ],
      reactions: { '🕷️': 5 },
      comments: []
    },
    {
      id: 'm3',
      name: 'Kate',
      subFamily: "Peter & Kate's House",
      photoUrl: 'https://picsum.photos/seed/kate/400/600',
      greeting: "Wishing everyone a peaceful holiday where we remember all our children.",
      updates: [
        { category: 'Work', text: 'Planning next year\'s Paris trip.' }
      ],
      reactions: { '❤️': 15 },
      comments: []
    },
    {
      id: 'm4',
      name: 'Fuller',
      subFamily: "Frank & Leslie's House",
      childGroup: "The Cousins",
      photoUrl: 'https://picsum.photos/seed/fuller/400/600',
      greeting: "Go easy on the Pepsi!",
      updates: [
        { category: 'Diet', text: 'Cutting back on soda.' }
      ],
      reactions: { '🥤': 20 },
      comments: []
    },
    {
      id: 'm5',
      name: 'Uncle Frank',
      subFamily: "Frank & Leslie's House",
      photoUrl: 'https://picsum.photos/seed/frank/400/600',
      greeting: "Look what you did, you little jerk.",
      updates: [
        { category: 'Travel', text: 'Looking for free shrimp cocktails.' }
      ],
      reactions: { '🍤': 3 },
      comments: []
    }
  ]
};

export const HIGHLIGHT_CATEGORIES = [
  'Work', 'School', 'Travel', 'Hobby', 'Life Event', 'Health', 'Achievement'
];

export const REACTIONS = ['❤️', '🎄', '❄️', '🥂', '🍪', '😂'];