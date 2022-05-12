'use strict';

var numberInput = document.getElementById('number');
var textInput = document.getElementById('msg');
var button = document.querySelector('#button');
var response = document.querySelector('#response'); // To check non-numeric number '/\D/g'

function sendMessage() {
    var number = numberInput.value.replace(/\D/g, '');
    var text = textInput.value;
    console.log(number);
    fetch('/', {
        method: 'post',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify({
            number: number,
            msg: text,
        }),
    })
        .then(function (res) {
            console.log(res);
        })
        ['catch'](function (error) {
            console.log(error);
        });
}

var socket = io(); //Data Catch from Server

socket.on('smsStatus', function (data) {
    response.innerHTML = '<h5> Text Message Was Sent to + '.concat(data.number, ' </h5>');
});
socket.on('smsStatus');
button.addEventListener('click', sendMessage);
console.log('hello');
