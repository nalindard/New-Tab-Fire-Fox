// @ts-check
const browser = chrome

// ///////////////////////////////////////////////////////////////////
// DOM Elements
// ///////////////////////////////////////////////////////////////////
const tabs = document.querySelectorAll('.tab')
const tasksPanel = document.getElementById('tasks-panel')
const wallpaperPanel = document.getElementById('wallpaper-panel')
const taskInput = document.getElementById('task-input')
const addTaskBtn = document.getElementById('add-task-btn')
const taskList = document.getElementById('task-list')
const emptyTasks = document.getElementById('empty-tasks')
const modeButtons = document.querySelectorAll('.mode-btn')
const bingControls = document.getElementById('bing-controls')
const customControls = document.getElementById('custom-controls')
const bingTitle = document.getElementById('bing-title')
const prevWallpaperBtn = document.getElementById('prev-wallpaper')
const nextWallpaperBtn = document.getElementById('next-wallpaper')
const openNewtabBtn = document.getElementById('open-newtab')

// State
let bgContent = []
let currentBgIndex = 0
let currentPreference = 'bing-wallpaper'

// ///////////////////////////////////////////////////////////////////
// Initialization
// ///////////////////////////////////////////////////////////////////
document.addEventListener('DOMContentLoaded', async () => {
    await loadTasks()
    await loadWallpaperState()
})

// ///////////////////////////////////////////////////////////////////
// Tab Switching
// ///////////////////////////////////////////////////////////////////
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const targetTab = tab.getAttribute('data-tab')

        // Update tab states
        tabs.forEach(t => t.classList.remove('active'))
        tab.classList.add('active')

        // Switch panels
        if (targetTab === 'tasks') {
            tasksPanel.classList.add('active')
            wallpaperPanel.classList.remove('active')
        } else {
            wallpaperPanel.classList.add('active')
            tasksPanel.classList.remove('active')
        }
    })
})

// ///////////////////////////////////////////////////////////////////
// Tasks
// ///////////////////////////////////////////////////////////////////
async function loadTasks() {
    const tasks = await getTasks()
    renderTasks(tasks)
}

function renderTasks(tasks) {
    taskList.innerHTML = ''

    if (tasks.length === 0) {
        emptyTasks.classList.add('show')
    } else {
        emptyTasks.classList.remove('show')
        tasks.forEach(task => {
            if (task.id !== null && task.id !== undefined) {
                const taskEl = document.createElement('span')
                taskEl.className = 'task-item'
                taskEl.setAttribute('data-id', task.id)
                taskEl.textContent = task.task
                taskList.appendChild(taskEl)
            }
        })
    }
}

async function addTask(text) {
    if (!text || text.trim().length === 0) return

    let taskText = text.trim()
    if (taskText.length > 45) taskText = taskText.slice(0, 45) + '...'

    const currentTasks = await getTasks()

    if (currentTasks.length > 20) {
        alert('Too many tasks! Delete some first.')
        return
    }

    const newTask = {
        id: currentTasks.length > 0 ? currentTasks.length + 1 : 0,
        task: taskText
    }

    await setStorage('task-list', [newTask, ...currentTasks])
    await loadTasks()
}

async function deleteTask(id) {
    const currentTasks = await getTasks()
    const newTasks = currentTasks.filter(task => task.id !== id)
    await setStorage('task-list', newTasks)
    await loadTasks()
}

// Task event handlers
addTaskBtn.addEventListener('click', async () => {
    await addTask(taskInput.value)
    taskInput.value = ''
    taskInput.focus()
})

taskInput.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
        await addTask(taskInput.value)
        taskInput.value = ''
    }
})

taskList.addEventListener('click', async (e) => {
    const target = e.target
    if (target.hasAttribute('data-id')) {
        const id = parseInt(target.getAttribute('data-id'))
        await deleteTask(id)
    }
})

// ///////////////////////////////////////////////////////////////////
// Wallpaper
// ///////////////////////////////////////////////////////////////////
async function loadWallpaperState() {
    // Get current preference
    currentPreference = await getStorage('wallpaper-src') || 'bing-wallpaper'
    currentBgIndex = await getStorage('bg_index') || 0

    // Update mode buttons
    modeButtons.forEach(btn => {
        const mode = btn.getAttribute('data-mode')
        btn.classList.toggle('active', mode === currentPreference)
    })

    // Update panels
    updateWallpaperControls()

    // Load Bing data
    await loadBingData()
}

function updateWallpaperControls() {
    if (currentPreference === 'bing-wallpaper') {
        bingControls.classList.remove('hidden')
        customControls.classList.add('hidden')
    } else {
        bingControls.classList.add('hidden')
        customControls.classList.remove('hidden')
    }
}

async function loadBingData() {
    try {
        const res = await fetch('https://peapix.com/bing/feed?country=us', { cache: 'force-cache' })
        bgContent = await res.json()
    } catch (error) {
        console.error('Failed to load Bing data:', error)
        bgContent = []
    }

    updateBingTitle()
}

function updateBingTitle() {
    if (bgContent.length > 0 && bgContent[currentBgIndex]) {
        let title = bgContent[currentBgIndex].title || 'Bing Wallpaper'
        if (title.length > 35) title = title.slice(0, 35) + '...'
        bingTitle.textContent = title
    } else {
        bingTitle.textContent = 'Bing Daily Wallpaper'
    }
}

// Wallpaper mode switching
modeButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
        const mode = btn.getAttribute('data-mode')

        // Update UI
        modeButtons.forEach(b => b.classList.remove('active'))
        btn.classList.add('active')

        // Save preference
        currentPreference = mode
        await setStorage('wallpaper-src', mode)
        updateWallpaperControls()
    })
})

// Wallpaper navigation
prevWallpaperBtn.addEventListener('click', async () => {
    if (bgContent.length === 0) return

    if (currentBgIndex <= 0) {
        currentBgIndex = bgContent.length - 1
    } else {
        currentBgIndex -= 1
    }

    await setStorage('bg_index', currentBgIndex)
    updateBingTitle()
})

nextWallpaperBtn.addEventListener('click', async () => {
    if (bgContent.length === 0) return

    if (currentBgIndex >= bgContent.length - 1) {
        currentBgIndex = 0
    } else {
        currentBgIndex += 1
    }

    await setStorage('bg_index', currentBgIndex)
    updateBingTitle()
})

// Open new tab button
openNewtabBtn.addEventListener('click', () => {
    browser.tabs.create({ url: 'pages/new-tab.html' })
    window.close()
})

// ///////////////////////////////////////////////////////////////////
// Storage Utilities
// ///////////////////////////////////////////////////////////////////
async function getTasks() {
    if (await checkStorage('task-list')) {
        return await getStorage('task-list')
    }
    return []
}

async function checkStorage(key) {
    if (typeof key !== 'string' || key.length < 1) {
        throw "Storage key is empty or invalid"
    }
    const result = await browser.storage.local.get(key)
    return result[key] !== undefined && result[key] !== null
}

async function getStorage(key) {
    if (typeof key !== 'string' || key.length < 1) {
        throw "Storage key is empty or invalid"
    }
    const data = await browser.storage.local.get(key)
    return data[key]
}

async function setStorage(key, value) {
    if (typeof key !== 'string' || key.length < 1) {
        throw "Storage key is empty or invalid"
    }
    await browser.storage.local.set({ [key]: value })
}
