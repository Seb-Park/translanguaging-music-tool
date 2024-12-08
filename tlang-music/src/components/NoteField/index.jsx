import { motion } from "motion/react";
import NoteCell from "./NoteCell";
import { useRef, forwardRef, useImperativeHandle } from "react";

const NoteField = forwardRef(
  (
    { spaces, userInput, toDisplay = null, toLabel = null, className = "" },
    ref
  ) => {
    const childrenRefs = Array.from({ length: spaces }, () => useRef());

    useImperativeHandle(ref, () => ({
      // iterateThroughChildren: (pause) => {
      //   childrenRefs.forEach((child, index) => {
      //     setTimeout(child.current.growBox, pause * index);
      //   });
      iterateThroughChildren: async (pause) => {
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
      },
    }));

    return (
      <div className={"note-field " + { className }}>
        {Array.from({ length: spaces }).map((_, index) => (
          <NoteCell
            note={
              toDisplay != null ? toDisplay[userInput[index]] : userInput[index]
            }
            label={toLabel != null && toLabel[userInput[index]]}
            key={index}
            ref={childrenRefs[index]}
          />
        ))}
      </div>
    );
  }
);
export default NoteField;
