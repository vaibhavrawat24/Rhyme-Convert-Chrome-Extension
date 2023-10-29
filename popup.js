document
  .getElementById("rhymeifyButton")
  .addEventListener("click", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs.length > 0) {
        const activeTab = tabs[0];

        chrome.scripting.executeScript({
          target: { tabId: activeTab.id },
          function: rhymeifyHeadlines,
        });
      } else {
        console.error("No active tab found");
      }
    });
  });

function rhymeifyHeadlines() {
  function fetchRhymes(word, callback) {
    const url = `https://api.datamuse.com/words?rel_rhy=${word}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          const rhyme = data[0].word;
          callback(rhyme);
        } else {
          callback(word);
        }
      })
      .catch((error) => {
        console.error("Error fetching rhymes:", error);
        callback(word);
      });
  }

  function replaceHeadlines() {
    const headlines = document.querySelectorAll(".headline-class");
    headlines.forEach((headline) => {
      const originalText = headline.innerText;
      const words = originalText.split(" ");

      Promise.all(
        words.map(
          (word) =>
            new Promise((resolve) => {
              fetchRhymes(word, (rhyme) => {
                word = word.replace(/\W/g, "");
                resolve({ word, rhyme });
              });
            })
        )
      ).then((replacements) => {
        replacements.forEach(({ word, rhyme }) => {
          originalText = originalText.replace(word, rhyme);
        });

        headline.innerText = originalText;
      });
    });
  }

  replaceHeadlines();
}

rhymeifyHeadlines();
