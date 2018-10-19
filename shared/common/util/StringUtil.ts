class StringUtil {
  static isEmpty(str: string): boolean {
    return str === '' || str === undefined || str === null;
  }

  static trimAddress(addr: string) {
    return addr.slice(0, 5) + '...' + addr.slice(-5);
  }

  static removeLastZeroInFloatString(str: string) {
    const trimedString = str.replace(/[0]+$/, '');
    return trimedString.slice(-1) === '.' ? trimedString.slice(0, trimedString.length - 1) : trimedString;
  }
}

export default StringUtil;
