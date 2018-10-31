class DateUtil {
  public transformTime(targetDate: Date, isFullDate: boolean): string {
    const year = targetDate.getFullYear();
    const month = targetDate.getMonth() + 1;
    const date = targetDate.getDate();
    const hour = targetDate.getHours();
    const min = targetDate.getMinutes();
    const sec = targetDate.getSeconds();

    return isFullDate
      ? year + '/' + month + '/' + date + ' ' + hour + ':' + min + ':' + sec
      : year + '/' + month + '/' + date;
  }

  public getCurrentTime(): string {
    let targetDate = new Date();
    return this.timstampFullDateConverter(targetDate);
  }

  public timstampFullDateConverter(UNIX_timestamp): string {
    let targetDate = new Date(UNIX_timestamp * 1000);
    return this.transformTime(targetDate, true);
  }

  public timstampCommonFormConverter(UNIX_timestamp): string {
    let targetDate = new Date(UNIX_timestamp * 1000);
    return this.transformTime(targetDate, false);
  }

  public sleep(ms) {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
  }
}

export default new DateUtil();
