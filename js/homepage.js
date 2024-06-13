let bgContent = []
// let bgIndex = 0
// const browser = chrome
let intervalId;

(async function update() {
    const preference = await getPreferenceWallpaper()
    await updateElementContext(preference)

    if (preference === "user-wallpaper" && await checkSavedWallpaper()) {
        const src = await getSavedWallpaper()
        updateBackground({ fullUrl: src }, "user-wallpaper")
    }
    else {
        let data = await fetchBingImages()
        bgContent = [...data]
        let bgIndex = await getBgIndex()
        updateBackground(bgContent[bgIndex], 'bing-wallpaper')
    }
    // getTime()
    setClock()

    // intervalId = setInterval(() => {
    //     getTime()
    // }, 1000);
    setTimeout(() => {
        setGreet()
    }, 0);

    // console.log(await getPreferenceWallpaper())
    updateTopsite()
})()
// update()

// Laving to the window,
window.addEventListener('blur', () => {
    clearInterval(intervalId)
})
// Coming to the window,
window.addEventListener('focus', () => {
    setClock()
    updateTheme()
    setTimeout(() => {
        setGreet()
    }, 0);
})

function setGreet() {
    const greets = {
        EarlyMorning: ["Rise and shine ☀️",
            "New day, new opportunities 🌅",
            "Early bird gets the worm 🐦",
            "Good morning sunshine 🌞",
            "Start your day with a smile 😊",
            "Embrace the morning calm 🌄",
            "Early riser vibes 🌇",
            "Morning glory 🌼",
            "Hello, world! 🌍",
            "Sunrise serenity 🌤️",
        ],
        Morning: ["Lovely day ahead 🔆",
            "Morning magic ✨",
            "Rise and grind 💪",
            "Hello, beautiful world 🌺",
            "Morning bliss 🌸",
            "Coffee and sunshine ☕☀️",
            "Good vibes only 🌈",
            "Make today amazing 🌟",
            "Blessed morning 🙏",
            "Sunshine on my mind 🌻",
        ],
        Afternoon: ["Enjoy your lunch break 🍴",
            "Afternoon delight 🌼",
            "Halfway there! 🎉",
            "Sunny afternoon vibes 🌞",
            "Stay positive and productive 🌟",
            "Fuel up for the rest of the day 🍲",
            "Keep shining bright ☀️",
            "Productivity mode on 💼",
            "Afternoon energy boost ⚡",
            "Make the most of this afternoon 🌺",
        ],
        Evening: ["Chill time begins 🌆",
            "Evening tranquility 🌙",
            "Relax and unwind 🍵",
            "Sunset serenade 🌅",
            "Evening breeze 🌬️",
            "Time to wind down 🌄",
            "Evening glow 🌟",
            "Peaceful evening vibes 🕊️",
            "Cozy evening ahead 🕯️",
            "Evening bliss 🌌",
        ],
        Night: ["Nighttime tranquility 🌜",
            "Stars shining bright ✨",
            "Good night, sleep tight 🌠",
            "Dreamland awaits 🌙",
            "Nighttime serenity 🌃",
            "Rest and recharge 💤",
            "Twinkling stars above 🌟",
            "Peaceful night vibes 🌌",
            "Sweet dreams ahead 🌠",
            "Nighttime magic 🌌",
        ],
        LateNight: ["Late night musings 🌃",
            "Still up? 🌙",
            "Night owl mode 🦉",
            "Quiet night thoughts 🌌",
            "Late night ponderings 🌠",
            "Embracing the silence 🌃",
            "Nighttime reflections 🌜",
            "Late night tranquility 🌌",
            "Stars whispering secrets 🌟",
            "Peaceful late night 🌠",
        ],
    }


    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const time = hours * 60 + minutes; // Convert current time to minutes since midnight

    let greet
    let randomPick = Math.floor(Math.random() * 10)

    if (time >= 0 && time < 240) {
        greet = greets.LateNight[randomPick];
    } else if (time >= 1140 || time < 1) {
        greet = greets.Night[randomPick];
    } else if (time >= 1020 && time < 1140) {
        greet = greets.Evening[randomPick];
    } else if (time >= 720 && time < 1020) {
        greet = greets.Afternoon[randomPick];
    } else if (time >= 420 && time < 720) {
        greet = greets.Morning[randomPick];
    } else if (time >= 240 && time < 420) {
        greet = greets.EarlyMorning[randomPick];
    }

    document.getElementById('greetings-msg').innerText = greet
}

