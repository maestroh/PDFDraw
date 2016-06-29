"use strict";
var drawUtils = (function () {
    var canvas;
    var context;
    //var canvas = document.getElementById('canvas1');
    //var context = canvas.getContext("2d");
    //context.strokeStyle = "#ff0000";
    //context.lineJoin = "round";
    //context.lineWidth = 5;

    var clickX = [];
    var clickY = [];
    var clickDrag = [];
    var paint;

    function clearCanvas() {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    }

    /**
     * Add information where the user clicked at.
     * @param {number} x
     * @param {number} y
     * @return {boolean} dragging
     */
    function addClick(x, y, dragging) {
        clickX.push(x);
        clickY.push(y);
        clickDrag.push(dragging);
    }

    /**
     * Redraw the complete canvas.
     */
    function redraw() {
        // Clears the canvas
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);

        for (var i = 0; i < clickX.length; i += 1) {
            if (!clickDrag[i] && i == 0) {
                context.beginPath();
                context.moveTo(clickX[i], clickY[i]);
                context.stroke();
            } else if (!clickDrag[i] && i > 0) {
                context.closePath();

                context.beginPath();
                context.moveTo(clickX[i], clickY[i]);
                context.stroke();
            } else {
                context.lineTo(clickX[i], clickY[i]);
                context.stroke();
            }
        }
    }

    /**
     * Draw the newly added point.
     * @return {void}
     */
    function drawNew() {
        var i = clickX.length - 1
        if (!clickDrag[i]) {
            if (clickX.length == 0) {
                context.beginPath();
                context.moveTo(clickX[i], clickY[i]);
                context.stroke();
            } else {
                context.closePath();

                context.beginPath();
                context.moveTo(clickX[i], clickY[i]);
                context.stroke();
            }
        } else {
            context.lineTo(clickX[i], clickY[i]);
            context.stroke();
        }
    }

    function mouseDownEventHandler(e) {
        paint = true;
        var x = e.pageX - canvas.offsetLeft;
        var y = e.pageY - canvas.offsetTop;
        if (paint) {
            addClick(x, y, false);
            drawNew();
        }
    }

    function touchstartEventHandler(e) {
        paint = true;
        if (paint) {
            addClick(e.touches[0].pageX - canvas.offsetLeft, e.touches[0].pageY - canvas.offsetTop, false);
            drawNew();
        }
    }

    function stopDrawingEventHandler(e) {
        context.closePath();
        paint = false;
    }

    function mouseMoveEventHandler(e) {
        var x = e.pageX - canvas.offsetLeft;
        var y = e.pageY - canvas.offsetTop;
        if (paint) {
            addClick(x, y, true);
            drawNew();
        }
    }

    function touchMoveEventHandler(e) {
        if (paint) {
            addClick(e.touches[0].pageX - canvas.offsetLeft, e.touches[0].pageY - canvas.offsetTop, true);
            drawNew();
        }
    }

    function setUpHandler(isMouseandNotTouch, detectEvent) {
        removeRaceHandlers();
        if (isMouseandNotTouch) {
            canvas.addEventListener('mouseup', stopDrawingEventHandler);
            canvas.addEventListener('mouseout', stopDrawingEventHandler);
            canvas.addEventListener('mousemove', mouseMoveEventHandler);
            canvas.addEventListener('mousedown', mouseDownEventHandler);
            mouseDownEventHandler(detectEvent);
        } else {
            canvas.addEventListener('touchstart', touchstartEventHandler);
            canvas.addEventListener('touchmove', touchMoveEventHandler);
            canvas.addEventListener('touchend', stopDrawingEventHandler);
            canvas.addEventListener('toucheleave', stopDrawingEventHandler);
            touchstartEventHandler(detectEvent);
        }
    }

    function mouseWins(e) {
        setUpHandler(true, e);
    }

    function touchWins(e) {
        setUpHandler(false, e);
    }

    function removeRaceHandlers() {
        canvas.removeEventListener('mousedown', mouseWins);
        canvas.removeEventListener('touchstart', touchWins);
    }

    function initDraw(c) {
        canvas = c;
        context = canvas.getContext("2d");
        context.strokeStyle = 'rgba(0, 255, 0, 0.02)'; //"#ff0000";
        context.lineJoin = "round";
        context.lineWidth = 5;

        canvas.addEventListener('mousedown', mouseWins);
        canvas.addEventListener('touchstart', touchWins);
    }

    return { init: initDraw };

});
