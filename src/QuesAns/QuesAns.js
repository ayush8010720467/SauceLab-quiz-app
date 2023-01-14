import { useCallback, useRef } from "react";

function QuesAns(props) {
  const inpRef = useRef("");

  const verifyAns = useCallback(() => {
    const inputAns = inpRef.current.value;
    console.log(props.ansSha);
  }, [props]);

  const onSubmit = useCallback(() => {
    if (verifyAns()) {
      props.onCorrectAns();
    } else {
      props.onWrongAns();
    }
  }, [verifyAns, props]);
  return (
    <>
      <div className="ques">
        <span>{props.question}</span>
      </div>
      <input className="input" ref={inpRef}></input>
      <button className="submit" onClick={onSubmit}>
        Submit
      </button>
    </>
  );
}
export default QuesAns;
