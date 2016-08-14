$(document).ready(function() {
	var $body = $('body');
	var $requestStatus = $('#status');

	function setRequestStatus(status) {
		$requestStatus.html(status);
	}

	setRequestStatus('Connection closed');

	var source = new EventSource('/sse/stream');

	source.onopen = function () {
		setRequestStatus('Connection open');
		$body.removeClass().addClass('open');	
	};

	source.onmessage= function(msg)	{ 
		setRequestStatus('Changes received');
		$body.removeClass().addClass('change');	

		setTimeout((function(){
			setRequestStatus('Connection open');
			$body.removeClass().addClass('open');	
		}), 2000);
	}			

});