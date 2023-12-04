function appendTaskBar(cell, year, month, currentDay, mode) {
    let currentDate = '' + year + '-' + month + '-' + (Math.floor(currentDay / 10) == 0 ? '0' : '') + currentDay;
    let currentTask = [];

    let today = new Date();
    let todayDate = String(today.getFullYear()) + "-" + String(today.getMonth() + 1).padStart(2, '0') + "-" + String(today.getDate()).padStart(2, '0');
    let todayTime = today.toTimeString().split(' ')[0].substring(0, 5);

    // 전체 일정에서 날짜가 같으면 가져오기로 했는데, 최적화 여부 고민해봐야 할 것 같습니다. by 박정근
    for (let ti = 0; ti < CalendarData.length; ti++) {
        if (currentDate == CalendarData[ti].date) {
            currentTask.push(CalendarData[ti]);
        }
    }
    let currentTaskByTime = currentTask.sort((a, b) => {
        if (a.startTime > b.startTime) return 1;
        if (a.startTime < b.startTime) return -1;
        return 0;
    });

    for (let tb = 0; tb < (mode == 1 ? currentTaskByTime.length : Math.min(3, currentTaskByTime.length)); tb++) {
        let taskbar_container = document.createElement('div');
        if (mode == 1) {
            taskbar_container.classList.add('day-taskbar-container');

            let taskbar_time = document.createElement('div');
            taskbar_time.classList.add('day-taskbar-time');
            taskbar_time.textContent = currentTaskByTime[tb].startTime + '~' + currentTaskByTime[tb].endTime;
            taskbar_container.appendChild(taskbar_time);

            let taskbar_blank = document.createElement('div');
            taskbar_blank.classList.add('day-taskbar-blank');
            taskbar_container.appendChild(taskbar_blank);
        }

        let taskbar = document.createElement('div');

        taskbar.classList.add('day-taskbar');
        taskbar.id = `tb_${currentTaskByTime[tb].index}`;
        taskbar.textContent = currentTaskByTime[tb].text;

        // Task, Schedule Border Color Category
        if (currentTaskByTime[tb].color_category !== 0) 
            taskbar.classList.add(`bc_${bgNames[currentTaskByTime[tb].color_category - 1]}`);

        if (currentTaskByTime[tb].type == 'Task') {
            taskbar.classList.add('taskbar-task');

            // Done or Skip
            if (currentTaskByTime[tb].status == 1) 
                taskbar.classList.add('taskbar-taskdone');
            else if (currentTaskByTime[tb].status == 0 && (currentTaskByTime[tb].date < todayDate || currentTaskByTime[tb].deadline < todayDate)) {
                taskbar.classList.add('taskbar-taskskip');
                skipTaskAppend(tb, currentTaskByTime);
            }
        }   
        else { 
            taskbar.classList.add('taskbar-schedule');

            // Schedule Background Color Category
            if (currentTaskByTime[tb].color_category !== 0) 
                taskbar.classList.add(`bg_${bgNames[currentTaskByTime[tb].color_category - 1]}`);
        }

        taskbar.onclick = () => showTask(taskbar, currentTaskByTime[tb]);

        if (currentDate == todayDate && currentTaskByTime[tb].startTime <= todayTime && todayTime <= currentTaskByTime[tb].endTime) {
            taskbar.classList.add('runningTask');
        }

        if (mode == 1) {
            taskbar.addEventListener("click", e => {
                umodal.hide();
                
            });

            taskbar_container.appendChild(taskbar);
            cell.appendChild(taskbar_container);
        }
        else {
            cell.appendChild(taskbar);
        }
        
    }

    if (mode == 0) {
        // 더보기 버튼 modal에 해당 날짜의 모든 일정을 보여주는 코드
        if (currentTask.length > 3) {
            let moreButton = document.createElement('div');
            moreButton.classList.add('day-taskbar-more');
            moreButton.textContent = 'More';
            moreButton.onclick = () => showAllTasks(currentDate);

            cell.appendChild(moreButton);
        }
    }
}

// Delete 버튼
function scheduleDelete(id) {
    CalendarData = JSON.parse(localStorage.getItem("CalendarData"));
    for (let i = 0; i < CalendarData.length; i++) {
        if (id == CalendarData[i].index) {
            CalendarData.splice(i, 1);
            break;
        }
    }
    localStorage.setItem("CalendarData", JSON.stringify(CalendarData));
    generateCalendar(nowYear, nowMonth);
}

