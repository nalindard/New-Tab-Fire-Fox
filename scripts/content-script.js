(function () {
    const browser = chrome
    console.log(`%cHome Page++ is running !`, 'color: cyan; font-size:2rem; background:black;');
    updateTheme()

    browser.runtime.onMessage.addListener((req, sender, sendResponce) => {
        if (req.to === 'content_script' && req?.duty === 'get_color_scheme') {
            console.log('Requesting get_color_scheme');
            let theme = detectColorScheme()
            console.log('theme', theme);
            sendResponce({ color_scheme: theme })
        } else {
            sendResponce({ succsess: true })
        }
    })

    window.addEventListener('focus', () => {
        console.log('Focusing window: Update theme req:')
        updateTheme()
    })

    function detectColorScheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        } else {
            return 'light';
        }
    }

    function updateTheme() {
        const scheme = detectColorScheme()
        if (scheme === 'dark' || 'light') {
            browser.runtime.sendMessage({ from: 'content_script', duty: 'updateTheme', color_scheme: detectColorScheme() }, (response) => {
                console.log('response', response);
            })
        }
    }

    // window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
    //     console.log('content_script: color-schema changed');
    //     browser.runtime.sendMessage({ from: 'content_script', duty: "updateTheme", color_scheme: detectColorScheme() }, (response) => {
    //         console.log('content_script: Color schema changed reply', response?.reply)
    //     });
    // });
})()

// ///////////////////////////////////////////////////////////////////
// browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
// browser.tabs.onMessage.addListener(async (req, sender, sendResponce) => {