class ObjectUtil {
  static isEmpty(obj: object): boolean {
    return obj === undefined || obj === null;
  }

  static sortObjectKeyByValue(obj: object): any[] {
    return Object.keys(obj).sort((prev, post) => {
      return obj[post] - obj[prev];
    });
  }
}

export default ObjectUtil;
