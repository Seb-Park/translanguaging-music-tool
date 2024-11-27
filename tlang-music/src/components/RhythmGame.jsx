import { useState } from "react";
import Button from "./Button";
import { motion } from "motion/react";
import NoteField from "./NoteField";

function RhythmGame() {
  // Separate out logic here: https://stackoverflow.com/questions/69332889/reactjs-separation-of-ui-and-business-logic

  // Animations here: https://medium.com/hackernoon/5-ways-to-animate-a-reactjs-app-in-2019-56eb9af6e3bf

  // Idle animations: https://www.youtube.com/watch?v=SrmTDrN1lkU&t=887s

  // Grain: https://www.youtube.com/watch?v=_ZFghigBmqo

  const [answer, setAnswer] = useState([]);

  const possibleRhythms = ["ta", "titi"];

  const beats = 4;

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
    let count = 0;
    let newPrompt = [];
    while (count < beats) {
      const random = Math.floor(Math.random() * possibleRhythms.length);
      newPrompt.push(possibleRhythms[random]);
      count++;
    }
    return newPrompt;
  };

  const [prompt, setPrompt] = useState(getNewPrompt());

  const skipPrompt = () => {
    setPrompt(getNewPrompt());
    setAnswer([]);
  };

  const arraysEqual = (arr1, arr2) => {
    if (arr1.length !== arr2.length) return false;
    return arr1.every((value, index) => value === arr2[index]);
  };

  const compareAnswer = () => {
    if (arraysEqual(prompt, answer)) {
      alert("correct!");
      skipPrompt();
    } else {
      alert("incorrect!");
    }
  };

  return (
    <div className="rhythm-game">
      <h1>Juego De Ritmo - Rhythm Game</h1>
      <h2>Imita el Ritmo - Imitate the Rhythm</h2>
      <p>{prompt.join("-")}</p>
      <NoteField spaces={beats} userInput={answer}/>
      <Button
        onClick={() => {
          addToAnswer("ta");
        }}
      >
        TA
      </Button>
      <Button
        onClick={() => {
          addToAnswer("titi");
        }}
      >
        TITI
      </Button>
      <Button onClick={deleteFromAnswer}>del</Button>
      <Button onClick={clearAnswer}>clear</Button>
      <br></br>
      <Button onClick={compareAnswer}>check</Button>
      <Button onClick={skipPrompt}>skip</Button>
    </div>
  );
}

export default RhythmGame;