async function fetchBingImages() {
    try {
        let res = await fetch('https://peapix.com/bing/feed?country=us', { cache: 'force-cache', })
        let data = await res.json()
        // console.log(data);
        return data
    } catch (error) {
        return [
            {
                "title": "Southern gemsbok in the savanna, Botswana",
                "copyright": "© Karine Aigner/Tandem Stills + Motio",
                "fullUrl": "https://img.peapix.com/a6dbf45453704258a32aa6bf4a833735_1080.jpg",
                "thumbUrl": "https://img.peapix.com/a6dbf45453704258a32aa6bf4a833735_480.jpg",
                "imageUrl": "https://img.peapix.com/a6dbf45453704258a32aa6bf4a833735.jpg",
                "date": "2024-06-11",
                "pageUrl": "https://peapix.com/bing/47682"
            },
            {
                "title": "Osaka at night, Japan",
                "copyright": "© wichianduangsri/Getty Image",
                "fullUrl": "https://img.peapix.com/effea940477c434da4080efccc1b11f8_1080.jpg",
                "thumbUrl": "https://img.peapix.com/effea940477c434da4080efccc1b11f8_480.jpg",
                "imageUrl": "https://img.peapix.com/effea940477c434da4080efccc1b11f8.jpg",
                "date": "2024-06-10",
                "pageUrl": "https://peapix.com/bing/47670"
            },
            {
                "title": "Bardenas Reales Biosphere Reserve and Natural Park, Bardenas, Navarra, Spain",
                "copyright": "© Aliaume Chapelle/Tandem Stills + Motio",
                "fullUrl": "https://img.peapix.com/1d31f95d42c240ae8aa7a6649957af52_1080.jpg",
                "thumbUrl": "https://img.peapix.com/1d31f95d42c240ae8aa7a6649957af52_480.jpg",
                "imageUrl": "https://img.peapix.com/1d31f95d42c240ae8aa7a6649957af52.jpg",
                "date": "2024-06-09",
                "pageUrl": "https://peapix.com/bing/47658"
            },
            {
                "title": "Confluence of Easter Creek and Killik River, Gates of the Arctic National Park, Alaska",
                "copyright": "© Patrick J. Endres/Getty Image",
                "fullUrl": "https://img.peapix.com/507ed4b49ae748fdb036ef9b1d16b6ac_1080.jpg",
                "thumbUrl": "https://img.peapix.com/507ed4b49ae748fdb036ef9b1d16b6ac_480.jpg",
                "imageUrl": "https://img.peapix.com/507ed4b49ae748fdb036ef9b1d16b6ac.jpg",
                "date": "2024-06-08",
                "pageUrl": "https://peapix.com/bing/47646"
            },
            {
                "title": "Family of humpback whales, Dutch Harbor, Alaska",
                "copyright": "© Jude Newkirk/Amazing Aerial Agenc",
                "fullUrl": "https://img.peapix.com/e5b033a9fe504bea91af4f934269efbc_1080.jpg",
                "thumbUrl": "https://img.peapix.com/e5b033a9fe504bea91af4f934269efbc_480.jpg",
                "imageUrl": "https://img.peapix.com/e5b033a9fe504bea91af4f934269efbc.jpg",
                "date": "2024-06-07",
                "pageUrl": "https://peapix.com/bing/47634"
            },
            {
                "title": "Les Braves monument on Omaha Beach, Normandy, France",
                "copyright": "© Christopher Furlong/Getty Image",
                "fullUrl": "https://img.peapix.com/9ef9d292c3c34502b003ff9f05672f9a_1080.jpg",
                "thumbUrl": "https://img.peapix.com/9ef9d292c3c34502b003ff9f05672f9a_480.jpg",
                "imageUrl": "https://img.peapix.com/9ef9d292c3c34502b003ff9f05672f9a.jpg",
                "date": "2024-06-06",
                "pageUrl": "https://peapix.com/bing/47622"
            },
            {
                "title": "Masoala National Park in Madagascar",
                "copyright": "© Dennis van de Water/Shutterstoc",
                "fullUrl": "https://img.peapix.com/0b9b60124f70407091c87b8dcd4337ae_1080.jpg",
                "thumbUrl": "https://img.peapix.com/0b9b60124f70407091c87b8dcd4337ae_480.jpg",
                "imageUrl": "https://img.peapix.com/0b9b60124f70407091c87b8dcd4337ae.jpg",
                "date": "2024-06-05",
                "pageUrl": "https://peapix.com/bing/47610"
            }
        ]
    }
}

