class WordSet {
  // TODO: Structure to allow words to have multiple rhythms 
  // associated with them or compound words
  // e.g. Pumpkin pie or parajito would be [ei_2, qu_1] or [ei_2, ei_2]

  // TODO: Allow place for a filepath for the photo
  // TODO: allow for complex rhythms like hen hen-ga llina
  constructor(name, words, possiblePatterns, allowedRhythms = []) {
    // Takes in allowed rhythms, which if empty will allow all words
    // and if not will allow words whose rhythms are in allowed rhythms
    this.name = name;
    this.allowedRhythms = allowedRhythms;
    this.words = {};
    // All the words that could show up
    this.possibleWords = new Set([]);

    if (allowedRhythms.length === 0) {
      this.words = words;
      for (let word in words) {
        if (words.hasOwnProperty(word)) {
          this.possibleWords.add(word);
        }
      }
    } else {
      for (let word in words) {
        if (words.hasOwnProperty(word)) {
          let rhythm = words[word];
          if (allowedRhythms.includes(rhythm)) {
            this.words[word] = rhythm;
            this.possibleWords.add(word);
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

  generatePattern(len) {
    /**
     * Given a pattern length, generates some combination of the words in
     * words in a random order. Returns the surface pattern and the underlying
     * rhythm.
     */

    let pattern = [];
    let rhythm = [];

    for (let i = 0; i < len; i++) {
      const keys = Object.keys(this.words);
      const randomWord = keys[Math.floor(Math.random() * keys.length)];
      const randomRhythm = this.words[randomWord];
      pattern.push(randomWord);
      rhythm.push(randomRhythm);
    }

    return [pattern, rhythm];
  }
}

// TODO: Make NoteDeck not just be wordsets but also have a version
// That works with lyrics from songs
class NoteDeck {
  constructor(deckname, allowedRhythms = []) {
    this.deckname = deckname;
    this.wordsets = [];
    // The possible word configurations that can come up
    // For example, a question that will generate from a combination of tas
    // and titis vs. a question that could generate from a combination of
    // cats and gatos
  }

  static fromJSON(json, allowedRhythms = []) {
    let res = new NoteDeck(json["deck_name"], allowedRhythms);
    json["question_set"].forEach((setOfWords) => {
      const genWordSet = new WordSet(
        setOfWords["name"],
        setOfWords["words"],
        setOfWords["possible_patterns"],
        allowedRhythms
      );
      if (genWordSet.valid) {
        res.wordsets.push(genWordSet);
      }
    });
    return res;
  }

  generateQuestion(len) {
    const index = Math.floor(Math.random() * this.wordsets.length);
    return this.wordsets[index].generatePattern(len);
  }

  setAllowedRhythms() {}
  // TODO: set allowed rhythms
}

export default NoteDeck;
