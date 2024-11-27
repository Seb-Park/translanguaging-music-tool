import { motion } from "motion/react";
import NoteCell from "./NoteCell";

const NoteField = ({ children, spaces, userInput }) => {
  const alertHello = () => {
    alert("Hello");
  };

  return (
    <div className="note-field">
      {Array.from({ length: spaces }).map((_, index) => (
        <NoteCell note={userInput[index]} key={index} />
      ))}
    </div>
  );
};

export default NoteField;
