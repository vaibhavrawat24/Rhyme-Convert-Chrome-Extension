chrome.action.onClicked.addListener(function (tab) {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: rhymeifyHeadlines,
  });
});

function rhymeifyHeadlines() {
  const headlineRegex = /India/gi;

  const elements = document.querySelectorAll("h1, h2, h3, .headline-class"); // Replace with the actual selector for headlines

  elements.forEach((element) => {
    const originalText = element.textContent;
    const rhymedText = originalText.replace(headlineRegex, "Rhyme");
    element.textContent = rhymedText;
  });
}

rhymeifyHeadlines();
