export const TRAINING_VIDEOS = [
  { id: 'v1', title: 'Introduction to MUN', url: 'https://www.youtube.com/embed/ChzKEFkv7Dg', youtubeId: 'ChzKEFkv7Dg', deadline: 'May 20, 2026' },
  { id: 'v2', title: 'Research I', url: 'https://www.youtube.com/embed/yPOr9Xg28AU', youtubeId: 'yPOr9Xg28AU', deadline: 'May 22, 2026' },
  { id: 'v3', title: 'Research II', url: 'https://www.youtube.com/embed/KTr4sDnE2zE', youtubeId: 'KTr4sDnE2zE', deadline: 'May 24, 2026' },
  { id: 'v4', title: 'Research Part Live Demonstration', url: 'https://www.youtube.com/embed/lnjpnhQPrRI', youtubeId: 'lnjpnhQPrRI', deadline: 'May 26, 2026' },
  { id: 'v5', title: 'Points I', url: 'https://www.youtube.com/embed/4nOiPrbcxyM', youtubeId: '4nOiPrbcxyM', deadline: 'May 28, 2026' },
  { id: 'v6', title: 'Points II', url: 'https://www.youtube.com/embed/HCGKEtP3Rww', youtubeId: 'HCGKEtP3Rww', deadline: 'May 30, 2026' },
  { id: 'v7', title: 'Motions I', url: 'https://www.youtube.com/embed/GM_Dgj23ePs', youtubeId: 'GM_Dgj23ePs', deadline: 'June 1, 2026' },
  { id: 'v8', title: 'Motions II', url: 'https://www.youtube.com/embed/ddS9cCaxQiU', youtubeId: 'ddS9cCaxQiU', deadline: 'June 3, 2026' },
  { id: 'v9', title: 'Roll Call', url: 'https://www.youtube.com/embed/nCxGlgpafFk', youtubeId: 'nCxGlgpafFk', deadline: 'June 5, 2026' },
  { id: 'position_paper', title: 'Position Paper Guide', url: '', youtubeId: '', deadline: 'Coming Soon', isPlaceholder: true },
  { id: 'v11', title: 'Opening Speech', url: 'https://www.youtube.com/embed/-TmTYMbfWEs', youtubeId: '-TmTYMbfWEs', deadline: 'June 9, 2026' },
  { id: 'v12', title: 'Draft Resolution - Introduction', url: 'https://www.youtube.com/embed/JhRlyvPQvLQ', youtubeId: 'JhRlyvPQvLQ', deadline: 'June 11, 2026' },
  { id: 'v13', title: 'Draft Resolution - Preambulatory', url: 'https://www.youtube.com/embed/FaP76l7BbiQ', youtubeId: 'FaP76l7BbiQ', deadline: 'June 13, 2026' },
  { id: 'v14', title: 'Draft Resolution - Operatives', url: 'https://www.youtube.com/embed/5vPlnSKTruA', youtubeId: '5vPlnSKTruA', deadline: 'June 15, 2026' },
  { id: 'v15', title: 'Unmoderated Caucus', url: 'https://www.youtube.com/embed/paF5ZmsvTUY', youtubeId: 'paF5ZmsvTUY', deadline: 'June 17, 2026' },
  { id: 'v16', title: 'Moderated Caucus', url: 'https://www.youtube.com/embed/U-M-3BBRe5o', youtubeId: 'U-M-3BBRe5o', deadline: 'June 19, 2026' },
  { id: 'v17', title: 'Resolution Debate Procedure', url: 'https://www.youtube.com/embed/EMuLbPUZblE', youtubeId: 'EMuLbPUZblE', deadline: 'June 21, 2026' }
];

