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
    
    function setNativeValue(element, value) {
        let lastValue = element.value;
        element.value = value;
        let event = new Event("input", { target: element, bubbles: true });
        // React 15
        event.simulated = true;
        // React 16
        let tracker = element._valueTracker;
        if (tracker) {
            tracker.setValue(lastValue);
        }
        element.dispatchEvent(event);
    }

    async function waitWithVal(selector, value) {
        const el = await waitForElm(selector);
        if (el) {
            setNativeValue(el, value);
        }
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
