const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const typingIndicator = document.getElementById("typingIndicator");
const themeToggle = document.getElementById("themeToggle");
const clearHistory = document.getElementById("clearHistory");

// Avatar images
// Avatar images as animated SVG data-URIs (not GIFs). These are lightweight, scalable,
// and animate natively in the image. Replace the SVG strings below if you want
// different artwork.
const userAvatar = (function(){
  const svg = `
  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='80' height='80'>
    <defs>
      <linearGradient id='g' x1='0' x2='1'>
        <stop offset='0' stop-color='#007BFF'/>
        <stop offset='1' stop-color='#00FFC1'/>
      </linearGradient>
    </defs>
    <circle cx='50' cy='50' r='30' fill='url(#g)'>
      <animate attributeName='r' values='28;34;28' dur='1.6s' repeatCount='indefinite' />
    </circle>
  </svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
})();

const botAvatar = (function(){
  const svg = `
  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='80' height='80'>
    <g>
      <rect x='22' y='32' width='56' height='36' rx='6' fill='#FFD54F'/>
      <circle cx='40' cy='50' r='4.5' fill='#2B2B2B'/>
      <circle cx='60' cy='50' r='4.5' fill='#2B2B2B'/>
      <rect x='44' y='60' width='12' height='3.5' rx='2' fill='#2B2B2B'/>
    </g>
    <animateTransform attributeName='transform' attributeType='XML' type='rotate' from='-6 50 50' to='6 50 50' dur='1s' repeatCount='indefinite'/>
  </svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
})();

// Load theme
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  themeToggle.textContent = "☀️";
}

// Load chat history
window.onload = () => {
  const savedChat = JSON.parse(localStorage.getItem("chatHistory")) || [];
  savedChat.forEach(msg => displayMessage(msg.text, msg.sender, false));
  chatBox.scrollTop = chatBox.scrollHeight;
};

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", e => {
  if (e.key === "Enter") sendMessage();
});

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const darkMode = document.body.classList.contains("dark");
  themeToggle.textContent = darkMode ? "☀️" : "🌙";
  localStorage.setItem("theme", darkMode ? "dark" : "light");
});

clearHistory.addEventListener("click", () => {
  if (confirm("Are you sure you want to clear the chat history?")) {
    // Clear the chat display
    chatBox.innerHTML = "";
    // Clear the localStorage
    localStorage.removeItem("chatHistory");
    // Add a system message
    displayMessage("Chat history has been cleared.", "bot", true);
  }
});

function sendMessage() {
  const message = userInput.value.trim();
  if (message === "") return;

  displayMessage(message, "user", true);
  userInput.value = "";

  typingIndicator.style.display = "block";

  setTimeout(() => {
    botReply(message);
    typingIndicator.style.display = "none";
  }, 1000);
}

function displayMessage(text, sender, save = true) {
  const wrapper = document.createElement("div");
  wrapper.classList.add("message-wrapper");
  if (sender === "user") wrapper.classList.add("user-wrapper");

  const avatar = document.createElement("img");
  avatar.src = sender === "user" ? userAvatar : botAvatar;
  avatar.classList.add("avatar");
  // Accessibility: set descriptive alt text for screen readers
  avatar.alt = sender === "user" ? "User avatar" : "Bot avatar";
  avatar.setAttribute('role', 'img');

  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", sender);
  messageDiv.textContent = text;

  wrapper.appendChild(avatar);
  wrapper.appendChild(messageDiv);
  chatBox.appendChild(wrapper);
  chatBox.scrollTop = chatBox.scrollHeight;

  if (save) saveMessage(text, sender);
}

