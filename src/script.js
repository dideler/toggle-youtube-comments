'use strict';

const l11n = {
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
    oldYouTube._waitCommentsPanel();
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
      <span class="yt-uix-button-content">${l11n.showComments}</span>
      &nbsp;<span id="comments-count"></span>
    </button>
    `;

    document.getElementById('action-panel-details').innerHTML += button;
    document
      .getElementById('toggle-comments')
      .addEventListener('click', oldYouTube._toggleComments);
  },

  _toggleComments() {
    const label = document.getElementById('toggle-comments').firstElementChild;
    const countLabel = document.getElementById('comments-count');
    const comments = document.getElementById('watch-discussion');
    
    countLabel.classList.toggle('is-hide'); // toggle commentsCount.

    if (comments.classList.toggle('hide-comments')) {
      label.textContent = l11n.showComments;
    } else {
      label.textContent = l11n.hideComments;
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

  _waitCommentsPanel() {
    debugLog('OBSERVING COMMENTS COUNT...');

    const observerTarget = document.getElementById('watch-discussion');
    const observerConfig = { childList: true };
    const commentsPanelObserver = new MutationObserver( mutations => {
      mutations.some( mutation => {
        if (mutation.addedNodes.length) {
          commentsPanelObserver.disconnect();
          debugLog('OBSERVED COMMENTS PANEL...');
          oldYouTube._addCommentsCount();
          return true; // the same as "break" in `Array.some()`
        }
      });
    });

    commentsPanelObserver.observe(observerTarget, observerConfig);
  },

  _addCommentsCount() {
    debugLog('FETCH COMMENTS COUNT...');
    const targetNode = document.getElementsByClassName('comment-section-header-renderer')[0];
    const extractDigitArray = targetNode.textContent.match(/\d+/g);
    const countString = extractDigitArray.join();

    debugLog('ADDING COMMENTS COUNT...');
    const label = document.getElementById('comments-count');
    label.textContent = countString;
  },
};

const newYouTube = {
  isVideo,
  isLiveVideo,

  type() {
    return 'NEW';
  },

  registerListeners() {
    document.addEventListener('yt-register-action', newYouTube.inject); // Inject the button on comments render.
    document.addEventListener('yt-page-data-updated', newYouTube.injectCommentsCount); // Asynchronously get comments count when navigated to video page
    window.addEventListener('focus', newYouTube._waitCommentsCount); // When the YouTube tab is in the background state and navigate to the next movie by auto-play, the node of comments is not updated. So set this event when the user returns to Youtube tab.
  },

  inject(e) {
    debugLog('ATTEMPTING TO INJECT...');
    if (!newYouTube._ready(e)) return;

    newYouTube._addClass();
    newYouTube._addButton();

    document.removeEventListener('yt-register-action', newYouTube.inject);
  },

  _ready(e) {
    return (
      newYouTube.isVideo() &&
      !newYouTube.isLiveVideo() &&
      (newYouTube._isCommentsRendered(e) ||
      newYouTube._isPageNavigated(e))
    );
  },

  _isCommentsRendered(e) {
    return (
      typeof e !== 'undefined' &&
      e.type === 'yt-register-action' &&
      e.target.tagName === 'YTD-COMMENTS'
    );
  },

  _isPageNavigated(e) {
    return (
      typeof e !== 'undefined' &&
      e.type === 'yt-page-data-updated'
    );
  },

  _addClass() {
    debugLog('ADDING CLASS...');
    document.querySelector('ytd-item-section-renderer.ytd-comments').classList.add('hide-comments');
  },

  _addButton() {
    debugLog('ADDING BUTTON...');
    const moreButton = document.getElementById('more');
    const button = `
    <button class="fake-paper-button" id="toggle-comments" type="button">
      <div class="fake-yt-formatted-string">
        <span id="toggle-comments-label">${l11n.showComments}</span>
        &nbsp;<span id="comments-count"></span>
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
    const countLabel = document.getElementById('comments-count');
    const comments = document.querySelector("ytd-item-section-renderer.ytd-comments");

    countLabel.classList.toggle('is-hide'); // toggle commentsCount.

    if (comments.classList.toggle('hide-comments')) {
      buttonLabel.textContent = l11n.showComments;
    } else {
      buttonLabel.textContent = l11n.hideComments;
    }
  },

  injectCommentsCount(e) {
    if (!newYouTube._ready(e)) return;

    newYouTube._commentsState.hasGotCount = false;
    newYouTube._rewriteCommentsCount('counting');
    newYouTube._waitCommentsCount()
  },
  
  _commentsState: {
    hasGotCount: false,
    currentCount: '',
  },

  _rewriteCommentsCount(condition) {
    const label = document.getElementById('comments-count');
    if (!label) return;
    
    debugLog('REWRITING COMMENTS COUNT...');
    (condition === 'counting') ? label.textContent = ''
                               : label.textContent = newYouTube._commentsState.currentCount;
  },

  _waitCommentsCount() {
    if (newYouTube._commentsState.hasGotCount) return;
    
    debugLog('OBSERVING COMMENTS COUNT...');

    const observerTarget = document.getElementById('comments'); // `<ytd-comments id="comments" ...>`
    const observerConfig = { childList: true, subtree: true };
    const commentsCountObserver = new MutationObserver( mutations => {
      mutations.some( mutation => {
        // debugLog(mutation)
        if (
          /**
           * Detect render of fetch target node.
           * 1st expression(id === 'header') is for when the parse target node mutation didn't occur.
           * This occurrence condition is when navigating to same number of comments video. e.g.(5 comments to 5 comments)
           */
          mutation.target.id === 'header'||
          mutation.target.tagName === 'YT-FORMATTED-STRING' &&
          mutation.target.classList.contains('count-text')
        ) {
          commentsCountObserver.disconnect();
          debugLog('OBSERVED COMMENTS COUNT...');
          newYouTube._fetchCommentsCount();
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
    newYouTube._commentsState.hasGotCount = true;
    newYouTube._commentsState.currentCount = countString;
    newYouTube._rewriteCommentsCount()
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
