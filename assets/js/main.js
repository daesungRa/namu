/*
 * Scripts for Namu jekyll blog.
 */

function toggleDropdownMenu () {
	let dropdownMenu = $('.menu-categories');
	let displayValue = dropdownMenu.css('display');
	if (displayValue == 'none') {
		dropdownMenu.css('display', 'block');
	} else {
		dropdownMenu.css('display', 'none');
	};
};

$(document).ready(function () {
	let menuDropdownBars = $('#menu-dropdown-bars');
	menuDropdownBars.on('click', function (event) {
		event.stopPropagation();
		toggleDropdownMenu();
	});
	document.onclick = function () {
		if ($('.menu-categories').css('display') == 'block') {
			toggleDropdownMenu();
		};
	};
});