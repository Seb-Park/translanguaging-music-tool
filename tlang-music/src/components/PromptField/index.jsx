import { memo } from "react";
import React from 'react';
import PromptCell from "./PromptCell";

const PromptField = memo(({ children, prompt }) => {
  let colors = ["red", "orange", "yellow", "green", "blue", "purple"];
  let wordToColor = {};
  prompt.forEach((word) => {
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
  return (
    <div className={"prompt-field"}>
      {prompt.map((word, index) => (
        <PromptCell word={word} label={""} key={index} color={wordToColor[word]} />
      ))}
    </div>
  );
});

// TODO: When user gets the correct answer, switch to ta or titi

export default PromptField;