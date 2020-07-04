import React, { useState, useEffect } from "react";
import * as ReactDOM from "react-dom";
import { ZeitProvider, CssBaseline } from "@zeit-ui/react";
import { Card, Spacer, Button } from "@zeit-ui/react";
import GitHubButton from "react-github-btn";

import Choice from "./components/choice";
import { getRandomInt, getRandomChoice, shuffle, rotate } from "./components/util";
import branchData from "./plate.json";


const BRANCH_NUM = 150;

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

  const [eliminated, setEliminated] = useState<number[]>([]);
  const [nearestIndex, setNearestIndex] = useState<number | undefined>(undefined);
  const [isSelected, setIsSelected] = useState(false);

  const [pointData, setPointData] = useState(initialData);
  const [correct, setCorrect] = useState(initialCorrect);
  const [wrong1, setWrong1] = useState(initialWrong1);
  const [wrong2, setWrong2] = useState(initialWrong2);
  const [wrong3, setWrong3] = useState(initialWrong3);
  const [choices, setChoices] = useState(shuffledArray);

  const [score, setScore] = useState(0);
  const [plusPoint, setPlusPoint] = useState(100);

  const fromPointsToSvg = (data: Zahyo[][], initialize: boolean) => {
    const svgs = [];
  
    for (let i=0;i<BRANCH_NUM;++i) {
      let text = "";
      
      for (const point of data[i]) {
        text += `${point[0]},`;
        text += `${point[1]} `;
      }

      if (initialize) {
        svgs.unshift(
          <polygon fill="brown" points={text} stroke="black" strokeWidth="2" />
        );
      } else {
        if (eliminated.includes(i)) {
          continue;
        } else if (i === nearestIndex) {
          svgs.push(
            <polygon fill="brown" points={text} stroke="red" strokeWidth="2" />
          );
        } else {
          svgs.unshift(
            <polygon fill="brown" points={text} stroke="black" strokeWidth="2" />
          );
        }
      }
    }
  
    return svgs;
  };

  const [svg, setSvg] = useState(fromPointsToSvg(initialData, true));



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
        if (eliminated.includes(i)) continue;

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === "d" || e.key === "D" || e.key === "Backspace" || e.key === "Delete") {
      deleteBranch();
    }
  };

  const deleteBranch = () => {
    if (nearestIndex) {
      const tmp = eliminated;
      tmp.push(nearestIndex);
      setEliminated(tmp);
      setSvg(fromPointsToSvg(pointData, false));
      setNearestIndex(undefined);
      setIsSelected(false);
    }
  };

  const startNewGame = (isCorrect: boolean) => {
    const newData = generatePoints();
    setPointData(newData);
    const newCorrect = getRandomChoice(496);
    const newWrong1 = getRandomChoice(496, [newCorrect]);
    const newWrong2 = getRandomChoice(496, [newCorrect, newWrong1]);
    const newWrong3 = getRandomChoice(496, [newCorrect, newWrong1, newWrong2]);
    const shuffledArray = shuffle([newWrong1, newWrong2, newWrong3, newCorrect]);

    setCorrect(newCorrect);
    setWrong1(newWrong1);
    setWrong2(newWrong2);
    setWrong3(newWrong3);
    setChoices(shuffledArray);

    setEliminated([]);
    setNearestIndex(undefined);
    setIsSelected(false);

    setSvg(fromPointsToSvg(newData, true));

    if (isCorrect) {
      setScore(score + plusPoint);
      setPlusPoint(100);
    } else {
      setScore(score - 200);
      setPlusPoint(100);
    }
  };


  useEffect(() => {
    setSvg(fromPointsToSvg(pointData, false));

    if (nearestIndex) {
      setIsSelected(true);
    }

    setPlusPoint(Math.max(0, 100 - eliminated.length * 10));

  }, [nearestIndex]);

  return (
    <div onKeyDown={handleKeyDown} tabIndex={0}>
      <Spacer y={1} />
      <div style={{display: "flex"}}>
        <Card width="400px" className="titlecard">
          <GitHubButton href="https://github.com/7ma7X/irasutoya-quiz" data-size="large" aria-label="Star 7ma7X/irasutoya-quiz on GitHub">Star</GitHubButton>
          <h2>いらすとやクイズ</h2>
          <p>枝で隠れた画像のタイトルを当てよう！<br />
          削除する枝が少ない方が高得点を獲得できるぞ！</p>
        </Card>
        <Spacer x={1.5} />
        <Card width="200px" type='secondary'>
          <h2>{score} 点</h2>
          <br />
          <p>正解すると +{plusPoint} 点<br />
          間違えると -200 点</p>
        </Card>
      </div>
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
          onNewGame={(isCorrect: boolean) => startNewGame(isCorrect)}
        />
      </div>
      <Spacer y={1} />
      {isSelected ? <Button type="error" ghost onClick={() => deleteBranch()}>選択した枝を削除（ D キーでも OK ）</Button> : null}
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