import GameButton from "./GameButton";
import PromptCell from "./PromptField/PromptCell";

const RhythmButtonSet = ({
  allowedRhythms,
  rhythmToSurface,
  addToAnswerFun = () => {},
}) => {
  return (
    <>
      {allowedRhythms.map((rhythm, index) => (
        <GameButton
          className="game-input"
          key={index}
          onClick={() => {
            addToAnswerFun(rhythm);
          }}
        >
          {/* {taIcon} */}
          {rhythmToSurface[rhythm].toUpperCase()}
        </GameButton>
      ))}
    </>
  );
};

export default RhythmButtonSet;
