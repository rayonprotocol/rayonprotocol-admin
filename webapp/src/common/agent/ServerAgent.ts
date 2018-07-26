import axios from 'axios';

export interface ServerAgentResponse {
  result_code: number;
  result_message: string;
  data?: Object;
}

class ServerAgent {
  static RESULTCODE_SUCCESS: number = 0;

  static async getItem(url: string, params?: Object): Promise<Object> {
    // To server
    const { data } = await axios.get(`${URL_APIBASE}${url}`, { params: params });
    // Return undfined in case of failure
    if (data === undefined || data['result_code'] !== ServerAgent.RESULTCODE_SUCCESS) return undefined;
    else return data['data'];
  }

  static async postItem(url: string, params?: Object): Promise<ServerAgentResponse> {
    // To server
    const { data } = await axios.post(`${URL_APIBASE}${url}`, params);
    // Return undfined in case of failure
    return <ServerAgentResponse>data;
  }
}

export default ServerAgent;
