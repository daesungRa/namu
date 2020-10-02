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

function getAnchorHomeElem () {
	let rootPath = $('.masthead-title').find('a').prop('href');
	let anchorElem = document.createElement('a');
	anchorElem.setAttribute('id', 'menu-bar-home');
	anchorElem.setAttribute('href', rootPath);
	anchorElem.setAttribute('title', 'Go to home~');
	let homeIconElem = document.createElement('i');
	homeIconElem.setAttribute('class', 'fa fa-fw fa-home');
	homeIconElem.setAttribute('style', 'max-width: 100%; color: #fff;');
	anchorElem.appendChild(homeIconElem);
	return anchorElem;
};

function getGoToTopElem () {
	let rootPath = $('.masthead-title').find('a').prop('href');
	let goToTopElem = document.createElement('div');
	goToTopElem.setAttribute('id', 'go-to-top');
	goToTopElem.setAttribute('title', 'Go to top!');
	let arrowIconElem = document.createElement('img');
	arrowIconElem.setAttribute('src', `${rootPath}/assets/img/arrow-top.png`);
	arrowIconElem.setAttribute('style', 'max-width: 100%;');
	arrowIconElem.setAttribute('alt', 'Go to top!');
	goToTopElem.appendChild(arrowIconElem);
	return goToTopElem;
};

function activateToggleMenuBarContents (scroll) {
	if (scroll > 1) {
		// Set menu-bar-home
		$('.header-menu').css({'background-color': '#555', 'opacity': 0.8});
		$('.header-menu > nav > a, #menu-dropdown-bars > i').css({'color': '#fff'});
		$('.menu-dropdown .menu-categories li').css({'background-color': '#555'});
		$('.menu-dropdown .menu-categories li').hover(function () {
			$(this).css({'background-color': '#cfcfcf', 'cursor': 'pointer'});
			$(this).find('a').css({'color': '#222'});
		}, function () {
			$(this).css({'background-color': '#555', 'cursor': 'pointer'});
			$(this).find('a').css({'color': '#fff'});
		});
		$('.menu-dropdown .menu-categories li a').css({'color': '#fff'});
		let menuBarHome = document.getElementById('menu-bar-home');
		if (menuBarHome === null || menuBarHome === 'undefined') {
			$('.header-menu .menu-content').css({'position': 'relative'});
			$('.header-menu .menu-content').append(getAnchorHomeElem());
		};
		// Set go-to-top
		goToTop = document.getElementById('go-to-top');
		if (goToTop === null || goToTop === 'undefined') {
			$('.header-menu .social-icons').css({'position': 'relative'});
			$('.header-menu .social-icons').append(getGoToTopElem());
			$('#go-to-top').on('click', function (event) {
				event.preventDefault();
				$('html, body').animate({'scrollTop': 0}, 200);
			});
		};
	} else {
		// Remove menu-bar-home
		$('.header-menu').css({'background-color': '#fff', 'opacity': 1});
		$('.header-menu > nav > a, #menu-dropdown-bars > i').css({'color': '#888'});
		$('.menu-dropdown .menu-categories li').css({'background-color': '#fff'});
		$('.menu-dropdown .menu-categories li').hover(function () {
			$(this).css({'background-color': '#cfcfcf', 'cursor': 'pointer'});
			$(this).find('a').css({'color': '#222'});
		}, function () {
			$(this).css({'background-color': '#fff', 'cursor': 'pointer'});
			$(this).find('a').css({'color': '#888'});
		});
		$('.menu-dropdown .menu-categories li a').css({'color': '#888'});
		if ($('#menu-bar-home')) {
			$('.header-menu .menu-content').css({'position': ''});
			$('.header-menu .menu-content #menu-bar-home').remove();
		};
		// Remove go-to-top
		if ($('#go-to-top')) {
			$('.header-menu .social-icons').css({'position': ''});
			$('.header-menu .social-icons #go-to-top').remove();
		};
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
	let scroll = $(window).scrollTop();
	if (scroll > 0) {
		activateToggleMenuBarContents(scroll);
	};
	$(window).scroll(function () {
		activateToggleMenuBarContents($(window).scrollTop());
	});
});