var selSceIdx = -1;
function editSchedule(id) {
    CalendarData = JSON.parse(localStorage.getItem("CalendarData"));
    let nows;
    for (let i = 0; i < CalendarData.length; i++) {
        if (id == CalendarData[i].index) {
            nows = CalendarData[i];
            selSceIdx = i;
            break;
        }
    }

    document.getElementById('titleInput').value = nows.text;
    document.getElementById('sdateInput').value = nows.date;
    document.getElementById('stypeInput').value = nows.type;
    document.getElementById('startTimeHoursInput').value = nows.startTime.substring(0, 2);
    document.getElementById('startTimeMinutesInput').value = nows.startTime.substring(3, 5);
    document.getElementById('endTimeHoursInput').value = nows.endTime.substring(0, 2);
    document.getElementById('endTimeMinutesInput').value = nows.endTime.substring(3, 5);
    document.getElementById('slocationInput').value = nows.location;
    document.getElementById('scolorInput').value = (nows.color_category == 0 ? "none" : bgNames[nows.color_category - 1]);
    document.getElementById('stextarea').value = nows.description;
}

function scheduleChange() {
    CalendarData = JSON.parse(localStorage.getItem("CalendarData"));
    CalendarData[selSceIdx].text = document.getElementById('titleInput').value;
    CalendarData[selSceIdx].date = document.getElementById('sdateInput').value;

    CalendarData[selSceIdx].startTime = ((Number(document.getElementById('startTimeHoursInput').value) < 10 ? '0' : '') + String(Number(document.getElementById('startTimeHoursInput').value))) + ":" + ((Number(document.getElementById('startTimeMinutesInput').value) < 10 ? '0' : '') + String(Number(document.getElementById('startTimeMinutesInput').value)))
    CalendarData[selSceIdx].endTime = ((Number(document.getElementById('endTimeHoursInput').value) < 10 ? '0' : '') + String(Number(document.getElementById('endTimeHoursInput').value))) + ":" + ((Number(document.getElementById('endTimeMinutesInput').value) < 10 ? '0' : '') + String(Number(document.getElementById('endTimeMinutesInput').value)))
    CalendarData[selSceIdx].location = document.getElementById('slocationInput').value;
    CalendarData[selSceIdx].color_category = bgFinds.indexOf(document.getElementById('scolorInput').value);
    CalendarData[selSceIdx].description = document.getElementById('stextarea').value;
}

