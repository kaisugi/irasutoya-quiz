import * as React from "react";
import { Spacer, Button, ButtonGroup } from "@zeit-ui/react";

import data from "../data.json";

const getRandomChoice = (max: number, dame?: number[]) => {
  let tmp = Math.floor(Math.random() * Math.floor(max));
  while (dame?.includes(tmp)) {
    tmp = Math.floor(Math.random() * Math.floor(max));
  }
  return tmp;
};

function shuffle<T> (arr: T[]): T[] {
  var j, x, i;
  for (i = arr.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = arr[i];
    arr[i] = arr[j];
    arr[j] = x;
  }
  return arr;
}

const excludeExtension = (s: string) => {
  return s.replace(".Png", "").replace(".png", "");
};

export default function Choice () {
  const correct = getRandomChoice(496);
  const wrong1 = getRandomChoice(496, [correct]);
  const wrong2 = getRandomChoice(496, [correct, wrong1]);
  const wrong3 = getRandomChoice(496, [correct, wrong1, wrong2]);

  const shuffledArray = shuffle([correct, wrong1, wrong2, wrong3]);

  return (
    <>
      <img id="irasutoya" src={`img/irasutoya/${data[correct]}`} height="400" width="400"></img>
      <Spacer y={3} />
      <ButtonGroup size="medium" vertical>
        <Button>{excludeExtension(data[shuffledArray[0]])}</Button>
        <Button>{excludeExtension(data[shuffledArray[1]])}</Button>
        <Button>{excludeExtension(data[shuffledArray[2]])}</Button>
        <Button>{excludeExtension(data[shuffledArray[3]])}</Button>
      </ButtonGroup>
    </>
  );
}