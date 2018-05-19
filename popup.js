let button = document.querySelector('#submit');

button.addEventListener('click', () => {
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
        chrome.tabs.executeScript(
            tabs[0].id,
            {code: 'let x=window.getSelection().toString(); console.log(x); '}
        );
    });
});