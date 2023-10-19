/** @type {HTMLCanvasElement} */

import { Plant } from './flower.js';
// import { Root } from './root.js';


// elements
const clearButton = document.getElementById('clear')

// settings
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx.lineWidth = 0.02;
ctx.globalCompositeOperation = 'lighten';

// vars
let drawing = false;

window.addEventListener('mousemove', (e) => {
    if (drawing) {
        for (let i = 0; i < 3; i++) {
            const root = new Plant(e.x, e.y, ctx);
            root.update();
        }
    }
});

window.addEventListener('mousedown', function (e) {
    drawing = true;
    for (let i = 0; i < 30; i++) {
        const root = new Plant(e.x, e.y, ctx);
        root.update();
    }
})

window.addEventListener('moouseup', function () {
    drawing = false;
})

window.addEventListener('click', function (event) {
    event.preventDefault();
    drawing = false;
})

clearButton.addEventListener('click', function (event) {
    event.preventDefault()
    ctx.clearRect(0, 0, canvas.width, canvas.height);
})