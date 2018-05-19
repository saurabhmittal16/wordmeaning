let button = document.querySelector('#submit'),
    word = document.querySelector('#wordToSearch'),
    meaning = document.querySelector('#meaning');




button.addEventListener('click', () => {
    meaning.style.display = 'block';
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
        chrome.tabs.executeScript(
            tabs[0].id,
            {code: 'window.getSelection().toString();'},
            selection => {
                console.log(selection);

                if (selection[0].length > 2){
                    word.value = selection[0];
                    // meaning.innerHTML = findMeaning(word.value);
                } 
            }
        );
    });
});