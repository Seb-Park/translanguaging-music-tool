import { motion } from "motion/react";

const NoteCell = ({ note = '' }) => {
  return (
    <motion.div
        key={note}
      className={note === '' ? "note-cell" : "note-cell filled"}
      initial={{ scale: 1.1 }}
      animate={{ scale: 1 }}
      exit={{ scale: 1 }}
    >
      {note === '' && "X"}
      {note}
    </motion.div>
  );
};

export default NoteCell;
