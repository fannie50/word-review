
let words = {};
let currentModule = "";
let currentIndex = 0;
let quizMode = false;

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
    showWord();
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

function toggleMode() {
  quizMode = !quizMode;
  document.getElementById("modeBtn").textContent = quizMode ? "切换为背诵模式" : "切换为测验模式";
  showWord();
}

function showWord() {
  const wordObj = words[currentModule][currentIndex];
  const englishEl = document.getElementById("english");
  const phoneticEl = document.getElementById("phonetic");
  const chineseEl = document.getElementById("chinese");

  if (quizMode) {
    // 测验模式：只显示中文，点击英文显示答案
    englishEl.textContent = "❓ 点击显示英文";
    phoneticEl.textContent = "";
    chineseEl.textContent = wordObj.chinese;

    englishEl.onclick = () => {
      englishEl.textContent = wordObj.english;
      phoneticEl.textContent = wordObj.phonetic;
      speakWord(wordObj.english);
    };
  } else {
    // 背诵模式：全部显示
    englishEl.textContent = wordObj.english;
    phoneticEl.textContent = wordObj.phonetic;
    chineseEl.textContent = wordObj.chinese;
    englishEl.onclick = () => speakWord(wordObj.english);
  }
}

function speakWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-US";
  speechSynthesis.speak(utterance);
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("english").onclick = () => {};
});
