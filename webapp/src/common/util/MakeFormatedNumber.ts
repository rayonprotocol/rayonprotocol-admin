const MakeFormatedNumber = (num: number) => {
  let result = '';
  num
    .toString()
    .split('')
    .reverse()
    .forEach((item, index) => {
      result = (index + 1) % 3 === 0 && num.toString().length - 1 !== index ? ',' + item + result : item + result;
    });
  return result;
};

export default MakeFormatedNumber;
