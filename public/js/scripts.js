$('.spotify-item').click(function(e) {
	var thiz = $(this);

	$('#spotifyItemType').val(thiz.data('type'));
	$('#spotifyItemId').val(thiz.data('id'));
});