// taskbar 일정 상세보기
var tbmodal;
function showTask(nowTaskBar, task) {

    let modalBody = document.querySelector('.modal-body-tb');
    let labelHeader = document.getElementById('LabelHeader-tb');
    labelHeader.textContent = `${task.text}`;

    modalBody.innerHTML = '';

    if (task.type == 'Schedule') {
        modalBody.innerHTML += "<h5>Schedule Title</h5><p>" + task.text + "</p>"
                                + "<h5>Date</h5><p>" + task.date + "</p>"
                                + "<h5>Start Time</h5><p>" + task.startTime + "</p>"
                                + "<h5>End Time</h5><p>" + task.endTime + "</p>"
                                + "<h5>Color Category</h5><p>" + (task.color_category == 0 ? "None" : bgNames[task.color_category - 1]) + "</p>"
                                + (task.location == "" ? "" : "<h5>Location</h5><p>" + task.location + "</p>")
                                + "<h5>Description</h5><p>" + task.description + "</p>";
        document.getElementById('tbmf').innerHTML = `<button type="button" class="btn btn-secondary" data-bs-dismiss="modal" onclick="editSchedule(${task.index})" data-bs-toggle="modal" data-bs-target="#sform">Edit</button>
                                                    <button type="button" class="btn btn-secondary tbcb" data-bs-dismiss="modal" onclick="scheduleDelete(${task.index})">Delete</button>`;                       
    }
    else {
        modalBody.innerHTML += "<h5>Schedule Title</h5><p>" + task.text + "</p>"
                                + "<h5>Date</h5><p>" + task.date + "</p>"
                                + "<h5>Start Time</h5><p>" + task.startTime + "</p>"
                                + "<h5>End Time</h5><p>" + task.endTime + "</p>"
                                + "<h5>Color Category</h5><p>" + (task.color_category == 0 ? "None" : bgNames[task.color_category - 1]) + "</p>"
                                + "<h5>Priority</h5><p>" + task.priority + "</p>"
                                + "<h5>Status</h5><p>" + (task.status == 0 ? 'To do' : 'Done') + "</p>"
                                + "<h5>Deadline</h5><p>" + task.deadline + "</p>"
                                + (task.location == "" ? "" : "<h5>Location</h5><p>" + task.location + "</p>")
                                + "<h5>Description</h5><p>" + task.description + "</p>";
        if (task.status == 0) {
            document.getElementById('tbmf').innerHTML = `<button type="button" class="btn btn-secondary" data-bs-dismiss="modal" onclick="editSchedule(${task.index})" data-bs-toggle="modal" data-bs-target="#sform">Edit</button>
                                                        <button type="button" class="btn btn-secondary tbcb" data-bs-dismiss="modal" onclick="scheduleDelete(${task.index})">Delete</button>
                                                        <button type="button" id="tbmf-done" class="btn btn-secondary tbdb" data-bs-dismiss="modal">Done</button>`;   
            document.querySelector('#tbmf-done').onclick = () => {
                for (let k = 0; k < CalendarData.length; k++) {
                    if (CalendarData[k].index == task.index) {
                        CalendarData[k].status = 1;
                        break;
                    }
                }
                localStorage.setItem("CalendarData", JSON.stringify(CalendarData));
                generateCalendar(nowYear, nowMonth);
            }
        }
        else {
            document.getElementById('tbmf').innerHTML = `<button type="button" class="btn btn-secondary" data-bs-dismiss="modal" onclick="editSchedule(${task.index})" data-bs-toggle="modal" data-bs-target="#sform">Edit</button>
                                                        <button type="button" class="btn btn-secondary tbcb" data-bs-dismiss="modal" onclick="scheduleDelete(${task.index})">Delete</button>
                                                        <button type="button" id="tbmf-cancel" class="btn btn-secondary tbcb" data-bs-dismiss="modal">Cancel</button> `  
            document.querySelector('#tbmf-cancel').onclick = () => {
                for (let k = 0; k < CalendarData.length; k++) {
                    if (CalendarData[k].index == task.index) {
                        CalendarData[k].status = 0;
                        break;
                    }
                }
                localStorage.setItem("CalendarData", JSON.stringify(CalendarData));
                generateCalendar(nowYear, nowMonth);
            }
        }
    }

    tbmodal = new bootstrap.Modal(document.getElementById('tbform'));
    tbmodal.show();
}

//더보기 버튼을 누르면 일정을 가져온다.
var umodal;
function showAllTasks(currentDate) {
    let modalBody = document.querySelector('.modal-body-more');
    let labelHeader = document.getElementById('LabelHeader-more');
    labelHeader.textContent = `All Schedules for ${currentDate}`;

    modalBody.innerHTML = '';

    appendTaskBar(modalBody, Number(currentDate.substring(0, 4)), Number(currentDate.substring(5, 7)), Number(currentDate.substring(8, 10)), 1);

    // 팝업 창 열기
    umodal = new bootstrap.Modal(document.getElementById('uform'));
    umodal.show();
}

var darkmode = 0;
// 다크 모드 토글 함수
function toggleDarkMode() {
    const body = document.body;
    body.classList.toggle('dark-mode');
    let nextMonthBut = document.getElementById("nextMonth");
    let prevMonthBut = document.getElementById("prevMonth");

    if (darkmode == 0) {
        nextMonthBut.classList.remove('monthButton');
        nextMonthBut.classList.add('monthButton_dark');
        prevMonthBut.classList.remove('monthButton');
        prevMonthBut.classList.add('monthButton_dark');
        darkmode = 1;
    }
    else {
        nextMonthBut.classList.remove('monthButton_dark');
        nextMonthBut.classList.add('monthButton');
        prevMonthBut.classList.remove('monthButton_dark');
        prevMonthBut.classList.add('monthButton');
        darkmode = 0;
    }
}


