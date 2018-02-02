# WaniKani Japanese Font Enlarger

Automatically enlarges Japanese font on the WaniKani website. Press 'u' to enlarge Japanese font even more.

I created this user script to make it easier to see the intricate details of unfamiliar kanji on low resolution screens.

Feel free to use and edit this script locally. The script's default font size for Japanese text is 28px, but can easily be changed by editing the code.

## Optional Browser Extensions

I recommend the following browser extensions to make WaniKani context sentences easier to read and more useful for beginners who don't already know all of the kanji.

### [rikaikun](https://chrome.google.com/webstore/detail/rikaikun/jipdnfibhldikgcjhfnomkfpcebammhp?hl=en)

Translate Japanese by hovering over words

### [IPA furigana](https://chrome.google.com/webstore/detail/ipa-furigana/jnnbgnfnncobhklficfkdnclohaklifi?hl=en)

Looks up the readings for kanji words and inserts them as furigana

## Screenshots

### Lesson with Normal Font Size

![Lesson with Normal Font Size](screenshots/lesson_with_normal_font_size.png)

### Lesson with Enlarged Font Size

![Lesson with Enlarged Font Size](screenshots/lesson_with_enlarged_font_size.png)

### Lesson with Double Enlarged Font Size

![Lesson with Double Enlarged Font Size](screenshots/lesson_with_double_enlarged_font_size.png)

## Acknowledgements

The code was thrown together quickly by copying code from other open-source user scripts.

The core logic was copied from a project called "enlargeJapanese", but I'm not able to find a link to the project anymore. It was a general script for ensuring a min font size for Japanese text on any website, but caused visual glitches on WaniKani and broke the audio button for vocabulary readings. I updated the code to tailor it for WaniKani. I fixed the audio button issues and increased the Japanese min font size from 16px to 28px.

I also copied code from the [WaniKani Stroke Order](https://greasyfork.org/en/scripts/723-wanikani-stroke-order) user script to detect DOM changes on WaniKani lesson and review pages.

## Disclaimer

I'm not affiliated with WaniKani or any of the Chrome extensions that I'm recommending. The script may break in the future if WaniKani changes their website.

## License & Copyright

© Mark Hennessy

Licensed under the [MIT License](LICENSE)
