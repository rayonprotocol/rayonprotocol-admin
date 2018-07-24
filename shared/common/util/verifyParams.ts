export interface Result<T> {
  result_code: number;
  result_message: string;
  data?: T;
}

export function verifyParams<T>(options) {
  const result = {
    result_code: 0,
    result_message: 'success',
  } as Result<T>;

  for (let key in options) {
    if (options[key] === undefined) {
      result.result_code = 1;
      result.result_message = key + ' is necessary';
      return result;
    }
  }
  return result;
}
