// @ts-check

const browser = chrome

// ///////////////////////////////////////////////////////////////////
// Events
// ///////////////////////////////////////////////////////////////////

browser.runtime.onInstalled.addListener(async () => {
    console.log('Service Worker installed');
});

// browser.tabs.onActivated.addListener(async (activeInfo) => {
//     // await getColorScheme()
//     await updateTheme()
// })

// browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
//     if (changeInfo.status === 'complete' && tab.status === 'complete' && tab.url) {
//         console.log(`Service Worker: Tab ${tabId} has finished loading: ${tab.url.slice(8, 27)}`);
//     }
//     // await getColorScheme()
//     await updateTheme()
// });

// This one is synchronous,
// wont work otherwise 🥲 JS,
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // Massages from content_scriptjs,
    if (message.from === 'content_script') {
        // @ts-ignore
        const { id, active } = sender.tab
        const activeTabId = active ? id : null
        switch (message.duty) {
            case "updateTheme":
                if (activeTabId !== null) {
                    try {
                        updateTheme(message?.color_scheme)
                        sendResponse({ reply: 'done' })
                    } catch (error) {
                        sendResponse({ reply: error })
                    }
                }
                break;
            // case "new_tab":
            //     console.log('%cNew tab request from content script:', 'font-size: 2.7rem;');
            //     console.log(id, active, activeTabId);
            //     if (activeTabId !== null) {
            //         try {
            //             updateTheme(message?.color_scheme)
            //             sendResponse({ reply: '200' })
            //         } catch (error) {
            //             sendResponse({ reply: error })
            //         }
            //     }
            //     break
            default:
                sendResponse({ reply: '200' })
                break;
        }

        // Massages from home_pagejs,
    } else if (message.from === 'home_page') {
        switch (message.duty) {
            case "updateTheme":
                try {
                    updateTheme(message?.color_scheme)
                    sendResponse({ reply: 'done' })
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
// Functions
// ///////////////////////////////////////////////////////////////////
function getActiveTab() {
    let id = 0
    browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
            let activeTab = tabs[0];
            let activeTabId = activeTab.id;
            console.log("Active Tab ID:", activeTabId);
            // @ts-ignore
            id = activeTabId
        } else {
            console.log("No active tab found.");
        }
    });
    return id
}

async function getColorScheme() {
    let [tab] = await browser.tabs.query({ active: true, currentWindow: true })
    let theme = "dark"
    // @ts-expect-error
    browser.tabs.sendMessage(tab.id, { to: 'content_script', duty: "get_color_scheme" }, async (response) => {
        // theme = await response?.color_scheme
        // if (theme) {
        //     // await updateTheme(theme)
        //     await setStorage('last_color_scheme', theme)
        //     console.log('Color_scheme from SW:', theme);
        // } else {
        //     const last_theme = await getStorage('last_color_scheme')
        //     // await updateTheme(last_theme)
        //     console.log('Color_scheme from SW:', last_theme);
        // }
        if (await response?.color_scheme === 'dark') {
            theme = 'dark'
        } else if (await response?.color_scheme === 'light') {
            theme = 'light'
        } else {
            if (await checkStorage('last_color_scheme')) {
                theme = await getStorage('last_color_scheme')
            }
            console.error('Invalid color_scheme', await response?.color_scheme);
            throw 'Invalid color_scheme'
        }
    });
    return theme
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
        // @ts-ignore
        h /= 6;
    }

    // @ts-ignore
    return [h * 360, s * 100, l * 100];
    // return [h * 360, 50, 50];
}


function getShades(h, s, l, color_scheme) {
    if (color_scheme === 'dark') {
        let lum = Math.trunc(l)
        let sat = Math.trunc(s)
        if (!(lum > 90 || lum < 20)) sat = 75
        return `hsl(${Math.trunc(h)},${sat}%,${12}%)`
    } else {
        return `hsl(${Math.trunc(h)},${20}%,${50}%)`
    }
}

async function captureScreen() {
    let capturing = ""
    try {
        capturing = await browser.tabs.captureVisibleTab()
        return capturing
    } catch (error) {
        console.error(error);
        throw error
        // return ""
    }
}

async function updateTheme(color_scheme_ = "") {
    let color_scheme
    if (color_scheme_ === 'dark' || color_scheme_ === 'light') color_scheme = color_scheme_
    if (typeof color_scheme !== 'string' || color_scheme.length < 4) {
        color_scheme = await getColorScheme()
    }

    console.log('updateTheme(), Color Scheme:', color_scheme);
    if (color_scheme === 'dark' || color_scheme === 'light') {
        try {
            let capturing = await captureScreen()

            console.log('UpdateTheme(), captured:', '🟢');
            // try {
            //     capturing = await browser.tabs.captureVisibleTab()
            // } catch (error) {
            //     console.log(error);
            //     throw error
            // }

            const img = new Image();
            // img.src = response.screenshot;
            img.src = capturing;
            img.onload = async () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                // @ts-ignore
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                // @ts-ignore
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
                let text_color = 'white' // Always use white text for visibility on all backgrounds

                // @ts-ignore
                browser.theme.update({
                    colors: {
                        frame: hslShade,
                        icons: text_color,
                        icons_attention: shade,
                        popup: hslShade,
                        popup_text: text_color,
                        popup_border: shade,
                        popup_highlight_text: text_color,
                        bookmark_text: text_color,
                        toolbar: shade,
                        toolbar_frame: shade,
                        toolbar_field: hslShade,
                        toolbar_field_border_focus: shade,
                        toolbar_field_border: hslShade,
                        toolbar_field_text: text_color,
                        tab_text: text_color,
                        tab_background_text: text_color,
                        tab_background_separator: shade,
                        tab_line: "rgba(255,255,255,0.1)",
                        tab_loading: shade,
                        tab_selected: shade,
                        sidebar: hslShade,
                        sidebar_highlight: text_color,
                        sidebar_highlight_text: shade,
                        sidebar_text: text_color,
                        button_background_active: shade,
                        button_background_hover: shade,
                    }
                })
            }
            await setStorage('last_color_scheme', color_scheme)
        } catch (error) {
            throw error
        }
    }
}


// ///////////////////////////////////////////////////////////////////
// Composables
// ///////////////////////////////////////////////////////////////////
async function checkStorage(key = "") {
    if (typeof key !== 'string' || key.length < 1) {
        throw "Storage key is empty or Invalid key type"
    } else {
        const result = await browser.storage.local.get(key)
        console.log(`Storage checking ${key}:`, result);
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
        console.log(`Storage reading ${key}:`, data, data[key]);
        return data[key]
    }
}
async function setStorage(key = "", value) {
    if (typeof key !== 'string' || key.length < 1) {
        throw "Storage key is empty or Invalid key type"
    } else {
        await browser.storage.local.set({ [key]: value })
        console.log(`Storage saved ${key}:`, value);
    }
}