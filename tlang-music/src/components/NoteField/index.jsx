import { motion } from "motion/react";
import NoteCell from "./NoteCell";

const NoteField = ({ children, spaces, userInput }) => {
  return (
    <div className="note-field">
      {Array.from({ length: spaces }).map((_, index) => (
        <NoteCell note={userInput[index]} key={index} />
      ))}
    </div>
  );
};

export default NoteField;
