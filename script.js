'use strict';

const globals = {
  showComments: chrome.i18n.getMessage('showCommentsText'),
  hideComments: chrome.i18n.getMessage('hideCommentsText'),
};

const injectorFactory = {
  youtubeInstance() {
    return this._isNewInterface() ? newYouTube : oldYouTube;
  },

  _isNewInterface() {
    return this._isNewVideoPage() || this._isNewHomePage();
  },

  _isNewVideoPage() {
    return !!document.getElementById('polymer-app');
  },

  _isNewHomePage() {
    return !!document.querySelector('ytd-app');
  },
};

const isVideo = () => {
  return window.location.pathname === '/watch';
};

const isLiveVideo = () => {
  return document.getElementsByClassName('ytp-live').length !== 0;
};

const oldYouTube = {
  isVideo,
  isLiveVideo,

  type() {
    return 'OLD';
  },

  registerListeners() {
    document.addEventListener('spfdone', oldYouTube.inject); // Inject on dynamic navigation (subsequent page loads)
  },

  inject() {
    debugLog('ATTEMPTING TO INJECT...');
    if (!oldYouTube._ready()) return;

    oldYouTube._addClass();
    oldYouTube._addButton();
  },

  _ready() {
    return oldYouTube.isVideo() && !oldYouTube.isLiveVideo();
  },

  _addClass() {
    debugLog('ADDING CLASS...');
    document.getElementById('watch-discussion').classList.add('hide-comments');
  },

  _addButton() {
    debugLog('ADDING BUTTON...');
    const button = `
    <button class="yt-uix-button yt-uix-button-size-default yt-uix-button-expander" id="toggle-comments" type="button">
      <span class="yt-uix-button-content">${globals.showComments}</span>
    </button>
    `;

    document.getElementById('action-panel-details').innerHTML += button;
    document
      .getElementById('toggle-comments')
      .addEventListener('click', oldYouTube._toggleComments);
  },

  _toggleComments() {
    const label = document.getElementById('toggle-comments').firstElementChild;
    const comments = document.getElementById('watch-discussion');

    if (comments.classList.toggle('hide-comments')) {
      label.textContent = globals.showComments;
    } else {
      label.textContent = globals.hideComments;
    }

    oldYouTube._showReadMore();
  },

  _showReadMore() {
    oldYouTube._showReadMore = function() {}; // Become a no-op after executing.

    const maxHeight = 65;
    const commentContents = document.getElementsByClassName(
      'comment-renderer-text-content'
    );

    for (var comment of commentContents) {
      if (comment.scrollHeight > maxHeight) {
        comment.nextElementSibling.classList.remove('hid');
      }
    }
  },
};

const newYouTube = {
  isVideo,
  isLiveVideo,

  type() {
    return 'NEW';
  },

  registerListeners() {
    document.addEventListener('yt-visibility-refresh', newYouTube.inject); // Inject the button on info panel render.
    document.addEventListener('yt-page-data-updated', newYouTube._waitCommentsCount); // Asynchronously get comments count when navigated to video page
    document.addEventListener('yt-page-data-updated', () => { newYouTube.rewriteCommentsCount('counting') }); // when page navigating, temp rewrite the comments count.
  },

  inject(e) {
    debugLog('ATTEMPTING TO INJECT...');
    if (!newYouTube._ready(e)) return;

    newYouTube._addClass();
    newYouTube._addButton();

    document.removeEventListener('yt-visibility-refresh', newYouTube.inject);
  },

  _ready(e) {
    return (
      newYouTube.isVideo() &&
      !newYouTube.isLiveVideo() &&
      newYouTube._isInfoPanelRendered(e)
    );
  },

  _isInfoPanelRendered(e) {
    return (
      typeof e !== 'undefined' &&
      e.type === 'yt-visibility-refresh' &&
      e.target.tagName === 'YTD-ITEM-SECTION-RENDERER' // this mean: rendered childNode of comments'DOM(<ytd-comments>)
    );
  },

  _addClass() {
    debugLog('ADDING CLASS...');
    document.querySelector('ytd-item-section-renderer.ytd-comments').classList.add('hide-comments');
  },

  _addButton() {
    debugLog('ADDING BUTTON...');
    const moreButton = document.getElementById('more');
    const style = moreButton.hidden ? 'style="margin-left:0"' : '';
    const button = `
    <button class="fake-paper-button" id="toggle-comments" ${style} type="button">
      <div class="fake-yt-formatted-string">
        <span id="toggle-comments-label">${globals.showComments}</span>
        <span id="comments-count-label">
          (<span id="comments-count">...</span>)
        </span>
      </div>
    </button>
    `;

    moreButton.insertAdjacentHTML('afterend', button);

    document
      .getElementById('toggle-comments')
      .addEventListener('click', newYouTube._toggleComments);
  },

  _toggleComments() {
    const buttonLabel = document.getElementById('toggle-comments-label');
    const countLabel = document.getElementById('comments-count-label');
    const comments = document.querySelector("ytd-item-section-renderer.ytd-comments");

    countLabel.classList.toggle('is-hide'); // toggle commentsCount.

    if (comments.classList.toggle('hide-comments')) {
      buttonLabel.textContent = globals.showComments;
    } else {
      buttonLabel.textContent = globals.hideComments;
    }
  },

  rewriteCommentsCount(condition) {
    debugLog('REWRITING COMMENTS COUNT...');
    const label = document.getElementById('comments-count');
    if (!label) return;
    (condition === 'counting') ? label.textContent = '...'
                               : label.textContent = newYouTube._fetchCommentsCount();
  },
  
  _waitCommentsCount() {
    const observerTarget = document.getElementById('comments'); // `<ytd-comments id="comments" ...>`

    if (!observerTarget) return; // Check rendered the observer target node.
    
    debugLog('OBSERVING COMMENTS COUNT...');

    const commentsCountNode = () => document.querySelector('yt-formatted-string.count-text');
    const observerConfig = { childList: true, subtree: true };
    const commentsCountObserver = new MutationObserver( mutations => {
      mutations.some( mutation => {
        // debugLog(mutation)
        if (commentsCountNode()) {
          commentsCountObserver.disconnect();
          debugLog('OBSERVED COMMENTS COUNT...');
          newYouTube.rewriteCommentsCount();
          return true; // the same as "break" in `Array.some()`
        }
      });
    });

    commentsCountObserver.observe(observerTarget, observerConfig);
  },

  _fetchCommentsCount() {
    debugLog('FETCH COMMENTS COUNT...');
    const targetNode = document.querySelector('yt-formatted-string.count-text');
    const extractDigitArray = targetNode.textContent.match(/\d+/g);
    const countString = extractDigitArray.join();
    return countString;
  },
};

const IS_DEV_MODE = !('update_url' in chrome.runtime.getManifest()); // Chrome Web Store adds update_url attribute.

function debugLog(...args) {
  if (IS_DEV_MODE) console.log(...args);
}

(function() {
  const youtube = injectorFactory.youtubeInstance();
  debugLog(`DETECTED ${youtube.type()} UI`);
  youtube.registerListeners();
  youtube.inject();
})();
