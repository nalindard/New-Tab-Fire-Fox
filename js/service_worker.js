// @ts-chec

const browser = chrome

browser.runtime.onInstalled.addListener(async () => {
    console.log('Service Worker installed');
});

browser.tabs.onActivated.addListener(async (activeInfo) => {
    console.log('Service Worker: onActivated');
    await getColorScheme()
    // await updateColors(theme)
})

browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    console.log('Service Worker: onUpdated');

    if (changeInfo.status === 'complete' && tab.status === 'complete' && tab.url) {
        console.log(`Service Worker: 23, Tab ${tabId} has finished loading: ${tab.url.slice(8, 20)}`);
        browser.runtime.sendMessage({ message: "c", data: "Hello from sw! 25" }, (response) => {
            if (chrome.runtime.lastError) {
                // console.error(chrome.runtime.lastError.message);
            } else {
                console.log('Message sent successfully');
            }
        })
    }

    // updateColors(getColorScheme())
    getColorScheme()
});


// (async () => {
//     // Get the current active tab
//     const [tab] = await browser.tabs.query({ active: true, lastFocusedWindow: true });
//     // Send a message to the content script with some data
//     const response = await browser.tabs.sendMessage(tab.id, { message: "c", data: "some data from sw" });
//     // Do something with the response
//     console.log(response);
// })();

// browser.tabs.onUpdated.addListener((tabId, tab) => {
//     // if (tab.url && tab.url.includes('youtube.com/watch')) {
//     //     const queryParameters = tab.url.split('?')[1]
//     //     const urlParameters = new URLSearchParams(queryParameters)

//     browser.tabs.sendMessage(tabId, {
//         type: 'NEW',
//         // params: urlParameters,
//         // videoId: urlParameters.get('v'),
//         data: "lol from Service Worker: 54"
//     })
//     // }
// })

async function setStorage(key = "", value) {
    await browser.storage.local.set({ [key]: value })
    console.log(`${key} saved:`, value);
    // return true
}

async function getStorage(key = "") {
    const data = await browser.storage.local.get(key)
    console.log(`${key} getting 🔥:`, data, data[key]);
    return data[key]
}

function getActiveTab() {
    let id = 0
    browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
            let activeTab = tabs[0];
            let activeTabId = activeTab.id;
            console.log("Active Tab ID:", activeTabId);
            id = activeTabId
        } else {
            console.log("No active tab found.");
        }
    });
    return id
}

async function getColorScheme() {
    let [tab] = await browser.tabs.query({ active: true, currentWindow: true })

    browser.tabs.sendMessage(tab.id, { to: 'content_script', duty: "get_color_scheme" }, async (response) => {
        let theme = await response?.color_scheme
        // console.log('⭐', await getStorage('last_color_scheme'))
        if (theme) {
            updateColors(await theme)
            await setStorage('last_color_scheme', theme)
            console.log('Theme from SW:', await response?.color_scheme);
        } else {
            const last_theme = await getStorage('last_color_scheme')
            updateColors(await last_theme)
            console.log('Theme from SW:', await last_theme);
        }
    });
}

function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }

    return [h * 360, s * 100, l * 100];
    // return [h * 360, 50, 50];
}


function getShades(h, s, l, color_scheme) {
    if (color_scheme === 'dark') {
        let lum = Math.trunc(l)
        let sat = Math.trunc(s)
        if (!(lum > 90 || lum < 20)) sat = 75
        // return `hsl(${Math.trunc(h)},${Math.trunc(s)}%,${Math.trunc(12)}%)`
        return `hsl(${Math.trunc(h)},${sat}%,${12}%)`
    } else {
        return `hsl(${Math.trunc(h)},${20}%,${70}%)`
    }
}

