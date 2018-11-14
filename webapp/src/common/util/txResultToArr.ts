export default function txResultToArr(obj = {}) {
  const arr = Object.keys(obj).map(index => obj[index])
  return arr;
};