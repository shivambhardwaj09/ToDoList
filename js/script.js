// LIST CONTAINER VARIABLES
const listsContainer = document.querySelector('[data-lists]');
const newListForm = document.querySelector('[data-new-list-form]');
const newListInput = document.querySelector('[data-new-list-input]');
const deleteListButton = document.querySelector('[data-delete-list-button]');

// TASK CONTAINER VARIABLES
const listDisplayContainer = document.querySelector('[data-list-display-container]');
const listTitleElement = document.querySelector('[data-list-title]');
const listCountElement = document.querySelector('[data-list-count]');
const tasksContainer = document.querySelector('[data-tasks]');
const tasksListContainer = document.querySelector('[data-tasks-container]');
const newTaskForm = document.querySelector('[data-new-task-form]');
const newTaskInput = document.querySelector('[data-new-task-input]');
const deleteTaskButton = document.querySelector('[data-delete-task-button]');

const LOCAL_STORAGE_LIST_KEY = 'task.lists';
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'task.selectedListId';

// CREATING AND ACCESSING THE LOCALSTORAGE
let lists;
if (localStorage.getItem(LOCAL_STORAGE_LIST_KEY) === null) {
    lists = [];
} else {
    lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY));
}
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY) || "";

// TO SELECT ANY LIST ITEM
listsContainer.addEventListener('click', (event) => {
    // console.log(event.target);
    if (event.target.tagName.toLowerCase() === 'li') {
        selectedListId = event.target.dataset.listId;
        saveAndRender();
    }
});

// ADDING NEW LIST ITEM TO THE LIST CONTAINER
newListForm.addEventListener('submit', event => {
    event.preventDefault();
    const listName = newListInput.value;
    if (listName === null || listName === '')
        return alert(`Please enter a list Item in the left panel`);
    const list = createList(listName);
    newListInput.value = null;
    lists.push(list);
    saveAndRender();
});

// ADDING NEW LIST'S TASK ITEM TO THE CONTAINER
newTaskForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const taskName = newTaskInput.value;
    if (taskName === null || taskName === '')
        return alert(`Please enter a task in the right panel`);
    const task = createTask(taskName);
    newTaskInput.value = '';
    const selectedList = lists.filter(list => {
        return list.id === selectedListId;
    });
    selectedList[0].tasks.push(task);
    saveAndRender();
});

// SELECT OR DE-SELECT THE TASKS FROM THE TASK CONTAINER
tasksListContainer.addEventListener('click', (event) => {
    if (event.target.tagName.toLowerCase() === 'label') {
        // console.log(event.target.htmlFor);
        const selectedList = lists.filter(list => {
            return list.id === selectedListId;
        });
        const selectedTask = selectedList[0].tasks.forEach(task => {
            if (task.id === event.target.htmlFor)
                task.completed = !task.completed;
        });
        save();
        renderTaskCount(selectedList);
    }
});

// DELETING THE LIST ITEM
deleteListButton.addEventListener('click', () => {
    lists = lists.filter((list) => {
        return list.id !== selectedListId;
    });
    selectedListId = "";
    saveAndRender();
});

// DELETING THE TASK ITEM
deleteTaskButton.addEventListener('click', (event) => {
    const selectedList = lists.filter(list => {
        return list.id === selectedListId;
    });
    const updatedSelectedListTasks = selectedList[0].tasks.filter(task => {
        return !task.completed;
    });
    selectedList[0].tasks = updatedSelectedListTasks;
    saveAndRender();
});

// DYNAMIC TEMPLATE FOR A LIST
function createList(listName) {
    return {
        id: Date.now().toString(),
        name: listName,
        tasks: []
    };
}

// DYNAMIC TEMPLATE FOR A TASK
function createTask(taskName) {
    return {
        id: Date.now().toString(),
        name: taskName,
        completed: false
    }
}

function saveAndRender() {
    save();
    render();
}

// SAVING BOTH LISTS AND SELECTEDLISTID TO LOCALSTORAGE
function save() {
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists));
    localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId);
}

// RENDERING ALL ITEM
function render() {
    clearElement(listsContainer);
    renderLists();

    let selectedList = lists.filter(list => list.id === selectedListId)
    // console.log(selectedList[0]);
    if (selectedList[0] == null)
        listDisplayContainer.style.display = 'none';
    else {
        listDisplayContainer.style.display = '';
        listTitleElement.innerText = selectedList[0].name;
        renderTaskCount(selectedList);
        clearElement(tasksListContainer)
        renderTasks(selectedList);
    }
}

// TO DISPLAY ALL THE LIST ITEM FROM THE LOCALSTORAGE
function renderLists() {
    lists.forEach(list => {
        const listElement = document.createElement('li');
        listElement.dataset['listId'] = list.id;
        listElement.classList.add('list-name');
        listElement.innerHTML = list.name;
        if (list.id === selectedListId)
        listElement.classList.add('active-list');
        listsContainer.appendChild(listElement);
        // console.log(listElement.dataset);
    });
}

// TO RENDER THE No. OF TASK REMAINING TO BE COMPLETED
function renderTaskCount(selectedList) {
    const incompleteTaskCount = selectedList[0].tasks.filter(task => {
        return !task.completed;
        // return task.completed === false;
    }).length;
    const taskString = (incompleteTaskCount === 1 || incompleteTaskCount === 0)? 'task': 'tasks';
    listCountElement.innerText = `${incompleteTaskCount} ${taskString} remaining`;
}

// TO DISPLAY ALL THE LIST'S TASK ITEM FROM THE LOCALSTORAGE
function renderTasks(selectedList) {
    selectedList[0].tasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.classList.add('task');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.style.display = "none";
        checkbox.id = task.id;
        checkbox.checked = task.completed;
        const label = document.createElement('label');
        label.htmlFor = task.id;
        const span = document.createElement('span');
        span.classList.add('custom-checkbox');
        label.appendChild(span);
        label.append(task.name);
        taskElement.appendChild(checkbox);
        taskElement.appendChild(label);
        tasksListContainer.appendChild(taskElement);
    });
}

// CLEARING ALL THE ELEMENT'S CHILDREN WHICH ARE PRESENT BY-DEFAULT IN THE HTML
function clearElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

render();