function botReply(userMessage) {
  const msg = userMessage.toLowerCase();
  let reply;

  // Greetings
  if (msg.includes("hello") || msg.includes("hi ") || msg.includes("hey")) {
    const greetings = [
      "Hi there! 👋 How can I assist you today?",
      "Hello! Great to see you! 😊",
      "Hey! How are you doing today? 👋",
      "Hi! I'm here to help! 🌟"
    ];
    reply = greetings[Math.floor(Math.random() * greetings.length)];
  }
  // Time related
  else if (msg.includes("time")) {
    reply = "⏰ Current time is: " + new Date().toLocaleTimeString();
  }
  // Date related
  else if (msg.includes("date") || msg.includes("day") || msg.includes("month") || msg.includes("year")) {
    reply = "📅 Today's date is: " + new Date().toLocaleDateString();
  }
  // Weather related
  else if (msg.includes("weather") || msg.includes("temperature") || msg.includes("forecast")) {
    reply = "I don't have real-time weather data, but I can suggest checking your local weather service! ⛅";
  }
  // Calculations
  else if (msg.includes("calculate") || msg.includes("sum") || msg.includes("plus") || msg.includes("minus")) {
    reply = "I can understand basic math! Try writing a simple equation. 🧮";
  }
  // Jokes
  else if (msg.includes("joke") || msg.includes("funny")) {
    const jokes = [
      "Why don't programmers like nature? It has too many bugs! 🐛",
      "Why did the scarecrow win an award? Because he was outstanding in his field! 🌾",
      "What do you call a bear with no teeth? A gummy bear! 🐻",
      "Why don't eggs tell jokes? They'd crack up! 🥚"
    ];
    reply = jokes[Math.floor(Math.random() * jokes.length)];
  }
  // Mood
  else if (msg.includes("how are you") || msg.includes("feeling")) {
    const moods = [
      "I'm doing great, thanks for asking! 😊",
      "I'm feeling energetic and ready to help! ⚡",
      "All systems operational and happy to chat! 🚀",
      "I'm having a wonderful day, hope you are too! 🌟"
    ];
    reply = moods[Math.floor(Math.random() * moods.length)];
  }
  // Music
  else if (msg.includes("music") || msg.includes("song") || msg.includes("sing")) {
    reply = "I love music! Though I can't sing, I can appreciate all genres! 🎵 What's your favorite type of music?";
  }
  // Food
  else if (msg.includes("food") || msg.includes("eat") || msg.includes("hungry")) {
    const foods = [
      "I don't eat, but I'd love to learn about your favorite foods! 🍽️",
      "I hear humans love pizza! 🍕 What's your favorite topping?",
      "I wish I could taste ice cream! 🍦 What flavors do you enjoy?",
      "Food is fascinating! What cuisine do you like best? 🌮"
    ];
    reply = foods[Math.floor(Math.random() * foods.length)];
  }
  // Help
  else if (msg.includes("help") || msg.includes("support") || msg.includes("assist")) {
    reply = "I can help with various topics! Try asking me about:\n- Time and date\n- Jokes\n- Basic chat\n- Fun facts\nOr just say hello! 💡";
  }
  // Goodbye
  else if (msg.includes("bye") || msg.includes("goodbye") || msg.includes("see you")) {
    const goodbyes = [
      "Goodbye! See you soon! 😊",
      "Take care! Come back anytime! 👋",
      "Bye bye! Have a great day! ✨",
      "Until next time! Stay awesome! 🌟"
    ];
    reply = goodbyes[Math.floor(Math.random() * goodbyes.length)];
  }
  // Name
  else if (msg.includes("name") || msg.includes("who are you")) {
    reply = "I'm ChatBot 🤖 — your friendly assistant!";
  }
  // Thank you
  else if (msg.includes("thank") || msg.includes("thanks")) {
    const thanks = [
      "You're welcome! 😊",
      "Anytime! Happy to help! ✨",
      "It's my pleasure! 🌟",
      "Glad I could help! 💫"
    ];
    reply = thanks[Math.floor(Math.random() * thanks.length)];
  }
  // Default response
  else {
    const defaults = [
      "I'm still learning... Try asking me about time, date, jokes, or just say hello! 🤔",
      "Interesting! While I think about that, why not try asking me for a joke? 💭",
      "I'm not sure about that, but I'd love to chat about something else! 🌟",
      "That's beyond my current abilities, but I'm happy to help with other topics! 💡"
    ];
    reply = defaults[Math.floor(Math.random() * defaults.length)];
  }

  displayMessage(reply, "bot", true);
}

function saveMessage(text, sender) {
  const chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
  chatHistory.push({ text, sender });
  localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
}
