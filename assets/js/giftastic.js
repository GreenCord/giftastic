/* Reference divs:
<div id="buttons"></div>

<div id="gif-display" class="gifs-wrapper">
	<div class="gif">
		<img src="" alt="" />
		<span class="gif-rating">Rated: G</span>
	</div>
</div>
*/

$(document).ready(function(){
	// create giftastic object to contain everything needed for the program
	// api url, parameters: api key, search term, limit, rating
	// initial array of categories
	// function to get and display buttons for categories array
	// function to get and add buttons based on user input
	// click handler to get ajax response from api to get and display gifs
	// click handler to swap still/playing gif images
	var giftastic = {
		url: 'https://api.giphy.com/v1/gifs/search?',
		method: 'GET',
		params:
		{
			api_key: 'VDj8YgH1bOojE5OT8jTClTcOKUS1W9i8',
			q: '',
			limit: 10
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
			'Butts',
			'Jump to Conclusions',
			'Holiday',
			'Robots',
			'Retro Game'
		],
		playing: false,

		buttonDisplay: function(arr){
			// empty current buttonset
			$('#buttons').empty();

			// loop thru array, append new button with array string
			$(arr).each(function(){
				var btns = $('#buttons').append($('<button>').text(this));
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
			this.params.q = val;
			var queryUrl = this.url + $.param(this.params);
			$.ajax({
				url: queryUrl,
				method: this.method
			}).done(function(res){
				var $gifdiv = $('#gif-display');
				$gifdiv.empty();
				var $res = $(res.data);
				$res.each(function(){
					if (this.rating != 'r') {
						var $gif = $('<div>').attr('class','gif');
						var st_img = this.images.original_still.url;
						var an_img = this.images.original.url;
						$gif.append($('<img>').attr({
							src: st_img,
							'data-still': st_img,
							'data-animated': an_img,
							'data-playing': 'paused'
						}));
						$gif.append($('<span>').attr('class','gif-rating').text('Rating: '+this.rating));	
						$gifdiv.append($gif);
					}

				});

			});
		},

		swapSrcs: function(obj, src, bool){
			obj.attr({
				src: src,
				'data-playing': bool
			});
		},

		playPause: function(val){
			// when user clicks gif, if playing, pause, if paused, play.
			console.log('playing', val);
			var $val = $(val);
			var $bg = $('#gif-display');
			if ($val.attr('data-playing') == 'playing') {
				this.swapSrcs($val,$val.attr('data-still'),'paused');
				$bg.attr('style','background-image: none');
			} else {
				this.swapSrcs($val,$val.attr('data-animated'),'playing');
				$bg.attr('style','background-image: url(\''+$val.attr('data-animated')+'\')');
			}
		}

	};

	var obj = giftastic;
	// click handlers
	// gif category button
	$(document).on('click', 'button', function(){
		obj.getGifs($(this).text());
	});

	// input button - call newButton
	$('#input').on('submit', function(e){
		e.preventDefault();
		obj.newButton($('#user-input').val());
	});

	// gif image
	$(document).on('click', 'img', function(){
		obj.playPause(this);
	});

	// load initial buttons
	obj.buttonDisplay(obj.categories);


});