    function waitForElm(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            } else {
                return resolve(null);
            }

            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    resolve(document.querySelector(selector));
                    observer.disconnect();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }
    
    async function waitAndClick(selector) {
        const el = await waitForElm(selector);
        if (el) {el.click();}
    }
    
    async function waitAndFocus(selector) {
        const el = await waitForElm(selector);
        if (el) {el.focus();}
    }
    
    async function waitFocusWithVal(selector, value) {
        const el = await waitForElm(selector);
        if (el) {
            el.focus();
            el.value = value
        }
    }
    
    async function waitClickWithVal(selector, value) {
        const el = await waitForElm(selector);
        if (el) {
            el.click();
            el.value = value
        }
    }
