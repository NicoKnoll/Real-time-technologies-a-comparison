$(document).ready(function(){
	var $body = $('body');
	var $requestStatus = $('#status');
	var status = '';

	function sendRequest() {
		$body.removeClass().addClass('wait');

		$.get("/ajax/ping/", function(data) {
			setRequestStatus('Request sent');
			setTimeout((function(){
				if(status == data) {
					setRequestStatus('No changes received');
					$body.removeClass().addClass('nochange');
				} else {
					setRequestStatus('Changes received');
					$body.removeClass().addClass('change');
				}

				setTimeout((function(){
					setRequestStatus('Connection closed');
					$body.removeClass();
				}), 2000);

				status = data;
			}), 1000);
		});
	}

	function setRequestStatus(status) {
		$requestStatus.html(status);
	}

	setRequestStatus('Connection closed');

	window.sendRequest = sendRequest;
	window.ajaxInterval = setInterval(sendRequest, 5000);

});