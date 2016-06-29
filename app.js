var pdfUtils = (function () {
    var _pdf;

    function load(name, cb) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://localhost:8080/file?file=' + name, true);
        xhr.responseType = 'arraybuffer';

        xhr.onload = function (e) {
            if (this.status == 200) {
                // get binary data as a response
                PDFJS.getDocument(new Uint8Array(this.response)).then(function (pdf) {
                    _pdf = pdf;
                    cb();
                });
            }
        };
        xhr.send();
    };

    function render(pageNumber) {
        if (pageNumber <= _pdf.numPages) {
            _pdf.getPage(pageNumber).then(function (page) {
                var scale = 1.5;
                var viewport = page.getViewport(scale);
                var container = document.getElementById('container');
                var canvas = document.createElement('canvas');
                canvas.id = 'canvas' + pageNumber;
                container.appendChild(canvas);

                var context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                var renderContext = {
                    canvasContext: context,
                    viewport: viewport
                };
                page.render(renderContext);

                drawUtils().init(canvas);
                render(pageNumber + 1);
            });
        }
    }

    // recombine all of the pages back into one canvas for saving
    function combineCanvases(canvas, pageNumber) {
        if (!pageNumber) pageNumber = 1;
        var newCanvas;
        if (pageNumber <= _pdf.numPages) {
            var currentCanvas = document.getElementById('canvas' + pageNumber);
            newCanvas = document.createElement('canvas');
            var context = newCanvas.getContext('2d');

            if (canvas) {
                // set the larger width
                newCanvas.width = currentCanvas.width > canvas.width ? currentCanvas.width : canvas.width;
                // increase the height of the combined canvas to account for new page
                newCanvas.height = canvas.height + currentCanvas.height;

                context.drawImage(canvas, 0, 0);
                context.drawImage(currentCanvas, 0, canvas.height);
            } else {
                newCanvas.width = currentCanvas.width;
                newCanvas.height = currentCanvas.height;
                context.drawImage(currentCanvas, 0, 0);
            }
            newCanvas = combineCanvases(newCanvas, pageNumber + 1);
        } else {
            newCanvas = canvas;
        };
        return newCanvas;
    }

    function save(pdf, pageNumber) {
        if (!pdf) pdf = new jsPDF();
        if (!pageNumber) pageNumber = 1;

        if (pageNumber <= _pdf.numPages) {
            var canvas = document.getElementById('canvas' + pageNumber);
            pdf.addHTML(canvas, function () {
                if (pageNumber + 1 <= _pdf.numPages) pdf.addPage();
                save(pdf, pageNumber + 1);
            });
        } else {
            $.ajax({
                type: "POST",
                url: "http://localhost:8080/file",
                data: {
                    filename: 'hello.pdf',
                    file: pdf.output('dataurlstring')
                }
            }).done(function (o) {
                console.log('saved');
                // If you want the file to be visible in the browser 
                // - please modify the callback in javascript. All you
                // need is to return the url to the file, you just saved 
                // and than put the image in your browser.
            });
        }
    }

    return {
        render: render,
        load: load,
        save: save
    }
})();

pdfUtils.load('helloWorld.pdf'
    , function () { pdfUtils.render(1); });


