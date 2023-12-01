function appendTaskBar(cell, year, month, currentDay) {
    let currentDate = '' + year + '-' + month + '-' + (Math.floor(currentDay / 10) == 0 ? '0' : '') + currentDay;
    let currentTask = [];

    let todayDate = '' + nowYear + '-' + nowMonth + '-' + (Math.floor(currentDay / 10) == 0 ? '0' : '') + today.getDate();

    // 전체 일정에서 날짜가 같으면 가져오기로 했는데, 최적화 여부 고민해봐야 할 것 같습니다. by 박정근
    for (let ti = 0; ti < CalendarData.length; ti++) {
        if (currentDate == CalendarData[ti].date) {
            currentTask.push(CalendarData[ti]);
        }
    }

    for (let tb = 0; tb < Math.min(4, currentTask.length); tb++) {
        let taskbar = document.createElement('div');

        taskbar.classList.add('day-taskbar');
        taskbar.id = `tb_${currentTask[tb].index}`;
        taskbar.textContent = currentTask[tb].text;

        // Task, Schedule Border Color Category
        if (currentTask[tb].color_category !== 0) 
            taskbar.classList.add(`bc_${bgNames[currentTask[tb].color_category - 1]}`);

        if (currentTask[tb].type == 'Task') {
            taskbar.classList.add('taskbar-task');

            // Done or Skip
            if (currentTask[tb].status === 1) 
                taskbar.classList.add('taskbar-taskdone');
            else if (currentTask[tb].status === 0 && currentTask[tb].date < todayDate)
                taskbar.classList.add('taskbar-taskskip');
        }   
        else { 
            taskbar.classList.add('taskbar-schedule');

            // Schedule Background Color Category
            if (currentTask[tb].color_category !== 0) 
                taskbar.classList.add(`bg_${bgNames[currentTask[tb].color_category - 1]}`);
        }

        cell.appendChild(taskbar);
    }

    // 더보기 버튼 modal에 해당 날짜의 모든 일정을 보여주는 코드
    if (currentTask.length > 3) {
        let moreButton = document.createElement('div');
        moreButton.classList.add('day-taskbar-more');
        moreButton.textContent = 'More';
        moreButton.onclick = () => showAllTasks(currentTask,currentDate);
        moreButton.style.border = '2px solid black'; // 테두리 스타일
        moreButton.style.margin = '2px'; // 테두리에 마진값 추가
        moreButton.style.fontSize = '12px'; // Adjust the font size
        moreButton.style.padding = '5px 10px'; // Adjust padding for the button

        cell.appendChild(moreButton);
    }
}

