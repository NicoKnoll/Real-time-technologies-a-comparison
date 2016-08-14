$(document).ready(function() {
	var $body = $('body');
	var $requestStatus = $('#status');
	var status = '';

	var socket = new WebSocket("ws://127.0.0.1:3000");

	socket.onopen = function () {
		setRequestStatus('Connection open');
		$body.removeClass().addClass('open');	
	};

	socket.onclose = function () {
		console.log('Connection closed');
		socket = new WebSocket("ws://127.0.0.1:3000");
		setRequestStatus('Connection closed');
		$body.removeClass();	
	};

	socket.onmessage= function(msg)	{ 
		setRequestStatus('Changes received');
		$body.removeClass().addClass('change');	

		setTimeout((function(){
			setRequestStatus('Connection open');
			$body.removeClass().addClass('open');	
		}), 2000);
	}			


	function setRequestStatus(status) {
		$requestStatus.html(status);
	}

	setRequestStatus('Connection closed');


	function sendMessage(message) {
		socket.send(message);
	}


	$('.terminal').bind("enterKey",function(e){
		sendMessage($(this).val());
		$(this).val('');
	});


	$('textarea, input').keyup(function(e){
	    if(e.keyCode == 13) {
	        $(this).trigger("enterKey");
	    }
	});

	window.sendMessage = sendMessage;
 
});