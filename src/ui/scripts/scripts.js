//vars
const generateNewsreelButton = document.querySelector('#generateNewsreel');
const cancelButton = document.querySelector('#cancel');

//initialize select menu
selectMenu.init();

generateNewsreelButton.onclick = () => { generateNewsreel(); }
cancelButton.onclick = () => { cancel(); }

//functions
function generateNewsreel() {
    fetch('https://fanicorn.api.stdlib.com/gm-tech-news@1.0.0/news/',
        {
            method: 'GET',
            headers: {
                Accept: 'application/json',
            },

        }
    )
        .then((res) => {
            res.json().then(json => {
                parent.postMessage({
                    pluginMessage: {
                        'type': 'news-fetched',
                        'news': json
                    }
                }, '*');
            });
        })
}

function cancel() {
    parent.postMessage({ pluginMessage: { 'type': 'cancel' } }, '*')
}

(() => {
    generateNewsreel();
})()