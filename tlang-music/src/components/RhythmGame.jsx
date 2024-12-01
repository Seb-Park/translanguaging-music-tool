/* LIBRARIES */
import { useState } from "react";
import { motion } from "motion/react";

/* DATACLASSES */
import NoteDeck from "../models/NoteDeck";

/* COMPONENTS */
import GameButton from "./GameButton";
import NoteField from "./NoteField";
// import 'bootstrap/dist/css/bootstrap.min.css';
// TODO: Doesn't work right now because bootstrap CSS isn't imported...
// But do I want it?

// import { ButtonGroup } from "react-bootstrap";

/* ICONS */
import { IoIosMusicalNotes } from "react-icons/io";
import { FaDeleteLeft as DeleteIcon } from "react-icons/fa6";
import { FaCheckCircle as CheckIcon } from "react-icons/fa";
import { IoPlaySkipForward as SkipIcon } from "react-icons/io5";
import { IoMdRefresh as ClearIcon } from "react-icons/io";

/* DATA */
import DefaultNoteSet from "/src/assets/decks/default.json";
import AnimalNoteSet from "/src/assets/decks/animals_basic.json";

/** TODO: check if answer full */

function RhythmGame() {
  // Separate out logic here: https://stackoverflow.com/questions/69332889/reactjs-separation-of-ui-and-business-logic

  // Animations here: https://medium.com/hackernoon/5-ways-to-animate-a-reactjs-app-in-2019-56eb9af6e3bf

  // Idle animations: https://www.youtube.com/watch?v=SrmTDrN1lkU&t=887s

  // Grain: https://www.youtube.com/watch?v=_ZFghigBmqo

  const [answer, setAnswer] = useState([]);

  const rhythmDisplay = {
    ei_2: "titi",
    qu_1: "ta",
  };

  const beats = 4;

  const noteDeck = NoteDeck.fromJSON(AnimalNoteSet);

  const addToAnswer = (item) => {
    if (answer.length < beats) {
      setAnswer(answer.concat([item]));
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
    return [surface, rhythm];
  };

  const newPrompt = getNewPrompt();

  const [promptSurface, setPromptSurface] = useState(newPrompt[0]);
  const [promptRhythm, setPromptRhythm] = useState(newPrompt[1]);

  const skipPrompt = () => {
    const newPrompt = getNewPrompt();
    setPromptSurface(newPrompt[0]);
    setPromptRhythm(newPrompt[1]);
    setAnswer([]);
  };

  const arraysEqual = (arr1, arr2) => {
    if (arr1.length !== arr2.length) return false;
    return arr1.every((value, index) => value === arr2[index]);
  };

  const compareAnswer = () => {
    if (arraysEqual(promptRhythm, answer)) {
      alert("correct!");
      skipPrompt();
    } else {
      alert("incorrect!");
    }
  };

  const values = Object.freeze({
    TA: Symbol("ta"),
    TITI: Symbol("titi"),
    TIRITIRI: Symbol("tiri-tiri"),
    TITIRI: Symbol("ti-tiri"),
    TIRITI: Symbol("tiri-ti"),
    TU: Symbol("tu"),
  });

  return (
    <div className="rhythm-game">
      <h1>Juego De Ritmo - Rhythm Game</h1>
      <h2>Imita el Ritmo - Imitate the Rhythm</h2>
      <p>{promptSurface.join("-")}</p>
      <NoteField spaces={beats} userInput={answer} toDisplay={rhythmDisplay} />
      <br />
      <div>
        {/* <div className="btn-group"> */}
          <GameButton
            onClick={() => {
              addToAnswer("qu_1");
            }}
          >
            TA
          </GameButton>
          <GameButton
            onClick={() => {
              addToAnswer("ei_2");
            }}
          >
            TITI
            <IoIosMusicalNotes />
          </GameButton>
        {/* </div> */}
        <GameButton
          className="delete"
          onClick={deleteFromAnswer}
          disabled={answer.length === 0}
        >
          <DeleteIcon />
        </GameButton>
        <GameButton
          className="submit"
          onClick={compareAnswer}
          disabled={answer.length !== beats}
        >
          <CheckIcon />
        </GameButton>
      </div>
      {/* <br />
      <br /> */}
      <div>
        <GameButton onClick={clearAnswer}>
          <ClearIcon />
        </GameButton>
        <GameButton onClick={skipPrompt}>
          <SkipIcon />
        </GameButton>
      </div>
      {/* <br />
      <br /> */}
    </div>
  );
}

export default RhythmGame;
