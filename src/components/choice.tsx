import React from "react";
import { Spacer, Button, ButtonGroup } from "@zeit-ui/react";

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
};

export default function Choice (props: ChoiceProps) {
  return (
    <>
      <img id="irasutoya" src={`img/irasutoya/${data[props.correct]}`} height="400" width="400"></img>
      <Spacer y={3} />
      <ButtonGroup size="medium" vertical>
        <Button>{excludeExtension(data[props.choice1])}</Button>
        <Button>{excludeExtension(data[props.choice2])}</Button>
        <Button>{excludeExtension(data[props.choice3])}</Button>
        <Button>{excludeExtension(data[props.choice4])}</Button>
      </ButtonGroup>
    </>
  );
}