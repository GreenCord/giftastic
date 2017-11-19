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
		params:
		{
			api_key: 'VDj8YgH1bOojE5OT8jTClTcOKUS1W9i8',
			q: '',
			limit: 10
		},
		categories:
		[
			'Happy',
			'Sad',
			'Angry',
			'Wat'
		],
		playing: false,
		buttonDisplay: function(arr){
			// loop thru array, append new button with array string
			$(arr).each(function(){
				var btns = $('#buttons').append($('<button>').text(this));
			});
		},
		newButton: function(val){
			// get user value from input, add to categories array, do buttonDisplay
			console.log('adding',val);
		},
		getGifs: function(val){
			// parameterize based on q = val, ajax the api, display still images in #gif-display
		},
		playPause: function(val){
			// when user clicks gif, if playing, pause, if paused, play.
		}

	};

	var obj = giftastic;
	// click handlers
	// gif category button
	// input button - call newButton
	$('#input').on('submit', function(e){
		e.preventDefault();
		obj.newButton($('#user-input').val());
	});

	// gif image

	// load initial buttons
	obj.buttonDisplay(obj.categories);


});