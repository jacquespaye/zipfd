chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.command === "getWordsFromActiveTab") {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      // Ensure the tab isn't undefined and has an ID
      if (tabs[0] && tabs[0].id) {
        // Inject a content script into the current tab
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          files: ['content.js'] // Your content script file
        }, () => {
          // Send a message to the content script
          chrome.tabs.sendMessage(tabs[0].id, {command: "getWords"}, function(response) {
            if (response && response.words) {
              // Send the response back to the popup script
              sendResponse({words: response.words});
            }
          });
        });
      }
    });
  }
  return true; // Indicate that sendResponse will be called asynchronously
});

