'use strict';

function toggleComments() {
	const label = document.getElementById('toggle-comments').firstElementChild;
	const comments = document.getElementById('watch-discussion');

	if (comments.classList.toggle('hide-comments')) {
		label.textContent = 'Show comments';
	}	else {
		label.textContent = 'Hide comments';
	}
}

function inject() {
	addClass();
	addButton();
}

function addClass() {
	document.getElementById('watch-discussion').className += ' hide-comments';
}

function addButton() {
	const button =`
	<button class="yt-uix-button yt-uix-button-size-default yt-uix-button-expander" id="toggle-comments" type="button">
		<span class="yt-uix-button-content">Show comments</span>
	</button>
	`;

	document.getElementById('action-panel-details').innerHTML += button;
	document.getElementById('toggle-comments').addEventListener('click', toggleComments);
}

(function () {
	document.addEventListener('DOMContentLoaded', inject); // Static navigation (i.e. initial page load)
	document.addEventListener('spfdone', inject); // Dynamic navigation (i.e. subsequent page loads)
})();
