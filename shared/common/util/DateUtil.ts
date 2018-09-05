class DateUtil {
  public transformTime(targetDate: Date): string {
    var year = targetDate.getFullYear();
    var month = targetDate.getMonth() + 1;
    var date = targetDate.getDate();
    var hour = targetDate.getHours();
    var min = targetDate.getMinutes();
    var sec = targetDate.getSeconds();
    return year + '/' + month + '/' + date + ' ' + hour + ':' + min + ':' + sec;
    // return year + '/' + month + '/' + date;
  }

  public getCurrentTime(): string {
    let targetDate = new Date();
    return this.transformTime(targetDate);
  }

  public timstampConverter(UNIX_timestamp): string {
    let targetDate = new Date(UNIX_timestamp * 1000);
    return this.transformTime(targetDate);
  }
}

export default new DateUtil();
