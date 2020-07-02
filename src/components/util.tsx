export const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};

export const getRandomChoice = (max: number, dame?: number[]) => {
  let tmp = Math.floor(Math.random() * Math.floor(max));
  while (dame?.includes(tmp)) {
    tmp = Math.floor(Math.random() * Math.floor(max));
  }
  return tmp;
};

export const shuffle = <T extends {}>(arr: T[]) => {
  var j, x, i;
  for (i = arr.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = arr[i];
    arr[i] = arr[j];
    arr[j] = x;
  }
  return arr;
};

export const rotate = (x: number, y: number, theta: number): [number, number] => {
  const nx = x * Math.cos(theta) - y * Math.sin(theta);
  const ny = x * Math.sin(theta) + y * Math.cos(theta);
  return [Math.floor(nx), Math.floor(ny)];
};