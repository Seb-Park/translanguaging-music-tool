/* LIBRARIES */
import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";

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

// import QuarterNote from "../assets/images/rhythm_game/notes/quarter.svg";
import Qu1Icon from "./CustomIcons/Qu1Icon";
import Ei2Icon from "./CustomIcons/Ei2Icon";

/* DATA */
import DefaultNoteSet from "/src/assets/decks/default.json";
import AnimalNoteSet from "/src/assets/decks/animals_basic.json";

/* UTILS */
import defaultSoundManager from "../utils/SoundManager";

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

  const beats = 4;

  const bpm = 80;

  const msPerBeat = (60 / bpm) * 1000;

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
    for (const rhythm of allowedRhythms) {
      defaultSoundManager.loadSound(
        `${rhythm}_0`,
        `/src/assets/audio/rhythm_game/default/${rhythm}_0_80.m4a`
      );
      defaultSoundManager.loadSound(
        `${rhythm}_1`,
        `/src/assets/audio/rhythm_game/default/${rhythm}_1_80.m4a`
      );
      defaultSoundManager.loadSound(
        `${rhythm}_2`,
        `/src/assets/audio/rhythm_game/default/${rhythm}_2_80.m4a`
      );
    }
    for (const clip in noteDeck.allClipPaths) {
      if (Object.prototype.hasOwnProperty.call(noteDeck.allClipPaths, clip)) {
        const clipPath = noteDeck.allClipPaths[clip];
        defaultSoundManager.loadSound(`${clip}_2`, `${clipPath}_2_80.m4a`); // Clip to play when it's the second to last word
        defaultSoundManager.loadSound(`${clip}_1`, `${clipPath}_1_80.m4a`); // Clip to play when it's the last word
        defaultSoundManager.loadSound(`${clip}_0`, `${clipPath}_0_80.m4a`); // Clip to play when it's any other word
      }
    }
    console.log(defaultSoundManager.sounds);
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
  }, promptRhythm.current);

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

  //   const taIcon = TaIcon();
  const taIcon = Qu1Icon();
  //   const titiIcon = TitiIcon();
  const titiIcon = Ei2Icon();

  const rhythmDisplay = {
    ei_2: titiIcon,
    qu_1: taIcon,
  };

  const rhythmName = {
    ei_2: "titi",
    qu_1: "ta",
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
      <h1>Juego De Ritmo - Rhythm Game</h1>
      <h2>Imita el Ritmo - Imitate the Rhythm</h2>
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
          rhythmToSurface={rhythmName}
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
          onClick={compareAnswer}
          disabled={answer.length !== beats || isPromptAnimating}
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
        <GameButton className="game-input" onClick={skipPrompt}>
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
 *  Get audio working
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
 */
