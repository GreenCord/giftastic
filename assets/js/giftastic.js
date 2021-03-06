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
		loadstatus: 'first',
		requested: false,

		buttonDisplay: function(arr){
			// empty current buttonset
			$('#js-buttons').empty();
			if(arr.length != 0) {
				$('#js-clear-history').fadeIn();
				$('#js-input').fadeIn();
			}

			// loop thru array, append new button with array string
			$(arr).each(function(){
				var btns = $('#js-buttons').prepend($('<button>').text(this).attr('class','c-btn'));
			});
		},

		newButton: function(val){
			// get user value from input, add to categories array, do buttonDisplay
			var cats = this.categories;
			cats.push(val);
			if (cats.length >= 10) { // keep history to 10 searches
				cats.splice(0,1);
			}
			this.buttonDisplay(cats);
			localStorage.removeItem('cats');
			localStorage.setItem('cats',JSON.stringify(cats));
		},

		ajaxCall: function(url, val){
			
		},

		getGifs: function(val){
			if ((val == null) || (val == '')) {
				return false;
			}
			// parameterize based on q = val, ajax the api, display still images in #gif-display
			this.requested = true;
			if (this.loadstatus != 'none') { // if not already loading a set of gifs do this stuff
				this.params.q = val;
				var queryUrl = this.url + $.param(this.params);
				giftastic.params.offset += 10; // increment offset for next call
				this.loadPanel('show');
				
				setTimeout(function(){
					$.ajax({
						url: queryUrl,
						method: this.method
					}).done(function(res){
					
						var $res = $(res.data);
						var $gifdiv = $('#js-gif-display');

						if($res.length != 0) {
							$gifdiv.show();
						// } else {
						// 	$gifdiv.show();
						}
							
						$res.each(function(){ // for each returned object in the array
							
							if (((this.rating == 'g') || this.rating == 'y') || ($('#js-switch-click').attr('data-filter') == 'false')) { // filter out gifs rated 'r' and build gif tile to append
								var $gif = $('<div>').attr({
									class: 'l-grid__item',
									title: 'Click to Play/Pause'
								});
								var st_img = this.images.fixed_height_still.url;
								var an_img = this.images.fixed_height.url;
								$gif.append($('<img>').attr({
									class: 'l-grid__thumbnail',
									src: st_img,
									'data-still': st_img,
									'data-animated': an_img,
									'data-playing': 'paused'
								}));
								$gif.append($('<h5>').attr('class','l-grid__headline').text(this.title));
								$gif.append($('<p>').attr('class','l-grid__text').text('Rating: '+this.rating));	
								$gifdiv.append($gif);
							} // end if - filter checking

							giftastic.requested = false;
							giftastic.loadPanel('hide');
						});
					
				
						// make sure initial load has enough gifs to fill screen
						// error handle when results returns 9 or less gifs
						if ( $(window).scrollTop() + $(window).height() >= ( 0.98 * $(document).height() ) && ($res.length >= 9)){
							
							giftastic.getGifs(val);

						} else if ( ($res.length < 9) && ($res.length > 0)) {
							$('#js-error').html('<span class="fa-stack"><i class="fa fa-times-circle fa-stack-2x" aria-hidden="true"></i></span>&nbsp;No more gifs found for ' + giftastic.currentcat + '!');
							$('#js-error').fadeIn();
							giftastic.loadstatus = 'none';
							giftastic.loadPanel('hide');

						} else if ($res.length == 0) {
							
							if ((giftastic.loadstatus === 'first') && (giftastic.offset >= 0)) {
								$('#js-error').html('<span class="fa-stack"><i class="fa fa-times-circle fa-stack-2x" aria-hidden="true"></i></span>&nbsp;No gifs found for ' + giftastic.currentcat + '!');
								$('#js-error').fadeIn();
							} else {
								$('#js-error').html('<span class="fa-stack"><i class="fa fa-times-circle fa-stack-2x" aria-hidden="true"></i></span>&nbsp;No more gifs found for ' + giftastic.currentcat + '!');
								$('#js-error').fadeIn();
							}
							giftastic.loadstatus = 'none';
							giftastic.loadPanel('hide');

						} else {
							giftastic.loadstatus = 'done';
						} // end scroll checking
					}); // end done function
				},900);
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
		},

		loadPanel: function(type){
			if (type === 'show') {
				$('#js-loadpanel').show();
			} else if (type === 'hide') {
				$('#js-loadpanel').hide();
			}
		}

	};

	var obj = giftastic;
	var lstorage = JSON.parse(localStorage.getItem('cats'));

	// if user history exists, replace obj categories
	if (lstorage != null){
		obj.categories = lstorage;
	} else {
		$('#js-input-header').text('Example searches...');
	}
	// click handlers
	// gif category button
	$(document).on('click', 'button', function(){
		if ($(this).text() != 'Clear History') {
			$btntext = $(this).text().replace(/[^a-z0-9\s]/gi, '');
			$('#js-error').fadeOut();
			obj.initLoad($btntext);
		}
	});

	// input button - call newButton
	$('#js-add-button').on('submit', function(e){
		lstorage = JSON.parse(localStorage.getItem('cats'));
		if (!lstorage) {
			$('js-buttons').empty();
			obj.categories = [];
		}
		e.preventDefault();
		var $btntext = $('#js-user-input').val().replace(/[^a-z0-9\s]/gi, '');
		if (($btntext == null) || ($btntext == '')) {
			$('#js-error').html('<span class="fa-stack"><i class="fa fa-times-circle fa-stack-2x" aria-hidden="true"></i></span>&nbsp;Please enter a search term in order to search for gifs.').fadeIn();
			return false;
		}

		$('#js-input-header').text('10 most recent searches...');
		$('#js-error').fadeOut();
		obj.newButton($btntext);
		obj.initLoad($btntext);
		$('#js-user-input').val('');
	});

	$('#js-clear-history').click(function(){
		localStorage.clear();
		obj.categories = [];
		$('#js-buttons').empty();
		$(this).fadeOut();
		$('#js-input').fadeOut();
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

	$('#js-switch-click').click(function(){
	
		if ($('#js-switch-click').attr('data-filter') == 'true') {
			$('#js-switch-click').attr('data-filter','false');
			$('#js-switch__text').text('OFF');
		} else {
			$('#js-switch-click').attr('data-filter','true');
			$('#js-switch__text').text('ON');
		}
	});


	// load initial buttons
	obj.buttonDisplay(obj.categories);

});