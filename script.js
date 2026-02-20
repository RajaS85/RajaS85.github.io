// 1. Firebase Configuration (Manhwa-Final)
const firebaseConfig = {
    apiKey: "AIzaSyAhV1QCnWoeNEOJwKWMc0Zrk43WJ6OfPII",
    authDomain: "manhwa-final.firebaseapp.com",
    projectId: "manhwa-final",
    storageBucket: "manhwa-final.firebasestorage.app",
    messagingSenderId: "657663835445",
    appId: "1:657663835445:web:be54175c16e3f592bbe07c",
    measurementId: "G-K7QSBRDZ6N"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// 2. Theme Toggle Logic
const toggleSwitch = document.querySelector('#checkbox');
const modeText = document.querySelector('#mode-text');

function switchTheme(e) {
    if (e.target.checked) {
        // Toggle ON = Dark Mode
        document.body.classList.remove('light-mode');
        if (modeText) modeText.innerText = "Dark";
        localStorage.setItem('theme', 'dark');
    } else {
        // Toggle OFF = Light Mode
        document.body.classList.add('light-mode');
        if (modeText) modeText.innerText = "Light";
        localStorage.setItem('theme', 'light');
    }    
}

// Add the listener once
if (toggleSwitch) {
    toggleSwitch.addEventListener('change', switchTheme, false);
}

// 3. Load Saved Preference
const currentTheme = localStorage.getItem('theme');
if (currentTheme === 'light') {
    document.body.classList.add('light-mode');
    if (toggleSwitch) toggleSwitch.checked = false;
    if (modeText) modeText.innerText = "Light";
} else {
    document.body.classList.remove('light-mode');
    if (toggleSwitch) toggleSwitch.checked = true;
    if (modeText) modeText.innerText = "Dark";
}
// Function to update character count
function updateCount() {
    const text = document.getElementById('storyText').value;
    const countDisplay = document.getElementById('charCount');
    if (countDisplay) {
        countDisplay.innerText = `Characters: ${text.length} / 1000`;
        countDisplay.style.color = text.length > 1000 ? "#ff4d4d" : "";
    }
}

// Function to Save a Story
async function saveStory() {
    const title = document.getElementById('storyTitle').value;
    const text = document.getElementById('storyText').value;
    if(!title || !text) return alert("Please fill both boxes!");

    try {
        await db.collection("stories").add({
            title: title,
            content: text,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        alert("Story Posted!");
        document.getElementById('storyTitle').value = "";
        document.getElementById('storyText').value = "";
        updateCount();
    } catch (e) {
        alert("Error: Check your Firebase Rules!");
    }
}

// Pull Stories in Real-Time (Only run if storiesList exists on the page)
const list = document.getElementById('storiesList');
if (list) {
    db.collection("stories").orderBy("timestamp", "desc").onSnapshot((snapshot) => {
        list.innerHTML = "";
        snapshot.forEach((doc) => {
            const story = doc.data();
            list.innerHTML += `
                <div class="card">
                    <h3>${story.title}</h3>
                    <p>${story.content}</p>
                </div>`;
        });
    });
}
