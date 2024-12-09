import { motion, useAnimate } from "motion/react";
import { useState } from "react";
import { useRef, forwardRef, useImperativeHandle } from "react";
import { wait } from "../../utils/Wait";

const NoteCell = forwardRef(({ note = "", label = "" }, ref) => {
  const [scope, animate] = useAnimate();

  useImperativeHandle(ref, () => ({
    growBox: async (dur) => {
      animate(scope.current, { scale: 1.1 });
      await wait(dur);
      animate(scope.current, { scale: 1 });
    },
    setOpacity: (opacity) => {
      animate(scope.current, { opacity: opacity });
    },
  }));

  return (
    <div className="labeled-item">
      <motion.div
        ref={scope}
        key={note}
        className={note === "" ? "note-cell" : "note-cell filled"}
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        exit={{ scale: 1 }}
        // ref={motionDivRef}
      >
        {/* {note === '' ? "X" : note} */}
        {note}
      </motion.div>
      <label className={"note-cell-label"}>
        {label ? (
          label.toUpperCase()
        ) : (
          <span className="placeholder">&nbsp;</span>
        )}
      </label>
    </div>
  );
});
export default NoteCell;
