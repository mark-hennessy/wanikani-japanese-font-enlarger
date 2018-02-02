// ==UserScript==
// @name          WaniKani Japanese Font Enlarger
// @description   Automatically enlarges Japanese font on WaniKani. Press 'u' to enlarge Japanese font even more.
// @author        konanji
// @version       0.0.65
// @namespace     https://greasyfork.org/en/users/168746
// @include       *.wanikani.com
// @include       *.wanikani.com/level/*
// @include       *.wanikani.com/radicals*
// @include       *.wanikani.com/kanji*
// @include       *.wanikani.com/vocabulary*
// @include       *.wanikani.com/review/session
// @include       *.wanikani.com/lesson/session
// @grant         none
// ==/UserScript==

var defaultFontSize = 28;

var jPatt = /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uffef\u4e00-\u9faf\u3400-\u4dbf]+/g;

if (document.readyState === "complete") {
  init();
} else {
  window.addEventListener("load", init);
}

document.addEventListener(
  "keydown",
  function(event) {
    if (event.keyCode == 85 /*u*/) {
      // If the search input field has focus do nothing
      var activeElement = document.activeElement;
      if (activeElement instanceof HTMLInputElement) return;

      enlarge(defaultFontSize * 2);
    }
  },
  false
);

function init() {
  enlarge();

  var isLesson = /\/lesson/.test(document.URL);
  var isReview = /\/review/.test(document.URL);

  if (isLesson) {
    var supplementNavHandler = function(mutations) {
      enlarge();
    };

    new MutationObserver(supplementNavHandler).observe(
      document.getElementById("supplement-nav"),
      { attributes: true, subtree: true }
    );
  }

  if (isLesson || isReview) {
    var itemInfoHandler = function(mutations) {
      // The last one always has 2 mutations, so let's use that
      if (mutations.length != 2) return;

      enlarge();
    };

    new MutationObserver(itemInfoHandler).observe(
      document.getElementById("item-info"),
      { attributes: true }
    );
  }
}

function enlarge(fontSize) {
  enlargeOnlyInnerMost(document.body, fontSize);
}

function enlargeOnlyInnerMost(elem, fontSize) {
  var minFontSize = fontSize || defaultFontSize;
  var paret = elem.parentNode;
  var id = elem.id;
  var classList = elem.classList;

  if (elem.nodeName == "TEXTAREA") {
    return;
  }

  // if (id === 'item-info-col1') {
  //     return;
  // }

  if (classList) {
    if (
      classList.contains("navbar") ||
      classList.contains("legend") ||
      classList.contains("single-character-grid") ||
      classList.contains("multi-character-grid") ||
      classList.contains("character-item") ||
      classList.contains("radical") ||
      classList.contains("kanji") ||
      classList.contains("vocabulary") ||
      classList.contains("radical-icon") ||
      classList.contains("kanji-icon") ||
      classList.contains("vocabulary-icon") ||
      classList.contains("radical-highlight") ||
      classList.contains("kanji-highlight") ||
      classList.contains("vocabulary-highlight") ||
      classList.contains("reading-highlight")
    ) {
      return;
    }
  }

  if (elem.hasChildNodes()) {
    var cn = elem.childNodes;
    for (var i = 0; i < cn.length; i++) {
      enlargeOnlyInnerMost(cn[i], minFontSize);
    }
  } else {
    // at this point elem is a text node or an empty element
    var isElementNode = elem.nodeType == 1;
    if (isElementNode && elem.textContent.length <= 1) {
      if (elem.hasAttribute("value") && elem.value.search(jPatt) >= 0) {
        elem.style.fontSize = minFontSize + "px";
      }

      return;
    }

    var isTextNode = elem.nodeType == 3;
    if (isTextNode) {
      // if the font is already bigger than the min font size, then there is nothing to do
      if (
        elementCurrentStyle(paret, "font-size").replace("px", "") >= minFontSize
      ) {
        return;
      }

      if (paret.childNodes.length == 1) {
        // A node with only text in it. It's safe to just insert < and >
        paret.innerHTML = getEnlarged(paret.innerHTML, minFontSize);
      }
    }
  }
}

function getEnlarged(text, minFontSize) {
  return text.replace(
    jPatt,
    '<span style="font-size: ' +
      minFontSize +
      'px !important; line-height: normal !important;">$&</span>'
  );
}

/*
 * http://salaciak.blogspot.de/2011/02/javascript-dom-how-to-get-elements.html
 */
function elementCurrentStyle(element, styleName) {
  if (element.currentStyle) {
    var i = 0,
      temp = "",
      changeCase = false;
    for (i = 0; i < styleName.length; i++) {
      if (styleName[i] != "-") {
        temp += changeCase ? styleName[i].toUpperCase() : styleName[i];
        changeCase = false;
      } else {
        changeCase = true;
      }
    }

    styleName = temp;
    return element.currentStyle[styleName];
  }

  return getComputedStyle(element, null).getPropertyValue(styleName);
}
