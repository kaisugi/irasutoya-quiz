import React, { useState, useEffect } from "react";
import * as ReactDOM from "react-dom";
import { ZeitProvider, CssBaseline } from "@zeit-ui/react";
import { Card, Spacer } from "@zeit-ui/react";
import GitHubButton from "react-github-btn";

import Choice from "./components/choice";
import branchData from "./plate.json";

const BRANCH_NUM = 150;

const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
};

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

  const fromPointsToSvg = (data: Zahyo[][]) => {
    const svgs = [];
  
    for (let i=0;i<BRANCH_NUM;++i) {
      let text = "";
      
      for (const point of data[i]) {
        text += `${point[0]},`;
        text += `${point[1]} `;
        
        if (i === nearestIndex) {
          svgs.push(
            <circle cx={point[0]} cy={point[1]} r="2" fill="red" />
          );
        } else {
          svgs.push(
            <circle cx={point[0]} cy={point[1]} r="2" fill="black" />
          );
        }
      }

      svgs.push(
        <polygon fill="brown" points={text} />
      );

      svgs.push(
        <circle cx={86} cy={-53} r="2" fill="black" />
      );
    }
  
    return svgs;
  };

  const [pointData, setPointData] = useState(initialData);
  const [svg, setSvg] = useState(fromPointsToSvg(initialData));
  const [nearestIndex, setNearestIndex] = useState<number | undefined>(undefined);

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
        <Choice/>
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