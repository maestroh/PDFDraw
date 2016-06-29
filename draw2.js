var drawUtils = (function () {
    var canvas;
    var context;
    var paint = false;
    var points = [];
    const POINT_COUNT = 3;

    function draw(pageX, pageY) {
        if (paint) {
            var x = pageX - canvas.offsetLeft;
            var y = pageY - canvas.offsetTop;
            points.push({ x: x, y: y });

            context.beginPath();
            var originalPoint = points.shift();
            context.moveTo(originalPoint.x, originalPoint.y);

            // by drawing short, overlapping lines, the line can be smooth and transparent
            points.forEach(function(point) {
                context.lineTo(point.x, point.y);
            });
            context.stroke();
            context.closePath();
        }
    }

    function start(pageX, pageY) {
        paint = true;
        var x = pageX - canvas.offsetLeft;
        var y = pageY - canvas.offsetTop;
        points = [];
        for (var i = 0; i < POINT_COUNT; i++) {
            points.push({ x: x, y: y });
        }
    }

    function mouseDownEventHandler(e) { start(e.pageX, e.pageY); }
    function mouseMoveEventHandler(e) { draw(e.pageX, e.pageY); }
    function touchstartEventHandler(e){ start(e.touches[0].pageX, e.touches[0].pageY); }
    function touchMoveEventHandler(e){ draw(e.touches[0].pageX, e.touches[0].pageY); }
    function stopDrawingEventHandler(e) { paint = false; }

    function reset() {
        canvas.removeEventListener('mousedown', setupMouseEvents);
        canvas.removeEventListener('touchstart', setupTouchEvents);
        canvas.removeEventListener('mouseup', stopDrawingEventHandler);
        canvas.removeEventListener('mouseout', stopDrawingEventHandler);
        canvas.removeEventListener('mousemove', mouseMoveEventHandler);
        canvas.removeEventListener('mousedown', mouseDownEventHandler);
        canvas.removeEventListener('touchstart', touchstartEventHandler);
        canvas.removeEventListener('touchmove', touchMoveEventHandler);
        canvas.removeEventListener('touchend', stopDrawingEventHandler);
        canvas.removeEventListener('toucheleave', stopDrawingEventHandler);
    }

    function setupMouseEvents(e) {
        reset();
        canvas.addEventListener('mouseup', stopDrawingEventHandler);
        canvas.addEventListener('mouseout', stopDrawingEventHandler);
        canvas.addEventListener('mousemove', mouseMoveEventHandler);
        canvas.addEventListener('mousedown', mouseDownEventHandler);
        mouseDownEventHandler(e);
    }

    function setupTouchEvents(e) {
        reset();
        canvas.addEventListener('touchstart', touchstartEventHandler);
        canvas.addEventListener('touchmove', touchMoveEventHandler);
        canvas.addEventListener('touchend', stopDrawingEventHandler);
        canvas.addEventListener('toucheleave', stopDrawingEventHandler);
        touchstartEventHandler(e);
    }

    function init(c) {
        canvas = c;
        context = canvas.getContext("2d");
        context.strokeStyle = 'rgba(0, 255, 0, 0.1)'; 
        context.lineJoin = "round";
        context.lineWidth = 10;

        canvas.addEventListener('mousedown', setupMouseEvents);
        canvas.addEventListener('touchstart', setupTouchEvents);
    };

    return { init: init };
});