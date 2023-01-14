function GameOver(props) {
  return (
    <>
      <span className="score-txt">Score: </span>
      <span className="score-go">{props.score}</span>
      <button onClick={props.restart} className="submit restart">
        Restart Game
      </button>
    </>
  );
}
export default GameOver;
