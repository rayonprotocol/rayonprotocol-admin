class Convert {
  static TimeConverter(timestamp: number) {
    let a = new Date(timestamp * 1000);
    let year = a.getFullYear();
    let month = a.getMonth() + 1;
    let date = a.getDate();
    let hour = a.getHours();
    let min = a.getMinutes();
    let sec = a.getSeconds();
    // let time = year + '/' + month + '/' + date + ' ' + hour + ':' + min + ':' + sec;
    let time = year + '/' + month + '/' + date;
    return time;
  }
}

export default Convert;
