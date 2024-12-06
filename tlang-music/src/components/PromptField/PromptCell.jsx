import { motion } from "motion/react";

const PromptCell = ({ children, word, color = "yellow" }) => {
  return (
    <motion.div
      key={word}
      className={(word === "" ? "prompt-cell " : "prompt-cell filled ") + color}
      initial={{ scale: 1.1 }}
      animate={{ scale: 1 }}
      exit={{ scale: 1 }}
    >
        {word}
    </motion.div>
  );
};

export default PromptCell;
