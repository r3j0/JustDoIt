// 1. 현재 시간 기준, 이후 시간 타임에서 '여유 시간' 구하기
// [10:30 ~ 18:30], [19:00 ~ 21:00]
// 2. 
// 동일 수행 시간 -> 냅색
// 데드라인, 우선순위 -> 그리디

// 데드라인 그룹화 -> 우선 데드라인부터 그리디 진행
// 우선순위가 같으면 냅색 진행

// todolist Task Key -> calendar Task Key

function nextDate(now) {
    const nowDate = new Date(now);
    nowDate.setDate(nowDate.getDate() + 1);
    return nowDate.toISOString().split('T')[0];
}

function prevMinute(d, now) {
    const nowTime = new Date(d);
    nowTime.setHours(parseInt(now.substring(0, 2))); 
    nowTime.setMinutes(parseInt(now.substring(3, 5)));
    nowTime.setMinutes(nowTime.getMinutes() - 1);
    return nowTime.toTimeString().split(' ')[0].substring(0, 5);
}

function nextMinuteValue(d, now, value) {
    const nowTime = new Date(d);
    nowTime.setHours(parseInt(now.substring(0, 2))); 
    nowTime.setMinutes(parseInt(now.substring(3, 5)));
    nowTime.setMinutes(nowTime.getMinutes() + value);
    return nowTime.toTimeString().split(' ')[0].substring(0, 5);
}

function getAvailableTime() {
    // 1. 현재 시간 기준, 이후 시간 타임에서 '여유 시간' 구하기
    // 일의 시작 시간은 09:00, 일의 종료 시간은 24:00 이라고 가정
    let today = new Date();
    let todayDate = new Date(today.getTime()).toISOString().split('T')[0];
    let todayTime = today.toTimeString().split(' ')[0].substring(0, 5);

    //console.log(todayDate + " " + todayTime);

    // 오늘 날짜 보여주기 (?) 테스트용..
    var d1 = document.getElementById("a"); 
    d1.innerHTML = todayDate + " " + todayTime;
    
    calendarData = JSON.parse(localStorage.getItem("CalendarData"))
    let calendarDataByTime = calendarData.sort((a, b) => {
        if (a.date > b.date) return 1;
        if (a.date < b.date) return -1;
        if (a.startTime > b.startTime) return 1;
        if (a.startTime < b.startTime) return -1;
        return 0;
    });

    let startDate = todayDate;
    let startTime = todayTime;
    let availableTime = [];

    let timeCount = 0;
    for (const cdata of Object.values(calendarDataByTime)) {
        if (cdata['date'] + " " + cdata['startTime'] > todayDate + " " + todayTime) {
            while (cdata['date'] != startDate) {
                availableTime.push({'date':startDate, 'start':startTime, 'end':'23:59'});
                startDate = nextDate(startDate);
                startTime = '09:00';
            }

            if (startTime != cdata['startTime']) availableTime.push({'date':startDate, 'start':startTime, 'end':prevMinute(startDate, cdata['startTime'])});
            startTime = cdata['endTime'];
        }
        else if (cdata['date'] == todayDate && cdata['endTime'] > todayTime) {
            todayTime = nextMinuteValue(cdata['date'], cdata['endTime'], 1);
        }
    }
    availableTime.push({'date':startDate, 'start':startTime, 'end':'23:59'});

    return availableTime;
}

function getTaskGroup() {
    // 2. 할일 그룹화
    prIndex = {'high':0, 'medium':1, 'low':2};
    todolistData = JSON.parse(localStorage.getItem("data"));
    let todolistDataByTimePr = todolistData.sort((a, b) => {
        if (a.date > b.date) return 1;
        if (a.date < b.date) return -1;
        if (prIndex[a.priority] > prIndex[b.priority]) return 1;
        if (prIndex[a.priority] < prIndex[b.priority]) return -1;
        else return 0;
    });

    todolistGroup = [];
    nowGroup = [todolistDataByTimePr[0]];
    for (let ti = 1; ti < todolistDataByTimePr.length; ti++) {
        if (todolistDataByTimePr[ti]['date'] != nowGroup[0]['date'] || todolistDataByTimePr[ti]['priority'] != nowGroup[0]['priority']) {
            todolistGroup.push(nowGroup);
            nowGroup = [todolistDataByTimePr[ti]];
        }
        else nowGroup.push(todolistDataByTimePr[ti]);
    }

    if (nowGroup.length > 0) todolistGroup.push(nowGroup);
    return todolistGroup;
}

