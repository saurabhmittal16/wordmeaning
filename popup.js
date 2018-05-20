let button = document.querySelector('#submit'),
    word = document.querySelector('#wordToSearch'),
    meaning = document.querySelector('#meaning');

function meaningPromise(word) {
    let findMeaning = new Promise(
        function(resolve, reject) {
            let request = new XMLHttpRequest();
            let final = "";
    
            request.open('GET', `http://api.pearson.com/v2/dictionaries/entries?headword=${word}`, true);
            request.onload = () => {
                let content = JSON.parse(request.response);
                if (request.status >= 200 && request.status < 400){
                    resolve(content.results[0].senses[0].definition);
                    console.log(content.results[0].senses[0].definition);
                } else {
                    reject("No such Word found");
                }
            };
            request.send();
        }
    );

    return findMeaning;
}

let wordToFind = "";

button.addEventListener('click', () => {
    meaning.style.display = 'block';
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
        chrome.tabs.executeScript(
            tabs[0].id,
            {code: 'window.getSelection().toString();'},
            selection => {
                console.log(selection);

                if (word.value.length > 0) {
                    wordToFind = word.value;
                } else if (selection[0].length > 2){
                    word.value = selection[0];
                    wordToFind = word.value;
                }
                meaningPromise(wordToFind)
                        .then(wordMeaning => {
                            meaning.innerHTML = wordMeaning;
                        })
                        .catch(error => {
                            meaning.innerHTML = error;
                        });
            }
        );
    });
});