(function () {
    const browser = chrome
    console.log(`%cSurfing Extension is running !`, 'color: cyan; font-size:2rem; background:black;', 'Content Script 12',);

    browser.runtime.onMessage.addListener((req, sender, sendResponce) => {
        // console.log("Message received from background:", req.greeting, req.to, req.duty);

        if (req.to === 'content_script' && req?.duty === 'get_color_scheme') {
            console.log('Requesting get_color_scheme');
            let theme = detectColorScheme()
            console.log('theme', theme);
            sendResponce({ color_scheme: theme })
        } else {
            sendResponce({ succsess: true })
        }
    })

    // browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    //     console.log('Content Script 19:', (message))
    //     if (message.action === "c") {
    //     }
    // });
    // console.log('Content Script 25:', 'page load');

    // browser.tabs.onMessage.addListener(async (req, sender, sendResponce) => {
    //     console.log('Requesting get_color_scheme');
    //     if (req?.duty === 'get_color_scheme') {
    //         sendResponce({ color_scheme: await detectColorScheme() })
    //     }
    // })

    // browser.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    //     console.log("Message received from background:", message.greeting);
    //     sendResponse({ reply: "hello from content script" });
    // });






    // ///////////////////////////////////////////////////////////////////
    function detectColorScheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        } else {
            return 'light';
        }
    }

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
        console.log('content_script: color-schema changed');
        browser.runtime.sendMessage({ from: 'content_script', duty: "updateTheme", color_scheme: detectColorScheme() }, (response) => {
            console.log('content_script: Color schema changed reply', response?.reply)
        });
    });


})()






// ///////////////////////////////////////////////////////////////////

// Send a massage to backend,
// browser.runtime.sendMessage({ from: 'content_script', greeting: "hello from content script" }, (response) => {
//     console.log('Content Script: 48, Res: from backend', response.reply);
// });

// ///////////////////////////////////////////////////////////////////

// Listen for messages from the background script
// browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     if (message.to === 'content_script') {
//         console.log("Message received from background:", message.greeting);
//         sendResponse({ reply: "hello from content script" });
//     }
// });