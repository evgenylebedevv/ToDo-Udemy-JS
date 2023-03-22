(function() {
    let todos = []
    let users = []
    const todoList = document.getElementById('todo-list')
    document.addEventListener('DOMContentLoaded', initApp)
    const userSelect = document.getElementById('user-todo')
    const form = document.querySelector('form')
    form.addEventListener('submit', handleSubmit)

    function initApp() {
        Promise.all([getAllToDos(), getAllUsers()]).then(value => {
            [todos, users] = value
            todos.forEach((todo) => printToDo(todo))
            users.forEach((user) => createUserOption(user))
        })
    }

// Async Functions
    async function getAllUsers() {
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/users')
            const data = await response.json()
            return data
        } catch(error) {
            alertError(error)
        }
    }

    async function getAllToDos() {
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/todos')
            const data = await response.json()
            return data
        } catch(error) {
            alertError(error)
        }
    }

    async function createToDo(todo){
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/todos', {
                method: 'POST',
                body: JSON.stringify(todo),
                headers: {
                    'Content-Type': 'application/json',
                }
            })

            const newTodo = await response.json()
            printToDo(newTodo)
        } catch (error) {
            alertError(error)
        }

    }

    async function toggleTodoComplete(todoid, completed) {
        try {
            const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${todoid}`, {
                method: 'PATCH',
                body: JSON.stringify({completed}),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const data = await response.json()
            console.log(data)

            if(!response.ok) {
                throw new Error('Failed connect to server')
            }
        } catch (error) {
            alertError(error)
        }

    }

    async function deleteTodo(todoId) {
        try {
            const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }

            })
            if (response.ok) {
                removeTodo(todoId)
            } else {
                throw new Error('Failed connect to server')
            }
        } catch (error) {
            alertError(error)
        }
    }

    function printToDo ({id, userId, title, completed}) {
        const li = document.createElement('li')
        li.classList.add('todo-item')
        li.dataset.id = id
        li.innerHTML = `<span> ${title} <i>by</i> <b>${getUserName(userId)}</b> ${getUserEmail(userId)}</span>`
        const status = document.createElement('input')
        status.type = 'checkbox'
        status.checked = completed
        status.addEventListener('change', handleTodoChange)

        const close = document.createElement('span')
        close.innerHTML = '&times;'
        close.className = 'close'
        close.addEventListener('click', handleClose)

        li.prepend(status)
        li.append(close)

        todoList.prepend(li)
    }

    function getUserName(userId) {
        const user = users.find(u => u.id === userId);
        return user.name
    }

    function getUserEmail(userId) {
        const user = users.find(u => u.id === userId);
        return user.email;
    }

    function removeTodo(todoId) {
        todos = todos.filter(todo => todo.id != todoId) // delete from array

        const todo = todoList.querySelector(`[data-id="${todoId}"]`)
        todo.querySelector('input').removeEventListener('change', handleTodoChange)
        todo.querySelector('.close').removeEventListener('click', handleClose)

        todo.remove() // delete from DOM
    }

    function createUserOption(user) {
        const option = document.createElement('option')
        option.value = user.id
        option.innerText = user.name

        userSelect.append(option)
    }

// Handle Functions
    function handleSubmit(event) {
        event.preventDefault()

        createToDo({
            userId: Number(form.user.value),
            title: form.todo.value,
            completed: false,
        })
    }

    function handleTodoChange() {
        const todoId = this.parentElement.dataset.id
        const completed = this.checked

        toggleTodoComplete(todoId, completed)

    }

    function handleClose() {
        const todoId = this.parentElement.dataset.id
        deleteTodo(todoId)
    }

    function alertError(error) {
        alert(error.message)
    }
})
()


