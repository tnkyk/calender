window.onload = function() {
    // 現在の年月の取得
    var current = new Date();
    var year = current.getFullYear();
    var month = current.getMonth() + 1;
 
    // カレンダーの表示
    var wrapper = document.getElementById('calendar');
    add_calendar(wrapper, year, month);
}
 
/**
 * 指定した年月のカレンダーを表示する
 * @param {object} wrapper - カレンダーを追加する親要素
 * @param {number} year    - 年の指定
 * @param {number} month   - 月の指定
 */
function add_calendar(wrapper, year, month) {
    // 現在カレンダーが追加されている場合は一旦削除する
    wrapper.textContent = null;
 
    // カレンダーに表示する内容を取得
    var headData = generate_calendar_header(wrapper, year, month);
    var bodyData = generate_month_calendar(year, month);
 
    // カレンダーの要素を追加
    wrapper.appendChild(headData);
    wrapper.appendChild(bodyData);
}
 
/**
 * 指定した年月のカレンダーのヘッダー要素を生成して返す
 * @param {object} wrapper - カレンダーを追加する親要素
 * @param {number} year    - 年の指定
 * @param {number} month   - 月の指定
 */
function generate_calendar_header(wrapper, year, month) {
    // 前月と翌月を取得
    var nextMonth = new Date(year, (month - 1));
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    var prevMonth = new Date(year, (month - 1));
    prevMonth.setMonth(prevMonth.getMonth() - 1);
 
    // ヘッダー要素
    var cHeader = document.createElement('div');
    cHeader.className = 'calendar-header';
 
    // 見出しの追加
    var cTitle = document.createElement('div');
    cTitle.className = 'calendar-header__title';
    var cTitleText = document.createTextNode(year + '年' + month + '月');
    cTitle.appendChild(cTitleText);
    cHeader.appendChild(cTitle);
 
    // 前月ボタンの追加
    var cPrev = document.createElement('button');
    cPrev.className = 'calendar-header__prev';
    var cPrevText = document.createTextNode('prev');
    cPrev.appendChild(cPrevText);
    // 前月ボタンをクリックした時のイベント設定
    cPrev.addEventListener('click', function() {
        add_calendar(wrapper, prevMonth.getFullYear(), (prevMonth.getMonth() + 1));
        get_weather_info();
    }, false);
    cHeader.appendChild(cPrev);
 
    // 翌月ボタンの追加
    var cNext = document.createElement('button');
    cNext.className = 'calendar-header__next';
    var cNextText = document.createTextNode('next');
    cNext.appendChild(cNextText);
    // 翌月ボタンをクリックした時のイベント設定
    cNext.addEventListener('click', function() {
        add_calendar(wrapper, nextMonth.getFullYear(), (nextMonth.getMonth() + 1));
        get_weather_info();
    }, false);
    cHeader.appendChild(cNext);
 
    return cHeader;
}
 
/**
 * 指定した年月のカレンダー要素を生成して返す
 * @param {number} year  - 年の指定
 * @param {number} month - 月の指定
 */
function generate_month_calendar(year, month) {
    var weekdayData = ['日', '月', '火', '水', '木', '金', '土'];
    // カレンダーの情報を取得
    var calendarData = get_month_calendar(year, month);

    var day = new Date()
    var today = day.getDate()
    var thismonth = day.getMonth()
    console.log(today)
    var thisweek = [today,today+1,today+2,today+3,today+4]
 
    var i = calendarData[0]['weekday']; // 初日の曜日を取得
    // カレンダー上の初日より前を埋める
    while(i > 0) {
        i--;
        calendarData.unshift({
            day: '',
            weekday: i
        });
    }
    var i = calendarData[calendarData.length - 1]['weekday']; // 末日の曜日を取得
    // カレンダー上の末日より後を埋める
    while(i < 6) {
        i++;
        calendarData.push({
            day: '',
            weekday: i
        });
    }
 
    // カレンダーの要素を生成
    var cTable = document.createElement('table');
    cTable.className = 'calendar-table';
 
    var insertData = '';
    // 曜日部分の生成
    insertData += '<thead>';
    insertData += '<tr>';
    for (var i = 0; i < weekdayData.length; i++) {
        insertData += '<th>';
        insertData += weekdayData[i];
        insertData += '</th>';
    }
    insertData += '</tr>';
    insertData += '</thead>';

    // 日付部分の生成
    insertData += '<tbody>';
    for (var i = 0; i < calendarData.length; i++) {
        if(calendarData[i]['weekday'] <= 0) {
            insertData += '<tr>';
        }
        insertData += '<td id=day-'+ calendarData[i]['day']+'>';
        insertData += calendarData[i]['day'];
        var count =0;
        for (var j = 0;j < thisweek.length;j++){
            if(calendarData[i]['day'] == thisweek[j] && thismonth == month-1){
                insertData += '<div style="height: 30px;width: 120px;">気温　<span id = "temp-'+calendarData[i]['day']+'"  class="bold"></span>　℃</div>'
                insertData += '<div style="height: 30px;width: 120px;">湿度　<span id = "humidity-'+calendarData[i]['day']+'" class="bold"></span>　%</div>'
                insertData += '<div><span id = "weather-'+calendarData[i]['day']+'" class="bold"></span></div>'
                insertData += '<div id="weatherMark-'+calendarData[i]['day']+'"></div>'
                count++;
            }
        }
        insertData += '</td>';
        if(calendarData[i]['weekday'] >= 6) {
            insertData += '</tr>';
        }
    }
    insertData += '</tbody>';
 
    cTable.innerHTML = insertData;
    return cTable;
}
 
