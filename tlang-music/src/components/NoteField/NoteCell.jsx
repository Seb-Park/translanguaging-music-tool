import { motion } from "motion/react";

const NoteCell = ({ note }) => {
  return (
    <motion.div
      style={{
        width: "50px",
        height: "50px",
        backgroundColor: "lightblue",
        border: "1px solid #ccc",
        borderRadius: "3px",
      }}
      initial={{ scale: 1 }}
    >
      {note}
    </motion.div>
  );
};

export default NoteCell;
