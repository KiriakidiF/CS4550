

(function() {
	"use strict";


	//local variables for calculator buttons
	var display = document.getElementById("display");
	var btnclr = document.getElementById("btnclr");
	var btndecimal = document.getElementById("btndecimal");
	var btnnums = [
		document.getElementById("btn0"),
		document.getElementById("btn1"),
		document.getElementById("btn2"),
		document.getElementById("btn3"),
		document.getElementById("btn4"),
		document.getElementById("btn5"),
		document.getElementById("btn6"),
		document.getElementById("btn7"),
		document.getElementById("btn8"),
		document.getElementById("btn9")
	];
	var btnops = [
		document.getElementById("btnplus"),
		document.getElementById("btnminus"),
		document.getElementById("btnmult"),
		document.getElementById("btndiv")
	];

	// track the state of the calculations through a current known input to the operation,
	// the operation type,
	// and the last pressed key
	var track = {
		cur: 0,
		op: null,
		last: null,
		decimal: false
	};

	// Clears the calculator display to 0 and resets tracker
	function clear() {
		display.innerHTML = "0";
		track.last = btnclr;
		track.cur = 0;
		track.op = btnops[0];
		track.decimal = false;
	}

	// Determines if the calculator has been cleared
	function isClear() {
		return display.innerHTML == "0";
	}
	
	// Appends to the current displayed number 
	function append(num) {
		display.innerHTML += num;
	}

	// Determines if the last button press was an operation
	function isOperation() {
		return btnops.includes(track.last);
	}

	
	// Produces a function for the behavior of a variable calculator number
	function typeNum(num) {
		function n() {
			if (isOperation() || isClear()) {
				display.innerHTML = num;
			}
			else {
				append(num);
			}
			track.last = btnnums[num];
		}
		return n;
	}

	// Determines the result of the current operation
	function calc() {
		var b = parseFloat(display.innerHTML);
		var a = parseFloat(track.cur);
		
		if (track.op == btnops[0]) {
			return a + b;
		}
		else if (track.op == btnops[1]) {
			return a - b;
		}
		else if (track.op == btnops[2]) {
			return a * b;
		}
		else {
			return a / b;
		}
	}

	// Produces the behavior for a given operation type,
	// all operations will be marked into the tracked operation and last press
	// and will complete the prepared operation (updates display) if valid
	//
	// In this case, a valid operation is if the last button press (before this operation)
	// was not also an operation
	function createOp(num) {
		function op() {
			if (!btnops.includes(track.last)) {
				var res = calc();
				track.cur = res;
				display.innerHTML = res;
				track.decimal = false; // Decimal can be typed again for next number
			}
			track.last = btnops[num];
			track.op = btnops[num];
		}
		return op;
	}

	// Appends a decimal to the displayed value and tracks that a decimal has been typed,
	// ON THE CONDITION that a decimal has not already been typed into the display
	function typeDecimal() {
		if (!track.decimal) {
			if (isOperation()) {
				display.innerHTML = "0.";
			}
			else {
				append(".");
			}
			track.decimal = true;
			track.last = btndecimal;
		}
	}

	function init() {
		// Add number button event
		btnnums[0].onclick = typeNum(0);
		btnnums[1].onclick = typeNum(1);
		btnnums[2].onclick = typeNum(2);
		btnnums[3].onclick = typeNum(3);
		btnnums[4].onclick = typeNum(4);
		btnnums[5].onclick = typeNum(5);
		btnnums[6].onclick = typeNum(6);
		btnnums[7].onclick = typeNum(7);
		btnnums[8].onclick = typeNum(8);
		btnnums[9].onclick = typeNum(9);

		// Add special button events
		btnclr.onclick = function(){clear()};
		btnops[0].onclick = createOp(0);
		btnops[1].onclick = createOp(1);
		btnops[2].onclick = createOp(2);
		btnops[3].onclick = createOp(3);
		btndecimal.onclick = function(){typeDecimal()};

		clear();
	}

	window.addEventListener('load', init, false);

})();

