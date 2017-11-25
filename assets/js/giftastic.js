$(document).ready(function(){
	var giftastic = {
		url: 'https://api.giphy.com/v1/gifs/search?',
		method: 'GET',
		params:
		{
			api_key: 'VDj8YgH1bOojE5OT8jTClTcOKUS1W9i8',
			q: '',
			limit: 10,
			offset: 0
		},
		categories:
		[
			'Spy Tools',
			'Wild Wild West',
			'Mission Impossible',
			'Get Smart',
			'Christmas',
			'Shrek',
			'Beth in Rick and Morty',
			'Jump to Conclusions',
			'Holiday',
			'Robots',
			'Retro Game'
		],
		playing: false,
		currentcat: '',
		loadstatus: '',
		requested: false,

		buttonDisplay: function(arr){
			// empty current buttonset
			$('#js-buttons').empty();

			// loop thru array, append new button with array string
			$(arr).each(function(){
				var btns = $('#js-buttons').append($('<button>').text(this).attr('class','c-btnlist__btn'));
			});
		},

		newButton: function(val){
			// get user value from input, add to categories array, do buttonDisplay
			var cats = this.categories;
			cats.push(val);
			this.buttonDisplay(cats);
		},

		getGifs: function(val){
			// parameterize based on q = val, ajax the api, display still images in #gif-display
			this.requested = true;
			if (this.loadstatus != 'none') {
				this.params.q = val;
				var queryUrl = this.url + $.param(this.params);
				giftastic.params.offset += 10;
			

				$.ajax({
					url: queryUrl,
					method: this.method
				}).done(function(res){
			
					var $res = $(res.data);
					var $gifdiv = $('#js-gif-display');
					
					$res.each(function(){ // for each returned object in the array
						if (this.rating != 'r') { // filter out gifs rated 'r' and build gif tile to append
							var $gif = $('<div>').attr({
								class: 'l-grid__item',
								title: 'Click to Play/Pause'
							});
							var st_img = this.images.original_still.url;
							var an_img = this.images.original.url;
							$gif.append($('<img>').attr({
								class: 'l-grid__thumbnail u-imgwidth',
								src: st_img,
								'data-still': st_img,
								'data-animated': an_img,
								'data-playing': 'paused'
							}));
							$gif.append($('<h5>').attr('class','l-grid__headline').text(this.title));
							$gif.append($('<p>').attr('class','l-grid__text').text('Rating: '+this.rating));	
							$gifdiv.append($gif);

						}
						giftastic.requested = false;
					});
					
					// make sure initial load has enough gifs to fill screen
					// error handle when results returns 9 or less gifs
					if ( $(window).scrollTop() + $(window).height() >= ( 0.98 * $(document).height() ) && ($res.length >= 9)){
						
						giftastic.getGifs(val);

					} else if ( ($res.length < 9) && ($res.length > 0)) {
						$('#js-error').text('No more gifs found!');
						$('#js-error').fadeIn();
						giftastic.loadstatus = 'none';

					} else if ($res.length == 0) {
						
						if (giftastic.loadstatus === 'first') {
							$('#js-error').text('No gifs found for ' + giftastic.currentcat + '!');
							$('#js-error').fadeIn();
						} else {
							$('#js-error').text('No more gifs found');
							$('#js-error').fadeIn();
						}
						giftastic.loadstatus = 'none';

					} else {
						giftastic.loadstatus = 'done';
					}
				});
			}
		},

		swapSrcs: function(obj, src, bool){
			obj.attr({
				src: src,
				'data-playing': bool
			});
		},

		playPause: function(val){
			// when user clicks gif, if playing, pause, if paused, play.
			var $val = $(val);
			var $bg = $('#js-gif-display');
			if ($val.attr('data-playing') == 'playing') {
				this.swapSrcs($val,$val.attr('data-still'),'paused');
			} else {
				this.swapSrcs($val,$val.attr('data-animated'),'playing');
			}
		},

		initLoad: function($text){
			var $gifdiv = $('#js-gif-display');
			$gifdiv.empty().append($('<p>').text('Here are some ' + $text +' gifs. Click to animate!'));
			obj.loadstatus = 'first';
			obj.currentcat = $text;
			obj.params.offset = 0;
			obj.getGifs($text);
		}

	};

	var obj = giftastic;
	// click handlers
	// gif category button
	$(document).on('click', 'button', function(){
		$btntext = $(this).text().replace(/[^a-z0-9\s]/gi, '');
		$('#js-error').fadeOut();
		obj.initLoad($btntext);
	});

	// input button - call newButton
	$('#js-add-button').on('submit', function(e){
		console.log('user input detected',$('#js-user-input').val().replace(/[^a-z0-9\s]/gi, ''));
		e.preventDefault();
		var $btntext = $('#js-user-input').val().replace(/[^a-z0-9\s]/gi, '');
		$('#js-error').fadeOut();
		obj.newButton($btntext);
		obj.initLoad($btntext);
		$('#js-user-input').val('');
	});

	// gif image
	$(document).on('click', 'img', function(){
		obj.playPause(this);
	});


	// scroll loading
	$(window).scroll(function(){
		// user scrolls to last 2% of height
		if($(window).scrollTop() + $(window).height() >= ( 0.98 * $(document).height() )){
			if (!giftastic.requested) {
				obj.getGifs(obj.currentcat);
			}
		}
	});


	// load initial buttons
	obj.buttonDisplay(obj.categories);

});