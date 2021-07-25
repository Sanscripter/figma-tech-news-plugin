//vars
const generateNewsreelButton = document.querySelector('#generateNewsreel');
const cancelButton = document.querySelector('#cancel');
const shapeMenu = document.querySelector('#shape');
const countInput = document.querySelector('#count');

//on load function
document.addEventListener("DOMContentLoaded", function () {
    formValidation();
});

//initialize select menu
selectMenu.init();



//form validation
var formValidation = function (event) {

    // if (shapeMenu.value === '' || countInput.value === '') {
    //     createShapesButton.disabled = true;
    // } else {
    //     createShapesButton.disabled = false;
    // }
}

//event listeners
// countInput.oninput = () => { formValidation(); }
// shapeMenu.onchange = () => { formValidation(); }
generateNewsreelButton.onclick = () => { generateNewsreel(); }
cancelButton.onclick = () => { cancel(); }

//functions
function generateNewsreel() {
    // const text = document.querySelector('#text_space');
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
                // JSON.stringify(json)

                parent.postMessage({
                    pluginMessage: {
                        'type': 'news-fetched',
                        'response': json
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