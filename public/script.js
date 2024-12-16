import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getDatabase, ref, onValue, push, set, update } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "",
  authDomain: "liveleaderboard-235f3.firebaseapp.com",
  databaseURL: "https://liveleaderboard-235f3-default-rtdb.firebaseio.com",
  projectId: "liveleaderboard-235f3",
  storageBucket: "liveleaderboard-235f3.firebasestorage.app",
  messagingSenderId: "427587378569",
  appId: "1:427587378569:web:266856fca5df3c9fdf5558"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Select form and leaderboard elements
const leaderboardDiv = document.getElementById("leaderboard");
const joinForm = document.getElementById("join-form");

// Reference to competition data
const competitionRef = ref(db, "competitions/competition1/users");

// Real-time listener to update the leaderboard
onValue(competitionRef, (snapshot) => {
  const users = snapshot.val();
  leaderboardDiv.innerHTML = ""; // Clear previous leaderboard content

  if (users) {
    // Sort users by score in descending order
    const sortedUsers = Object.entries(users).sort(([, a], [, b]) => b.score - a.score);

    // Display users and scores
    sortedUsers.forEach(([userId, user]) => {
      const userDiv = document.createElement("div");
      userDiv.innerHTML = `
        <span>${user.name}: ${user.score}</span>
        <button onclick="incrementScore('${userId}', ${user.score})">UP</button>
      `;
      leaderboardDiv.appendChild(userDiv);
    });
  }
});

// Handle form submission to add a new user
joinForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const score = parseInt(document.getElementById("score").value);

  if (username && !isNaN(score)) {
    const newUserRef = push(competitionRef);
    set(newUserRef, {
      name: username,
      score: score
    });

    // Clear input fields
    document.getElementById("username").value = "";
    document.getElementById("score").value = "";
  }
});

// Function to increment the user's score
window.incrementScore = (userId, currentScore) => {
  const userRef = ref(db, `competitions/competition1/users/${userId}`);
  update(userRef, {
    score: currentScore + 1
  });
};
