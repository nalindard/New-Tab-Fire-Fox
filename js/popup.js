const time = document.getElementById('time')

document.getElementById('capture-button').addEventListener('click', () => console.log('capture'))
document.addEventListener('DOMContentLoaded', (event) => { })
document.addEventListener('beforeunload', () => console.log('popup unloading, clearing timeout'))