//더보기 버튼을 누르면 일정을 가져온다.
function showAllTasks(tasks, currentDate) {
    let modalBody = document.querySelector('.modal-body-more');
    let labelHeader = document.getElementById('LabelHeader-more');
    labelHeader.textContent = `All Schedules for ${currentDate}`;

    modalBody.innerHTML = '';

    for (let task of tasks) {
        let taskDetail = document.createElement('div');
        taskDetail.classList.add('day-task-detail');
        taskDetail.textContent = `${currentDate} - ${task.text}`;

        modalBody.appendChild(taskDetail);
    }

    // 팝업 창 열기
    let modal = new bootstrap.Modal(document.getElementById('uform'));
    modal.show();
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
                cell.appendChild(dayNumber);

                // 달력에 표시될 일정, 할 일에 대한 구조입니다. by 박정근 (2023-11-17)
                appendTaskBar(cell, year, month, currentDay);

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

// Test Data
CalendarData.push({ index: 1, text: 'Database HW1', date: '2023-11-29', type: 'Task', color_category: 0, description: 'Test 1', location: 'Home',
                        status: 0, deadline: '2023-11-30', priority: 'high', runningTime: 120,
                        startTime: '09:00', endTime: '11:00'});
CalendarData.push({ index: 2, text: 'Lunch Meeting', date: '2023-11-29', type: 'Schedule', color_category: 0, description: 'Test 2', location: 'Cafe',
                        startTime: '14:00', endTime: '16:00'});
CalendarData.push({ index: 3, text: 'Dinner Meeting', date: '2023-11-30', type: 'Schedule', color_category: 4, description: 'Test 3', location: 'Restaurant',
                        startTime: '18:00', endTime: '20:00'});
CalendarData.push({ index: 4, text: 'Lend books', date: '2023-11-30', type: 'Task', color_category: 2, description: 'Test 4', location: 'Library',
                        status: 0, deadline: '', priority: 'low', runningTime: 30,
                        startTime: '20:00', endTime: '20:30'});
CalendarData.push({ index: 5, text: 'Wash dishes', date: '2023-11-01', type: 'Task', color_category: 5, description: 'Test 5', location: 'Home',
                        status: 0, deadline: '', priority: 'low', runningTime: 20,
                        startTime: '09:00', endTime: '09:20'});
CalendarData.push({ index: 6, text: 'Send Mail', date: '2023-11-21', type: 'Task', color_category: 6, description: 'Test 6', location: 'Home',
                        status: 1, deadline: '2023-11-25', priority: 'medium', runningTime: 60,
                        startTime: '09:00', endTime: '10:00'});
CalendarData.push({ index: 7, text: 'Party', date: '2023-11-29', type: 'Schedule', color_category: 7, description: 'Test 7', location: 'Cafe',
                        startTime: '20:00', endTime: '23:00'});
CalendarData.push({ index: 8, text: 'Go Hospital', date: '2023-11-25', type: 'Schedule', color_category: 1, description: 'Test 8', location: 'Hospital',
                        startTime: '13:00', endTime: '14:00'});
CalendarData.push({ index: 9, text: 'Lunch Meeting1', date: '2023-11-24', type: 'Schedule', color_category: 0, description: 'Test 9', location: '',
                        startTime: '14:00', endTime: '17:00'});
CalendarData.push({ index: 10, text: 'Lunch Meeting2', date: '2023-11-24', type: 'Schedule', color_category: 0, description: 'Test 10', location: '',
                        startTime: '17:00', endTime: '18:00'});
CalendarData.push({ index: 11, text: 'Lunch Meeting3', date: '2023-11-24', type: 'Schedule', color_category: 0, description: 'Test 11', location: '',
                        startTime: '18:00', endTime: '19:00'});
CalendarData.push({ index: 12, text: 'Lunch Meeting4', date: '2023-11-24', type: 'Schedule', color_category: 0, description: 'Test 12', location: '',
                        startTime: '19:00', endTime: '20:00'});
CalendarData.push({ index: 13, text: 'Lunch Meeting5', date: '2023-11-24', type: 'Schedule', color_category: 0, description: 'Test 13', location: '',
                        startTime: '20:00', endTime: '21:00'});
CalendarData.push({ index: 14, text: 'Lunch Meeting1', date: '2023-12-01', type: 'Schedule', color_category: 0, description: 'Test 14', location: '',
                        startTime: '12:00', endTime: '14:00'});
CalendarData.push({ index: 15, text: 'Lunch Meeting2', date: '2023-12-01', type: 'Schedule', color_category: 0, description: 'Test 15', location: '',
                        startTime: '16:30', endTime: '18:00'}); 

let sform = document.getElementById("sform");
let addSche = document.getElementById("addSche");
let titleInput = document.getElementById("titleInput");
let sdateInput = document.getElementById("sdateInput");
let stextarea = document.getElementById("stextarea");
let stypeInput = document.getElementById("stypeInput");
let slocationInput = document.getElementById("slocationInput");
let sdayNumber = document.getElementsByClassName("day-number");


sform.addEventListener("submit", (e) => {
    e.preventDefault();
    formValidationCal();
});

let formValidationCal = () => {
    if (titleInput.value === "") {
        console.log("failure");
    } else {
        console.log("success");
        acceptScheduleData();
        addSche.setAttribute("data-bs-dismiss", "modal");
        addSche.click();

        (() => {
            addSche.setAttribute("data-bs-dismiss", "");
        })();
    }
};

var bgFinds = [ "none", "red", "yellow", "green", "greenyellow", "blue", "aqua", "purple" ];

let acceptScheduleData = () => {
    let startHour = parseInt(document.getElementById('startTimeHoursInput').value) || 0;
    let startMinute = parseInt(document.getElementById('startTimeMinutesInput').value) || 0;
    let endHour = parseInt(document.getElementById('endTimeHoursInput').value) || 0;
    let endMinute = parseInt(document.getElementById('endTimeMinutesInput').value) || 0;
    console.log('d');
    CalendarData.push({
        index: CalendarData.length + 1,
        text: titleInput.value,
        date: sdateInput.value,
        description: stextarea.value,
        type: stypeInput.value,
        color_category: bgFinds.indexOf(document.getElementById('scolorInput').value),
        location: slocationInput.value,
        startTime: ((startHour < 10 ? '0' : '') + toString(startHour)) + ((startMinute < 10 ? '0' : '') + toString(startMinute)),
        endTime: ((endHour < 10 ? '0' : '') + toString(endHour)) + ((endMinute < 10 ? '0' : '') + toString(endMinute))    
    });

    localStorage.setItem("CalendarData", JSON.stringify(CalendarData));

    console.log(CalendarData);
    generateCalendar(nowYear, nowMonth);

    titleInput.value = "";
    sdateInput.value = "";
    stextarea.value = "";
    stypeInput.value = "Schedule";
    slocationInput.value = "";
};

// 오늘 기준으로 생성하는 것으로 수정했습니다. by 박정근
let today = new Date();
var nowYear = today.getFullYear();
var nowMonth = today.getMonth() + 1;

localStorage.setItem("CalendarData", JSON.stringify(CalendarData));
generateCalendar(today.getFullYear(), today.getMonth() + 1);

console.log(CalendarData);