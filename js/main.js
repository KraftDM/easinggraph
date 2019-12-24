let graphCanvas = document.getElementById('graph-canvas'),
    context  = graphCanvas.getContext('2d'),
    box = document.getElementById('box'),
    duration = document.getElementById('duration'),
    timeVal = 500;

function BezierHandle(x, y) {
    this.x = x;
    this.y = y;
    this.width = 12;
    this.height = 12;
}

BezierHandle.prototype = {
    getSides : function() {
        this.left = this.x - (this.width / 2);
        this.right = this.left + this.width;
        this.top = this.y - (this.height / 2);
        this.bottom = this.top + this.height;
    },
    draw : function() {
        this.getSides();
        context.fillStyle = "#333";
        context.fillRect(this.left, this.top, this.width, this.height);
    }
};

function Graph() {
    this.x = 0;
    this.y = 0;
    this.height = 200;
    this.width = 200;
}

Graph.prototype = {
    draw : function() {
        context.save();
        context.fillStyle = "#fff";
        context.fillRect(this.x, this.y, this.width, this.height);
        context.restore();
    }
};

let handles = [
    new BezierHandle(30, 170),
    new BezierHandle(170, 30)
];

let graph = new Graph();
graphCanvas.onmousedown = event => mousePress(event);

let currentHandle = null;

function mousePress(event){

    let mousePosition = getCanvasMousePos(event),
        x = mousePosition.x,
        y = mousePosition.y;

    for (let i=0; i < handles.length; i++) {
        let curHandle = handles[i];
        if (x >= curHandle.left &&
            x <= curHandle.right &&
            y >= curHandle.top &&
            y <= curHandle.bottom
        ) {
            currentHandle = curHandle;
            graphCanvas.onmousemove = event => moveHandle(event);
            graphCanvas.onmouseup = event => stopMoveHandle(event);
            graphCanvas.onmouseleave = event => stopMoveHandle(event);
        }
    }
}

function getCanvasMousePos(event) {
    let mouseX = event.pageX - event.target.getBoundingClientRect().left,
        mouseY = event.pageY - event.target.getBoundingClientRect().top;

    return { x: mouseX,  y: mouseY };
}

function moveHandle(event) {

    let pos = getCanvasMousePos(event),
        x = pos.x,
        y = pos.y;

    x = x > graph.width ? graph.width : x;
    x = x < 0 ? 0 : x;
    y = x > graph.height ? graph.height : y;
    y = x < 0 ? 0 : y;

    currentHandle.x = x;
    currentHandle.y = y;

    updateDrawing();
}

function stopMoveHandle(event) {
    graphCanvas.onmousemove = null;
}

function updateDrawing() {
    context.clearRect(0, 0 , graphCanvas.width, graphCanvas.height);
    graph.draw();

    let cp1 = handles[0],
        cp2 = handles[1];

    context.save();
    context.strokeStyle = '#4C84D3';
    context.lineWidth = 3;
    context.beginPath();
    context.moveTo(graph.x, graph.y + graph.height);
    context.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, graph.width, graph.y);
    context.stroke();
    context.restore();

    context.strokeStyle = '#f00';
    context.beginPath();
    context.moveTo(graph.x, graph.y + graph.height);
    context.lineTo(cp1.x, cp1.y);
    context.moveTo(graph.width, graph.y);
    context.lineTo(cp2.x, cp2.y);
    context.stroke();

    for (let i=0; i < handles.length; i++) {
        handles[i].draw();
    }
}

updateDrawing();

function setTransition() {

    let cp1 = handles[0],
        cp2 = handles[1];

    let x1 = (cp1.x / graph.width).toFixed(3),
        y1 = ( (graph.height - cp1.y) / graph.height ).toFixed(3),
        x2 = (cp2.x / graph.width).toFixed(3),
        y2 = ( (graph.height - cp2.y) / graph.height ).toFixed(3),

        points = '(' + x1 + ', ' + y1 + ', ' + x2 + ', ' + y2 + ')';

    timeVal = duration.value;

    box.style.WebkitTransition =
        box.style.MozTransition =
            box.style.MsTransition =
                box.style.OTransition =
                    box.style.transition =
                        'all ' + timeVal + 'ms cubic-bezier' + points;
}

let left = document.getElementById('left');
let width = document.getElementById('width');
let height = document.getElementById('height');
let opacity = document.getElementById('opacity');

left.onclick = function (event) {
    setTransition();
    if(!box.classList.contains('left'))
        box.classList.add('left');
    else
        box.classList.remove('left');
};

width.onclick = function (event) {
    setTransition();
    if(!box.classList.contains('width'))
        box.classList.add('width');
    else
        box.classList.remove('width');
};

height.onclick = function (event) {
    setTransition();
    if(!box.classList.contains('height'))
        box.classList.add('height');
    else
        box.classList.remove('height');
};

opacity.onclick = function (event) {
    setTransition();
    if(!box.classList.contains('opacity'))
        box.classList.add('opacity');
    else
        box.classList.remove('opacity');
};