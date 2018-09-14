class ObjectUtil {
  static sortObjectKeyByValue(obj: object): any[] {
    return Object.keys(obj).sort((prev, post) => {
      return obj[post] - obj[prev];
    });
  }
}

export default ObjectUtil;
