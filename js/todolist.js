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
    if (textInput.value === "") {
        console.log("failure");
        if (msg) {
            msg.innerHTML = "Task cannot be blank";
        }
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
        text: textInput.value,
        date: dateInput.value,
        description: textarea.value,
        priority: document.getElementById('priorityInput').value,
        location: document.getElementById('locationInput').value,
        executionTime: hours * 60 + minutes,
    });

    localStorage.setItem("data", JSON.stringify(data));

    console.log(data);
    createTasks();
};

let createTasks = () => {
    let currentDate = new Date();   // 마감일 지난일 확인하기 위해 현재 날짜 변수 추가
    tasks.innerHTML = "";
    data.map((x, y) => {
        let taskDate = new Date(x.date);
        let isOverdue = taskDate < currentDate;

        let priorityColor = 'text-primary';
        if (Object.keys(data).includes('priority')) {
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
            <div id=${y} class="${isOverdue ? 'overdue' : ''}">
                <span class="fw-bold">${x.text}</span>
                <span class="small text-secondary">${x.date}</span>
                <p>${x.description}</p>
                ${x.location ? `<span class="small text-secondary">Location: ${x.location}</span>` : ''}
                <span class="small ${priorityColor}">Priority: ${x.priority}</span>
                <span class="small text-secondary">Execution Time: ${Math.floor(x.executionTime / 60)}h ${x.executionTime % 60}min</span>
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
    document.getElementById('locationInput').value = selectedTask.children[3].textContent.split(": ")[1];
    document.getElementById('priorityInput').value = selectedTask.children[4].textContent.split(": ")[1];
    document.getElementById('executionTimeHoursInput').value = Math.floor(selectedTask.children[5].textContent.split(": ")[1] / 60);
    document.getElementById('executionTimeMinutesInput').value = selectedTask.children[5].textContent.split(": ")[1] % 60;

    deleteTask(e);
};



// batch 버튼 누르면 데이터 보내는 함수
function sendBatchData() {
    //console.log('Batch button clicked'); // 함수 호출 테스트용

    let taskData = data.map(task => ({
        text: task.text,
        date: task.date,
        description: task.description,
        priority: task.priority,
        location: task.location,
        executionTime: task.executionTime,
    }));

    console.log(taskData);

    //anotherFunction(taskData);
}

batchButton.addEventListener('click', sendBatchData);

/*
function anotherFunction(taskData) {
    for (let i = 0; i < taskData.length; i++) {
        let task = taskData[i];

        // 객체의 속성에 접근할 수 있습니다
        console.log('Task text: ' + task.text);
        console.log('Due date: ' + task.date);
        console.log('Description: ' + task.description);
        console.log('Priority: ' + task.priority);
        console.log('Location: ' + task.location);
        console.log('Execution time: ' + task.executionTime);
    }
}
*/




let resetForm = () => {
    textInput.value = "";
    dateInput.value = "";
    textarea.value = "";
    locationInput.value = "";
};

(() => {
    data = JSON.parse(localStorage.getItem("data")) || []
    console.log(data);
    createTasks();
})();



