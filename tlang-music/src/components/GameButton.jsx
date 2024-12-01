import { motion } from "motion/react";

const GameButton = ({
  children,
  onClick,
  color = "success",
  disabled = false,
  className = "",
}) => {
  return (
    <motion.button
      whileTap={{ scale: disabled ? 1 : 0.8 }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      type="button"
      className={`game-btn btn btn-${color} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </motion.button>
  );
};

export default GameButton;
