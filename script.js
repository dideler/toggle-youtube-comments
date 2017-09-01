'use strict';

let injected = false;

function newToggleComments() {
	const label = document.getElementById('toggle-comments').firstElementChild;
	const comments = document.getElementById('comments');

	if (comments.classList.toggle('hide-comments')) {
		label.textContent = 'Show comments';
	}	else {
		label.textContent = 'Hide comments';
	}
}

function toggleComments() {
	const label = document.getElementById('toggle-comments').firstElementChild;
	const comments = document.getElementById('watch-discussion');

	if (comments.classList.toggle('hide-comments')) {
		label.textContent = 'Show comments';
	}	else {
		label.textContent = 'Hide comments';
	}

	showReadMore();
}

function inject(e) {
	if (e.type == 'spfdone') { injected = false; } // reset for old UI navigation
	if (injected) { return; } // guard clause because event 'yt-register-action' fires many times

	if (isOldInterface()) {
		addClass();
		addButton();
	} else {
		if (e.target.id != 'comments') {
			return; // do not inject if triggering too early
		}

		const oldTriggerEvents = ['DOMContentLoaded', 'spfdone'];
		if (oldTriggerEvents.includes(e.type)) {
			return; // do not inject for old UI events on new UI
		}

		addNewClass();
		addNewButton();
	}

	injected = true;
}

function isOldInterface() {
	return !!document.getElementById('watch-discussion');
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

function addNewClass() {
	document.getElementById('comments').className += ' hide-comments';
}

function addNewButton() {
	const button =`
	<button class="fake-paper-button" id="toggle-comments" type="button">
		<span class="fake-yt-formatted-string">Show comments</span>
	</button>
	`;

	const moreButton = document.getElementById('more');
	moreButton.insertAdjacentHTML('afterend', button);

	document.getElementById('toggle-comments').addEventListener('click', newToggleComments);
}

function showReadMore() {
	showReadMore = function() {}; // Become a no-op after executing.

	const maxHeight = 65;
	const commentContents = document.getElementsByClassName('comment-renderer-text-content');

	for (var comment of commentContents) {
		if (comment.scrollHeight > maxHeight) {
			comment.nextElementSibling.classList.remove('hid');
		}
	};
}

(function () {
	document.addEventListener('DOMContentLoaded', inject); // Static navigation (i.e. initial page load)
	document.addEventListener('spfdone', inject); // Dynamic navigation (i.e. subsequent page loads)
	document.addEventListener('yt-register-action', inject); // Polymer event for new UI
})();
