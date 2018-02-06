// ==UserScript==
// @name          WaniKani Japanese Font Enlarger
// @description   Automatically enlarges Japanese font on WaniKani. Press 'u' to enlarge Japanese font even more.
// @author        konanji
// @version       1.0.8
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

// A regex pattern to match Japanese text.
var japaneseRegex = /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uffef\u4e00-\u9faf\u3400-\u4dbf]+/g;

var defaultFontSize = 28;

var cssClassesToIgnore = [
  "navbar",
  "legend",

  "single-character-grid",
  "multi-character-grid",
  "character-item",

  "radical",
  "kanji",
  "vocabulary",

  "radical-icon",
  "kanji-icon",
  "vocabulary-icon",

  "radical-highlight",
  "kanji-highlight",
  "vocabulary-highlight",
  "reading-highlight",

  "highlight-radical",
  "highlight-kanji",
  "highlight-vocabulary",
  "highlight-reading"
];

if (document.readyState === "complete") {
  init();
} else {
  window.addEventListener("load", init);
}

function init() {
  initMutationListeners();
  initKeyboardShortcuts();
  enlargeJapaneseText();
}

function initMutationListeners() {
  var url = document.URL;
  var isLesson = /\/lesson/.test(url);
  var isReview = /\/review/.test(url);

  if (isLesson) {
    var supplementNavHandler = function(mutations) {
      enlargeJapaneseText();
    };

    new MutationObserver(supplementNavHandler).observe(
      document.getElementById("supplement-nav"),
      { attributes: true, subtree: true }
    );
  }

  if (isLesson || isReview) {
    var itemInfoHandler = function(mutations) {
      // The last one always has 2 mutations, so let's use that
      if (mutations.length != 2) {
        return;
      }

      enlargeJapaneseText();
    };

    new MutationObserver(itemInfoHandler).observe(
      document.getElementById("item-info"),
      { attributes: true }
    );
  }
}

function initKeyboardShortcuts() {
  document.addEventListener(
    "keydown",
    function(event) {
      if (event.keyCode == 85 /*u*/ && !isTextBox(document.activeElement)) {
        enlargeJapaneseText(defaultFontSize * 2);
      }
    },
    false
  );
}

function enlargeJapaneseText(fontSize) {
  enlargeJapaneseTextRecursive(document.body, fontSize || defaultFontSize);
}

function enlargeJapaneseTextRecursive(element, fontSize) {
  // Stop traversing if a text area is encountered.
  if (element.nodeName == "TEXTAREA") {
    return;
  }

  // Stop traversing if an ignored CSS class is encountered.
  var classList = element.classList;
  if (classList) {
    for (var i = 0; i < cssClassesToIgnore.length; i++) {
      if (classList.contains(cssClassesToIgnore[i])) {
        return;
      }
    }
  }

  // If there are child nodes, then recursively traverse the DOM.
  if (element.hasChildNodes()) {
    var childNodes = element.childNodes;
    for (var i = 0; i < childNodes.length; i++) {
      enlargeJapaneseTextRecursive(childNodes[i], fontSize);
    }

    return;
  }

  var isTextNode = element.nodeType == 3;
  var parent = element.parentNode;
  var onlyChild = parent.childNodes.length == 1;

  if (isTextNode && onlyChild) {
    // When comparing a string with a number, JavaScript will
    // convert the string to a number when doing the comparison.
    var currentFontSize = getStyleValue(parent, "font-size").replace("px", "");

    if (fontSize > currentFontSize) {
      // This is a node with only text in it, so it's safe to insert a child span.
      parent.innerHTML = getEnlargedText(parent.innerHTML, fontSize);
    }
  }
}

function getEnlargedText(text, minFontSize) {
  return text.replace(
    japaneseRegex,
    '<span style="font-size: ' +
      minFontSize +
      'px !important; line-height: normal !important;">$&</span>'
  );
}

function getStyleValue(element, styleName) {
  if (!element.currentStyle) {
    return getComputedStyle(element, null).getPropertyValue(styleName);
  }

  return element.currentStyle[camelCase(styleName)];
}

/**
 * Converts a dashed-cased string to a camelCased string.
 * This is useful for converting CSS properties to their
 * JavaScript equivalents, e.g. font-size => fontSize
 *
 * @param {string} inputString a dash-cased string
 * @returns the camelCased equivalent of the input
 */
function camelCase(inputString) {
  var camelCasedString = "";

  var upperCaseNextChar = false;
  for (var i = 0; i < inputString.length; i++) {
    var char = inputString[i];

    if (char == "-") {
      // Ignore the dash, but uppercase the next character.
      upperCaseNextChar = true;
    } else {
      camelCasedString += upperCaseNextChar ? char.toUpperCase() : char;
      upperCaseNextChar = false;
    }
  }

  return camelCasedString;
}

function isTextBox(element) {
  if (!element) {
    return false;
  }

  var tagName = element.tagName.toLowerCase();

  if (tagName === "textarea") {
    return true;
  }

  if (tagName === "input") {
    var type = element.getAttribute("type").toLowerCase();

    // If an input types is not supported by the browser,
    // then it will behave as input type text.
    var inputTypes = [
      "text",
      "password",
      "number",
      "email",
      "tel",
      "url",
      "search",
      "date",
      "datetime",
      "datetime-local",
      "time",
      "month",
      "week"
    ];

    return inputTypes.indexOf(type) >= 0;
  }

  return false;
}
