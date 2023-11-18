// To Do List
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
    tasks.innerHTML = "";
    data.map((x, y) => {
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
            <div id=${y}>
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



