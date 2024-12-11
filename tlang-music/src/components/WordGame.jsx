import WordBank from "/src/assets/wordbanks/wordbank.json";
import GameButton from "./GameButton";
import { useState, useEffect, useRef } from "react";
import { shuffleArray } from "../utils/ShuffleArray";
import { wait } from "../utils/Wait";

import { IoPlaySkipForward as SkipIcon } from "react-icons/io5";
import { FaCheckCircle as CheckIcon } from "react-icons/fa";
import Confetti from "react-confetti";

const WordGame = () => {
  const spanishToEnglish = useRef({});
  const englishToSpanish = useRef({});
  const allWords = useRef(new Set());
  const allSpanishWords = useRef(new Set());
  const allEnglishWords = useRef(new Set());
  const unchosenSpanishWords = useRef(new Set());
  const unchosenEnglishWords = useRef(new Set());
  const unchosenWords = useRef(new Set());
  const terms = WordBank["terms"];

  const [currentWord, setCurrentWord] = useState(null);
  const [currentAnswer, setCurrentAnswer] = useState(null);
  const [currentOptions, setCurrentOptions] = useState([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [currentGuessIndex, setCurrentGuessIndex] = useState(-1);
  const [isConfettiFalling, setIsConfettiFalling] = useState(false);
  const [isTransitioningWords, setIsTransitioningWords] = useState(false)
  const [confettiExists, setConfettiExists] = useState(false);
  const [buttonStatuses, setButtonStatuses] = useState([]);

  const waitBetweenQuestions = 3000;
  const numberOfOptions = 3;

  useEffect(() => {
    const spanishToEnglishTemp = {};
    const englishToSpanishTemp = {};
    const allWordsTemp = new Set();

    terms.forEach((term) => {
      term["es"].forEach((spanishWord) => {
        if (!spanishToEnglishTemp[spanishWord]) {
          spanishToEnglishTemp[spanishWord] = [];
        }
        spanishToEnglishTemp[spanishWord].push(...term["en"]);
        allWordsTemp.add(spanishWord);
      });

      term["en"].forEach((englishWord) => {
        if (!englishToSpanishTemp[englishWord]) {
          englishToSpanishTemp[englishWord] = [];
        }
        englishToSpanishTemp[englishWord].push(...term["es"]);
        allWordsTemp.add(englishWord);
      });
    });

    spanishToEnglish.current = spanishToEnglishTemp;
    englishToSpanish.current = englishToSpanishTemp;
    allWords.current = allWordsTemp;
    allSpanishWords.current = new Set(Object.keys(spanishToEnglish.current));
    allEnglishWords.current = new Set(Object.keys(englishToSpanish.current));
    unchosenWords.current = allWordsTemp;
    unchosenSpanishWords.current = new Set(
      Object.keys(spanishToEnglish.current)
    );
    unchosenEnglishWords.current = new Set(
      Object.keys(englishToSpanish.current)
    );
  }, []);

  const chooseNewWord = () => {
    // TODO: Not equal dist
    let chosenSet;
    let chosenLanguage = "";
    if (
      unchosenSpanishWords.current.size === 0 &&
      unchosenEnglishWords.current.size === 0
    ) {
      unchosenSpanishWords.current = allSpanishWords.current;
      unchosenEnglishWords.current = allEnglishWords.current;
    }
    const sizeRatio =
      unchosenSpanishWords.current.size /
      (unchosenSpanishWords.current.size + unchosenEnglishWords.current.size);
    if (
      unchosenSpanishWords.current.size !== 0 &&
      unchosenEnglishWords.current.size !== 0
    ) {
      chosenLanguage = Math.random() < sizeRatio ? "es" : "en";
    } else if (unchosenSpanishWords.current.size === 0) {
      chosenLanguage = "en";
    } else {
      chosenLanguage = "es";
    }
    chosenSet =
      chosenLanguage == "es" ? unchosenSpanishWords : unchosenEnglishWords;
    console.log(unchosenEnglishWords.current);
    console.log(unchosenSpanishWords.current);
    const arrayOfUnchosen = [...chosenSet.current];
    const randomWord =
      arrayOfUnchosen[Math.floor(Math.random() * arrayOfUnchosen.length)];
    chosenSet.current.delete(randomWord);
    setCurrentWord(randomWord);
    const translations =
      chosenLanguage == "es"
        ? spanishToEnglish.current[randomWord]
        : englishToSpanish.current[randomWord];
    const correctAnswer =
      translations[Math.floor(Math.random() * translations.length)]; // Choose a translation at random as the "correct" answer
    const answerOptions = new Set([correctAnswer]);
    const otherLang = [
      ...(chosenLanguage == "es" ? allEnglishWords : allSpanishWords).current,
    ];
    for (let i = 0; i < numberOfOptions - 1; i++) {
      let wordToAdd = correctAnswer;
      // We don't want any words that are already options or that are other
      // valid interpretations of the word
      while (answerOptions.has(wordToAdd) || translations.includes(wordToAdd)) {
        wordToAdd = otherLang[Math.floor(Math.random() * otherLang.length)];
      }
      answerOptions.add(wordToAdd);
    }
    setCurrentAnswer(correctAnswer);
    setCurrentOptions(shuffleArray([...answerOptions]));
    setButtonStatuses(Array(numberOfOptions).fill(0));
    setCurrentGuess("");
  };

  const disableOption = (i) => {
    let temp = [...buttonStatuses];
    temp[i] = -1;
    setButtonStatuses(temp);
  };

  const guess = (word, index) => {
    setCurrentGuess(word);
    setCurrentGuessIndex(index);
  };

  const checkGuess = async () => {
    if (currentGuess == currentAnswer) {
      setConfettiExists(true);
      setIsConfettiFalling(true);
      setIsTransitioningWords(true);
      await wait(waitBetweenQuestions / 2);
      setIsConfettiFalling(false);
      await wait(waitBetweenQuestions / 2);
      chooseNewWord();
      setIsTransitioningWords(false);
    } else {
      disableOption(currentGuessIndex);
    }
  };

  // Switches between languages, promotes translanguaging

  return (
    <div className="word-game">
      {confettiExists && (
        <Confetti
          recycle={isConfettiFalling}
          gravity={0.05}
          numberOfPieces={700}
        />
      )}

      {currentWord != null ? (
        <>
          <p>Palabra/Word:</p>
          <div className="question-word">{currentWord}</div>

          <div className="game-btn-row">
            {currentOptions.map((word, index) => (
              <GameButton
                onClick={() => {
                  guess(word, index);
                }}
                key={word}
                className={
                  "word-btn " + (word == currentGuess ? "word-selected" : "")
                }
                disabled={buttonStatuses[index] === -1}
              >
                {word.toLowerCase()}
              </GameButton>
            ))}
          </div>
          <GameButton
            onClick={checkGuess}
            disabled={currentGuess == "" || isTransitioningWords}
          >
            chequear {/*<CheckIcon />*/}
          </GameButton>
        </>
      ) : (
        <GameButton onClick={chooseNewWord}>Empezar</GameButton>
      )}
    </div>
  );
};

export default WordGame;
