/* 
 * Authors: Nedim Arabacı (http://ned.im)
*/

var notes = [];

notes['alert'] = 'Best check yo self, you\'re not looking too good.';
notes['error'] = 'Change a few things up and try submitting again.';
notes['success'] = 'You successfully read this important alert message.';
notes['information'] = 'This alert needs your attention, but it\'s not super important.';
notes['warning'] = '<strong>Warning!</strong> <br /> Best check yo self, you\'re not looking too good.';
notes['confirm'] = 'Do you want to continue?';

function commit_history() {
	$.getJSON('https://api.github.com/repos/craga89/notyfy/commits?callback=?', function(json) {
		$('#commit-history-json tr').remove();
		$.each(json.data, function(i, data) {
			var $col = $('<tr style="border-bottom: 1px solid #999; text-shadow: none" />');
			var $committer = $('<td valign="top" />').html(data.commit.committer.name);
			var $link = $('<a style="font-weight: bold" />').attr('href', 'https://github.com/craga89/notyfy/commit/' + data.sha).html(data.commit.message);
			var $url = $('<td />').append($link);
			var $date = $('<td style="text-align: right" />').html($.format.date(data.commit.committer.date, "dd.MM.yy HH:MM"));
			
			$col.append($committer);
			$col.append($url);
			$col.append($date);
			
			$('#commit-history-json').append($col);
		});
	});
}


$(document).ready(function() {

	var n = notyfy({
		text: '<strong>Hi!</strong> <br /> notyfy v2 released! Catch me if you can!',
		type: 'warning',
		layout: 'topLeft',
		closeWith: ['hover'],
		callback: {
			afterClose: function() {
				notyfy({
					text: '<strong>Hehe!</strong> <br /> Sorry, you can catch me now.',
					type: 'alert',
					layout: 'topRight',
					closeWith: ['click'],
				});
			}
		}
	});

	commit_history();

	$('.inner-menu').appendTo($('h4')).fadeIn();
	
	if (location.hash) {
		$('a[href='+location.hash+']').trigger('click');
	} else {
		$('a[href=#welcome]').trigger('click');
	}
	
	$('.inner-menu a').click(function() {
		var self = $(this);
		$("html, body").animate({ scrollTop: $(self.attr('href')).offset().top - 20 }, 1000);
		return false;
	});

	$('span.runner').click(function() {

		var self = $(this);

		if (self.data('layout') == 'inline') {
			$(self.data('custom')).notyfy({
				text: notes[self.data('type')],
				type: self.data('type'),
				dismissQueue: true,
				buttons: (self.data('type') != 'confirm') ? false : [
		    {addClass: 'btn btn-primary', text: 'Ok', onClick: function($notyfy) {
		    			
		    			// this = button element
		    			// $notyfy = $notyfy element
		    	
		    			$notyfy.close();
		    			$(self.data('custom')).notyfy({force: true, text: 'You clicked "Ok" button', type: 'success'});
		    	}
		    },
		    {addClass: 'btn btn-danger', text: 'Cancel', onClick: function($notyfy) {
		    		$notyfy.close();
			    	$(self.data('custom')).notyfy({force: true, text: 'You clicked "Cancel" button', type: 'error'});
		    	}
		    }
		    ]
			});
			return false;
		}

		notyfy({
			text: notes[self.data('type')],
			type: self.data('type'),
			dismissQueue: true,
			layout: self.data('layout'),
			buttons: (self.data('type') != 'confirm') ? false : [
		    {addClass: 'btn btn-primary', text: 'Ok', onClick: function($notyfy) {
		    			
		    			// this = button element
		    			// $notyfy = $notyfy element
		    	
		    			$notyfy.close();
		    			notyfy({force: true, text: 'You clicked "Ok" button', type: 'success', layout: self.data('layout')});
		    	}
		    },
		    {addClass: 'btn btn-danger', text: 'Cancel', onClick: function($notyfy) {
		    		$notyfy.close();
			    	notyfy({force: true, text: 'You clicked "Cancel" button', type: 'error', layout: self.data('layout')});
		    	}
		    }
		    ]
		});
		return false;
	});
	
});