class WordSet {
  // TODO: Structure to allow words to have multiple rhythms
  // associated with them or compound words
  // e.g. Pumpkin pie or parajito would be [ei_2, qu_1] or [ei_2, ei_2]

  // TODO: Allow place for a filepath for the photo
  // TODO: allow for complex rhythms like hen hen-ga llina
  constructor(
    name,
    words,
    possiblePatterns,
    clipPaths,
    beats = 4,
    allowedRhythms = new Set()
  ) {
    // Takes in allowed rhythms, which if empty will allow all words
    // and if not will allow words whose rhythms are in allowed rhythms
    this.name = name;
    this.beats = beats; // Number of beats in a pattern
    this.allowedRhythms = allowedRhythms;
    this.clipPaths = clipPaths;
    this.words = {};
    // All the words that could show up
    this.lengthIndex = {}; // Object that goes from integers to a list of words
    // that take up that many spaces or less
    // This is used so that when a word is to be selected the word won't take
    // up more spaces than is possible in the rhythm
    this.possibleWords = new Set([]);

    this.resetLengthIndex();
    this.words = words;

    if (allowedRhythms.size === 0) {
      // If allowedRhythms is empty, all
      for (let word in words) {
        if (words.hasOwnProperty(word)) {
          // TODO: need to check if number of rhythms is too high for beats
          // TODO: need to index into lengthIndex
          for (let i = words[word].length; i <= beats; i++) {
            // Will add the word to the length index for all the lengths that
            // are the length of the word or more
            // e.g. "perro" takes up a single beat in two eighth notes and
            // will therefore be accessible in 1, 2, 3, and 4 in a 4 beat deck.
            //
            // This will also make sure the word is included only if the word
            // has equal or fewer beats than the beats in the measure, because
            // otherwise it's not included in possible words
            this.lengthIndex[i].add(word);
            this.possibleWords.add(word);
          }
        }
      }
    } else {
      for (let word in words) {
        if (words.hasOwnProperty(word)) {
          let rhythms = words[word];
          // All of the rhythms in the word are allowed rhythms, i.e. every
          // kind of rhythm in the sequence of rhythms of the word we allowed
          const allRhythmsAllowed = rhythms.every((item) =>
            allowedRhythms.has(item)
          );
          // TODO: need to check if each rhythm in the list is in the set
          // TODO: need to check if the number of rhythms is too high for beats
          // TODO: need to index into lengthIndex
          if (allRhythmsAllowed) {
            for (let i = words[word].length; i <= beats; i++) {
              this.lengthIndex[i].add(word);
              this.possibleWords.add(word);
            }
          }
        }
      }
    }

    this.possiblePatterns = possiblePatterns;

    // Will only be a valid set if you could get a question with more than one
    // word
    // We include this in case a set has only complex rhythms that the teacher
    // wants to exclude.
    // For example, bird and pajaro. If the teacher wanted to include only
    // quarter and eighth notes, then bird would be allowed but not parajo.
    // Thus, the set would have at least one word, but every time it would
    // just generate bird bird bird bird (or however long the pattern is)
    this.valid = this.possibleWords.size > 1;
  }

  resetLengthIndex() {
    const dictionary = {};
    for (let i = this.beats; i > 0; i--) {
      dictionary[i] = new Set();
    }
    this.lengthIndex = dictionary;
  }

  generatePattern() {
    /**
     * Given a pattern length, generates some combination of the words in
     * words in a random order. Returns the surface pattern and the underlying
     * rhythm.
     */

    let pattern = []; // Surface form of the rhythm, i.e. what's displayed
    let rhythm = []; // Underlying form of rhythm, i.e. what actual rhythms
    let beatsOccupied = []; // Number of beats that each word in pattern 
                            // takes up. e.g. Paja-ro is two
    let ordinal = []; // Array of integers that determines what position in the
    // measure the surface form words are, i.e. if they're
    // 2nd to last or last beat they will have a different
    // inflection

    // for (let i = 0; i < this.beats; i++) {
    //   const keys = Object.keys(this.words);
    //   const randomWord = keys[Math.floor(Math.random() * keys.length)];
    //   const randomRhythm = this.words[randomWord];
    //   pattern.push(randomWord);
    //   rhythm.push(randomRhythm[0]);
    // }

    let beatsSet = 0;

    while (beatsSet < this.beats) {
      const beatsLeft = this.beats - beatsSet;
      const wordsToChooseFrom = this.lengthIndex[beatsLeft];
      const randomWord = [...wordsToChooseFrom][
        Math.floor(Math.random() * wordsToChooseFrom.size)
      ];
      const randomRhythm = this.words[randomWord];

      //   pattern.push(...randomWord.split("-"));
      pattern.push(randomWord);
      // If the word takes up multiple beats, will add them each to the pattern
      rhythm.push(...randomRhythm);
      // Will add all elements in the underlying rhythm of the word to the
      // underlying rhythm of the pattern.
      beatsOccupied.push(randomRhythm.length);

      beatsSet += randomRhythm.length;

      if (beatsSet > this.beats) {
        throw Error("Indexing problem. Rhythm overflowed.");
      }
    }

    ordinal = new Array(pattern.length);

    let spacesFromEnd = 0;

    for (let i = beatsOccupied.length - 1; i > -1; i--) {
      // Iterating backwards through the surface form of the rhythm, the
      // number of dashes will determine spacing
      const numBeats = beatsOccupied[i];
      spacesFromEnd += numBeats;
      ordinal[i] = spacesFromEnd;
    }

    return [pattern, rhythm, beatsOccupied, ordinal];
  }
}

// TODO: Make NoteDeck not just be wordsets but also have a version
// That works with lyrics from songs
class NoteDeck {
  constructor(deckname, beats = 4, allowedRhythms = new Set()) {
    this.deckname = deckname;
    this.wordsets = [];
    this.beats = beats;
    this.allClipPaths = {};
    // The possible word configurations that can come up
    // For example, a question that will generate from a combination of tas
    // and titis vs. a question that could generate from a combination of
    // cats and gatos
  }

  static fromJSON(json, beats, allowedRhythms = new Set()) {
    let res = new NoteDeck(json["deck_name"], beats, allowedRhythms);
    json["question_set"].forEach((setOfWords) => {
      const genWordSet = new WordSet(
        setOfWords["name"],
        setOfWords["words"],
        setOfWords["possible_patterns"],
        setOfWords["clip_paths"],
        beats,
        allowedRhythms
      );
      if ("clip_paths" in setOfWords && setOfWords["clip_paths"]) {
        res.allClipPaths = Object.assign(
          res.allClipPaths,
          setOfWords["clip_paths"]
        );
      }
      if (genWordSet.valid) {
        res.wordsets.push(genWordSet);
      }
    });
    return res;
  }

  generateQuestion() {
    const index = Math.floor(Math.random() * this.wordsets.length);
    return this.wordsets[index].generatePattern();
  }

  setNumberBeats() {}
  // TODO: set the number of beats and also update children

  setAllowedRhythms() {}
  // TODO: set allowed rhythms
}

export default NoteDeck;