function setClock() {
    const d = new Date();
    const msUntilNextMinute = (60 - d.getSeconds()) * 1000 - d.getMilliseconds();
    const { time, day } = getTime()
    document.getElementById('time-time').innerText = time;
    document.getElementById('time-day').innerText = day

    setTimeout(() => {
        intervalId = setInterval(() => {
            const { time, day } = getTime()
            document.getElementById('time-time').innerText = time;
            document.getElementById('time-day').innerText = day
        }, 60000);
    }, msUntilNextMinute);
}

function getTime() {
    const d = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const hours = d.getHours() > 12 ? d.getHours() - 12 : d.getHours();
    const ampm = d.getHours() >= 12 ? 'PM' : 'AM';

    const day = days[d.getDay()];
    const date = d.getDate();
    const month = months[d.getMonth()];

    return {
        time: `${hours.toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}${ampm}`,
        day: `${day} ${date}, ${month}`
    }
}

async function setBgIndex(bgIndex) {
    if (typeof bgIndex === 'number') {
        await browser.storage.local.set({ ['bg_index']: bgIndex });
    }
}

async function getBgIndex() {
    const result = await browser.storage.local.get('bg_index')
    console.log('Bg index getting:', await result['bg_index']);
    if (!result['bg_index'] && (typeof await result['bg_index'] !== 'number')) {
        // if (typeof result['bg_index'] !== 'number') {
        await setBgIndex(0)
        // }
        return 0
    } else {
        return await result['bg_index']
    }
}

function updateBackground(data, preference) {
    const img = new Image();
    img.src = data?.fullUrl;

    img.onload = function () {
        console.log('Background image loaded successfully');
        document.body.style.background = `url('${data?.fullUrl}')`
        updateTheme()
    };
    img.onerror = function () {
        console.log('Failed to load background image');
        document.body.style.background = `linear-gradient(129deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%);`
    };

    if (preference && preference === 'bing-wallpaper') {
        // document.body.style.background = `url('${data?.fullUrl}')`
        let title = data?.title

        if (typeof title === 'string' && title.length > 25) title = title.slice(0, 25) + '...'

        document.querySelector('.title').innerText = title
        document.querySelector('.copyright').innerText = data?.copyright
        document.querySelector('.date').innerText = data?.date
        document.querySelector('.download').setAttribute('href', data?.fullUrl)
        document.querySelector('.download').setAttribute('download', `${data?.title}.jpg`)
        document.querySelector('.download-4k').setAttribute('href', data?.imageUrl)
        document.querySelector('.download-4k').setAttribute('download', `${data?.title}-4K.jpg`)
    }
}

