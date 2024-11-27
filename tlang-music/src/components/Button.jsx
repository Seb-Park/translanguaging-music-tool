import { motion } from "motion/react";

const Button = ({ children, onClick, color = "success" }) => {
  return (
    <motion.button
      whileTap={{ scale: 0.8 }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      type="button"
      className={"btn btn-" + { color }}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
};

export default Button;