function generateCalendar(year, month) {
    let yearInput = document.getElementById('year');
    let monthInput = document.getElementById('month');
    let calendarBody = document.getElementById('calendar-body');
    let monthYearHeader = document.getElementById('month-year');
    calendarBody.innerHTML = '';

    let firstDay = new Date(year, month - 1, 1);
    let lastDay = new Date(year, month, 0);
    let daysInMonth = lastDay.getDate();
    let startingDay = firstDay.getDay();

    let currentDay = 1;
    CalendarData = JSON.parse(localStorage.getItem("CalendarData"));

    for (let i = 0; i < 6; i++) {
        let row = document.createElement('tr');

        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < startingDay) {
                let cell = document.createElement('td');
                row.appendChild(cell);
            } else if (currentDay > daysInMonth) {
                break;
            } else {
                let cell = document.createElement('td');    

                // 각 셀에 날짜를 표시
                let dayNumber = document.createElement('div');
                dayNumber.classList.add('day-number');
                dayNumber.classList.add('btn-3d');
                dayNumber.setAttribute("data-bs-toggle", "modal");
                dayNumber.setAttribute("data-bs-target", "#sform");

                dayNumber.onclick = () => { 
                    sdateInput.value = nowYear + "-" + ((nowMonth < 10 ? '0' : '') + nowMonth) + "-" + ((dayNumber.textContent < 10 ? '0' : '') + dayNumber.textContent);
                };
                
                if (j == 0) dayNumber.classList.add('tc_red');
                else if (j == 6) dayNumber.classList.add('tc_blue');

                // Today Marker
                if (nowYear === today.getFullYear()     && 
                    nowMonth === today.getMonth() + 1   && 
                    currentDay === today.getDate()) 
                    dayNumber.classList.add('today_mark');
                
                dayNumber.textContent = currentDay;
                dayNumber.addEventListener('click', function() {
                    document.getElementById('titleInput').value = '';
                    document.getElementById('stypeInput').value = 'Schedule';
                    document.getElementById('startTimeHoursInput').value = '';
                    document.getElementById('startTimeMinutesInput').value = '';
                    document.getElementById('endTimeHoursInput').value = '';
                    document.getElementById('endTimeMinutesInput').value = '';
                    document.getElementById('slocationInput').value = '';
                    document.getElementById('scolorInput').value = "none";
                    document.getElementById('stextarea').value = '';
                })
                cell.appendChild(dayNumber);

                // 달력에 표시될 일정, 할 일에 대한 구조입니다. by 박정근 (2023-11-17)
                appendTaskBar(cell, year, month, currentDay, 0);

                row.appendChild(cell);
                currentDay++;
            }
        }

        calendarBody.appendChild(row);

        if (currentDay > daysInMonth) {
            break;
        }
    }

    yearInput.value = year;
    monthInput.value = month;
    nowYear = year;
    nowMonth = month;
    monthYearHeader.textContent = `${year} / ${monthNames[month - 1]}`;
}

function updateCalendar() {
    let yearInput = document.getElementById('year');
    let monthInput = document.getElementById('month');
    let year = parseInt(yearInput.value);
    let month = parseInt(monthInput.value);

    generateCalendar(year, month);
}

// 이전 달, 다음 달로 넘어가는 버튼입니다.
function prevMonth() {
    if (nowMonth === 1) {
        nowYear -= 1;
        nowMonth = 12;
    }
    else nowMonth -= 1;

    generateCalendar(nowYear, nowMonth);
}

function nextMonth() {
    if (nowMonth === 12) {
        nowYear += 1;
        nowMonth = 1;
    }
    else nowMonth += 1;

    generateCalendar(nowYear, nowMonth);
}

// Global Variable
var monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];
var bgNames = [ "red", "yellow", "green", "greenyellow", "blue", "aqua", "purple" ];

var CalendarData = [];

// Data Read in localStorage
read_CalendarData = JSON.parse(localStorage.getItem("CalendarData"))
if (read_CalendarData) CalendarData = read_CalendarData;

let sform = document.getElementById("sform");
let addSche = document.getElementById("addSche");
let titleInput = document.getElementById("titleInput");
let sdateInput = document.getElementById("sdateInput");
let stextarea = document.getElementById("stextarea");
let stypeInput = document.getElementById("stypeInput");
let slocationInput = document.getElementById("slocationInput");
let sdayNumber = document.getElementsByClassName("day-number");
let startTimeHoursInput = document.getElementById('startTimeHoursInput')
let startTimeMinutesInput = document.getElementById('startTimeMinutesInput')
let endTimeHoursInput = document.getElementById('endTimeHoursInput')
let endTimeMinutesInput = document.getElementById('endTimeMinutesInput')

sform.addEventListener("submit", (e) => {
    e.preventDefault();
    formValidationCal();
});