async function updateElementContext(src) {
    if (src === 'user-wallpaper') {
        document.getElementById("bg-controll").style.visibility = 'hidden' // Pre, next buttons -> container
        document.getElementById("bg-controll").style.position = 'absolute' // Pre, next buttons -> container
        document.getElementById("bg-data").style.visibility = 'hidden' // Copyright data,
        document.getElementById("userImage-container").style.visibility = 'visible' // Wallpaper input container,
        document.getElementById("userImage-container").style.position = 'static' // Wallpaper input container,
        document.getElementById("pre-img").disabled = true // Pre, next buttons, -> pre
        document.getElementById("nxt-img").disabled = true // Pre, next buttons, -> next
        document.getElementById("user-wallpaper").checked = true // radio
    } else if (src === 'bing-wallpaper') {
        document.getElementById("bg-controll").style.visibility = 'visible'
        document.getElementById("bg-controll").style.position = 'static'
        document.getElementById("bg-data").style.visibility = 'visible'
        document.getElementById("userImage-container").style.visibility = 'hidden'
        document.getElementById("userImage-container").style.position = 'absolute'
        document.getElementById("pre-img").disabled = false
        document.getElementById("nxt-img").disabled = false
        document.getElementById("bing-wallpaper").checked = true
    }
}

// chrome.storage.local.set({ key: value }).then(() => {
//     console.log("Value is set");
//   });

//   chrome.storage.local.get(["key"]).then((result) => {
//     console.log("Value currently is " + result.key);
//   });

// -----------------------------------------------------------
document.getElementById('pre-img').onclick = async () => {
    if (await getPreferenceWallpaper() !== 'bing-wallpaper') {
        // console.log('Malicious input, reject');
        return
    }
    let bgIndex = await getBgIndex()
    if (await bgIndex <= 0) {
        bgIndex = (bgContent.length - 1)
    } else {
        bgIndex -= 1
    }
    await setBgIndex(bgIndex)
    updateBackground(bgContent[bgIndex], 'bing-wallpaper')
}

document.getElementById('nxt-img').onclick = async () => {
    if (await getPreferenceWallpaper() !== 'bing-wallpaper') {
        // console.log('Malicious input, reject');
        return
    }
    let bgIndex = await getBgIndex()
    if (await bgIndex >= (bgContent.length - 1)) {
        bgIndex = 0
    } else {
        bgIndex += 1
    }
    await setBgIndex(bgIndex)
    updateBackground(bgContent[bgIndex], 'bing-wallpaper')
}

document.getElementById('search').onchange = async (e) => {
    // console.log(e.target.value);
    // await chrome.search?.query({ text: e.target.value, disposition: "NEW_TAB" }, (d) => { console.log(d); })
    await chrome.search?.query({ text: e.target.value }, (d) => { console.log(d); })
}


document.getElementById('bm-btn').onclick = async () => {
    chrome.bookmarks?.getTree((d) => console.log(d))
}


// document.getElementById('topsites-btn').onclick = updateTopsite

async function updateTopsite() {
    // document.getElementById('topsites-btn').onclick = async () => {
    const sites = await browser.topSites.get()
    const list = sites.map(site => {
        const url = new URL(site.url)
        let title = url.host.indexOf('.') == url.host.lastIndexOf('.') ? url.host.slice(url.host.indexOf('//') + 1, url.host.lastIndexOf('.')) : url.host.slice(url.host.indexOf('.') + 1, url.host.lastIndexOf('.'))
        // let favicon = new URL("/favicon.ico", site.url).href
        // let favicon = `https://www.google.com/s2/favicons?sz=64&domain_url=${url.host}`
        let favicon = `https://favicone.com/${url.host}?s=100`
        // https://favicone.com/nalindard.github.io?s=100

        return {
            url: url.href,
            host: url.host,
            title: title,
            favicon: favicon,
        }

    })
    // console.log(list);
    // document.getElementById('topsites-list').innerText = list

    let filterd_list = list.filter(tile => !(tile.url.includes('localhost') || tile.url.includes('127.0.0.1')))

    const tilesLimit = 7

    if (filterd_list.length > tilesLimit) {
        filterd_list = filterd_list.slice(0, tilesLimit)
    }

    filterd_list.forEach(tile => {
        // console.log(tile);
        document.getElementById('topsites-list').innerHTML += `
            <a href="${tile.url}" rel="noopener noreferrer">
                <span class="tile">
                    <span class="tile-image-container">
                        <img width="48" height="48" src="${tile.favicon}" alt="" class="tile-favicon-img">
                    </span>
                    <p class="tile-title">${tile.title}</p> 
                    <!-- ${tile.title}-->
                </span>
            </a>
            `

    })
    faviconLoadFails()
}

