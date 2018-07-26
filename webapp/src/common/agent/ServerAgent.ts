import axios from 'axios';

import SendResult from '../../../../shared/common/model/SendResult';

class ServerAgent {
  static RESULTCODE_SUCCESS: number = 0;

  static async getRequest<T>(url: string, params?: Object): Promise<T> {
    // To server
    const { data } = await axios.get(`${URL_APIBASE}${url}`, { params: params });
    // Return undfined in case of failure
    if (data === undefined || data['result_code'] !== ServerAgent.RESULTCODE_SUCCESS) return undefined;
    else return data['data'];
  }

  static async postRequest<T>(url: string, params?: Object): Promise<SendResult<T>> {
    // To server
    const { data } = await axios.post(`${URL_APIBASE}${url}`, params);
    // Return undfined in case of failure
    return <SendResult<T>>data;
  }
}

export default ServerAgent;
