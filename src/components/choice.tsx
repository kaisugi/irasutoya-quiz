import React, {useState} from "react";
import { Spacer, Button, ButtonGroup, Modal} from "@zeit-ui/react";

import data from "../data.json";

const excludeExtension = (s: string) => {
  return s.replace(".Png", "").replace(".png", "");
};

type ChoiceProps = {
  correct: number;
  wrong1: number;
  wrong2: number;
  wrong3: number;
  choice1: number;
  choice2: number;
  choice3: number;
  choice4: number;
  onNewGame: (isCorrect: boolean) => void;
};

export default function Choice (props: ChoiceProps) {
  const [correctState, setCorrectState] = useState(false);
  const [incorrectState, setIncorrectState] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const openHandler = (correct: number, choice: number) => {
    if (correct === choice) setCorrectState(true);
    else setIncorrectState(true);
  };

  const closeHandler = (isCorrect: boolean) => {
    setCorrectState(false);
    setIncorrectState(false);
    setIsLoading(true);
    props.onNewGame(isCorrect);
  };

  return (
    <>
      {isLoading ? <h3 style={{zIndex: 40, color: "blue", position: "absolute", paddingTop: 420}}>画像を読み込み中です...</h3> : null}
      <img 
        id="irasutoya" 
        src={`img/irasutoya/${data[props.correct]}`} 
        height="400" 
        width="400"
        onLoad={() => setIsLoading(false)}
      >
      </img>
      <Spacer y={3} />
      <ButtonGroup size="medium" vertical>
        <Button onClick={() => openHandler(props.correct, props.choice1)}>{excludeExtension(data[props.choice1])}</Button>
        <Button onClick={() => openHandler(props.correct, props.choice2)}>{excludeExtension(data[props.choice2])}</Button>
        <Button onClick={() => openHandler(props.correct, props.choice3)}>{excludeExtension(data[props.choice3])}</Button>
        <Button onClick={() => openHandler(props.correct, props.choice4)}>{excludeExtension(data[props.choice4])}</Button>
      </ButtonGroup>
      <Modal open={correctState} disableBackdropClick={true}>
        <Modal.Title>正解！</Modal.Title>
        <Modal.Action passive onClick={() => closeHandler(true)}>Close</Modal.Action>
      </Modal>
      <Modal open={incorrectState} disableBackdropClick={true}>
        <Modal.Title>残念！</Modal.Title>
        <Modal.Content>
          <p>正解は {excludeExtension(data[props.correct])} でした</p>
        </Modal.Content>
        <Modal.Action passive onClick={() => closeHandler(false)}>Close</Modal.Action>
      </Modal>
    </>
  );
}