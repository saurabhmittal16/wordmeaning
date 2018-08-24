let button = document.querySelector('#submit'),
    word = document.querySelector('#wordToSearch'),
    meaning = document.querySelector('#meaning'),
    wordToFind = "";
    
chrome.tabs.query({active: true, currentWindow: true}, tabs => {
    chrome.tabs.executeScript(
        tabs[0].id,
        {code: 'window.getSelection().toString();'},
        selection => {
            word.value = selection;
        }
    );
});

function meaningPromise(word) {
    let findMeaning = new Promise(
        function(resolve, reject) {
            let request = new XMLHttpRequest();
            let final = "";
    
            request.open('GET', `http://api.pearson.com/v2/dictionaries/entries?headword=${word}`, true);
            request.onload = () => {
                let content = JSON.parse(request.response);
                if (request.status >= 200 && request.status < 400 && content.total > 0){
                    for(let i=0; i<=10; i++){
                        let temp = String(content.results[i].senses[0].definition); 
                        if (temp.localeCompare("undefined") != 0){
                            if (temp.length > 20){
                                resolve(temp);
                                break;
                            }
                        }
                    }
                } else {
                    reject("No such word found");
                }
            };
            request.send();
        }
    );

    return findMeaning;
}

document.addEventListener('keydown', key => {
    let code = key.keyCode;
    if(code == 13){
        console.log("Enter key pressed");
       button.click(); 
    }
});

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
                } else if (selection[0].length > 0){
                    word.value = selection[0];
                    wordToFind = word.value;
                }
                meaning.innerHTML = "Searching...";
                
                meaningPromise(wordToFind)
                        .then(wordMeaning => {
                            if (wordMeaning.localeCompare("undefined") == 0){
                                meaning.innerHTML = "No such word found";
                            } else {
                                meaning.innerHTML = wordMeaning;
                            }
                        })
                        .catch(error => {
                            meaning.innerHTML = error;
                            let code = key.keyCode;
                            if(code == 13) {
                                console.log("Enter key pressed");
                               button.click();
                            }
                        });
            }
        );
    });
});