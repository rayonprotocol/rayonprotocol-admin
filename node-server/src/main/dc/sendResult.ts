import { Request, Response } from 'express';

export class Result<T> {
  static SUCCESS = 'success';

  result_code: number;
  result_message: string;
  data: T;

  constructor(result_code: number, result_message: string, data?: T) {
    this.result_code = result_code;
    this.result_message = result_message;
    this.data = data;
  }
}

// 이 미들웨어는 sendResult함수를 res에 포함시킵니다.
export default function(req: Request, res: Response, next) {
  res.sendResult = function<T>() {
    arguments.length === 0 || arguments.length === 1
      ? res.send(new Result<T>(0, Result.SUCCESS, arguments[0]))
      : res.send(new Result<T>(arguments[0], arguments[1], arguments[2]));
    return res;
  };
  next();
}
