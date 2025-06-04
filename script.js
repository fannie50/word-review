
let words = {};
let currentModule = "";
let currentIndex = 0;
let spellMode = true;
let recognition;

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
  spellMode = !spellMode;
  document.getElementById("modeBtn").textContent = spellMode ? "切换为背诵模式" : "切换为拼写练习";
  showWord();
}

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

function showWord() {
  const wordObj = words[currentModule][currentIndex];
  const englishEl = document.getElementById("english");
  const phoneticEl = document.getElementById("phonetic");
  const chineseEl = document.getElementById("chinese");
  const inputEl = document.getElementById("answerInput");
  const checkBtn = document.getElementById("checkBtn");
  const scrambledEl = document.getElementById("scrambled");
  const resultText = document.getElementById("resultText");

  resultText.textContent = "";

  if (!spellMode) {
    englishEl.textContent = wordObj.english;
    phoneticEl.textContent = wordObj.phonetic;
    chineseEl.textContent = wordObj.chinese;
    inputEl.style.display = "none";
    checkBtn.style.display = "none";
    scrambledEl.innerHTML = "";
    englishEl.onclick = () => speakWord(wordObj.english);
  } else {
    englishEl.textContent = "请根据中文提示拼出英文：";
    phoneticEl.textContent = wordObj.chinese;
    chineseEl.textContent = "";
    inputEl.value = "";
    inputEl.style.display = "inline-block";
    checkBtn.style.display = "inline-block";
    inputEl.placeholder = "输入英文单词";
    scrambledEl.innerHTML = shuffleArray(wordObj.english.split("")).map(c => `<span class='letter'>${c}</span>`).join(" ");
    checkBtn.onclick = () => {
      if (inputEl.value.toLowerCase().trim() === wordObj.english.toLowerCase()) {
        resultText.textContent = `✅ 拼写正确！`;
        nextWord();
      } else {
        resultText.textContent = `❌ 再试一次！`;
      }
    };
  }
}

function speakWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-US";
  speechSynthesis.speak(utterance);
}

function startVoiceRecognition() {
  const wordObj = words[currentModule][currentIndex];
  const resultText = document.getElementById("resultText");

  if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
    alert("当前浏览器不支持语音识别，请使用 Chrome 或 Edge。");
    return;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.start();

  recognition.onresult = function (event) {
    const spoken = event.results[0][0].transcript.toLowerCase().trim();
    const expected = wordObj.english.toLowerCase();
    if (spoken === expected) {
      resultText.textContent = `🎉 正确：你说了 "${spoken}"`;
      nextWord();
    } else {
      resultText.textContent = `😢 错误：你说的是 "${spoken}"，正确是 "${expected}"`;
    }
  };

  recognition.onerror = function () {
    resultText.textContent = "❌ 识别失败，请再试一次";
  };
}
