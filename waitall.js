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

    async function valAll(selectors, value) {
        for (let i = 0; i < selectors.length; i++) {
            await waitWithVal(selectors[i], value);
        }
    }

    async function clickAll(selectors) {
        for (let i = 0; i < selectors.length; i++) {
            await waitAndClick(selectors[i]);
        }
    }

    function copyBoard(props) {
        const board = document.querySelector('#mmcopyBoard');

        if (!board) {
            const boardDiv = document.createElement('div');
            boardDiv.id = 'mmcopyBoard';
            boardDiv.style = 'position:relative';
            boardDiv.onmousedown='mydragg.startMoving(this,"mmcopyBoard",event);';
            boardDiv.onmouseup='mydragg.stopMoving("mmcopyBoard");'

            Object.keys(props).forEach((prop) => {
                const button = document.createElement('button');
                button.innerHTML = prop;
                button.style = 'margin:5px;color:blue;';
                button.onclick = function(){
                    copyTextToClipboard(props[prop]);
                };
                boardDiv.appendChild(button);
            });

            document.body.appendChild(boardDiv);
        }
    }

    function copyTextToClipboard(text) {
      var textArea = document.createElement("textarea");

      // Place in the top-left corner of screen regardless of scroll position.
      textArea.style.position = 'fixed';
      textArea.style.top = 0;
      textArea.style.left = 0;

      // Ensure it has a small width and height. Setting to 1px / 1em
      // doesn't work as this gives a negative w/h on some browsers.
      textArea.style.width = '2em';
      textArea.style.height = '2em';

      // We don't need padding, reducing the size if it does flash render.
      textArea.style.padding = 0;

      // Clean up any borders.
      textArea.style.border = 'none';
      textArea.style.outline = 'none';
      textArea.style.boxShadow = 'none';

      // Avoid flash of the white box if rendered for any reason.
      textArea.style.background = 'transparent';


      textArea.value = text;

      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        //console.log('Copying text command was ' + msg);
      } catch (err) {
        //console.log('Oops, unable to copy');
      }

      document.body.removeChild(textArea);
    }

    var mydragg = function() {
      return {
        move: function(divid, xpos, ypos) {
          divid.style.left = xpos + 'px';
          divid.style.top = ypos + 'px';
        },
        startMoving: function(divid, container, evt) {
          evt = evt || window.event;
          var posX = evt.clientX,
            posY = evt.clientY,
            divTop = divid.style.top,
            divLeft = divid.style.left,
            eWi = parseInt(divid.style.width),
            eHe = parseInt(divid.style.height),
            cWi = parseInt(document.getElementById(container).style.width),
            cHe = parseInt(document.getElementById(container).style.height);
          document.getElementById(container).style.cursor = 'move';
          divTop = divTop.replace('px', '');
          divLeft = divLeft.replace('px', '');
          var diffX = posX - divLeft,
            diffY = posY - divTop;
          document.onmousemove = function(evt) {
            evt = evt || window.event;
            var posX = evt.clientX,
              posY = evt.clientY,
              aX = posX - diffX,
              aY = posY - diffY;
            if (aX < 0) aX = 0;
            if (aY < 0) aY = 0;
            if (aX + eWi > cWi) aX = cWi - eWi;
            if (aY + eHe > cHe) aY = cHe - eHe;
            mydragg.move(divid, aX, aY);
          }
        },
        stopMoving: function(container) {
          var a = document.createElement('script');
          document.getElementById(container).style.cursor = 'default';
          document.onmousemove = function() {}
        },
      }
    }();
