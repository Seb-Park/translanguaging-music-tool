import { memo, useRef, forwardRef, useImperativeHandle } from "react";
import React from "react";
import PromptCell from "./PromptCell";
import GameButton from "../GameButton";
import { FaPlay as PlayPromptIcon } from "react-icons/fa";
import { useState } from "react";

const PromptField = memo(
  forwardRef(({ children, prompt, onClickPlay, isPlayingAnimation }, ref) => {
    let colors = ["red", "orange", "yellow", "green", "blue", "purple"];
    let wordToColor = useRef({});
    let promptWithSplits = [];

    // const [isPlayingAnimation, setIsPlayingAnimation] = useState(false);

    for (const word of prompt) {
      const wordSplitIntoParts = [...word.split("-")];
      // For all of the parts of the word that aren't the last, then add
      // a dash after them
      for (let i = 0; i < wordSplitIntoParts.length - 1; i++) {
        promptWithSplits.push(wordSplitIntoParts[i] + "-");
      }
      promptWithSplits.push(wordSplitIntoParts[wordSplitIntoParts.length - 1]);
    }

    // Assign Colors
    promptWithSplits.forEach((word) => {
      if (!wordToColor.hasOwnProperty(word)) {
        const randomIndex = Math.floor(Math.random() * colors.length);
        const randomColor = colors[randomIndex];
        wordToColor[word] = randomColor;
        colors = colors.filter((item) => item !== randomColor);
        if (colors.length === 0) {
          colors = ["red", "orange", "yellow", "green", "blue", "purple"];
        }
      }
    });

    const childrenRefs = Array.from({ length: promptWithSplits.length }, () =>
      useRef()
    );

    const iterateThroughChildren = async (pause) => {
      //   setIsPlayingAnimation(true);
      for (let i = 0; i < childrenRefs.length; i++) {
        await childrenRefs[i].current.setOpacity(0.5);
      }
      for (let i = 0; i < childrenRefs.length; i++) {
        childrenRefs[i].current.setOpacity(1.0);
        await childrenRefs[i].current.growBox(pause);
        childrenRefs[i].current.setOpacity(0.5);
      }
      for (let i = 0; i < childrenRefs.length; i++) {
        await childrenRefs[i].current.setOpacity(1.0);
      }
      //   setIsPlayingAnimation(false);
    };

    useImperativeHandle(ref, () => ({
      iterateThroughChildren: iterateThroughChildren,
      //   isAnimating: isPlayingAnimation, // TODO: alter this state outside
    }));

    return (
      <div className="prompt-field-row">
        <div className={"prompt-field"}>
          {promptWithSplits.map((word, index) => (
            <PromptCell
              word={word}
              label={""}
              key={index}
              color={wordToColor[word]}
              ref={childrenRefs[index]}
            />
          ))}
        </div>
        <GameButton
          className="prompt-play-btn"
          disabled={isPlayingAnimation}
          onClick={() => {
            onClickPlay();
          }}
          color="success"
        >
          <PlayPromptIcon />
        </GameButton>
      </div>
    );
  })
);

// TODO: When user gets the correct answer, switch to ta or titi

export default PromptField;
