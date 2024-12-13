import GameButton from "./GameButton";
import PromptCell from "./PromptField/PromptCell";

const RhythmButtonSet = ({
  allowedRhythms,
  rhythmToSurface,
  addToAnswerFun = () => {},
  disabled = false,
  customColors = null,
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
          disabled={disabled}
          customStyle={
            customColors ? { backgroundColor: customColors[rhythm] } : {}
          }
        >
          {typeof rhythmToSurface[rhythm] === "string"
            ? rhythmToSurface[rhythm].toUpperCase()
            : rhythmToSurface[rhythm]}
        </GameButton>
      ))}
    </>
  );
};

export default RhythmButtonSet;
