$(function(){
	var room = window.location.pathname;

	// tab in textarea
	$(document).on('textarea', 'keydown', function(e) {
		var keyCode = e.keyCode || e.which;
		if (keyCode == 9) {
			e.preventDefault();
			var start = $(this).get(0).selectionStart;
			var end = $(this).get(0).selectionEnd;
			// set textarea value to: text before caret + tab + text after caret
			$(this).val($(this).val().substring(0, start) + "\t" + $(this).val().substring(end));
			// put caret at right position again
			$(this).get(0).selectionStart = $(this).get(0).selectionEnd = start + 1;
		}
	});

	// check for value in firebase db
	var myDataRef = new Firebase('https://padder.firebaseio.com/url' + room);
	myDataRef.on('value', function(snapshot){
		if(snapshot.val() == null){
			myDataRef.child('content').set('');
		}
		else{
			var afterMessage = snapshot.val().content
			var textbox = $("#content").get(0);
			var beforeMessage = $("#content").val();

			var beforeLocation = getSelectionInfo(textbox);
			var beforeLength = beforeMessage.length;
			var afterLength = afterMessage.length;

			var offset = 0;
			var difference = Math.abs(beforeLength - afterLength);
			// change is made before the cursor
			if(beforeLocation.start + 1 == getOffset(beforeMessage.substring(0, beforeLocation.start + 1), afterMessage.substring(0, beforeLocation.start + 1))){
				offset = 0;
			}
			// change is made before the cursor
			else{
				if(beforeLength <= afterLength){
					offset = difference;
				}
				if(beforeLength > afterLength){
					offset = -1*difference;
				}
			}

			afterStartSelection = beforeLocation.start + offset;
			afterEndSelection = beforeLocation.end + offset;

			// paste or cut in the middle of text selection (rare case)
			if(afterStartSelection != afterEndSelection){
				if(beforeMessage.substring(beforeLocation.start, beforeLocation.end) != afterMessage.substring(afterStartSelection, afterEndSelection)){
					afterEndSelection = afterStartSelection;
				}
			}

			// set selection correctly
			$('#content').val(afterMessage);
			textbox.selectionStart = beforeLocation.start;
			textbox.selectionEnd = beforeLocation.end;
			textbox.focus();
		}
	});

	// update value
	$('textarea').on('input propertychange', function() {
		var content = $('#content').val();
		myDataRef.update({content: content});
	});

	function getSelectionInfo (element) {
		var props = {};
		
		props.start  = element.selectionStart;
		props.end    = element.selectionEnd;
		props.length = props.end - props.start;
		props.text   = element.innerHTML.substr(props.start, props.length);
		
		return props;
	}

	function getOffset (before, after){
		compareNum = 0;

		l = Math.min(before.length, after.length);
		for( i=0; i<l; i++) {
			if( before.charAt(i) == after.charAt(i)) compareNum++;
		}

		return compareNum;
	}

});