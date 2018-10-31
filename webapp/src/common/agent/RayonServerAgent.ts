import axios from 'axios';

abstract class RayonServerAgent {
  public static RESULTCODE_SUCCESS: number = 0;

  public async postRequest<T>(url: string, params?: Object): Promise<T> {
    const { data } = await axios.post(`${URL_APIBASE}${url}`, params);
    return <T>data;
  }

  public async getRequest<T>(url: string, params?: Object): Promise<T> {
    const { data } = await axios.get(`${URL_APIBASE}${url}`, { params: params });
    if (this.isRequestFail(data)) {
      console.error(data['result_message']);
      return undefined;
    } else return data['data'];
  }

  private isRequestFail(responsedData): boolean {
    return responsedData === undefined || responsedData['result_code'] !== RayonServerAgent.RESULTCODE_SUCCESS;
  }
}

export default RayonServerAgent;
