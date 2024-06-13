const time = document.getElementById('time')
let intervalId;

// function update() {
//   let d = new Date()
//   time.innerText = `${d.getHours().toString().length < 2 ? '0' + d.getHours() : d.getHours()}:${d.getMinutes().toString().length < 2 ? '0' + d.getMinutes() : d.getMinutes()}:${d.getSeconds().toString().length < 2 ? '0' + d.getSeconds().toString() : d.getSeconds()}`
// }

document.getElementById('capture-button').addEventListener('click', () => {
  console.log('capture');
});


document.addEventListener('DOMContentLoaded', (event) => {
  // intervalId = setInterval(update, 1000)
  // update()

})
document.addEventListener('beforeunload', () => {
  clearInterval(intervalId)
  console.log('popup unloading, clearing timeout');
})


// ////////////////////////////////////////////////////////////////////////

// Send a massage to backend,
// document.getElementById('to-back-end').onclick = () => {
//   browser.runtime.sendMessage({ from: 'popup', greeting: "hello from popup" }, (response) => {
//     document.getElementById('results-from-back-end').innerText = response.reply
//     // console.log('From popup',response);
//   });
// }

// ////////////////////////////////////////////////////////////////////////

// Listen for messages from the background script
// browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.to === 'popup') {
//     console.log("Message received from background:", message.greeting);
//     sendResponse({ reply: "hello from popup" });
//   }
// });
