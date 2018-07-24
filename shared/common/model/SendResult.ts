export default interface SendResult<T> {
  result_code: number;
  result_message: string;
  data: T;
}
