import { motion } from "motion/react";

const NoteCell = ({ note = "", label = "" }) => {
  return (
    <div className="labeled-item">
      <motion.div
        key={note}
        className={note === "" ? "note-cell" : "note-cell filled"}
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        exit={{ scale: 1 }}
      >
        {/* {note === '' ? "X" : note} */}
        {note}
      </motion.div>
      <label className={"note-cell-label"}>{label ? label.toUpperCase() : <span className="placeholder">&nbsp;</span>}</label>
    </div>
  );
};

export default NoteCell;
