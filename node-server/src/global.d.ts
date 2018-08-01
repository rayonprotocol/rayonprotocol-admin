interface JWTPayload {
  id: string;
  login_id: string;
  hashed_password: string;
}

// Express interface extension
// See for example method-override.d.ts (https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/method-override/method-override.d.ts)
declare namespace Express {
  export interface Request {
    user?: JWTPayload;
    apicacheGroup?: string;
  }

  export interface Response {
    // 미들웨어로 직접 정의한 sendResult함수
    // send default success result
    sendResult<T>(data?: T): Response;
    // send specific result with arguements including failure case
    sendResult<T>(result_code: number, result_message: string, data?: T): Response;
  }
}

declare module 'mysql/lib/protocol/constants/types' {
  const types: { [typeName: string]: number };
  export = types;
}