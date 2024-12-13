import { useState, useEffect, useRef } from "react";
import GameButton from "./GameButton";
import NoteField from "./NoteField";
import RhythmButtonSet from "./RhythmButtonSet";
import defaultSoundManager from "../utils/SoundManager";
import Confetti from "react-confetti";

import { FaPlay as PlayPromptIcon } from "react-icons/fa";
import { FaDeleteLeft as DeleteIcon } from "react-icons/fa6";
import { FaCheckCircle as CheckIcon } from "react-icons/fa";
import { FaVolumeHigh as SoundIcon } from "react-icons/fa6";

import { wait } from "../utils/Wait";

const ToneGame = () => {
  const availableTones = ["g3", "e3"];

  const tonesToColors = {
    e3: "#fcc603",
    g3: "#04d1b9",
  };

  const tonesToSolfege = {
    e3: "mi",
    g3: "sol",
  };

  const tonesToRelativeEs = {
    e3: "bajo",
    g3: "alto",
  };

  const tonesToRelativeEn = {
    e3: "low",
    g3: "high",
  };

  const beatsPerMeasure = 4;
  const bpm = 80;
  const msPerBeat = 60000 / 80; // Inverse bpm is minutes per beat. Times 60 is seconds per beat. Times 1000 is ms per beat.
  const waitBetweenQuestions = 3000;

  const generatePattern = () => {
    let res = Array.from({ length: beatsPerMeasure }, () => 0);
    while (res.every((val) => val === res[0])) {
      res = Array.from(
        { length: beatsPerMeasure },
        () => availableTones[Math.floor(Math.random() * availableTones.length)]
      );
    }
    return res;
  };

  const skipPattern = () => {
    setCurrentPattern(generatePattern());
    setIsPlayingClip(false);
    setIsUserInputAnimating(false);
    setHasListened(false);
    setUserInput([]);
  };

  const [currentPattern, setCurrentPattern] = useState(generatePattern());
  const [isPlayingClip, setIsPlayingClip] = useState(false);
  const [userInput, setUserInput] = useState([]);
  const [isUserInputAnimating, setIsUserInputAnimating] = useState(false);
  const [isConfettiFalling, setIsConfettiFalling] = useState(false);
  const [confettiExists, setConfettiExists] = useState(false);
  const [hasListened, setHasListened] = useState(false);

  const userInputRef = useRef();

  const toneDirectory = "/assets/audio/tone_game/tones/";
  useEffect(() => {
    availableTones.forEach((toneName) => {
      defaultSoundManager.loadSound(
        toneName,
        `${toneDirectory}${toneName}.m4a`
      );
    });
    // Load in effects
    defaultSoundManager.loadSound(
      "xylo",
      "/assets/audio/rhythm_game/effects/xylophone.m4a"
    );
    defaultSoundManager.loadSound(
      "gliss",
      "/assets/audio/rhythm_game/effects/gliss.wav"
    );
  }, []);

  const playTonePattern = async () => {
    setIsPlayingClip(true);
    defaultSoundManager.playSequenceTimed(currentPattern, msPerBeat);
    await wait(msPerBeat * beatsPerMeasure);
    setIsPlayingClip(false);
    setHasListened(true);
  };

  const updateUserInput = (toAdd) => {
    const newUserInput = [...userInput, toAdd];
    setUserInput(newUserInput);
  };

  const deleteFromAnswer = () => {
    setUserInput(userInput.slice(0, -1));
  };

  const arraysEqual = (arr1, arr2) => {
    if (arr1.length !== arr2.length) return false;
    return arr1.every((value, index) => value === arr2[index]);
  };

  const testAnswer = async () => {
    setIsUserInputAnimating(true);
    defaultSoundManager.playSequenceTimed(userInput, msPerBeat);
    await userInputRef.current.iterateThroughChildren(msPerBeat);
    setIsUserInputAnimating(false);
  };

  const submitAnswer = async () => {
    // if (arraysEqual(currentPattern, userInput)) {
    //   alert("correct!");
    // } else {
    //   alert("incorrect!");
    // }
    let allCorrect = true;
    setIsPlayingClip(true);
    setIsUserInputAnimating(true);
    defaultSoundManager.playSequenceTimed(
      currentPattern,
      Array.from({ length: beatsPerMeasure - 1 }, () => msPerBeat).concat(-1)
    );
    for (let i = 0; i < beatsPerMeasure; i++) {
      const actual = currentPattern[i];
      const guess = userInput[i];
      const correct = actual === guess;
      if (correct) {
        userInputRef.current.growChild(i, msPerBeat);
        userInputRef.current.setChildColor(i, "#d1ffd7");
        defaultSoundManager.playSound("xylo");
      } else {
        allCorrect = false;
      }
      await wait(msPerBeat);
    }

    if (allCorrect) {
      defaultSoundManager.playSound("gliss");
      setIsConfettiFalling(true);
      setConfettiExists(true);
      await wait(waitBetweenQuestions / 2);
      setIsConfettiFalling(false);
      await wait(waitBetweenQuestions / 2);
      skipPattern();
    }

    setIsPlayingClip(false);
    setIsUserInputAnimating(false);
  };

  return (
    <div className="tone-game">
      {confettiExists && (
        <Confetti
          recycle={isConfettiFalling}
          gravity={0.05}
          numberOfPieces={700}
        />
        // TODO: Make responsive to size by separating out component and adding
        // a resize event listener
      )}
      <h1>Tonos Altos y Bajos - High and Low Notes</h1>
      <h2>Primero escucha la melodía, luego imítala - Listen to the melody first, then imitate it</h2>
      <div className="game-btn-row">
        <GameButton
          onClick={playTonePattern}
          disabled={isPlayingClip}
          className="submit"
        >
          Escucha la Melodía <SoundIcon />
        </GameButton>
      </div>
      <NoteField
        spaces={beatsPerMeasure}
        userInput={userInput}
        toDisplay={tonesToRelativeEs}
        toLabel={tonesToRelativeEn}
        toColor={tonesToColors}
        ref={userInputRef}
      />
      <div className="game-btn-row">
        <RhythmButtonSet
          allowedRhythms={availableTones}
          rhythmToSurface={tonesToRelativeEs}
          addToAnswerFun={updateUserInput}
          disabled={!hasListened} // Only allow to start once they've listened to melody
          customColors={tonesToColors}
        ></RhythmButtonSet>
        <GameButton
          className="delete game-input"
          onClick={deleteFromAnswer}
          disabled={userInput.length === 0}
        >
          <DeleteIcon />
        </GameButton>
        <GameButton
          className="submit game-input"
          onClick={submitAnswer}
          disabled={
            userInput.length !== beatsPerMeasure ||
            isPlayingClip ||
            isUserInputAnimating
          }
        >
          <CheckIcon />
        </GameButton>
      </div>
      <div className="game-btn-row">
        <GameButton
          className="game-input"
          onClick={() => {
            testAnswer();
          }}
          disabled={isPlayingClip || isUserInputAnimating}
        >
          <SoundIcon />
        </GameButton>
      </div>
    </div>
  );
};

/**
 * TODO:
 *  Listen
 *  Have students do hand motion
 */

export default ToneGame;
