// To Do List
let form = document.getElementById("form");
let textInput = document.getElementById("textInput");
let dateInput = document.getElementById("dateInput");
let textarea = document.getElementById("textarea");
let msg = document.getElementById("msg");
let tasks = document.getElementById("tasks");
let add = document.getElementById("add");
let batchButton = document.getElementById("batch");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    formValidation();
});

let formValidation = () => {
    let hours = Number(document.getElementById('executionTimeHoursInput').value);
    let minutes = Number(document.getElementById('executionTimeMinutesInput').value);

    if (textInput.value === "" || hours * 60 + minutes > 900) {
        console.log("failure");
    } else {
        console.log("success");
        if (msg) {
            msg.innerHTML = "";
        }
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
    let hours = parseInt(document.getElementById('executionTimeHoursInput').value) || 0;
    let minutes = parseInt(document.getElementById('executionTimeMinutesInput').value) || 0;

    data.push({
        calindex: -1,
        index: (data.length == 0 ? 1 : data[data.length - 1]['index'] + 1),
        text: textInput.value,
        date: dateInput.value,
        description: textarea.value,
        color_category: document.getElementById('colorInput').value,
        priority: document.getElementById('priorityInput').value,
        location: document.getElementById('locationInput').value,
        executionTime: hours * 60 + minutes,
    });
    editTaskDelete();

    localStorage.setItem("data", JSON.stringify(data));

    console.log(data);
    createTasks();
};

function createTasks() {
    let currentDate = new Date();   // 마감일 지난일 확인하기 위해 현재 날짜 변수 추가
    tasks.innerHTML = "";
    data.map((x, y) => {
        let taskDate = new Date(x.date);
        let isOverdue = taskDate < currentDate;

        let priorityColor = 'text-primary';
        if (Object.keys(x).includes('priority')) {
            switch (x.priority.toLowerCase()) {
                case 'high':
                    priorityColor = 'text-danger'; // 빨간색
                    break;
                case 'medium':
                    priorityColor = 'text-secondary'; // 회색
                    break;
                case 'low':
                    priorityColor = 'text-primary'; // 파란색
                    break;
                default:
                    priorityColor = '';
            }
        }

        return (tasks.innerHTML += `
            <div id=${y} class="${isOverdue ? 'overdue' : ''}" style="display:flex">
                <span style="display:none;">${x.index}</span>
                <div style="flex-basis:50%; border:0">
                    <span class="task-title fw-bold">${x.text}</span>
                    <span class="small text-secondary">${x.date}</span>
                    <p>${x.description}</p>
                    ${x.location ? `<span class="small text-secondary">Location: ${x.location}</span>` : ''}
                </div>
                <div style="border:0">
                    <span class="small ${priorityColor}">Priority: ${x.priority}</span>
                    <span class="small text-secondary">Execution Time: <br>${Math.floor(x.executionTime / 60)}h ${x.executionTime % 60}min</span>
                </div>
                <div style="border:0">
                    <span class="options">
                        <i onClick="editTask(this)" data-bs-toggle="modal" data-bs-target="#form" class="fas fa-edit"></i>
                        <i onClick="deleteTask(this);createTasks()" class="fas fa-trash-alt"></i>
                    </span>
                </div>
            </div>
        `);
    });

    resetForm();
};


let deleteTask = (e) => {
    e.parentElement.parentElement.parentElement.remove();
    data.splice(e.parentElement.parentElement.parentElement.id, 1);
    localStorage.setItem("data", JSON.stringify(data));
    console.log(data);
    createTasks();
};

function editTaskDelete() {
    if (selDataIdx != -1) {
        data.splice(selDataIdx, 1);
        localStorage.setItem("data", JSON.stringify(data));
        createTasks();
        selDataIdx = -1;
    }
}

let editTask = (e) => {
    data = JSON.parse(localStorage.getItem("data"))
    let selectedTaskIdx = e.parentElement.parentElement.parentElement.children[0].innerHTML;
    let selectedTask;
    
    for (let i = 0; i < data.length; i++) {
        if (selectedTaskIdx == data[i].index) {
            selectedTask = data[i];
            selDataIdx = i;
            break;
        }
    }

    textInput.value = selectedTask.text;
    dateInput.value = selectedTask.date;
    textarea.value = selectedTask.description;
    document.getElementById('locationInput').value = selectedTask.location;
    document.getElementById('priorityInput').value = selectedTask.priority;
    document.getElementById('executionTimeHoursInput').value = Math.floor(selectedTask.executionTime / 60);
    document.getElementById('executionTimeMinutesInput').value = selectedTask.executionTime % 60;
};

// batch 버튼 누르면 데이터 보내는 함수
function sendBatchData() {
    if (data.length == 0) alert("There is nothing to batch.");
    else assignTasks();
}

var selDataIdx = -1;
batchButton.addEventListener('click', sendBatchData);

let resetForm = () => {
    selDataIdx = -1;
    textInput.value = "";
    dateInput.value = "";
    textarea.value = "";
    locationInput.value = "";
    document.getElementById('executionTimeHoursInput').value = "";
    document.getElementById('executionTimeMinutesInput').value = "";
};

(() => {
    data = JSON.parse(localStorage.getItem("data")) || []
    console.log(data);
    createTasks();
})();



