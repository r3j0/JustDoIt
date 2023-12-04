// 1. 현재 시간 기준, 이후 시간 타임에서 '여유 시간' 구하기
// [10:30 ~ 18:30], [19:00 ~ 21:00]
// 2. 
// 동일 수행 시간 -> 냅색
// 데드라인, 우선순위 -> 그리디

// 데드라인 그룹화 -> 우선 데드라인부터 그리디 진행
// 우선순위가 같으면 냅색 진행

// todolist Task Key -> calendar Task Key

// [TODO] 주석 제대로 짜기, 한 번 더 검토

function nextDate(now) {
    const nowDate = new Date(now);
    nowDate.setDate(nowDate.getDate() + 1);
    return String(nowDate.getFullYear()) + "-" + String(nowDate.getMonth() + 1).padStart(2, '0') + "-" + String(nowDate.getDate()).padStart(2, '0');
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
    let todayDate = String(today.getFullYear()) + "-" + String(today.getMonth() + 1).padStart(2, '0') + "-" + String(today.getDate()).padStart(2, '0');
    let todayTime = today.toTimeString().split(' ')[0].substring(0, 5);

    calendarData = JSON.parse(localStorage.getItem("CalendarData"))
    let calendarDataByTime = calendarData.sort((a, b) => {
        if (a.date > b.date) return 1;
        if (a.date < b.date) return -1;
        if (a.startTime > b.startTime) return 1;
        if (a.startTime < b.startTime) return -1;
        return 0;
    });

    console.log('calendarDataByTime');
    console.log(calendarDataByTime);

    let startDate = todayDate;
    let startTime = todayTime;
    if (startTime < '09:00') startTime = '09:00'; // 예외 : 오전 실행
    let availableTime = [];

    for (const cdata of Object.values(calendarDataByTime)) {
        if (cdata['date'] + " " + cdata['startTime'] > todayDate + " " + todayTime) {
            while (cdata['date'] != startDate) {
                availableTime.push({'date':startDate, 'start':startTime, 'end':'23:59'});
                startDate = nextDate(startDate);
                startTime = '09:00';
            }

            if (startTime < cdata['startTime']) availableTime.push({'date':startDate, 'start':startTime, 'end':nextMinuteValue(startDate, cdata['startTime'], -1)});
            startTime = cdata['endTime'];
            if (startTime < '09:00') startTime = '09:00';
        }
        else if (cdata['date'] == todayDate && cdata['endTime'] > todayTime) {
            startTime = cdata['endTime'];
        }
    }
    if (startTime < '09:00') startTime = '09:00';
    availableTime.push({'date':startDate, 'start':startTime, 'end':'23:59'});

    return [availableTime, nextDate(startDate)];
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

var bgFinds = [ "none", "red", "yellow", "green", "greenyellow", "blue", "aqua", "purple" ];

function assignTasks() {
    let [availableTime, lastTime] = getAvailableTime();
    let taskGroup = getTaskGroup();

    let calendarInput = [];

    console.log('Available Time');
    console.log(JSON.parse(JSON.stringify(availableTime)));
    console.log('Task Group');
    console.log(JSON.parse(JSON.stringify(taskGroup)));

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
                let tmpEndTime = nextMinuteValue(availableTime[at]['date'], availableTime[at]['start'], taskGroup[tg][assignTasksByIdx[atk] - 1]['executionTime']);
                if (tmpEndTime == '00:00') tmpEndTime = '24:00';

                calendarInput.push({'text':taskGroup[tg][assignTasksByIdx[atk] - 1]['text'],
                                    'date': availableTime[at]['date'],
                                    'type': 'Task',
                                    'color_category': taskGroup[tg][assignTasksByIdx[atk] - 1]['color_category'],
                                    'description': taskGroup[tg][assignTasksByIdx[atk] - 1]['description'],
                                    'location': taskGroup[tg][assignTasksByIdx[atk] - 1]['location'],
                                    'status': 0,
                                    'deadline': taskGroup[tg][assignTasksByIdx[atk] - 1]['date'],
                                    'priority': taskGroup[tg][assignTasksByIdx[atk] - 1]['priority'],
                                    'runningTime': taskGroup[tg][assignTasksByIdx[atk] - 1]['executionTime'],
                                    'startTime': availableTime[at]['start'],
                                    'endTime': tmpEndTime});
                                    

                availableTime[at]['start'] = tmpEndTime;
                taskGroup[tg].splice(assignTasksByIdx[atk] - 1, 1);

                // [TODO] task 들을 실제로 지우기 위해 배열에다가 append
            }

        }
    }
    
    // [TODO] 이후 남겨진 task 들은, availableTime 이후 시간에 배치
    while (true) {
        let maxTasks = 0;
        for (let tgi = 0; tgi < taskGroup.length; tgi++) maxTasks = imax(maxTasks, taskGroup[tgi].length);

        if (maxTasks == 0) break;
        let dateRemainTask = lastTime;
        let dateRemainTaskStartTime = '09:00';
        let dateRemainTaskEndTime = '23:59';

        for (let tg = 0; tg < taskGroup.length; tg++) {
            let weightRange = strToTime(dateRemainTaskEndTime) - strToTime(dateRemainTaskStartTime) + 1;
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
                
                let tmpEndTime = nextMinuteValue(dateRemainTask, dateRemainTaskStartTime, taskGroup[tg][assignTasksByIdx[atk] - 1]['executionTime']);
                if (tmpEndTime == '00:00') tmpEndTime = '24:00';

                calendarInput.push({'text':taskGroup[tg][assignTasksByIdx[atk] - 1]['text'],
                                    'date': dateRemainTask,
                                    'type': 'Task',
                                    'color_category': taskGroup[tg][assignTasksByIdx[atk] - 1]['color_category'],
                                    'description': taskGroup[tg][assignTasksByIdx[atk] - 1]['description'],
                                    'location': taskGroup[tg][assignTasksByIdx[atk] - 1]['location'],
                                    'status': 0,
                                    'deadline': taskGroup[tg][assignTasksByIdx[atk] - 1]['date'],
                                    'priority': taskGroup[tg][assignTasksByIdx[atk] - 1]['priority'],
                                    'runningTime': taskGroup[tg][assignTasksByIdx[atk] - 1]['executionTime'],
                                    'startTime': dateRemainTaskStartTime,
                                    'endTime': tmpEndTime});
                                    

                dateRemainTaskStartTime = tmpEndTime;
                taskGroup[tg].splice(assignTasksByIdx[atk] - 1, 1);
            }

        }

        lastTime = nextDate(lastTime);
    }

    // 할당한 task 정보 캘린더에 집어넣기
    console.log("Calendar Input Data");
    console.log(calendarInput);

    for (let ci = 0; ci < calendarInput.length; ci++) {
        CalendarData.push({
            index: CalendarData.length + 1,
            text: calendarInput[ci]['text'],
            date: calendarInput[ci]['date'],
            type: 'Task',
            color_category: bgFinds.indexOf(calendarInput[ci]['color_category']),
            description: calendarInput[ci]['description'],
            location: calendarInput[ci]['location'],
            status: 0,
            deadline: calendarInput[ci]['deadline'],
            priority: calendarInput[ci]['priority'],
            runningTime: calendarInput[ci]['runningTime'],
            startTime: calendarInput[ci]['startTime'],
            endTime: calendarInput[ci]['endTime']
        });

    }
    localStorage.setItem("CalendarData", JSON.stringify(CalendarData));
    generateCalendar(nowYear, nowMonth);
}