(function () {
	var clearButton = document.getElementById("button-clear");
	var canvas = document.getElementById("canvas-sig");
	var ctx = canvas.getContext("2d");
	
	clearCanvas();
	
	var drawing = false;
	var mousePos = { x: 0, y: 0 };
	var lastPos = mousePos;
	
	// the main loop
	(function drawLoop () {
		requestAnimationFrame(drawLoop);
		renderCanvas();
	})();
	
	// surprisingly, this works...
	function clearCanvas() {
		canvas.width = canvas.width;
		ctx.translate(0.5, 0.5);
		ctx.strokeStyle = "#222222";
		ctx.lineWidth = 2;
		ctx.lineCap = "round";
	}
	
	function renderCanvas () {
		if (drawing) {
			//ctx.moveTo(lastPos.x, lastPos.y);
			//ctx.lineTo(mousePos.x, mousePos.y);
			//ctx.stroke();
			//lastPos = mousePos;
			
			ctx.beginPath();
			ctx.moveTo(lastPos.x, lastPos.y);
			ctx.lineTo(mousePos.x, mousePos.y);
			ctx.stroke();
			lastPos = mousePos
		}
	}
	
	addEvent(clearButton, "click", () => {
		clearCanvas();
	});
	
	// -------------------- MOUSE
	addEvent(canvas, "mousedown", (e) => {
		drawing = true;
		lastPos = getMousePos(canvas, e);
	});
	
	addEvent(canvas, "mouseup", (e) => {
		drawing = false;
		document.getElementById("img-canvas").setAttribute("src", canvas.toDataURL());
		document.getElementById("download-image").setAttribute("href", canvas.toDataURL());
	});
	
	addEvent(canvas, "mousemove", (e) => {
		mousePos = getMousePos(canvas, e);
	});
	
	function getMousePos(canvasDom, event) {
		var rect = canvasDom.getBoundingClientRect();
		return {
			x: event.clientX - rect.left,
			y: event.clientY - rect.top
		};
	}
	// -------------------- /MOUSE
	
	// -------------------- TOUCH
	addEvent(canvas, "touchstart", (e) => {
		mousePos = getTouchPos(canvas, e);
		var touch = e.touches[0];
		var mouseEvent = new MouseEvent("mousedown", {
			clientX: touch.clientX,
			clientY: touch.clientY
		});
		canvas.dispatchEvent(mouseEvent);
	});
	
	addEvent(canvas, "touchend", (e) => {
		var mouseEvent = new MouseEvent("mouseup", {});
		canvas.dispatchEvent(mouseEvent);
	});
	
	addEvent(canvas, "touchmove", (e) => {
		var touch = e.touches[0];
		var mouseEvent = new MouseEvent("mousemove", {
			clientX: touch.clientX,
			clientY: touch.clientY
		});
		canvas.dispatchEvent(mouseEvent);
	});
	
	// prevent scrolling when touching the canvas
	addEvent(canvas, "touchstart", (e) => {
		if (e.target == canvas) {
			e.preventDefault();
		}
	});
	
	addEvent(canvas, "touchend", (e) => {
		if (e.target == canvas) {
			e.preventDefault();
		}
	});
	
	addEvent(canvas, "touchmove", (e) => {
		if (e.target == canvas) {
			e.preventDefault();
		}
	});
	
	function getTouchPos(canvasDom, touchEvent) {
		var rect = canvasDom.getBoundingClientRect();
		return {
			x: touchEvent.touches[0].clientX - rect.left,
			y: touchEvent.touches[0].clientY - rect.top
		};
	}
	// -------------------- /TOUCH
	
	// cross-browser event listener polyfill
    function addEvent(htmlElement, eventName, callback) {
        if (htmlElement.attachEvent) {
            htmlElement.attachEvent("on" + eventName, function () { callback.call(htmlElement); });
        } else if (htmlElement.addEventListener) {
            htmlElement.addEventListener(eventName, callback, false);
        }
    }
	
	// rAF polyfill
	window.requestAnimationFrame = (function (callback) {
		return window.requestAnimationFrame || 
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			window.msRequestAnimaitonFrame ||
			function (callback) {
				window.setTimeout(callback, 1000/60);
			};
	})();
})();