function faviconLoadFails() {
    let icons = [...document.querySelectorAll('.tile-favicon-img')]
    icons.forEach(icon => {
        icon.onerror = () => {
            icon.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 16 16'%3E%3Cpath fill='%23f0f0f0' class='favicon-fallback' d='M13.384 3.408c.535.276 1.22 1.152 1.556 1.963a8 8 0 0 1 .503 3.897l-.009.077l-.026.224A7.758 7.758 0 0 1 .006 8.257v-.04q.025-.545.114-1.082c.01-.074.075-.42.09-.489l.01-.051a6.6 6.6 0 0 1 1.041-2.35q.327-.465.725-.87q.35-.358.758-.65a1.5 1.5 0 0 1 .26-.137c-.018.268-.04 1.553.268 1.943h.003a5.7 5.7 0 0 1 1.868-1.443a3.6 3.6 0 0 0 .021 1.896q.105.07.2.152c.107.09.226.207.454.433l.068.066l.009.009a2 2 0 0 0 .213.18c.383.287.943.563 1.306.741c.201.1.342.168.359.193l.004.008c-.012.193-.695.858-.933.858c-2.206 0-2.564 1.335-2.564 1.335c.087.997.714 1.839 1.517 2.357a4 4 0 0 0 .439.241q.114.05.228.094c.325.115.665.18 1.01.194c3.043.143 4.155-2.804 3.129-4.745v-.001a3 3 0 0 0-.731-.9a3 3 0 0 0-.571-.37l-.003-.002a2.68 2.68 0 0 1 1.87.454a3.92 3.92 0 0 0-3.396-1.983q-.116.001-.23.01l-.042.003V4.31h-.002a4 4 0 0 0-.8.14a7 7 0 0 0-.333-.314a2 2 0 0 0-.2-.152a4 4 0 0 1-.088-.383a5 5 0 0 1 1.352-.289l.05-.003c.052-.004.125-.01.205-.012C7.996 2.212 8.733.843 10.17.002l-.003.005l.003-.001l.002-.002h.002l.002-.002h.015a.02.02 0 0 1 .012.007a2.4 2.4 0 0 0 .206.48q.09.153.183.297c.49.774 1.023 1.379 1.543 1.968c.771.874 1.512 1.715 2.036 3.02l-.001-.013a8 8 0 0 0-.786-2.353'/%3E%3C/svg%3E"
        }
    })
}

function detectColorScheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    } else {
        return 'light';
    }
}

function updateTheme() {
    browser.runtime.sendMessage({ from: 'home_page', duty: "updateTheme", color_scheme: detectColorScheme() }, async (response) => {
        console.log('Update theme response:', response);
    });
}

// ///////////////////////////////////////////////////////////////////

// Input Wallpaper,
document.getElementById('userImage').onchange = (e) => {
    if (e.target.files && e.target.files[0]) {

        updateElementContext('user-wallpaper')

        const file = e.target.files[0];
        console.log(file);
        const src = URL.createObjectURL(file)
        document.body.style.background = `url('${src}')`

        const reader = new FileReader()
        reader.readAsArrayBuffer(file);

        reader.onload = async (e) => {
            console.log('reader loads');
            const arrayBuffer = e.target.result;
            const blob = new Blob([arrayBuffer], { type: file.type });

            // Create a unique key for the image
            // const imageKey = 'userImage_' + new Date.now()

            // Convert Blob to ArrayBuffer for storage
            // blob.arrayBuffer().then(buffer => {
            //     const imageData = new Uint8Array(buffer);
            //     // chrome.storage.local.set({ [imageKey]: imageData }, () => {
            //     //     console.log('Image saved in storage as Blob');
            //     // });
            //     console.log(imageData);
            // });
            const buffer = await blob.arrayBuffer()
            const imageData = new Uint8Array(buffer);
            // await browser.storage.local.set({ ['userImage']: imageData }, () => {
            //     console.log('Image saved in storage as Blob');
            // });
            await browser.storage.local.set({ ['userImage']: imageData });
            console.log(imageData);
        };
    }

    updateTheme()
}