async function updateColors(color_scheme) {
    console.log('Color Scheme to updateColors():', color_scheme);
    if (color_scheme === 'dark' || color_scheme === 'light') {


        let capturing = await browser.tabs.captureVisibleTab()
        const img = new Image();
        // img.src = response.screenshot;
        img.src = capturing;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            let r = 0, g = 0, b = 0;
            for (let i = 0; i < data.length; i += 4) {
                r += data[i];
                g += data[i + 1];
                b += data[i + 2];
            }
            r = Math.floor(r / (data.length / 4));
            g = Math.floor(g / (data.length / 4));
            b = Math.floor(b / (data.length / 4));

            const avgColor = `rgb(${r}, ${g}, ${b})`;
            const avgHSL = rgbToHsl(r, g, b)
            // alert(avgColor)
            const hslShade = getShades(avgHSL[0], avgHSL[1], avgHSL[2], color_scheme)

            console.log('%cavgColor', `background-color:${avgColor};`, avgColor, avgHSL, hslShade);

            let shade = color_scheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.5)'
            let text_color = color_scheme === 'dark' ? 'white' : 'black'
            let dynamic_shade = color_scheme === 'dark' ? hslShade : `rgba(255,255,255,0.99)`

            browser.theme.update({
                colors: {
                    toolbar: hslShade,
                    frame: hslShade,
                    tab_background_text: text_color,
                    tab_text: text_color,
                    // toolbar: text_color,
                    icons: text_color,
                    icons_attention: shade,
                    popup: dynamic_shade,
                    popup_text: text_color,
                    popup_border: shade,
                    popup_highlight_text: text_color,
                    bookmark_text: text_color,
                    button_background_active: hslShade,
                    button_background_hover: hslShade,
                    toolbar: hslShade,
                    // frame: shade,
                    toolbar: shade,
                    toolbar_frame: shade,
                    toolbar_field:  dynamic_shade,
                    toolbar_field_text: text_color,
                    toolbar_field_border_focus: shade,
                    // toolbar_field: text_color,
                    toolbar_field_border: hslShade,
                    toolbar_field_text: text_color,
                    // toolbar_top_separator: text_color,
                    // toolbar_bottom_separator: text_color,
                    // toolbar_vertical_separator: text_color,
                    tab_text: text_color,
                    tab_background_text: text_color,
                    tab_background_separator: shade,
                    tab_line: "rgba(255,255,255,0.1)",
                    tab_loading: shade,
                    tab_selected: shade,
                    sidebar: dynamic_shade,
                    sidebar_highlight: text_color,
                    sidebar_highlight_text: shade,
                    sidebar_text: text_color,
                    button_background_active: shade,
                    button_background_hover: shade,
                }
            })
        }
    }
}


// ///////////////////////////////////////////////////////////////////

browser.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    // Massages from content_scriptjs,
    if (message.from === 'content_script') {
        switch (message.duty) {
            case "updateTheme":
                try {
                    await new Promise((res) => setTimeout(() => {
                        updateColors(message?.color_scheme)
                        sendResponse({ reply: 'done' })
                    }, 0))
                } catch (error) {
                    sendResponse({ reply: error })
                }
                break;

            default:
                sendResponse({ reply: '200' })
                break;
        }
    }

    // Massages from home_pagejs,
    if (message.from === 'home_page') {
        switch (message.duty) {
            case "updateTheme":
                try {
                    await new Promise((res) => setTimeout(() => {
                        updateColors(message?.color_scheme)
                        sendResponse({ reply: 'done' })
                    }, 0))
                } catch (error) {
                    sendResponse({ reply: error })
                }
                break;

            default:
                sendResponse({ reply: '200' })
                break;
        }
    }
});

// ///////////////////////////////////////////////////////////////////

// Send a message to a content script in a specific tab
// browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//     let activeTab = tabs[0];
//     browser.tabs.sendMessage(activeTab.id, { to: 'content_script', greeting: "hello from background" }, (response) => {
//         console.log(response?.reply);
//     });
// });

// Send a message to the popup script
// browser.runtime.sendMessage({ to: 'popup', greeting: "hello from background to popup" }, (response) => {
//     console.log(response?.reply);
// });

// Send a message to the home page
// let tabId = 0
// browser.tabs.sendMessage(tabId, { to: 'home_page', greeting: "hello from background" }, (response) => {
//     console.log(response?.reply);
// });