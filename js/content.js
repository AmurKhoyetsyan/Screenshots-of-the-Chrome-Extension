;(function(){
    chrome.runtime.onMessage.addListener(takePhoto);

    let drawingCords = {
        startX: 0,
        startY: 0,
        endX: 0,
        endY: 0,
        width: 0,
        height: 0
    };

    function takePhoto(message, sender, sendResponse){
        if(message.type === 'top'){
            creaateImage(message.data);
        }else if(message.type === 'part'){
            let styles = document.createElement("style");
            styles.id = "arm-screenshote-style";

            styles.innerText = "* {" +
                "-webkit-user-select: none !important;" +
                "-moz-user-select: none !important;" +
                 "-ms-user-select: none !important;" +
                "user-select: none !important;" +
                "cursor: crosshair !important;" +
            "}";

            document.documentElement.appendChild(styles);
            
            let width = window.innerWidth;
            let height = window.innerHeight;

            let canvasBottom = document.createElement("canvas");
            canvasBottom.width = width;
            canvasBottom.height = height;

            canvasBottom.style["position"] = "fixed";
            canvasBottom.style["zIndex"] = "99999";
            canvasBottom.style["top"] = "0";
            canvasBottom.style["left"] = "0";
            canvasBottom.id = "arm-screenshote-canvas-bottom";

            let canvasTop = document.createElement("canvas");
            canvasTop.width = width;
            canvasTop.height = height;

            canvasTop.style["position"] = "fixed";
            canvasTop.style["zIndex"] = "99999";
            canvasTop.style["top"] = "0";
            canvasTop.style["left"] = "0";
            canvasTop.id = "arm-screenshote-canvas-top";
            
            document.documentElement.appendChild(canvasBottom);
            document.documentElement.appendChild(canvasTop);
            
            createCanvasImageForDrawing(canvasBottom, canvasTop, message.data);
        }
    }

    function creaateImage(data) {
        let dataExtension = data.substring(0, data.lastIndexOf("base64"));
        let extension = dataExtension.substring(dataExtension.lastIndexOf("/") + 1, dataExtension.lastIndexOf(";"));
        let link = document.createElement('a');
        link.href = data;
        link.download = "screenshot." + extension;
        link.click();
        link.remove();
    };

    function createCanvasImageForDrawing(canvasBottom, canvasTop, data) {
        let img = new Image();
        img.src = data;
        img.onload = function(res) {
            let ctx = canvasBottom.getContext("2d");
            ctx.drawImage(img, 0, 0, canvasBottom.width, canvasBottom.height);
            canvasTop.addEventListener("mousedown", function(event){
                drawingCords.startX = event.clientX;
                drawingCords.startY = event.clientY;
                canvasTop.addEventListener("mousemove", drawing, false);
            }, false);
            canvasTop.addEventListener("mouseup", function(event) {
                canvasTop.removeEventListener("mousemove", drawing, false);
                screenShotePart(img);
            });
        };
        img.onerror = function(err) {
            console.log(err);
        };
    };

    function drawing(event) {
        let canvas = document.querySelector("#arm-screenshote-canvas-top");
        let ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        drawingCords.endX = event.clientX;
        drawingCords.endY = event.clientY;
        
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#FF0000";
        
        ctx.beginPath();
        ctx.moveTo(drawingCords.startX, drawingCords.startY);
        ctx.lineTo(drawingCords.endX, drawingCords.startY);
        ctx.moveTo(drawingCords.startX, drawingCords.startY);
        ctx.lineTo(drawingCords.startX, drawingCords.endY);
        ctx.moveTo(drawingCords.endX, drawingCords.startY);
        ctx.lineTo(drawingCords.endX, drawingCords.endY);
        ctx.moveTo(drawingCords.startX, drawingCords.endY);
        ctx.lineTo(drawingCords.endX, drawingCords.endY);
        ctx.closePath();
        ctx.stroke();

        drawingCords.width = drawingCords.endX - drawingCords.startX;
        drawingCords.height = drawingCords.endY - drawingCords.startY;
    };

    function screenShotePart(img) {
        let canvasBottom = document.querySelector("#arm-screenshote-canvas-bottom");
        let canvasTop = document.querySelector("#arm-screenshote-canvas-top");
        let styles = document.querySelector("#arm-screenshote-style");
        styles.remove();
        canvasBottom.remove();
        canvasTop.remove();

        drawingCords.width = drawingCords.width < 0 ? -drawingCords.width : drawingCords.width;
        drawingCords.height = drawingCords.height < 0 ? -drawingCords.height : drawingCords.height;
        
        if(drawingCords.startX > drawingCords.endX) {
            let startX = drawingCords.startX;
            drawingCords.startX = drawingCords.endX;
            drawingCords.endX = startX;
        }

        if(drawingCords.startY > drawingCords.endY) {
            let startY = drawingCords.startY;
            drawingCords.startY = drawingCords.endY;
            drawingCords.endY = startY;
        }

        let cnv = document.createElement("canvas");

        let width = drawingCords.width;
        let height = drawingCords.height;
        let startX = drawingCords.startX;
        let startY = drawingCords.startY;
        let endX = drawingCords.endX;
        let endY = drawingCords.endY;

        if(width === 0) {
            width = 1;
            endX = startX + 1;
        }

        if(height === 0) {
            height = 1;
            endY = startY + 1;
        }

        cnv.width = width;
        cnv.height = height;

        let ctx = cnv.getContext("2d");
        ctx.drawImage(
            img,
            startX,
            startY,
            width,
            height,
            0,
            0,
            width,
            height
        );

        let data = cnv.toDataURL('image/jpeg');

        cnv.remove();

        creaateImage(data);
    };
})();