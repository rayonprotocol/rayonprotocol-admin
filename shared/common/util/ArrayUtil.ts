class ArrayUtil {
  static isEmpty = (targetArray: Array<any>): boolean => {
    return targetArray === undefined || targetArray.length < 1;
  };

  static isContainElement = (targetArray: Array<any>, elem: any) => {
    return targetArray.indexOf(elem) > -1;
  };

  static makeLowerCase = (targetArray: Array<any>): Array<any> => {
    return targetArray.map(element => element.toLowerCase());
  };

  static removeWhiteSpace = (targetArray: Array<any>): Array<any> => {
    return targetArray.map(element => element.replace(/\s/g, ''));
  };

  static removeUndefinedElements = (targetArray: Array<any>): Array<any> => {
    return targetArray.filter(element => typeof element !== 'undefined');
  };
}

export default ArrayUtil;