function create2DArray(rows, columns) {
    var arr = new Array(rows);
    for (var i = 0; i < rows; i++) {
        arr[i] = new Array(columns);
        for (var j = 0; j < columns; j++) {
            arr[i][j] = {'value':0, 'track':[]};
        }
    }
    return arr;
}

function imax(a, b) {
    if (a > b) return a;
    return b;
}

function strToTime(t) {
    return (t[4] - '0') + (t[3] - '0') * 10 + (t[1] - '0') * 60 + (t[0] - '0') * 600;
}

function assignTasks() {
    let availableTime = getAvailableTime();
    let taskGroup = getTaskGroup();

    let calendarInput = [];

    //console.log(JSON.parse(JSON.stringify(availableTime)));
    //console.log(JSON.parse(JSON.stringify(taskGroup)));

    let maxTaskLength = 0;
    for (let tg = 0; tg < taskGroup.length; tg++) maxTaskLength = imax(maxTaskLength, taskGroup[tg].length);

    for (let at = 0; at < availableTime.length; at++) {
        for (let tg = 0; tg < taskGroup.length; tg++) {
            let weightRange = strToTime(availableTime[at]['end']) - strToTime(availableTime[at]['start']) + 1;
            if (weightRange <= 0) break;
            if (taskGroup[tg].length == 0) continue;
            let dp = create2DArray(taskGroup[tg].length + 1, weightRange+1);

            //console.log(JSON.parse(JSON.stringify(availableTime[at])));
            //console.log(JSON.parse(JSON.stringify(taskGroup[tg])));
            
            // Knapsack
            for (let j = 1; j <= weightRange; j++) {
                for (let i = 1; i <= taskGroup[tg].length; i++) {
                    let weight = taskGroup[tg][i-1]['executionTime'];
                    
                    if (j >= weight) {
                        if (dp[i-1][j]['value'] < dp[i-1][j-weight]['value'] + 1) {
                            dp[i][j]['value'] = dp[i-1][j-weight]['value'] + 1;
                            dp[i][j]['track'] = dp[i-1][j-weight]['track'].slice();
                            dp[i][j]['track'].push(i);
                        }
                        else {
                            dp[i][j]['value'] = dp[i-1][j]['value'];
                            dp[i][j]['track'] = dp[i-1][j]['track'].slice();
                        }
                    }
                    else {
                        dp[i][j]['value'] = dp[i-1][j]['value'];
                        dp[i][j]['track'] = dp[i-1][j]['track'].slice();
                    }
                }
            }

            // Assign 
            let assignTasks = dp[taskGroup[tg].length][weightRange]['track'].slice();
            let assignTasksByIdx = assignTasks.sort((a, b) => {
                if (a > b) return -1;
                if (a < b) return 1;
                return 0;
            });

            for (let atk = 0; atk < assignTasksByIdx.length; atk++) {
                // console.log(JSON.parse(JSON.stringify(taskGroup[tg][assignTasksByIdx[atk] - 1])));
                // console.log(availableTime[at]['start']);

                calendarInput.push({'text':taskGroup[tg][assignTasksByIdx[atk] - 1]['text'],
                                    'date': availableTime[at]['date'],
                                    'type': 'Task',
                                    'color_category': 0,
                                    'description': taskGroup[tg][assignTasksByIdx[atk] - 1]['description'],
                                    'location': taskGroup[tg][assignTasksByIdx[atk] - 1]['location'],
                                    'status': 0,
                                    'deadline': taskGroup[tg][assignTasksByIdx[atk] - 1]['date'],
                                    'priority': taskGroup[tg][assignTasksByIdx[atk] - 1]['priority'],
                                    'runningTime': taskGroup[tg][assignTasksByIdx[atk] - 1]['executionTime'],
                                    'startTime': availableTime[at]['start'],
                                    'endTime': nextMinuteValue(availableTime[at]['date'], availableTime[at]['start'], taskGroup[tg][assignTasksByIdx[atk] - 1]['executionTime'])});
                                    

                availableTime[at]['start'] = nextMinuteValue(availableTime[at]['date'], availableTime[at]['start'], taskGroup[tg][assignTasksByIdx[atk] - 1]['executionTime']);
                if (availableTime[at]['start'] == '00:00') availableTime[at]['start'] = '24:00'
                taskGroup[tg].splice(assignTasksByIdx[atk] - 1, 1);

                // [TODO] task 들을 실제로 지우기 위해 배열에다가 append
            }

        }
    }

    // [TODO] 할당한 task 정보 캘린더에 집어넣기
    console.log(calendarInput);

    // [TODO] 할당한 task 들 투두리스트에서 삭제

}

assignTasks();