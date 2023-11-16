/* 달력 */

function generateCalendar(year, month) {
    let calendarBody = document.getElementById('calendar-body');
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
                dayNumber.textContent = currentDay;
                cell.appendChild(dayNumber);

                row.appendChild(cell);
                currentDay++;
            }
        }

        calendarBody.appendChild(row);

        if (currentDay > daysInMonth) {
            break;
        }
    }
}

function updateCalendar() {
    let yearInput = document.getElementById('year');
    let monthInput = document.getElementById('month');
    let monthYearHeader = document.getElementById('month-year');

    let year = parseInt(yearInput.value);
    let month = parseInt(monthInput.value);

    generateCalendar(year, month);
    
    let monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    
    monthYearHeader.textContent = `${year} / ${monthNames[month - 1]}`;
}

generateCalendar(2023, 11);



/* to do list */

let form = document.getElementById("form");
let textInput = document.getElementById("textInput");
let dateInput = document.getElementById("dateInput");
let textarea = document.getElementById("textarea");
let msg = document.getElementById("msg");
let tasks = document.getElementById("tasks");
let add = document.getElementById("add");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  formValidation();
});

let formValidation = () => {
  if (textInput.value === "") {
    console.log("failure");
    msg.innerHTML = "Task cannot be blank";
  } else {
    console.log("success");
    msg.innerHTML = "";
    acceptData();
    add.setAttribute("data-bs-dismiss", "modal");
    add.click();

    (() => {
      add.setAttribute("data-bs-dismiss", "");
    })();
  }
};

let data = [{}];

let acceptData = () => {
  data.push({
    text: textInput.value,
    date: dateInput.value,
    description: textarea.value,
  });

  localStorage.setItem("data", JSON.stringify(data));

  console.log(data);
  createTasks();
};

let createTasks = () => {
  tasks.innerHTML = "";
  data.map((x, y) => {
    return (tasks.innerHTML += `
    <div id=${y}>
          <span class="fw-bold">${x.text}</span>
          <span class="small text-secondary">${x.date}</span>
          <p>${x.description}</p>
  
          <span class="options">
            <i onClick= "editTask(this)" data-bs-toggle="modal" data-bs-target="#form" class="fas fa-edit"></i>
            <i onClick ="deleteTask(this);createTasks()" class="fas fa-trash-alt"></i>
          </span>
        </div>
    `);
  });

  resetForm();
};

let deleteTask = (e) => {
  e.parentElement.parentElement.remove();
  data.splice(e.parentElement.parentElement.id, 1);
  localStorage.setItem("data", JSON.stringify(data));
  console.log(data);
  
};

let editTask = (e) => {
  let selectedTask = e.parentElement.parentElement;

  textInput.value = selectedTask.children[0].innerHTML;
  dateInput.value = selectedTask.children[1].innerHTML;
  textarea.value = selectedTask.children[2].innerHTML;

  deleteTask(e);
};

let resetForm = () => {
  textInput.value = "";
  dateInput.value = "";
  textarea.value = "";
};

(() => {
  data = JSON.parse(localStorage.getItem("data")) || []
  console.log(data);
  createTasks();
})();



