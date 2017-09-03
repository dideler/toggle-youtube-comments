'use strict';

let injected = false;

function newToggleComments() {
  const label = document.getElementById('toggle-comments').firstElementChild;
  const comments = document.getElementById('comments');

  if (comments.classList.toggle('hide-comments')) {
    label.textContent = 'Show comments';
  } else {
    label.textContent = 'Hide comments';
  }
}

function toggleComments() {
  const label = document.getElementById('toggle-comments').firstElementChild;
  const comments = document.getElementById('watch-discussion');

  if (comments.classList.toggle('hide-comments')) {
    label.textContent = 'Show comments';
  } else {
    label.textContent = 'Hide comments';
  }

  showReadMore();
}

function inject(e) {
  if (window.location.pathname != '/watch') {
    return; // only inject on video pages
  }
  if (e.type == 'spfdone') {
    injected = false; // old UI requires re-injection on navigation
  }
  if (injected) {
    return; // guard clause because we're using a generic event that fires many times
  }

  if (isOldInterface()) {
    addClass();
    addButton();
  } else {
    if (e.target.tagName != 'YTD-VIDEO-SECONDARY-INFO-RENDERER') {
      return;
    }

    const oldTriggerEvents = ['DOMContentLoaded', 'spfdone'];
    if (oldTriggerEvents.includes(e.type)) {
      return; // do not inject on old UI events
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
  const button = `
	<button class="yt-uix-button yt-uix-button-size-default yt-uix-button-expander" id="toggle-comments" type="button">
		<span class="yt-uix-button-content">Show comments</span>
	</button>
	`;

  document.getElementById('action-panel-details').innerHTML += button;
  document
    .getElementById('toggle-comments')
    .addEventListener('click', toggleComments);
}

function addNewClass() {
  document.getElementById('comments').className += ' hide-comments';
}

function addNewButton() {
  const moreButton = document.getElementById('more');
  const style = moreButton.hidden ? 'style="margin-left:0"' : '';
  const button = `
	<button class="fake-paper-button" id="toggle-comments" ${style} type="button">
		<span class="fake-yt-formatted-string">Show comments</span>
	</button>
	`;

  moreButton.insertAdjacentHTML('afterend', button);

  document
    .getElementById('toggle-comments')
    .addEventListener('click', newToggleComments);
}

function showReadMore() {
  showReadMore = function() {}; // Become a no-op after executing.

  const maxHeight = 65;
  const commentContents = document.getElementsByClassName(
    'comment-renderer-text-content',
  );

  for (var comment of commentContents) {
    if (comment.scrollHeight > maxHeight) {
      comment.nextElementSibling.classList.remove('hid');
    }
  }
}

(function() {
  document.addEventListener('DOMContentLoaded', inject); // Old: Static navigation (i.e. initial page load)
  document.addEventListener('spfdone', inject); // Old: Dynamic navigation (i.e. subsequent page loads)

  document.addEventListener('yt-visibility-refresh', inject); // New: Inject on info panel render.
})();
