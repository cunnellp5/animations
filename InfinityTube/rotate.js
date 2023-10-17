console.log('test')

const cursor = document.querySelector('body')
const element = document.getElementById('center-pixel')

console.log(cursor.offset, 'cuur')

addEventListener("mousemove", (event) => {
    // cursor.toggle(event.target(cursor));
    cursor.style
    cursor.style({
        '--x': event.pageX + 'px',
        '--y': event.pageY + 'px',
        '--r': calculateRotate(cursor, element) + 20 + 'deg'
    });
});

// document.on('mousemove', e => {
// });

// container.on('mouseleave', e => {
//    cursor.hide(); 
// });

function calculateRotate(cursor, to) {
        center = {
            x: cursor.offsetLeft + cursor.offsetWidth / 2,
            y: cursor.offsetTop + cursor.offsetHeight / 2
        },
        toCenter = {
            x: to.offsetLeft + to.offsetWidth / 2,
            y: to.offsetTop + to.offsetHeight / 2
        },
        radians = Math.atan2(toCenter.x - center.x, toCenter.y - center.y),
        degree = (radians * (180 / Math.PI) * -1) + 180;
    return degree;
}

element.click(e => {
    return false;
})