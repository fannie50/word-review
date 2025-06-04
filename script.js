
let words = {};
let currentModule = "";
let currentIndex = 0;

fetch("words.json")
  .then(response => response.json())
  .then(data => {
    words = data;
    const moduleSelect = document.getElementById("module");
    for (let module in words) {
      const option = document.createElement("option");
      option.value = module;
      option.textContent = module;
      moduleSelect.appendChild(option);
    }
    currentModule = moduleSelect.value;
  });

function changeModule(value) {
  currentModule = value;
  currentIndex = 0;
  showWord();
}

function nextWord() {
  if (!currentModule || !words[currentModule]) return;
  currentIndex = (currentIndex + 1) % words[currentModule].length;
  showWord();
}

function showWord() {
  const wordObj = words[currentModule][currentIndex];
  document.getElementById("english").textContent = wordObj.english;
  document.getElementById("phonetic").textContent = wordObj.phonetic;
  document.getElementById("chinese").textContent = wordObj.chinese;
}

// 发音功能
document.addEventListener("DOMContentLoaded", () => {
  const englishElem = document.getElementById("english");
  englishElem.addEventListener("click", () => {
    const word = englishElem.textContent;
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-US";
    speechSynthesis.speak(utterance);
  });
});
