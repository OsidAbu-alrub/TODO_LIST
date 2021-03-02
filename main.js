const form = document.querySelector('#form');
const addBtn = document.querySelector('.add-btn');
const cardList = document.querySelector('.task-list');
const searchField = document.querySelector('#searchField');
const searchCancel = document.querySelector('.search-cancel');
const todoCount = document.querySelector('.todo-count');
const doneCount = document.querySelector('.done-count');
const dim = document.querySelector('.dim');
const popup = document.querySelector('.popup');
let id = 0;
let li = null;
// adjustCounters();

// get from local storage
document.addEventListener("DOMContentLoaded", displayTasksList);
function displayTasksList(){
    const tasksList = getFromStorage();
    let temp = 0;
    for(let {task,assignee,done,id} of tasksList){
        const card = createCard(task,assignee);
        if(done) card.classList.add("done");
        card.attributes.id.value = id;
        temp = id;
        cardList.appendChild(card);
    }
    adjustCounters();
    id = temp + 1;
}

function getFromStorage(){
    let tasksList = [];
    if(localStorage.getItem('tasksList') !== null){
        tasksList = JSON.parse(localStorage.getItem('tasksList'));
    }
    return tasksList;
}

function addToStorage(task,assignee,done = false,id){
    const tasksList = getFromStorage();
    tasksList.push({
        task,
        assignee,
        done,
        id
    });
    localStorage.setItem('tasksList',JSON.stringify(tasksList))
}

function removeFromStorage(){
    const id = li.id;
    const tasksList = getFromStorage();
    tasksList.forEach((value,index)=>{
        if(value.id == id) tasksList.splice(index,1);
    })
    localStorage.setItem('tasksList',JSON.stringify(tasksList));
}

function updateLocalStorage(task,assignee,done,id){
    const tasksList = getFromStorage();
    tasksList.forEach((value) =>{
        console.log(value);
        if(value.id == id) {
            value.done = done;
        }
    })
    localStorage.setItem('tasksList',JSON.stringify(tasksList))
}

// ADD TASK
addBtn.addEventListener('click', (event)=>{
    event.preventDefault();
    const formData = new FormData(form);
    const task = formData.get('task-name');
    const assignee = formData.get('task-assignee');

    const card = createCard(task,assignee);
    cardList.appendChild(card);
    addToStorage(task,assignee,false,id);
    id += 1;
    console.log(id);
})

function createCard(task = 'Relax',assignee='jk'){
    const li = document.createElement('li');
    li.classList.add('task-card')
    li.id = id;
    li.innerHTML = 
    `
        <p class="task-card-name">Task: <span>${task}</span></p>
        <p class="task-card-assignee">Assignee: <span>${assignee}</span></p>
        <button class="task-card-check"><i class="fas fa-check"></i></button>
        <button class="task-card-delete"><i class="fas fa-trash-alt"></i></button>
    `
    return li;
}

// SEARCH FIELD
searchField.addEventListener('keyup',function(){
    if(this.value){
        for(let card of cardList.children){
            const span = card.querySelector('span');
            if(!span.textContent.includes(this.value))
                card.classList.add('hide');
            else
                card.classList.remove('hide');
        }
    }
    else{
        for(let card of cardList.children){
            card.classList.remove('hide');
        }
    }
})

searchCancel.addEventListener('click', ()=>{
    searchField.value = '';
    for(let card of cardList.children){
        card.classList.remove('hide');
    }
})


// CHECK TASK
cardList.addEventListener('click', (event)=>{
    
    try{
        const target = event.target.closest('.task-card-check');
        if(target){
            const li = target.closest('.task-card');
            li.classList.toggle('done');
            updateLocalStorage(null, null, li.classList.contains('done'), li.id);
            adjustCounters();
        }
        else if(event.target.closest('.task-card-delete')){
            li = event.target.closest('.task-card');
            popUp();
        }
    }
    catch(err){
        return;
    }
})

function adjustCounters(){
    let done = 0;
    let todo = 0;
    for(let card of cardList.children){
        card.classList.contains('done') ? done++ : todo++;    
    }
    doneCount.firstElementChild.textContent = done;
    todoCount.firstElementChild.textContent = todo;
}

function popUp(){
    dim.classList.toggle('hide');
    popup.classList.toggle('hide');
}

popup.addEventListener('click',(event)=>{
    const val = event.target.value;
    if(val === 'confirm'){
        popUp();
        removeFromStorage();
        li.remove();
        adjustCounters();
    }
    else if(val === 'cancel'){
        popUp();
        return;
    }
});