/**
 * 指定した年月のカレンダー情報を返す
 * @param {number} year  - 年の指定
 * @param {number} month - 月の指定
 */
function get_month_calendar(year, month) {
    var firstDate = new Date(year, (month - 1), 1); // 指定した年月の初日の情報
    var lastDay = new Date(year, (firstDate.getMonth() + 1), 0).getDate(); // 指定した年月の末日
    var weekday = firstDate.getDay(); // 指定した年月の初日の曜日
 
    var calendarData = []; // カレンダーの情報を格納
    var weekdayCount = weekday; // 曜日のカウント用
    for (var i = 0; i < lastDay; i++) {
        calendarData[i] = {
            day: i + 1,
            weekday: weekdayCount
        }
        // 曜日のカウントが6(土曜日)まできたら0(日曜日)に戻す
        if(weekdayCount >= 6) {
            weekdayCount = 0;
        } else {
            weekdayCount++;
        }
    }
    return calendarData;
}

function get_weather_info(){
    var day = new Date()
    var today = day.getDate()
    var week = [today,today+1,today+2,today+3,today+4];
    $.each(week,function(index,val){
        $.post("http://api.openweathermap.org/data/2.5/forecast?id=1850147&appid=cc05750ba50400f27ebabbcd6f4c4976&lang=ja&units=metric",  
                function(json){
                    weather = "#weather-"+val
                    temp = "#temp-"+val
                    humidity = "#humidity-"+val
                    weatherMark = "#weatherMark-"+val
                    
                    //TODO: 日にちごとにidがあるからそれに変える
                    $(weather).html(json.list[8*index].weather[0].description);
                    $(humidity).html(json.list[8*index].main.humidity);
                    //lang=jaにすることで華氏から摂氏に変換することなく摂氏表示となる。小数点だけ丸める処理をする
                    $(temp).html(Math.round(json.list[8*index].main.temp));

                    //天気に応じた天気アイコンを表示させる
                    switch (json.list[8*index].weather[0].main){
                    case 'Clouds':
                    $(weatherMark).html("<img src='http://openweathermap.org/img/w/04d.png' >");
                    break;
                    case 'Snow':
                    $(weatherMark).html("<img src='http://openweathermap.org/img/w/13d.png' >");
                    break;
                    case 'Rain':
                    $(weatherMark).html("<img src='http://openweathermap.org/img/w/09d.png' >");
                    break;
                    case 'Clear':
                    $(weatherMark).html("<img src='http://openweathermap.org/img/w/01d.png' >");
                    break;
                    case 'Fog':
                    $(weatherMark).html("<img src='http://openweathermap.org/img/w/50d.png' >");
                    break;
                    case 'Mist':
                    $(weatherMark).html("<img src='http://openweathermap.org/img/w/50n.png' >");
                    break;
                    case 'Haze':
                    $(weatherMark).html("<img src='http://openweathermap.org/img/w/50d.png' >");
                    break;
                    default:
                    $(weatherMark).html("<img src='http://openweathermap.org/img/w/01n.png' >");
                }
            }
        );
    });
}