// Get Wallpaper,
async function getSavedWallpaper() {
    const result = await browser.storage.local.get('userImage')
    // if (result['userImage']) {
    console.log('loading saved image');
    const data = new Uint8Array(result['userImage'])
    const blob = new Blob([data])
    const srcUrl = URL.createObjectURL(blob)
    console.log('saved url', srcUrl);
    return srcUrl
    // }
}

// Check Saved Wallpaper,
async function checkSavedWallpaper() {
    const result = await browser.storage.local.get('userImage')
    if (await result['userImage']) {
        return true
    } else {
        return false
    }
}

// Update wallpaper preferences,
async function updatePreferenceWallpaper(src) {
    // await browser.storage.local.set({ ['wallpaper-src']: src }, () => {
    //     console.log('wallpaper src set to:', src);
    // });
    await browser.storage.local.set({ ['wallpaper-src']: src });
}
// Get wallpaper preferences,
async function getPreferenceWallpaper() {
    const result = await browser.storage.local.get('wallpaper-src')
    console.log('Wallpaper src getting:', await result['wallpaper-src']);
    if (!result['wallpaper-src']) return 'bing-wallpaper'
    return await result['wallpaper-src']
}


// document.getElementById('inputImage').addEventListener('click', (e) => {
//     const input = document.getElementById('userImage');
//     if (input.files && input.files[0]) {
//         const file = input.files[0];

//         console.log(file);

//         const src = URL.createObjectURL(file)
//         document.body.style.background = `url('${src}')`


//         const reader = new FileReader();

//         reader.onload = function (e) {
//             const arrayBuffer = e.target.result;
//             const blob = new Blob([arrayBuffer], { type: file.type });

//             // Create a unique key for the image
//             const imageKey = 'userImage_' + Date.now();

//             // Convert Blob to ArrayBuffer for storage
//             blob.arrayBuffer().then(buffer => {
//                 const imageData = new Uint8Array(buffer);
//                 // chrome.storage.local.set({ [imageKey]: imageData }, () => {
//                 //     console.log('Image saved in storage as Blob');
//                 // });
//                 console.log(image, imageData);
//             });
//         };

//         reader.readAsArrayBuffer(file); // Read the file as an ArrayBuffer
//     }
// });

// Function to retrieve and display the stored image
// function loadImage(imageKey) {
//     chrome.storage.local.get(imageKey, (result) => {
//         if (result[imageKey]) {
//             const imageData = new Uint8Array(result[imageKey]);
//             const blob = new Blob([imageData]);

//             const img = document.createElement('img');
//             img.src = URL.createObjectURL(blob);
//             document.body.appendChild(img);
//         } else {
//             console.log('No image found for key:', imageKey);
//         }
//     });
// }

// Example usage:
// const imageKey = 'userImage_1234567890'; // Replace with the actual key used during saving
// loadImage(imageKey);

// Wallpaper src change,
document.getElementById('inputImage').onclick = async (e) => {
    if (e.target?.id === 'user-wallpaper') {
        await updateElementContext('user-wallpaper')
        const src = await getSavedWallpaper()
        updateBackground({ fullUrl: src }, "user-wallpaper")
        updatePreferenceWallpaper('user-wallpaper')
    } else if (e.target?.id === 'bing-wallpaper') {
        await updateElementContext('bing-wallpaper')
        let data = await fetchBingImages()
        let bgIndex = await getBgIndex()
        bgContent = [...data]
        updateBackground(bgContent[bgIndex], "user-wallpaper")
        updatePreferenceWallpaper('bing-wallpaper')
    }
}

// ///////////////////////////////////////////////////////////////////