export const VIDEO_CHECKPOINTS = {
  v1: [
    {
      id: 'v1_q1',
      timestamp: 30,
      timestampLabel: '0:30',
      question: 'What is the primary goal of a delegate in a Model UN committee?',
      options: [
        'To win awards at all costs',
        "To represent their assigned country's foreign policy and collaborate on solutions",
        'To argue and defeat other delegates',
        'To read their speech and leave early'
      ],
      correct: "To represent their assigned country's foreign policy and collaborate on solutions"
    }
  ],
  v2: [
    {
      id: 'v2_q1',
      timestamp: 30,
      timestampLabel: '0:30',
      question: 'Which of the following is considered a primary source for researching your country\'s stance on a topic?',
      options: [
        'Wikipedia articles',
        'Official UN resolutions and government statements',
        'Social media discussions',
        'A blog post by a student'
      ],
      correct: 'Official UN resolutions and government statements'
    }
  ],
  v3: [
    {
      id: 'v3_q1',
      timestamp: 30,
      timestampLabel: '0:30',
      question: 'Why is it important to research past UN resolutions on your committee topic?',
      options: [
        'To copy them word-for-word into your resolution',
        'To understand what the international community has already tried and where the gaps are',
        'To prove that the UN has done nothing',
        'It is not important; you should only write new ideas'
      ],
      correct: 'To understand what the international community has already tried and where the gaps are'
    }
  ],
  v4: [
    {
      id: 'v4_q1',
      timestamp: 30,
      timestampLabel: '0:30',
      question: 'When conducting a live search for UN documents, what is the official database called?',
      options: [
        'Google Scholar',
        'UN Digital Library',
        'Library of Congress',
        'UN Wikipedia'
      ],
      correct: 'UN Digital Library'
    }
  ],
  v5: [
    {
      id: 'v5_q1',
      timestamp: 30,
      timestampLabel: '0:30',
      question: 'If the room is too cold, or you cannot hear the speaker, which point should you rise to?',
      options: [
        'Point of Inquiry',
        'Point of Personal Privilege',
        'Point of Order',
        'Point of Information'
      ],
      correct: 'Point of Personal Privilege'
    }
  ],
  v6: [
    {
      id: 'v6_q1',
      timestamp: 30,
      timestampLabel: '0:30',
      question: 'When should a delegate raise a Point of Order?',
      options: [
        'When they want to ask the Chair a general question',
        'When they believe the Chair or another delegate has violated the rules of procedure',
        'When they disagree with a speaker\'s opinion',
        'When they want to go to the restroom'
      ],
      correct: 'When they believe the Chair or another delegate has violated the rules of procedure'
    }
  ],
  v7: [
    {
      id: 'v7_q1',
      timestamp: 30,
      timestampLabel: '0:30',
      question: 'What is the purpose of a Motion to Open Debate?',
      options: [
        'To start the committee session formally',
        'To end the conference early',
        'To allow delegates to speak without limits',
        'To vote on resolutions immediately'
      ],
      correct: 'To start the committee session formally'
    }
  ],
  v8: [
    {
      id: 'v8_q1',
      timestamp: 30,
      timestampLabel: '0:30',
      question: 'Which motion is used to suspend the rules for a temporary, informal discussion where delegates can speak for a set time?',
      options: [
        'Motion for an Unmoderated Caucus',
        'Motion for a Moderated Caucus',
        'Motion to Adjourn',
        'Motion to Table the Topic'
      ],
      correct: 'Motion for a Moderated Caucus'
    }
  ],
  v9: [
    {
      id: 'v9_q1',
      timestamp: 30,
      timestampLabel: '0:30',
      question: 'What is the difference between responding \'Present\' vs \'Present and Voting\' during Roll Call?',
      options: [
        'There is no difference',
        '\'Present and Voting\' means you cannot abstain from voting on draft resolutions',
        '\'Present\' allows you to leave the room whenever you want',
        '\'Present and Voting\' gives you two votes instead of one'
      ],
      correct: '\'Present and Voting\' means you cannot abstain from voting on draft resolutions'
    }
  ],
  // position_paper has no checkpoints as it is a placeholder
  v11: [
    {
      id: 'v11_q1',
      timestamp: 30,
      timestampLabel: '0:30',
      question: 'What are the three essential components of a strong MUN opening speech?',
      options: [
        'Hook, Point, and Action (or Solution)',
        'Greeting, Joke, and Conclusion',
        'Introduction, Biography, and List of friends',
        'Title, Country name, and Thank you'
      ],
      correct: 'Hook, Point, and Action (or Solution)'
    }
  ],
  v12: [
    {
      id: 'v12_q1',
      timestamp: 30,
      timestampLabel: '0:30',
      question: 'What is a \'Sponsor\' of a draft resolution?',
      options: [
        'A delegate who pays for printing the document',
        'A country that helped write the resolution and fully supports its content',
        'A country that merely wants to see the resolution debated but might not support it',
        'The Chair of the committee'
      ],
      correct: 'A country that helped write the resolution and fully supports its content'
    }
  ],
  v13: [
    {
      id: 'v13_q1',
      timestamp: 30,
      timestampLabel: '0:30',
      question: 'Which of the following describes the correct formatting of preambulatory clauses?',
      options: [
        'They begin with an underlined/italicized participle or adjective, end with a comma, and outline background context',
        'They begin with an action verb, end with a semicolon, and outline specific solutions',
        'They are written in bullet points without any specific rules',
        'They must be in all capital letters'
      ],
      correct: 'They begin with an underlined/italicized participle or adjective, end with a comma, and outline background context'
    }
  ],
  v14: [
    {
      id: 'v14_q1',
      timestamp: 30,
      timestampLabel: '0:30',
      question: 'How do operative clauses end in a draft resolution?',
      options: [
        'With a comma',
        'With a period (for the final clause) or a semicolon (for others)',
        'With an exclamation mark',
        'With no punctuation'
      ],
      correct: 'With a period (for the final clause) or a semicolon (for others)'
    }
  ],
  v15: [
    {
      id: 'v15_q1',
      timestamp: 30,
      timestampLabel: '0:30',
      question: 'What is the primary activity delegates do during an Unmoderated Caucus?',
      options: [
        'Deliver speeches in front of the committee',
        'Informally negotiate, form blocs, and write draft resolutions',
        'Take a recess and leave the building',
        'Ask the Chair questions about rules of procedure'
      ],
      correct: 'Informally negotiate, form blocs, and write draft resolutions'
    }
  ],
  v16: [
    {
      id: 'v16_q1',
      timestamp: 30,
      timestampLabel: '0:30',
      question: 'How does a delegate get the floor to speak during a Moderated Caucus?',
      options: [
        'By shouting over other delegates',
        'By raising their placard and being recognized by the Chair',
        'By running to the podium',
        'By sending a note to the delegate of the USA'
      ],
      correct: 'By raising their placard and being recognized by the Chair'
    }
  ],
  v17: [
    {
      id: 'v17_q1',
      timestamp: 30,
      timestampLabel: '0:30',
      question: 'What is the final step required for a draft resolution to become an official, adopted UN resolution?',
      options: [
        'The Chair signs it without a vote',
        'It passes with a majority vote in the committee',
        'Every delegate agrees to it unanimously',
        'The sponsors present it and debate ends immediately'
      ],
      correct: 'It passes with a majority vote in the committee'
    }
  ]
};
