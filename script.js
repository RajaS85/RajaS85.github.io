// 1. FIREBASE CONFIGURATION (Manhwa-Final)
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

// 2. THEME TOGGLE LOGIC
const toggleSwitch = document.querySelector('#checkbox');
const modeText = document.querySelector('#mode-text');

function switchTheme(e) {
    if (e.target.checked) {
        document.body.classList.remove('light-mode');
        if(modeText) modeText.innerText = "Dark";
        localStorage.setItem('theme', 'dark');
    } else {
        document.body.classList.add('light-mode');
        if(modeText) modeText.innerText = "Light";
        localStorage.setItem('theme', 'light');
    }    
}

if(toggleSwitch) {
    toggleSwitch.addEventListener('change', switchTheme);
}

// Load saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
    if(toggleSwitch) toggleSwitch.checked = false;
    if(modeText) modeText.innerText = "Light";
} else {
    if(toggleSwitch) toggleSwitch.checked = true;
    if(modeText) modeText.innerText = "Dark";
}

// 3. DATABASE FUNCTIONS
function updateCount() {
    const text = document.getElementById('storyText').value;
    const countDisplay = document.getElementById('charCount');
    if(countDisplay) {
        countDisplay.innerText = `Characters: ${text.length} / 1000`;
    }
}

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

// 4. REAL-TIME STORIES & DELETE LOGIC
const storiesList = document.getElementById('storiesList');
if(storiesList) {
    db.collection("stories").orderBy("timestamp", "desc").onSnapshot(snap => {
        storiesList.innerHTML = "";
        snap.forEach(doc => {
            const s = doc.data();
            const storyId = doc.id; // Correctly grab the ID
            storiesList.innerHTML += `
                <div class="card">
                    <h3>${s.title}</h3>
                    <p>${s.content}</p>
                    <button class="btn-delete" onclick="deleteStory('${storyId}')">Delete</button>
                </div>`;
        });
    });
}

async function deleteStory(id) {
    const password = prompt("Enter Admin Password to Delete:");
    if (password === "Raja123") { 
        if(confirm("Are you sure you want to delete this story forever?")) {
            try {
                await db.collection("stories").doc(id).delete();
                alert("Story deleted!");
            } catch (error) {
                alert("Error: " + error.message);
            }
        }
    } else {
        alert("Wrong password!");
    }
}
