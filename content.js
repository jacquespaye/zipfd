// content.js
function getAllWords() {
  const text = document.body.innerText;
  const words = text.split(/\s+/);
  const word_count = {};
  for (let word of words) {
    word = word.trim().toLowerCase();
    word = word.replace(/[^a-z]/gi, '');
    if (word === '') {
      continue;
    }
    if (!(word in word_count)) {
      word_count[word] = 0;
    }
    word_count[word] = word_count[word] + 1;
  }
  let word_array = Object.entries(word_count);
  word_array.sort((a, b) => b[1] - a[1]);
  return word_array;
}

// Listen for messages from popup or background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.command === "getWords") {
    const words = getAllWords();
    sendResponse({ words: words });
  }
});

