import * as React from "react";
import * as ReactDOM from "react-dom";
import { ZeitProvider, CssBaseline, Display } from "@zeit-ui/react";
import { Spacer, Button, ButtonGroup } from "@zeit-ui/react";
import GitHubButton from "react-github-btn";

import data from "./data.json";
import branchData from "./plate.json";

const getRandomChoice = (max: number, dame?: number[]) => {
  let tmp = Math.floor(Math.random() * Math.floor(max));
  while (dame?.includes(tmp)) {
    tmp = Math.floor(Math.random() * Math.floor(max));
  }
  return tmp;
};

const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
};

const rotate = (x: number, y: number, theta: number) => {
  const nx = x * Math.cos(theta) - y * Math.sin(theta);
  const ny = x * Math.sin(theta) + y * Math.cos(theta);
  return [Math.floor(nx), Math.floor(ny)];
};

type Zahyo = {
  x: number, 
  y: number
}

const fromPointsToString = (points: Zahyo[]) => {
  let res = "";
  const cx = getRandomInt(-15, 15);
  const cy = getRandomInt(-15, 15);
  const theta = getRandomInt(-180, 180);
  for (const point of points) {
    let x, y;
    [x, y] = rotate(point["x"] / 2 + cx, point["y"] / 2 + cy, theta);
    res += `${x},`;
    res += `${y} `;
  }

  return res;
};

const App = () => {
  const correct = getRandomChoice(496);
  const wrong1 = getRandomChoice(496, [correct]);
  const wrong2 = getRandomChoice(496, [correct, wrong1]);
  const wrong3 = getRandomChoice(496, [correct, wrong1, wrong2]);

  const svgs: React.ReactNode[] = [];
  for (let i=0;i<120;++i) {
    const text = fromPointsToString(branchData["branches"][i%5]["contour"]);
    svgs.push(
      <polygon fill="brown" stroke="black" stroke-width="3" points={text} />
    );
  }

  // TODO: Buttonの部分は別のComponentに分ける
  return (
    <div>
      <Spacer y={0.5} />
      <GitHubButton href="https://github.com/7ma7X/irasutoya-quiz" data-size="large" aria-label="Star 7ma7X/irasutoya-quiz on GitHub">Star</GitHubButton>
      <h2>いらすとやクイズ</h2>
      <p>枝で隠れた画像のタイトルを当てよう！</p>
      <div style={{display: "flex"}}>
        <svg 
          className="palette"
          width="400" 
          height="400" 
          viewBox="-100, -100, 300, 300" >
          {svgs}
        </svg>
        <img className="irasutoya" src={`img/irasutoya/${data[correct]}`} height="400" width="400"></img>
        <Spacer y={3} />
        <ButtonGroup size="medium" vertical>
          <Button>{data[correct]}</Button>
          <Button>{data[wrong1]}</Button>
          <Button>{data[wrong2]}</Button>
          <Button>{data[wrong3]}</Button>
        </ButtonGroup>
      </div>
    </div>
  );
};

const myTheme = {
};

ReactDOM.render(
  <>
    <ZeitProvider theme={myTheme}>
      <CssBaseline/>
      <App/>
    </ZeitProvider>
  </>, document.getElementById("app"));