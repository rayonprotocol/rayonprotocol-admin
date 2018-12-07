import moment from 'moment';

function txResultToArr(obj = {}) {
  const arr = Object.keys(obj).map(index => obj[index])
  return arr;
};

function mapDateProp(fromProp, toProp) {
  return (obj) => !isNaN(obj[fromProp])
    ? Object.assign({}, obj, { [toProp]: moment.unix(obj[fromProp]).format('YYYY-MM-DD') })
    : obj;
}

export { txResultToArr, mapDateProp }
