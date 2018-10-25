import { Response } from 'express';

// model
import SendResult from '../../../../shared/common/model/SendResult';

interface EventListner {
  [eventType: number]: ((event) => void)[];
}

abstract class RayonDC {
  public RESULT_CODE_SUCCESS = 0;
  public RESULT_CODE_FAIL = 1;

  public generateResultResponse(responseCode: number, message: string, data: any) {
    const result = {
      result_code: responseCode,
      result_message: message,
      data,
    };
    return result;
  }
}

export default RayonDC;
