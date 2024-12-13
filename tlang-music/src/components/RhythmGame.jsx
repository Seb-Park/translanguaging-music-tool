/* LIBRARIES */
import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import Confetti from "react-confetti";

/* DATACLASSES */
import NoteDeck from "../models/NoteDeck";

/* COMPONENTS */
import GameButton from "./GameButton";
import NoteField from "./NoteField";
import PromptField from "./PromptField";
import RhythmButtonSet from "./RhythmButtonSet";
// import 'bootstrap/dist/css/bootstrap.min.css';
// TODO: Doesn't work right now because bootstrap CSS isn't imported...
// But do I want it?

// import { ButtonGroup } from "react-bootstrap";

/* ICONS */
import { IoIosMusicalNotes as TitiIcon } from "react-icons/io";
import { IoIosMusicalNote as TaIcon } from "react-icons/io";
import { FaDeleteLeft as DeleteIcon } from "react-icons/fa6";
import { FaCheckCircle as CheckIcon } from "react-icons/fa";
import { IoPlaySkipForward as SkipIcon } from "react-icons/io5";
import { FaTrashCan as ClearIcon } from "react-icons/fa6";
import { FaVolumeHigh as SoundIcon } from "react-icons/fa6";
import { FaPlay as PlayPromptIcon } from "react-icons/fa";

/* CUSTOM ICONS */
// import QuarterNote from "../assets/images/rhythm_game/notes/quarter.svg";
import Qu1Icon from "./CustomIcons/Qu1Icon";
import Ei2Icon from "./CustomIcons/Ei2Icon";
import Qu1BlockIcon from "./CustomIcons/Qu1BlockIcon";
import Ei2BlockIcon from "./CustomIcons/Ei2BlockIcon";
import Qu1HeadlessIcon from "./CustomIcons/Qu1HeadlessIcon";
import Ei2HeadlessIcon from "./CustomIcons/Ei2HeadlessIcon";

/* DATA */
import DefaultNoteSet from "/src/assets/decks/default.json";
import AnimalNoteSet from "/src/assets/decks/animals_basic.json";

/* UTILS */
import defaultSoundManager from "../utils/SoundManager";
import { wait } from "../utils/Wait";

/** TODO: check if answer full */

