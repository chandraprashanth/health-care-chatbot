let diseasesData = [];

// Load dataset
fetch("diseases.json")
  .then(response => response.json())
  .then(data => diseasesData = data)
  .catch(err => console.error("Failed to load disease data:", err));

const userInput = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");
const sendBtn = document.getElementById("send-btn");

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", function(e) {
  if (e.key === "Enter") sendMessage();
});

function sendMessage() {
  const message = userInput.value.trim();
  if (message === "") return;
  appendMessage("user", message);
  userInput.value = "";
  botReply(message);
}

function appendMessage(sender, text) {
  const msgDiv = document.createElement("div");
  msgDiv.classList.add(sender === "user" ? "user-msg" : "bot-msg");
  msgDiv.innerHTML = `<p><b>${sender === "user" ? "You" : "Bot"}:</b> ${text}</p>`;
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function botReply(message) {
  message = message.toLowerCase();
  let detectedSymptoms = message.split(/[, ]+/).map(s => s.trim()).filter(s => s.length>0);
  let possibleDiseases = [];

  diseasesData.forEach(disease => {
    let matchCount = disease.symptoms.filter(symptom =>
      detectedSymptoms.some(userSymptom => userSymptom.includes(symptom))
    ).length;
    if (matchCount > 0) {
      possibleDiseases.push({ name: disease.disease, matches: matchCount });
    }
  });

  let reply = "I'm not sure. Please consult a doctor for an accurate diagnosis.";
  if (possibleDiseases.length > 0) {
    possibleDiseases.sort((a,b) => b.matches - a.matches);
    reply = `Based on your symptoms, you might have: ${possibleDiseases[0].name}`;
  }

  setTimeout(() => appendMessage("bot", reply), 600);
}