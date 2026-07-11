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

// ─────────────────────────────────────────────────────────────────────────────
// VIDEO_CHECKPOINTS — 48 checkpoints across 16 active videos
//
// DESIGN RULES:
//   1. Each question tests a concept explained BEFORE the checkpoint timestamp.
//   2. Timestamps are placed AFTER enough content has been covered (~45-70s in).
//   3. Questions are kept only where necessary — no redundant or filler questions.
//   4. Spacing between checkpoints: ≥ 45s.  Last checkpoint: ≥ 15s before end.
// ─────────────────────────────────────────────────────────────────────────────

export const VIDEO_CHECKPOINTS = {

  // ═══════════════════════════════════════════════════════════════════════════
  // v1 — Introduction to MUN (237s / 3:57) — 3 checkpoints
  // Section flow: What is MUN → Delegate's role → Chair/Dais → Session goal
  // ═══════════════════════════════════════════════════════════════════════════
  v1: [
    {
      // After: "MUN" is defined, the concept of simulating the UN is explained
      id: 'v1_q1',
      timestamp: 60,
      timestampLabel: '1:00',
      question: 'What does a delegate do in a Model United Nations simulation?',
      options: [
        'Represents their assigned country\'s foreign policy and works toward solutions',
        'Judges other delegates\' speeches and assigns scores',
        'Writes news articles about the committee proceedings',
        'Translates documents between different languages'
      ],
      correct: 'Represents their assigned country\'s foreign policy and works toward solutions'
    },
    {
      // After: The role of the Chair / Dais is explained
      id: 'v1_q2',
      timestamp: 130,
      timestampLabel: '2:10',
      question: 'Who maintains order and guides the flow of debate in a MUN committee?',
      options: [
        'The delegate with the most experience',
        'The Chair (also called the Dais)',
        'The Secretary-General of the school',
        'Whichever delegate speaks loudest'
      ],
      correct: 'The Chair (also called the Dais)'
    },
    {
      // After: The overall session structure and its ultimate goal are covered
      id: 'v1_q3',
      timestamp: 200,
      timestampLabel: '3:20',
      question: 'What is the ultimate goal of debate in an MUN committee?',
      options: [
        'To give the longest speech possible',
        'To write and pass a resolution that addresses the committee topic',
        'To eliminate opposing delegates from debate',
        'To memorize the entire UN Charter'
      ],
      correct: 'To write and pass a resolution that addresses the committee topic'
    }
  ],

  // ═══════════════════════════════════════════════════════════════════════════
  // v2 — Research I (258s / 4:18) — 3 checkpoints
  // Section flow: What to research → Primary sources → Country stance → Position Paper
  // ═══════════════════════════════════════════════════════════════════════════
  v2: [
    {
      // After: What delegates should research first is explained
      id: 'v2_q1',
      timestamp: 70,
      timestampLabel: '1:10',
      question: 'What is the first thing you should research when preparing for MUN?',
      options: [
        'The awards criteria and how to win',
        'Your assigned country and the committee topic',
        'The conference venue and food options',
        'Other delegates\' social media profiles'
      ],
      correct: 'Your assigned country and the committee topic'
    },
    {
      // After: Primary vs. secondary sources are discussed
      id: 'v2_q2',
      timestamp: 140,
      timestampLabel: '2:20',
      question: 'Which of the following is a PRIMARY source for MUN research?',
      options: [
        'A Wikipedia summary of the topic',
        'Official UN resolutions and government press releases',
        'A student blog with MUN tips',
        'A social media discussion thread'
      ],
      correct: 'Official UN resolutions and government press releases'
    },
    {
      // After: The position paper structure is introduced
      id: 'v2_q3',
      timestamp: 210,
      timestampLabel: '3:30',
      question: 'A Position Paper typically contains which three sections?',
      options: [
        'Hook, Body, and Thank You',
        'Background of the topic, Country\'s position, and Proposed solutions',
        'Preamble, Operatives, and Signatories',
        'Introduction, Biography, and Conclusion'
      ],
      correct: 'Background of the topic, Country\'s position, and Proposed solutions'
    }
  ],

  // ═══════════════════════════════════════════════════════════════════════════
  // v3 — Research II (234s / 3:54) — 3 checkpoints
  // Section flow: Past resolutions → Treaties/blocs → Building arguments → Multi-country research
  // ═══════════════════════════════════════════════════════════════════════════
  v3: [
    {
      // After: The importance of studying past UN resolutions is explained
      id: 'v3_q1',
      timestamp: 60,
      timestampLabel: '1:00',
      question: 'Why is it important to research past UN resolutions on your topic?',
      options: [
        'To copy them word-for-word into your own resolution',
        'To understand what has already been tried and identify gaps in existing solutions',
        'To prove the UN has been ineffective',
        'It is not important — only new ideas matter'
      ],
      correct: 'To understand what has already been tried and identify gaps in existing solutions'
    },
    {
      // After: Blocs and alliances are discussed
      id: 'v3_q2',
      timestamp: 125,
      timestampLabel: '2:05',
      question: 'What are "blocs" in the context of MUN?',
      options: [
        'Physical blocks used for a model of the UN building',
        'Groups of countries that share similar positions on issues (e.g., EU, G77)',
        'Sections of a draft resolution',
        'Types of voting procedures'
      ],
      correct: 'Groups of countries that share similar positions on issues (e.g., EU, G77)'
    },
    {
      // After: Building arguments and researching other countries is covered
      id: 'v3_q3',
      timestamp: 195,
      timestampLabel: '3:15',
      question: 'Why should you research the positions of OTHER countries, not just your own?',
      options: [
        'To copy their ideas into your speech',
        'To anticipate arguments, find potential allies, and identify opposition',
        'It is unnecessary — you only need your own country\'s position',
        'To report their weaknesses to the Chair'
      ],
      correct: 'To anticipate arguments, find potential allies, and identify opposition'
    }
  ],

  // ═══════════════════════════════════════════════════════════════════════════
  // v4 — Research Part Live Demonstration (360s / 6:00) — 4 checkpoints
  // Section flow: UN Digital Library → Searching/filtering → Reading docs → Source verification → Research binder
  // ═══════════════════════════════════════════════════════════════════════════
  v4: [
    {
      // After: The UN Digital Library is introduced and demonstrated
      id: 'v4_q1',
      timestamp: 80,
      timestampLabel: '1:20',
      question: 'What is the official UN database for searching resolutions and documents?',
      options: [
        'Google Scholar',
        'The UN Digital Library',
        'The Library of Congress',
        'JSTOR'
      ],
      correct: 'The UN Digital Library'
    },
    {
      // After: How to read UN documents and their numbering system is shown
      id: 'v4_q2',
      timestamp: 165,
      timestampLabel: '2:45',
      question: 'When reading a UN document, which section contains the actionable recommendations?',
      options: [
        'The preamble paragraphs',
        'The operative clauses',
        'The header and date line',
        'The list of signatories'
      ],
      correct: 'The operative clauses'
    },
    {
      // After: Source verification and reliability are discussed
      id: 'v4_q3',
      timestamp: 260,
      timestampLabel: '4:20',
      question: 'How can you verify if a source is reliable for MUN research?',
      options: [
        'Check if it has a colorful website design',
        'Verify it comes from an official domain (.gov, .un.org, .int) authored by recognized institutions',
        'See if it appears on the first page of Google',
        'Check how many social media shares it has'
      ],
      correct: 'Verify it comes from an official domain (.gov, .un.org, .int) authored by recognized institutions'
    },
    {
      // After: Organizing a research binder is demonstrated
      id: 'v4_q4',
      timestamp: 330,
      timestampLabel: '5:30',
      question: 'What is the purpose of a "research binder" in MUN preparation?',
      options: [
        'To submit to the Chair for extra credit',
        'To organize key facts, sources, country stance, and solutions for quick reference during debate',
        'To share with opposing delegates',
        'To copy from during committee sessions'
      ],
      correct: 'To organize key facts, sources, country stance, and solutions for quick reference during debate'
    }
  ],

  // ═══════════════════════════════════════════════════════════════════════════
  // v5 — Points I (222s / 3:42) — 3 checkpoints
  // Section flow: What is Point of Personal Privilege → When to use it → Can it interrupt a speaker
  // ═══════════════════════════════════════════════════════════════════════════
  v5: [
    {
      // After: Point of Personal Privilege is defined
      id: 'v5_q1',
      timestamp: 60,
      timestampLabel: '1:00',
      question: 'When should a delegate raise a Point of Personal Privilege?',
      options: [
        'When they disagree with a speaker\'s policy position',
        'When they have a physical discomfort or cannot hear the proceedings',
        'When they want to ask the speaker a question',
        'When they believe a procedural rule was broken'
      ],
      correct: 'When they have a physical discomfort or cannot hear the proceedings'
    },
    {
      // After: Whether it can interrupt is explained
      id: 'v5_q2',
      timestamp: 125,
      timestampLabel: '2:05',
      question: 'Can a Point of Personal Privilege interrupt a speaker during their speech?',
      options: [
        'Yes, but only if the delegate literally cannot hear the speaker (audibility issue)',
        'No, it can never interrupt under any circumstances',
        'Yes, for any personal reason at any time',
        'Only if the Chair gives explicit permission first'
      ],
      correct: 'Yes, but only if the delegate literally cannot hear the speaker (audibility issue)'
    },
    {
      // After: Valid vs. invalid uses are covered
      id: 'v5_q3',
      timestamp: 190,
      timestampLabel: '3:10',
      question: 'Which of the following is NOT a valid reason to raise a Point of Personal Privilege?',
      options: [
        'The microphone is not working and you cannot hear',
        'The air conditioning is making the room too cold',
        'You disagree with the speaker\'s policy position',
        'You need the speaker to repeat their last statement'
      ],
      correct: 'You disagree with the speaker\'s policy position'
    }
  ],

  // ═══════════════════════════════════════════════════════════════════════════
  // v6 — Points II (424s / 7:04) — 4 checkpoints
  // Section flow: Point of Order → Point of Inquiry → Point of Information → Right of Reply
  // ═══════════════════════════════════════════════════════════════════════════
  v6: [
    {
      // After: Point of Order is defined and when to use it
      id: 'v6_q1',
      timestamp: 90,
      timestampLabel: '1:30',
      question: 'When should a delegate raise a Point of Order?',
      options: [
        'When they disagree with a speaker\'s opinion on a policy',
        'When they believe the Chair or a delegate has violated the rules of procedure',
        'When they want to ask the speaker a question about their speech',
        'When they feel physically uncomfortable'
      ],
      correct: 'When they believe the Chair or a delegate has violated the rules of procedure'
    },
    {
      // After: Point of Inquiry (Parliamentary Inquiry) is explained
      id: 'v6_q2',
      timestamp: 190,
      timestampLabel: '3:10',
      question: 'What is a Point of Inquiry (Parliamentary Inquiry)?',
      options: [
        'A question directed at the speaker about their speech content',
        'A question directed at the Chair about the rules of procedure',
        'A motion to change the speaking time',
        'A request to leave the committee room'
      ],
      correct: 'A question directed at the Chair about the rules of procedure'
    },
    {
      // After: Point of Information (to a speaker) is covered
      id: 'v6_q3',
      timestamp: 295,
      timestampLabel: '4:55',
      question: 'When can a delegate ask a "Point of Information to the Speaker"?',
      options: [
        'At any time during the speaker\'s speech by interrupting',
        'Only after the speaker has finished and yielded their time to Points of Information',
        'Only during an unmoderated caucus',
        'Only if the Chair calls on them randomly'
      ],
      correct: 'Only after the speaker has finished and yielded their time to Points of Information'
    },
    {
      // After: Right of Reply is explained
      id: 'v6_q4',
      timestamp: 385,
      timestampLabel: '6:25',
      question: 'What is a Right of Reply?',
      options: [
        'The right to speak on the General Speakers List again',
        'The right to respond when a delegate feels their personal or national integrity has been insulted',
        'The right to ask unlimited questions',
        'The right to veto any resolution'
      ],
      correct: 'The right to respond when a delegate feels their personal or national integrity has been insulted'
    }
  ],

  // ═══════════════════════════════════════════════════════════════════════════
  // v7 — Motions I (316s / 5:16) — 4 checkpoints
  // Section flow: Motion to Open Debate → GSL → Speaking time & Yielding → Closing Speakers List
  // ═══════════════════════════════════════════════════════════════════════════
  v7: [
    {
      // After: Motion to Open Debate is explained
      id: 'v7_q1',
      timestamp: 65,
      timestampLabel: '1:05',
      question: 'What is the purpose of a "Motion to Open Debate"?',
      options: [
        'To formally begin the committee session and start procedural activities',
        'To end the conference early',
        'To allow delegates to speak without any rules',
        'To vote on draft resolutions immediately'
      ],
      correct: 'To formally begin the committee session and start procedural activities'
    },
    {
      // After: The General Speakers List and speaking time are covered
      id: 'v7_q2',
      timestamp: 140,
      timestampLabel: '2:20',
      question: 'What is the "General Speakers List" (GSL)?',
      options: [
        'A list of delegates who are not allowed to speak',
        'The default list that determines the order in which delegates deliver speeches to the full committee',
        'A record of all votes taken during the session',
        'A list of motions that have been proposed'
      ],
      correct: 'The default list that determines the order in which delegates deliver speeches to the full committee'
    },
    {
      // After: Yielding time is explained (yield to delegate, to Chair, to Points of Information)
      id: 'v7_q3',
      timestamp: 220,
      timestampLabel: '3:40',
      question: 'When a delegate finishes their speech early, what can they do with their remaining time?',
      options: [
        'There are no options — unused time is simply lost',
        'Yield to another delegate, yield to Points of Information, or yield to the Chair',
        'They must continue speaking until time runs out',
        'They can donate it to the committee\'s total debate time'
      ],
      correct: 'Yield to another delegate, yield to Points of Information, or yield to the Chair'
    },
    {
      // After: Motion to Close the Speakers List is covered
      id: 'v7_q4',
      timestamp: 285,
      timestampLabel: '4:45',
      question: 'What happens when a "Motion to Close the Speakers List" passes?',
      options: [
        'All debate immediately ends and voting begins',
        'No new names can be added to the GSL; once all listed speakers have spoken, debate may end',
        'The conference is adjourned for the day',
        'The committee immediately votes on all resolutions'
      ],
      correct: 'No new names can be added to the GSL; once all listed speakers have spoken, debate may end'
    }
  ],

  // ═══════════════════════════════════════════════════════════════════════════
  // v8 — Motions II (420s / 7:00) — 4 checkpoints
  // Section flow: Moderated Caucus → Unmoderated Caucus → Suspend/Adjourn/Table → Closure of Debate & Precedence
  // ═══════════════════════════════════════════════════════════════════════════
  v8: [
    {
      // After: Moderated Caucus and its required specifications are explained
      id: 'v8_q1',
      timestamp: 95,
      timestampLabel: '1:35',
      question: 'When proposing a Moderated Caucus, what three things must you specify?',
      options: [
        'Only the topic you want to discuss',
        'The total caucus time, individual speaking time per delegate, AND the specific topic',
        'The names of delegates who should speak',
        'The number of speakers and the room temperature'
      ],
      correct: 'The total caucus time, individual speaking time per delegate, AND the specific topic'
    },
    {
      // After: Unmoderated Caucus is defined and compared to Moderated
      id: 'v8_q2',
      timestamp: 195,
      timestampLabel: '3:15',
      question: 'What is a Motion for an Unmoderated Caucus?',
      options: [
        'A motion for a formal debate with strict speaking turns',
        'A motion for informal, free-form discussion where delegates leave their seats to negotiate directly',
        'A motion to table the current topic',
        'A motion to extend the General Speakers List'
      ],
      correct: 'A motion for informal, free-form discussion where delegates leave their seats to negotiate directly'
    },
    {
      // After: Suspend, Adjourn, and Table are covered
      id: 'v8_q3',
      timestamp: 300,
      timestampLabel: '5:00',
      question: 'What is the difference between "suspending" and "adjourning" a meeting?',
      options: [
        'They mean exactly the same thing',
        'Suspending pauses the session temporarily (e.g., for a break); adjourning ends it permanently',
        'Suspending ends the session; adjourning pauses it',
        'Suspending applies to speakers; adjourning applies to motions'
      ],
      correct: 'Suspending pauses the session temporarily (e.g., for a break); adjourning ends it permanently'
    },
    {
      // After: Closure of Debate and order of precedence are covered
      id: 'v8_q4',
      timestamp: 390,
      timestampLabel: '6:30',
      question: 'What does a "Motion for Closure of Debate" do?',
      options: [
        'It ends only the current moderated caucus',
        'It ends debate on the topic entirely and moves the committee directly to voting on draft resolutions',
        'It restarts the debate from the beginning',
        'It extends the speaking time for all delegates'
      ],
      correct: 'It ends debate on the topic entirely and moves the committee directly to voting on draft resolutions'
    }
  ],

  // ═══════════════════════════════════════════════════════════════════════════
  // v9 — Roll Call (108s / 1:48) — 2 checkpoints
  // Section flow: Present vs Present and Voting → Quorum
  // ═══════════════════════════════════════════════════════════════════════════
  v9: [
    {
      // After: The difference between Present and Present & Voting is explained
      id: 'v9_q1',
      timestamp: 45,
      timestampLabel: '0:45',
      question: 'What does "Present and Voting" mean during Roll Call?',
      options: [
        'It is the same as saying "Present"',
        'The delegate CANNOT abstain during substantive votes — they must vote Yes or No',
        'The delegate gets two votes instead of one',
        'The delegate can leave the room whenever they want'
      ],
      correct: 'The delegate CANNOT abstain during substantive votes — they must vote Yes or No'
    },
    {
      // After: Quorum is defined and late arrival procedure is covered
      id: 'v9_q2',
      timestamp: 85,
      timestampLabel: '1:25',
      question: 'What is "quorum" in MUN?',
      options: [
        'A type of motion used to end debate',
        'The minimum number of delegates who must be present for the committee to conduct business',
        'The maximum number of speakers on the speakers list',
        'The number of votes needed to pass a resolution'
      ],
      correct: 'The minimum number of delegates who must be present for the committee to conduct business'
    }
  ],

  // position_paper has no checkpoints (placeholder video)

  // ═══════════════════════════════════════════════════════════════════════════
  // v11 — Opening Speech (236s / 3:56) — 3 checkpoints
  // Section flow: Structure (Hook/Point/Action) → Delivery techniques → Mistakes & Yielding
  // ═══════════════════════════════════════════════════════════════════════════
  v11: [
    {
      // After: The Hook–Point–Action structure is explained
      id: 'v11_q1',
      timestamp: 65,
      timestampLabel: '1:05',
      question: 'What are the three essential components of a strong MUN opening speech?',
      options: [
        'Hook (attention grabber), Point (country\'s position), and Action (proposed solutions)',
        'Greeting, Joke, and Farewell',
        'Introduction, Biography, and List of allies',
        'Title, Country name, and Thank you'
      ],
      correct: 'Hook (attention grabber), Point (country\'s position), and Action (proposed solutions)'
    },
    {
      // After: Delivery techniques (eye contact, tone, body language) are covered
      id: 'v11_q2',
      timestamp: 135,
      timestampLabel: '2:15',
      question: 'Which delivery technique makes an opening speech more effective?',
      options: [
        'Reading directly from your paper without looking up',
        'Maintaining eye contact, using confident body language, and varying vocal tone',
        'Speaking as fast as possible to fit in more content',
        'Whispering throughout to create a dramatic effect'
      ],
      correct: 'Maintaining eye contact, using confident body language, and varying vocal tone'
    },
    {
      // After: Yielding remaining time is explained
      id: 'v11_q3',
      timestamp: 200,
      timestampLabel: '3:20',
      question: 'At the end of your speech, what should you do with remaining time?',
      options: [
        'Simply stop talking mid-sentence',
        'Yield your time — to Points of Information, to another delegate, or to the Chair',
        'Start discussing an unrelated topic',
        'Ask the Chair for extra time'
      ],
      correct: 'Yield your time — to Points of Information, to another delegate, or to the Chair'
    }
  ],

  // ═══════════════════════════════════════════════════════════════════════════
  // v12 — Draft Resolution - Introduction (140s / 2:20) — 2 checkpoints
  // Section flow: What is a Draft Resolution → Sponsors vs Signatories
  // ═══════════════════════════════════════════════════════════════════════════
  v12: [
    {
      // After: What a draft resolution is and its purpose are explained
      id: 'v12_q1',
      timestamp: 50,
      timestampLabel: '0:50',
      question: 'What is a "Draft Resolution" in MUN?',
      options: [
        'A personal essay about your country',
        'A formal document proposing solutions to the committee topic — it becomes a resolution if voted in favor',
        'The Chair\'s opening remarks for the session',
        'A sketch of the committee room layout'
      ],
      correct: 'A formal document proposing solutions to the committee topic — it becomes a resolution if voted in favor'
    },
    {
      // After: Sponsors vs. Signatories distinction is made clear
      id: 'v12_q2',
      timestamp: 110,
      timestampLabel: '1:50',
      question: 'What is the difference between a "Sponsor" and a "Signatory"?',
      options: [
        'They are the same thing',
        'A Sponsor helped write and fully supports the resolution; a Signatory wants to see it debated but may not support it',
        'A Sponsor only funds it; a Signatory writes the content',
        'A Signatory has more power than a Sponsor'
      ],
      correct: 'A Sponsor helped write and fully supports the resolution; a Signatory wants to see it debated but may not support it'
    }
  ],

  // ═══════════════════════════════════════════════════════════════════════════
  // v13 — Draft Resolution - Preambulatory (112s / 1:52) — 2 checkpoints
  // Section flow: Format rules (italicized starters, commas) → Purpose (background/context)
  // ═══════════════════════════════════════════════════════════════════════════
  v13: [
    {
      // After: The formatting rules for preambulatory clauses are demonstrated
      id: 'v13_q1',
      timestamp: 45,
      timestampLabel: '0:45',
      question: 'How do preambulatory clauses begin?',
      options: [
        'With a strong action verb like "Requests" or "Urges"',
        'With an italicized participle or adjective (e.g., "Noting," "Recalling," "Deeply concerned")',
        'With a country name',
        'With a number followed by a period'
      ],
      correct: 'With an italicized participle or adjective (e.g., "Noting," "Recalling," "Deeply concerned")'
    },
    {
      // After: The purpose of preambulatory clauses is explained
      id: 'v13_q2',
      timestamp: 90,
      timestampLabel: '1:30',
      question: 'What is the PURPOSE of preambulatory clauses?',
      options: [
        'To propose specific actionable solutions',
        'To provide background context, justification, and rationale for the resolution',
        'To list the countries that will vote in favor',
        'To set the budget for implementing the resolution'
      ],
      correct: 'To provide background context, justification, and rationale for the resolution'
    }
  ],

  // ═══════════════════════════════════════════════════════════════════════════
  // v14 — Draft Resolution - Operatives (268s / 4:28) — 3 checkpoints
  // Section flow: Purpose & action verbs → Punctuation & sub-clauses → Amendments
  // ═══════════════════════════════════════════════════════════════════════════
  v14: [
    {
      // After: Purpose and starting verbs (Requests, Urges, Decides, etc.) are taught
      id: 'v14_q1',
      timestamp: 80,
      timestampLabel: '1:20',
      question: 'Operative clauses begin with:',
      options: [
        'An italicized adjective like "Noting" or "Recalling"',
        'An underlined action verb like "Requests," "Urges," "Calls upon," or "Decides"',
        'A country name',
        'A number followed by a dash'
      ],
      correct: 'An underlined action verb like "Requests," "Urges," "Calls upon," or "Decides"'
    },
    {
      // After: Punctuation rules (semicolons, final period) and sub-clauses are demonstrated
      id: 'v14_q2',
      timestamp: 165,
      timestampLabel: '2:45',
      question: 'How do operative clauses end in a draft resolution?',
      options: [
        'Every clause ends with a comma',
        'Each clause ends with a semicolon (;), except the very last one which ends with a period (.)',
        'They all end with exclamation marks',
        'There is no required punctuation'
      ],
      correct: 'Each clause ends with a semicolon (;), except the very last one which ends with a period (.)'
    },
    {
      // After: Amendments are defined
      id: 'v14_q3',
      timestamp: 235,
      timestampLabel: '3:55',
      question: 'What is an "amendment" to a draft resolution?',
      options: [
        'A completely new resolution that replaces the old one',
        'A proposed change — addition, deletion, or modification — to existing clauses',
        'A speech given in support of the resolution',
        'A signature added by a new sponsor'
      ],
      correct: 'A proposed change — addition, deletion, or modification — to existing clauses'
    }
  ],

  // ═══════════════════════════════════════════════════════════════════════════
  // v15 — Unmoderated Caucus (230s / 3:50) — 3 checkpoints
  // Section flow: Definition & rules suspended → Bloc formation → Strategy
  // ═══════════════════════════════════════════════════════════════════════════
  v15: [
    {
      // After: What an Unmoderated Caucus is and that rules are suspended
      id: 'v15_q1',
      timestamp: 65,
      timestampLabel: '1:05',
      question: 'During an Unmoderated Caucus, the formal rules of procedure are:',
      options: [
        'Strictly enforced by the Chair at all times',
        'Temporarily suspended — delegates may leave their seats and speak freely',
        'Replaced by entirely different rules',
        'The same as during a Moderated Caucus'
      ],
      correct: 'Temporarily suspended — delegates may leave their seats and speak freely'
    },
    {
      // After: Bloc formation is explained
      id: 'v15_q2',
      timestamp: 135,
      timestampLabel: '2:15',
      question: 'What is a "bloc" that forms during an Unmoderated Caucus?',
      options: [
        'A physical barrier between committee sections',
        'A group of like-minded countries that work together to write a shared draft resolution',
        'A voting procedure used by the Chair',
        'A type of amendment to a resolution'
      ],
      correct: 'A group of like-minded countries that work together to write a shared draft resolution'
    },
    {
      // After: Effective strategies are covered
      id: 'v15_q3',
      timestamp: 200,
      timestampLabel: '3:20',
      question: 'What is the most effective strategy during an Unmoderated Caucus?',
      options: [
        'Sit quietly and wait for others to approach you',
        'Actively approach delegates, pitch ideas, find allies, and contribute to drafting clauses',
        'Focus only on talking to one person the entire time',
        'Leave the room since rules are suspended'
      ],
      correct: 'Actively approach delegates, pitch ideas, find allies, and contribute to drafting clauses'
    }
  ],

  // ═══════════════════════════════════════════════════════════════════════════
  // v16 — Moderated Caucus (286s / 4:46) — 3 checkpoints
  // Section flow: How it works (placard/Chair) → Proposing (3 specs) → Strategy & timing
  // ═══════════════════════════════════════════════════════════════════════════
  v16: [
    {
      // After: How delegates get recognized to speak is explained
      id: 'v16_q1',
      timestamp: 80,
      timestampLabel: '1:20',
      question: 'How does a delegate get the floor to speak during a Moderated Caucus?',
      options: [
        'By shouting over other delegates',
        'By raising their placard and being recognized by the Chair',
        'By running to the podium first',
        'By sending a note to the delegate next to them'
      ],
      correct: 'By raising their placard and being recognized by the Chair'
    },
    {
      // After: How to propose a Moderated Caucus (total time, speaking time, topic) is covered
      id: 'v16_q2',
      timestamp: 170,
      timestampLabel: '2:50',
      question: 'When proposing a Moderated Caucus, you must specify:',
      options: [
        'Only the topic you want to discuss',
        'Total caucus time, individual speaking time, and the specific topic of discussion',
        'The names of all delegates who will speak',
        'The countries allowed to participate'
      ],
      correct: 'Total caucus time, individual speaking time, and the specific topic of discussion'
    },
    {
      // After: Strategic use and when to propose one are discussed
      id: 'v16_q3',
      timestamp: 250,
      timestampLabel: '4:10',
      question: 'When is the best strategic time to propose a Moderated Caucus?',
      options: [
        'At the very start before Roll Call',
        'When debate needs focus on a specific sub-issue, or when you want to steer discussion',
        'Only at the very end of the conference',
        'Only when the Chair specifically requests one'
      ],
      correct: 'When debate needs focus on a specific sub-issue, or when you want to steer discussion'
    }
  ],

  // ═══════════════════════════════════════════════════════════════════════════
  // v17 — Resolution Debate Procedure (170s / 2:50) — 2 checkpoints
  // Section flow: Introducing & debating a DR → Voting (Yes/No/Abstain, majority, P&V rule)
  // ═══════════════════════════════════════════════════════════════════════════
  v17: [
    {
      // After: The voting procedure and majority requirement are explained
      id: 'v17_q1',
      timestamp: 65,
      timestampLabel: '1:05',
      question: 'What is required for a draft resolution to pass and become adopted?',
      options: [
        'The Chair signs it without any vote',
        'It must receive a simple majority (more Yes votes than No votes)',
        'Every single delegate must agree unanimously',
        'The sponsors simply present it and it is automatically adopted'
      ],
      correct: 'It must receive a simple majority (more Yes votes than No votes)'
    },
    {
      // After: Yes/No/Abstain and the "Present and Voting" abstention rule are explained
      id: 'v17_q2',
      timestamp: 135,
      timestampLabel: '2:15',
      question: 'Can a delegate who declared "Present and Voting" during Roll Call abstain from a vote?',
      options: [
        'Yes, they can abstain freely like everyone else',
        'No — "Present and Voting" means they MUST vote Yes or No and cannot abstain',
        'They can abstain only if the Chair allows it',
        'They can abstain only on the first vote of the day'
      ],
      correct: 'No — "Present and Voting" means they MUST vote Yes or No and cannot abstain'
    }
  ]
};