function RhythmGame() {
  // Separate out logic here: https://stackoverflow.com/questions/69332889/reactjs-separation-of-ui-and-business-logic

  // Animations here: https://medium.com/hackernoon/5-ways-to-animate-a-reactjs-app-in-2019-56eb9af6e3bf

  // Idle animations: https://www.youtube.com/watch?v=SrmTDrN1lkU&t=887s

  // Grain: https://www.youtube.com/watch?v=_ZFghigBmqo

  const [answer, setAnswer] = useState([]);

  const [round, setRound] = useState([]);

  const [isPromptAnimating, setIsPromptAnimating] = useState(false);

  const [isAnswerAnimating, setIsAnswerAnimating] = useState(false);

  const [isConfettiFalling, setIsConfettiFalling] = useState(false);

  const [confettiExists, setconfettiExists] = useState(false);

  const beats = 4;

  const bpm = 80;

  const msPerBeat = (60 / bpm) * 1000;

  const waitBetweenQuestions = 3000;

  const allowedRhythms = ["qu_1", "ei_2"];

  const noteDeck = NoteDeck.fromJSON(
    AnimalNoteSet,
    beats,
    new Set(["qu_1", "ei_2"])
  );

  const addToAnswer = (item) => {
    if (answer.length < beats) {
      setAnswer(answer.concat([item]));
      //   defaultSoundManager.playSound(item);
    }
  };

  const deleteFromAnswer = () => {
    setAnswer(answer.slice(0, -1));
  };

  const clearAnswer = () => {
    setAnswer([]);
  };

  const getNewPrompt = () => {
    const generatedPrompt = noteDeck.generateQuestion(beats);
    const surface = generatedPrompt[0];
    const rhythm = generatedPrompt[1];
    const beatsOccupied = generatedPrompt[2];
    const spacesFromEnd = generatedPrompt[3];
    return [surface, rhythm, beatsOccupied, spacesFromEnd];
  };

  const newPrompt = getNewPrompt();

  const [promptSurface, setPromptSurface] = useState(newPrompt[0]);
  const promptRhythm = useRef(newPrompt[1]);
  const promptBeatsOccupied = useRef(newPrompt[2]);
  const promptSpacesFromEnd = useRef(newPrompt[3]);
  //   const [promptRhythm, setPromptRhythm] = useState(newPrompt[1]);

  const skipPrompt = () => {
    const newPrompt = getNewPrompt();
    setPromptSurface(newPrompt[0]);
    promptRhythm.current = newPrompt[1];
    // setPromptRhythm(newPrompt[1]);
    promptBeatsOccupied.current = newPrompt[2];
    promptSpacesFromEnd.current = newPrompt[3];
    setIsAnswerAnimating(false);
    setIsPromptAnimating(false);
    setAnswer([]);
  };

  useEffect(() => {
    // Load in User Input Sounds, the tas and titis
    for (const rhythm of allowedRhythms) {
      defaultSoundManager.loadSound(
        `${rhythm}_0`,
        `/assets/audio/rhythm_game/default/${rhythm}_0_80.m4a`
      );
      defaultSoundManager.loadSound(
        `${rhythm}_1`,
        `/assets/audio/rhythm_game/default/${rhythm}_1_80.m4a`
      );
      defaultSoundManager.loadSound(
        `${rhythm}_2`,
        `/assets/audio/rhythm_game/default/${rhythm}_2_80.m4a`
      );
    }

    // Load in prompt sounds
    for (const clip in noteDeck.allClipPaths) {
      if (Object.prototype.hasOwnProperty.call(noteDeck.allClipPaths, clip)) {
        const clipPath = noteDeck.allClipPaths[clip];
        defaultSoundManager.loadSound(`${clip}_2`, `${clipPath}_2_80.m4a`); // Clip to play when it's the second to last word
        defaultSoundManager.loadSound(`${clip}_1`, `${clipPath}_1_80.m4a`); // Clip to play when it's the last word
        defaultSoundManager.loadSound(`${clip}_0`, `${clipPath}_0_80.m4a`); // Clip to play when it's any other word
      }
    }

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

  const playPrompt = async () => {
    setIsPromptAnimating(true);
    const sequence = promptSurface.map((word, i) => {
      const j = promptSpacesFromEnd.current[i];
      return `${word}_${j < 3 ? j : 0}`;
    });
    const clipTimes = promptBeatsOccupied.current.map((n) => n * msPerBeat);
    defaultSoundManager.playSequenceTimed(sequence, clipTimes);
    await promptRef.current.iterateThroughChildren(msPerBeat);
    setIsPromptAnimating(false);
  };

  useEffect(() => {
    playPrompt();
    // defaultSoundManager.playSequence(promptRhythm);
  }, [promptSurface]);

  const arraysEqual = (arr1, arr2) => {
    if (arr1.length !== arr2.length) return false;
    return arr1.every((value, index) => value === arr2[index]);
  };

  const compareAnswer = () => {
    if (arraysEqual(promptRhythm.current, answer)) {
      alert("correct!");
      skipPrompt();
    } else {
      alert("incorrect!");
    }
  };

  const submitAnswer = async () => {
    setIsPromptAnimating(true);
    setIsAnswerAnimating(true);

    let allCorrect = true;

    // create the sequence of strings that will also include
    // how many spaces the word is from the end so that we 
    // can get the right clip with the right intonation
    const sequence = promptSurface.map((word, i) => {
      const j = promptSpacesFromEnd.current[i];
      return `${word}_${j < 3 ? j : 0}`;
    });
    const clipTimes = promptBeatsOccupied.current.map((n) => n * msPerBeat);
    defaultSoundManager.playSequenceTimed(sequence, clipTimes);

    // let seq = answer.map(
    //   (r, i) => `${r}_${answer.length - i < 3 ? `${answer.length - i}` : `0`}`
    // );
    // defaultSoundManager.playSequenceTimed(seq, msPerBeat);

    for (let i = 0; i < beats; i++) {
      const actual = promptRhythm.current[i];
      const guess = answer[i];
      const correct = actual === guess;
      promptRef.current.growChild(i, msPerBeat);
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
      setconfettiExists(true);
      await wait(waitBetweenQuestions / 2);
      setIsConfettiFalling(false);
      await wait(waitBetweenQuestions / 2);
      skipPrompt();
    } else {
      //   alert("incorrect!");
    }

    setIsPromptAnimating(false);
    setIsAnswerAnimating(false);
  };

  const taIcon = Qu1Icon();
  const titiIcon = Ei2Icon();
  const taBlockIcon = Qu1BlockIcon();
  const titiBlockIcon = Ei2BlockIcon();
  const taHeadlessIcon = Qu1HeadlessIcon();
  const titiHeadlessIcon = Ei2HeadlessIcon();

  const rhythmDisplay = {
    ei_2: titiHeadlessIcon,
    qu_1: taHeadlessIcon,
  };

  const rhythmName = {
    ei_2: "titi",
    qu_1: "ta",
  };

  const rhythmToBlock = {
    ei_2: titiHeadlessIcon,
    qu_1: taHeadlessIcon,
  };

  const promptRef = useRef();
  const userInputRef = useRef();

  const testAnswer = async () => {
    let seq = answer.map(
      (r, i) => `${r}_${answer.length - i < 3 ? `${answer.length - i}` : `0`}`
    );
    setIsAnswerAnimating(true);
    defaultSoundManager.playSequenceTimed(seq, msPerBeat);
    await userInputRef.current.iterateThroughChildren(msPerBeat);
    setIsAnswerAnimating(false);
  };

  return (
    <div className="rhythm-game">
      {confettiExists && (
        <Confetti
          recycle={isConfettiFalling}
          gravity={0.05}
          numberOfPieces={700}
        />
        // TODO: Make responsive to size by separating out component and adding
        // a resize event listener
      )}
      <h1>Juego De Ritmo - Rhythm Game</h1>

      <h2>Imita el Ritmo! - Imitate the Rhythm!</h2>
      {/* <p className="prompt-text">{promptSurface.join("-")}</p> */}
      <PromptField
        prompt={promptSurface}
        onClickPlay={playPrompt}
        key={promptSurface.join()}
        ref={promptRef}
        isPlayingAnimation={isAnswerAnimating || isPromptAnimating}
      />
      <div className="row-checkmark">
        <NoteField
          spaces={beats}
          userInput={answer}
          toDisplay={rhythmDisplay}
          toLabel={rhythmName}
          ref={userInputRef}
        />
        {/* <div className="labeled-item inline-submit">
          <motion.button
            whileTap={{ scale: 0.8 }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            type="button"
            className="submit-small"
          >
            <CheckIcon />
          </motion.button>
          <label className={"note-cell-label"}><span className="placeholder">&nbsp;</span></label>
        </div> */}
      </div>
      {/* <br /> */}
      <div className="game-btn-row">
        <RhythmButtonSet
          allowedRhythms={allowedRhythms}
          rhythmToSurface={rhythmToBlock}
          addToAnswerFun={addToAnswer}
        ></RhythmButtonSet>
        {/* </div> */}
        <GameButton
          className="delete game-input"
          onClick={deleteFromAnswer}
          disabled={answer.length === 0}
        >
          <DeleteIcon />
        </GameButton>
        <GameButton
          className="submit game-input"
          onClick={submitAnswer}
          disabled={
            answer.length !== beats || isAnswerAnimating || isPromptAnimating
          }
        >
          <CheckIcon />
        </GameButton>
      </div>
      {/* <br />
      <br /> */}
      <div className="game-btn-row">
        <GameButton className="game-input" onClick={clearAnswer}>
          <ClearIcon />
        </GameButton>
        <GameButton
          className="game-input"
          onClick={() => {
            testAnswer();
          }}
          disabled={isAnswerAnimating || isPromptAnimating}
        >
          <SoundIcon />
        </GameButton>
        <GameButton
          className="game-input"
          onClick={skipPrompt}
          disabled={isAnswerAnimating}
        >
          <SkipIcon />
        </GameButton>
      </div>
      {/* <br />
      <br /> */}
    </div>
  );
}

export default RhythmGame;

/**
 * Main TODO:
 *  Get images working
 *  Get labeled buttons working
 *      * Replace text with dash symbols
 *  Change styles
 *  Add correct animation
 *  Add settings modal, at least be able to switch decks and number of spaces
 *  Add animals_complex, where all animals can be together, or at mix setting
 *  Have the keyboard make sounds
 *  Add playback button
 *  Ask what sound the animal makes
 *  Add vaca / cow
 */
