import React, { useState, useEffect } from "react";
import * as ReactDOM from "react-dom";
import { ZeitProvider, CssBaseline } from "@zeit-ui/react";
import { Card, Spacer, Button } from "@zeit-ui/react";
import GitHubButton from "react-github-btn";

import Choice from "./components/choice";
import branchData from "./plate.json";

const BRANCH_NUM = 150;

const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
};

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

const rotate = (x: number, y: number, theta: number): [number, number] => {
  const nx = x * Math.cos(theta) - y * Math.sin(theta);
  const ny = x * Math.sin(theta) + y * Math.cos(theta);
  return [Math.floor(nx), Math.floor(ny)];
};

type Zahyo = [number, number];

const generatePoints = () => {
  const ans: Zahyo[][] = [];

  for (let i=0;i<BRANCH_NUM;++i) {
    const tmp: Zahyo[] = [];
    const points = branchData["branches"][i%5]["contour"];

    const cx = getRandomInt(-100, 200);
    const cy = getRandomInt(-100, 200);
    const theta = getRandomInt(-45, 45);
    for (const point of points) {
      let x, y: number;
      [x, y] = rotate(point["x"] + cx, point["y"] + cy, theta);
      tmp.push([x, y]);
    }

    ans.push(tmp);
  }
  return ans;
};


const App = () => {
  const initialData = generatePoints();
  const initialCorrect = getRandomChoice(496);
  const initialWrong1 = getRandomChoice(496, [initialCorrect]);
  const initialWrong2 = getRandomChoice(496, [initialCorrect, initialWrong1]);
  const initialWrong3 = getRandomChoice(496, [initialCorrect, initialWrong1, initialWrong2]);
  const shuffledArray = shuffle([initialWrong1, initialWrong2, initialWrong3, initialCorrect]);


  const fromPointsToSvg = (data: Zahyo[][]) => {
    const svgs = [];
  
    for (let i=0;i<BRANCH_NUM;++i) {
      let text = "";
      
      for (const point of data[i]) {
        text += `${point[0]},`;
        text += `${point[1]} `;
      }

      if (i === nearestIndex) {
        svgs.push(
          <polygon fill="brown" points={text} stroke="red" strokeWidth="2" />
        );
      } else {
        svgs.unshift(
          <polygon fill="brown" points={text} stroke="black" strokeWidth="2" />
        );
      }
    }
  
    return svgs;
  };

  const [pointData, setPointData] = useState(initialData);
  const [svg, setSvg] = useState(fromPointsToSvg(initialData));
  const [nearestIndex, setNearestIndex] = useState<number | undefined>(undefined);

  const [correct, setCorrect] = useState(initialCorrect);
  const [wrong1, setWrong1] = useState(initialWrong1);
  const [wrong2, setWrong2] = useState(initialWrong2);
  const [wrong3, setWrong3] = useState(initialWrong3);
  const [choices, setChoices] = useState(shuffledArray);

  const [isSelected, setIsSelected] = useState(false);

  const handleClick = (e: React.MouseEvent<SVGElement>) => {
    const rect = document.getElementById("irasutoya")?.getBoundingClientRect();

    const tmpX = e.clientX;
    const tmpY = e.clientY;

    if (rect) {
      const zahyoX = Math.floor(tmpX - rect.left);
      const zahyoY = Math.floor(tmpY - rect.top);

      let min = 10000;
      let min_index = 0;

      for (let i=0;i<BRANCH_NUM;++i) { 
        const points = pointData[i];
        for (const point of points) {
          if (zahyoX < 0) continue;
          if (zahyoX > 400) continue;
          if (zahyoY < 0) continue;
          if (zahyoY > 400) continue;
          const tmp = Math.abs(zahyoX - point[0]) + Math.abs(zahyoY - point[1]);
          
          if (tmp < min) {

            min = tmp;
            min_index = i;
          }
        }
      }

      setNearestIndex(min_index);
    }
  };


  useEffect(() => {
    setSvg(fromPointsToSvg(pointData));

    if (nearestIndex) {
      setIsSelected(true);
    }

  }, [nearestIndex]);

  return (
    <div>
      <Spacer y={1} />
      <Card width="400px" className="titlecard">
        <GitHubButton href="https://github.com/7ma7X/irasutoya-quiz" data-size="large" aria-label="Star 7ma7X/irasutoya-quiz on GitHub">Star</GitHubButton>
        <h2>いらすとやクイズ</h2>
        <p>枝で隠れた画像のタイトルを当てよう！</p>
      </Card>
      <Spacer y={1} />
      <div style={{display: "flex"}}>
        <svg 
          className="palette"
          width="400" 
          height="400" 
          viewBox="0, 0, 400, 400" 
          onClick={handleClick}
        >
          {svg}
        </svg>
        <Choice
          correct={correct}
          wrong1={wrong1}
          wrong2={wrong2}
          wrong3={wrong3}
          choice1={choices[0]}
          choice2={choices[1]}
          choice3={choices[2]}
          choice4={choices[3]}
        />
      </div>
      <Spacer y={1} />
      {isSelected ? <Button type="error" ghost>選択した枝を削除</Button> : null}
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