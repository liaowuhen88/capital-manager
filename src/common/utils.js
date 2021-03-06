export default class Utils {
  // 当前日期
  static todayDate() {
    let dt, y, m, d, w
    dt = new Date()
    y = dt.getFullYear()
    m = dt.getMonth() + 1
    d = dt.getDate()
    w = dt.getDay()
    let weeks = ['天', '一', '二', '三', '四', '五', '六']
    return `${y} 年 ${m.toString().padStart(2, '0')} 月 ${d.toString().padStart(2, '0')} 日 星期${weeks[w]}`
  }

  static getTime() {
    let date = new Date()
    let yy = date.getFullYear()
    let mm = date.getMonth() + 1
    let dd = date.getDate()
    let hh = date.getHours()
    let mf = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
    let ss = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
    return yy + '-' + mm + '-' + dd + ' ' + hh + ':' + mf + ':' + ss
  }

  //日期格式化，返回值形式为yy-mm-dd
  static timeFormat(date) {
    if (!date || typeof (date) === "string") {
      this.error("参数异常，请检查...")
    }
    var y = date.getFullYear() //年
    var m = date.getMonth() + 1 //月
    var d = date.getDate() //日

    return y + '-' + m + '-' + d
  }


  //获取当年第一天
  static getFirstDayOfYear(date) {
    date.setDate(1)
    date.setMonth(0)
    return this.timeFormat(date)
  }

  // 浏览器全屏
  static fullScreen() {
    let isFull = document.isFullScreen || document.mozIsFullScreen || document.webkitIsFullScreen

    // 判断是否全屏
    if (isFull) {
      let close = document.exitFullscreen || document.webkitCancelFullScreen || document.mozCancelFullScreen || document.msExitFullscreen
      close && close.call(document)
    } else {
      let docElm = document.documentElement
      let open = docElm.requestFullScreen || docElm.webkitRequestFullScreen || docElm.mozRequestFullScreen || docElm.msRequestFullscreen
      open && open.call(docElm)
    }
  }

  // 拆分整数与小数
  static splits(tranvalue) {
    var value = new Array('', '');
    var temp = tranvalue.split(".");
    for (var i = 0; i < temp.length; i++) {
      value[i] = temp[i];
    }
    return value;
  }

  static toMoney(num) {
    var dw2 = new Array("", "", "", "", "千", "万", "十万", "百万", "千万", "亿", "十亿", "百亿", "千亿");// 大单位
    if (num) {
      if (isNaN(num)) {
        alert('金额中含有不能识别的字符');
        return;
      }
      var source = this.splits(Math.abs(num).toString());
      //console.log(Math.abs(num).toString(), source[0],source[0].length);
      var len = source[0].length;// 整数的长度

      num = typeof num == 'string' ? parseFloat(num) : num // 判断是否是字符串如果是字符串转成数字
      num = num.toFixed(2); // 保留两位
      num = parseFloat(num); // 转成数字
      num = num.toString(); // 转成金额显示模式
      if (len > 3) {
        num = num + '(' + dw2[len] + ')';
      }

      return num; // 返回的是字符串23,245.12保留2位小数
    } else {
      return 0;
    }
  }

  static getDaysBetween(dateString1, dateString2) {
    if (dateString1 && dateString2) {
      var startDate = Date.parse(dateString1);
      var endDate = Date.parse(dateString2);
      var days = (endDate - startDate) / (1 * 24 * 60 * 60 * 1000);
      // alert(days);
      return days;
    }
    return 0;
  }

  // static toMoney(num) {
  //   var dw2 = new Array("","", "", "", "千", "万", "十万", "百万", "千万", "亿", "十亿", "百亿", "千亿");// 大单位
  //   if (num) {
  //     if (isNaN(num)) {
  //       alert('金额中含有不能识别的字符');
  //       return;
  //     }
  //     var source = this.splits(Math.abs(num).toString());
  //     console.log(Math.abs(num).toString(), source[0],source[0].length);
  //     var len = source[0].length;// 整数的长度

  //     num = typeof num == 'string' ? parseFloat(num) : num // 判断是否是字符串如果是字符串转成数字
  //     num = num.toFixed(2); // 保留两位
  //     num = parseFloat(num); // 转成数字
  //     num = num.toLocaleString(); // 转成金额显示模式

  //     // 判断是否有小数
  //     if (num.indexOf('.') === -1) {
  //       num = '￥' + num + '.00' + '(' + dw2[len] + ')';
  //     } else {
  //       num = num.split('.')[1].length < 2 ? '￥' + num + '0' + '(' + dw2[len] + ')' : '￥' + num + '(' + dw2[len] + ')';
  //     }
  //     return num; // 返回的是字符串23,245.12保留2位小数
  //   } else {
  //     return 0;
  //   }
  // }



  static transform(tranvalue) {
    // 如果为空，直接返回
    if (tranvalue) {
      var i = 1;
      var dw2 = new Array("", "万", "亿");// 大单位
      var dw1 = new Array("十", "百", "千");// 小单位
      var dw = new Array("零", "一", "二", "三", "四", "五", "六", "七", "八", "九");// 整数部分用
      // 以下是小写转换成大写显示在合计大写的文本框中     
      // 分离整数与小数
      var source = this.splits(tranvalue);
      var num = source[0];
      var dig = source[1];

      // 转换整数部分
      var k1 = 0;// 计小单位
      var k2 = 0;// 计大单位
      var sum = 0;
      var str = "";
      var len = source[0].length;// 整数的长度
      for (i = 1; i <= len; i++) {
        var n = source[0].charAt(len - i);// 取得某个位数上的数字
        var bn = 0;
        if (len - i - 1 >= 0) {
          bn = source[0].charAt(len - i - 1);// 取得某个位数前一位上的数字
        }
        sum = sum + Number(n);
        if (sum != 0) {
          str = dw[Number(n)].concat(str);// 取得该数字对应的大写数字，并插入到str字符串的前面
          if (n == '0') sum = 0;
        }
        if (len - i - 1 >= 0) {// 在数字范围内
          if (k1 != 3) {// 加小单位
            if (bn != 0) {
              str = dw1[k1].concat(str);
            }
            k1++;
          } else {// 不加小单位，加大单位
            k1 = 0;
            var temp = str.charAt(0);
            if (temp == "万" || temp == "亿")// 若大单位前没有数字则舍去大单位
              str = str.substr(1, str.length - 1);
            str = dw2[k2].concat(str);
            sum = 0;
          }
        }
        if (k1 == 3)// 小单位到千则大单位进一
        { k2++; }
      }

      //转换小数部分
      var strdig = "";
      if (dig != "") {
        var n = dig.charAt(0);
        if (n != 0) {
          strdig += dw[Number(n)] + "角";//加数字
        }
        var n = dig.charAt(1);
        if (n != 0) {
          strdig += dw[Number(n)] + "分";//加数字
        }
      }
      str += "元" + strdig;
      return str;
    }

  }




}