// ///////////////////////////////////////////////////////////////////
document.getElementById('sidebar-btn').onclick = async (e) => {
    // console.log('Sidebar btn click', e);
    document.getElementById('sidebar').classList.toggle('show-sidebar')
    document.getElementById('sidebar').classList.toggle('hide-sidebar')
    document.getElementById('sidebar-btn').classList.toggle('sidebar-btn-default')
    document.getElementById('sidebar-btn').classList.toggle('sidebar-btn-rotate')
    await renderTask()
}

// ///////////////////////////////////////////////////////////////////
document.getElementById('save-task-btn').onclick = async () => {
    let text = document.getElementById('task-text').value
    if (typeof text === 'string' && text.length > 0) addTask(text)
}

document.getElementById('task-list').onclick = async (e) => {
    if (e.target.getAttribute('data-id')) await deleteTask(parseInt(e.target.getAttribute('data-id')))
}

async function addTask(text) {
    if (text.length > 20) text = text.slice(0, 45) + '...'

    const currentTaskList = await getTasks()

    if (await currentTaskList.length > 20) {
        alert('Too many items')
        throw "Too many items"
    }

    // if (await checkStorage('task-list')) {
    if (await currentTaskList.length > 0) {
        // const currentTaskList = await getStorage('task-list')
        console.log(currentTaskList, text);
        await setStorage('task-list', [{ id: currentTaskList.length + 1, task: text }, ...currentTaskList])
        await renderTask()

    } else {
        console.log(text);
        await setStorage('task-list', [{ id: 0, task: text }])
        await renderTask()
    }
}
async function deleteTask(id) {
    if (typeof id !== 'number') throw "Parameter Id must be a number"
    const currentTaskList = await getTasks()
    if (await currentTaskList.length > 0) {
        const newTaskList = await currentTaskList.filter(task => task.id !== id)
        console.log('Deleted task:', id, newTaskList);
        console.log('new Task List', await newTaskList);
        await setStorage('task-list', await newTaskList)
    }
    await renderTask()
}

async function getTasks() {
    if (await checkStorage('task-list')) {
        const currentTaskList = await getStorage('task-list')
        return await currentTaskList
    } else {
        return []
    }
}
async function renderTask() {
    const currentTaskList = await getTasks()
    document.getElementById('task-list').innerHTML = ''
    if (await currentTaskList.length > 0) {
        currentTaskList.forEach(task => {
            if (task.id !== null || task.id !== undefined) {
                document.getElementById('task-list').innerHTML += `<span data-id='${task.id}' class='task-item'>${task.task}</span>`
            }
        })

    }
}

// ///////////////////////////////////////////////////////////////////

async function checkStorage(key = "") {
    if (typeof key !== 'string' || key.length < 1) {
        throw "Storage key is empty or Invalid key type"
    } else {
        const result = await browser.storage.local.get(key)
        if (await result[key]) {
            return true
        } else {
            return false
        }
    }
}
async function getStorage(key = "") {
    if (typeof key !== 'string' || key.length < 1) {
        throw "Storage key is empty or Invalid key type"
    } else {
        const data = await browser.storage.local.get(key)
        // console.log(`${key} getting 🔥:`, data, data[key]);
        return data[key]
    }
}
async function setStorage(key = "", value) {
    if (typeof key !== 'string' || key.length < 1) {
        throw "Storage key is empty or Invalid key type"
    } else {
        await browser.storage.local.set({ [key]: value })
        // console.log(`${key} saved:`, value);
        // await browser.storage.local.set({ ['wallpaper-src']: src }, () => {
        //     console.log('wallpaper src set to:', src);
        // });
    }
}



// ///////////////////////////////////////////////////////////////////


// Send a massage to backend,
// document.getElementById('to-back-end').onclick = () => {
//     browser.runtime.sendMessage({ from: 'home_page', greeting: "hello from homepage" }, (response) => {
//         document.getElementById('results-from-back-end').innerText = response.reply
//     });
// }

// Listen for messages from the background script
// browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     if (message.to === "home_page") {
//         console.log("Message received from background:", message.greeting);
//         sendResponse({ reply: "hello from homepage" });
//     }
// });