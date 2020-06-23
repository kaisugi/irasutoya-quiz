import React, { useState } from "react";
import { Button, Spacer } from "@zeit-ui/react";

type IProps = {
  name: string;
}

export default (props: IProps) => {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    console.log("クリックされました");
    setCount(count + 1);
  };

  return (
    <div>
      <h2>h2: {props.name}</h2>
      <div>div: {count}</div>
      <Spacer y={0.5} />
      <Button onClick={handleClick}>Add +1</Button>
    </div>
  );
};