class NumberUtil {
  static RoundNumberWithPrecision(_targetNumber: number, _precision: number): number {
    const precision = Math.pow(10, _precision);
    return Math.round(_targetNumber * precision) / precision;
  }
}

export default NumberUtil;
