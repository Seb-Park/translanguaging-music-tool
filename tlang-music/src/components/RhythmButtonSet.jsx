import GameButton from "./GameButton";

const RhythmButtonSet = ({
  allowedRhythms,
  rhythmToSurface,
  addToAnswerFun = () => {},
}) => {
  return (
    <>
      {allowedRhythms.map((item, index) => {
        <GameButton
          key={index}
          onClick={() => {
            addToAnswerFun(rhythmToSurface[item]);
          }}
        >
          rhythmToSurface[item].toUpperCase()
        </GameButton>;
      })}
    </>
  );
};

export default RhythmButtonSet;