let formValidationCal = () => {
    if (titleInput.value === "" || 
        sdateInput.value === "" ||
        startTimeHoursInput.value === "" || 
        startTimeMinutesInput.value === "" || 
        endTimeHoursInput.value === "" || 
        endTimeMinutesInput.value === "") {
        console.log("failure");
    } else {
        console.log("success");
        if (selSceIdx == -1) {
            acceptScheduleData();
        }
        else {
            scheduleChange();
            selSceIdx = -1;
            localStorage.setItem("CalendarData", JSON.stringify(CalendarData));
            generateCalendar(nowYear, nowMonth);
        }
        addSche.setAttribute("data-bs-dismiss", "modal");
        addSche.click();

        (() => {
            addSche.setAttribute("data-bs-dismiss", "");
        })();
    }
};

var bgFinds = [ "none", "red", "yellow", "green", "greenyellow", "blue", "aqua", "purple" ];


let acceptScheduleData = () => {
    let startHours = Number(startTimeHoursInput.value);
    let startMinutes = Number(startTimeMinutesInput.value);
    let endHours = Number(endTimeHoursInput.value);
    let endMinutes = Number(endTimeMinutesInput.value);
    
    if (stypeInput.value == 'Schedule') {
        CalendarData.push({
            index: (CalendarData.length == 0 ? 1 : CalendarData[CalendarData.length - 1]['index'] + 1),
            text: titleInput.value,
            date: sdateInput.value,
            description: stextarea.value,
            type: stypeInput.value,
            color_category: bgFinds.indexOf(document.getElementById('scolorInput').value),
            location: slocationInput.value,
            startTime: ((startHours < 10 ? '0' : '') + startHours) + ':' + ((startMinutes < 10 ? '0' : '') + startMinutes),
            endTime: ((endHours < 10 ? '0' : '') + endHours) + ':' + ((endMinutes < 10 ? '0' : '') + endMinutes)
        });
    }
    else {
        CalendarData.push({
            index: (CalendarData.length == 0 ? 1 : CalendarData[CalendarData.length - 1]['index'] + 1),
            text: titleInput.value,
            date: sdateInput.value,
            deadline: sdateInput.value,
            priority: "low",
            runningTime: (endHours * 60 + endMinutes) - (startHours * 60 + startMinutes),
            status: 0,
            description: stextarea.value,
            type: stypeInput.value,
            color_category: bgFinds.indexOf(document.getElementById('scolorInput').value),
            location: slocationInput.value,
            startTime: ((startHours < 10 ? '0' : '') + startHours) + ':' + ((startMinutes < 10 ? '0' : '') + startMinutes),
            endTime: ((endHours < 10 ? '0' : '') + endHours) + ':' + ((endMinutes < 10 ? '0' : '') + endMinutes)
        });
    }

    localStorage.setItem("CalendarData", JSON.stringify(CalendarData));

    console.log(CalendarData);
    generateCalendar(nowYear, nowMonth);

    titleInput.value = "";
    sdateInput.value = "";
    stextarea.value = "";
    stypeInput.value = "Schedule";
    slocationInput.value = "";
};

function skipTaskAppend(tb, currentTaskByTime) {
    data = JSON.parse(localStorage.getItem("data"))
    for (let k = 0; k < data.length; k++) {
        if (data[k].calindex == currentTaskByTime[tb].index) return;
    }

    data.push({
        index: (data.length == 0 ? 1 : data[data.length - 1]['index'] + 1),
        text: currentTaskByTime[tb].text,
        date: currentTaskByTime[tb].deadline,
        description: currentTaskByTime[tb].description,
        color_category: (currentTaskByTime[tb].color_category == 0, "none", bgNames[currentTaskByTime[tb].color_category - 1]),
        priority: currentTaskByTime[tb].priority,
        location: currentTaskByTime[tb].location,
        executionTime: currentTaskByTime[tb].runningTime,
        calindex: currentTaskByTime[tb].index
    });

    localStorage.setItem("data", JSON.stringify(data));

    console.log(data);
    createTasks();
}



// 오늘 기준으로 생성하는 것으로 수정했습니다. by 박정근
let today = new Date();
var nowYear = today.getFullYear();
var nowMonth = today.getMonth() + 1;

localStorage.setItem("CalendarData", JSON.stringify(CalendarData));
generateCalendar(today.getFullYear(), today.getMonth() + 1);

console.log(CalendarData);