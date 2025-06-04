
let words = {};
let currentModule = "";
let currentIndex = 0;
let recognizing = false;
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

function showWord() {
  const wordObj = words[currentModule][currentIndex];
  document.getElementById("english").textContent = wordObj.english;
  document.getElementById("phonetic").textContent = wordObj.phonetic;
  document.getElementById("chinese").textContent = wordObj.chinese;
  document.getElementById("resultText").textContent = "";
}

function speakWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-US";
  speechSynthesis.speak(utterance);
}

function startVoiceRecognition() {
  const wordObj = words[currentModule][currentIndex];

  if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
    alert("当前浏览器不支持语音识别，请使用 Chrome 或 Edge 浏览器。");
    return;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.start();
  recognizing = true;

  recognition.onresult = function (event) {
    const spoken = event.results[0][0].transcript.toLowerCase().trim();
    const expected = wordObj.english.toLowerCase();

    if (spoken === expected) {
      document.getElementById("resultText").textContent = `✅ 正确：你说了 "${spoken}"`;
      nextWord();
    } else {
      document.getElementById("resultText").textContent = `❌ 错误：你说的是 "${spoken}"，正确是 "${expected}"`;
    }
    recognizing = false;
  };

  recognition.onerror = function (event) {
    document.getElementById("resultText").textContent = "❌ 识别失败，请再试一次";
    recognizing = false;
  };
}
