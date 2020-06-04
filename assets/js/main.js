function toggleDropdownMenu () {
	let displayValue = $('.menu-categories').css('display');
	if (displayValue == 'none') {
		$('.menu-categories').css('display', 'inline-block');
	} else {
		$('.menu-categories').css('display', 'none');
	}
}