import { motion } from "motion/react";
import NoteCell from "./NoteCell";

const NoteField = ({
  children,
  spaces,
  userInput,
  toDisplay = null,
  toLabel = null,
  className=''
}) => {
  return (
    <div className={"note-field " + {className}}>
      {Array.from({ length: spaces }).map((_, index) => (
        <NoteCell
          note={
            toDisplay != null ? toDisplay[userInput[index]] : userInput[index]
          }
          label={toLabel != null && toLabel[userInput[index]]}
          key={index}
        />
      ))}
    </div>
  );
};

export default NoteField;
