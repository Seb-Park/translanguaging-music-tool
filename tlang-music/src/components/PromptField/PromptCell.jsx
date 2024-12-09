import { motion, useAnimate } from "motion/react";
import { forwardRef, useImperativeHandle } from "react";
import { wait } from "../../utils/Wait";

const PromptCell = forwardRef(({ children, word, color = "yellow" }, ref) => {
  const [scope, animate] = useAnimate();

  useImperativeHandle(ref, () => ({
    growBox: async (dur) => {
      if (!scope.current) {
        console.log(scope);
      }
      animate(scope.current, { scale: 1.1 });
      await wait(dur);
      animate(scope.current, { scale: 1 });
    },
    setOpacity: (opacity) => {
      animate(scope.current, { opacity: opacity });
    },
  }));

  return (
    <motion.div
      ref={scope}
      key={word}
      className={(word === "" ? "prompt-cell " : "prompt-cell filled ") + color}
      initial={{ scale: 1.1 }}
      animate={{ scale: 1 }}
      exit={{ scale: 1 }}
    >
      {word}
    </motion.div>
  );
});

export default PromptCell;
