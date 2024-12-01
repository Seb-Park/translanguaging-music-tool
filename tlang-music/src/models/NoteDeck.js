class WordSet {
  constructor(name, words, possiblePatterns, allowedRhythms = []) {
    // Takes in allowed rhythms, which if empty will allow all words
    // and if not will allow words whose rhythms are in allowed rhythms
    this.name = name;
    this.allowedRhythms = allowedRhythms;
    this.words = {};

    if (allowedRhythms.length === 0) {
      this.words = words;
    } else {
      for (let word in words) {
        if (words.hasOwnProperty(word)) {
          let rhythm = words[word];
          if (allowedRhythms.includes(rhythm)) {
            this.words[word] = rhythm;
          }
        }
      }
    }

    this.possiblePatterns = possiblePatterns;
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
      res.wordsets.push(
        new WordSet(
          setOfWords["name"],
          setOfWords["words"],
          setOfWords["possible_patterns"],
          allowedRhythms
        )
      );
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
