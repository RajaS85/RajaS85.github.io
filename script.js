// 1. FIREBASE INITIALIZATION
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
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

// 2. THEME TOGGLE LOGIC
document.addEventListener('DOMContentLoaded', () => {
    const toggleSwitch = document.querySelector('#checkbox');
    const modeText = document.getElementById('mode-text');
    
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'light-mode') {
        document.body.classList.add('light-mode');
        if (toggleSwitch) toggleSwitch.checked = true;
        if (modeText) modeText.innerText = "Light";
    }

    if (toggleSwitch) {
        toggleSwitch.addEventListener('change', () => {
            if (toggleSwitch.checked) {
                document.body.classList.add('light-mode');
                localStorage.setItem('theme', 'light-mode');
                if (modeText) modeText.innerText = "Light";
            } else {
                document.body.classList.remove('light-mode');
                localStorage.setItem('theme', 'dark-mode');
                if (modeText) modeText.innerText = "Dark";
            }
        });
    }
});

// 3. WORDPAD SAVING LOGIC
async function saveStory() {
    const titleInput = document.getElementById('storyTitle');
    const contentInput = document.getElementById('storyText');

    if (!titleInput || !contentInput) return;

    const title = titleInput.value;
    const content = contentInput.innerHTML; // Captures formatting for the Reader
    const author = prompt("Enter your Name:");
    const secretCode = prompt("Create a secret code to manage this story later:");

    if (!title || content === "" || content === "Start your script here..." || !secretCode) {
        return alert("Please fill in the title, content, and your secret code!");
    }

    try {
        await db.collection("stories").add({
            title: title,
            content: content,
            author: author || "Anonymous",
            editCode: secretCode,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        alert("Published successfully!");
        location.reload(); 
    } catch (e) {
        console.error("Error saving story: ", e);
        alert("Error publishing. Check console and Firebase Rules.");
    }
}

// 4. LOAD STORY INDEX (Real-time updates)
const storiesList = document.getElementById('storiesList');
if (storiesList) {
    db.collection("stories").orderBy("timestamp", "desc").onSnapshot((snap) => {
        storiesList.innerHTML = ""; 
        snap.forEach((doc) => {
            const s = doc.data();
            const id = doc.id;

            storiesList.innerHTML += `
                <div class="col-md-6 mb-4">
                    <div class="card h-100 shadow-sm">
                        <div class="card-body">
                            <h4 class="card-title highlight">${s.title}</h4>
                            <p class="card-text text-muted small">By: ${s.author}</p>
                            <div class="d-flex justify-content-between mt-3">
                                <a href="reader.html?id=${id}" class="btn btn-sm btn-warning">Read Full Story →</a>
                                <button onclick="secureDelete('${id}', '${s.editCode}')" class="btn btn-sm btn-outline-danger">Delete</button>
                            </div>
                        </div>
                    </div>
                </div>`;
        });
    });
}

// 5. SECURE DELETE FUNCTION
async function secureDelete(id, correctCode) {
    const userInput = prompt("Enter the Secret Code for this story:");
    if (userInput === correctCode || userInput === "RajaAdmin79") {
        if (confirm("Delete this story permanently?")) {
            await db.collection("stories").doc(id).delete();
            alert("Deleted!");
        }
    } else {
        alert("Incorrect Code. Access Denied.");
    }
}

// 6. RYTS WEB DOWNLOADER LOGIC
async function generateDownload() {
    const url = document.getElementById('videoUrl').value;
    const resultArea = document.getElementById('downloadResult');
    const downloadBtn = document.getElementById('downloadBtn');
    const titleText = document.getElementById('videoTitle');
    const thumbnail = document.getElementById('videoThumbnail');

    const videoIdMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);

    if (!videoIdMatch) {
        return alert("Please enter a valid YouTube URL!");
    }

    const videoId = videoIdMatch[1];
    resultArea.style.display = "block";
    titleText.innerText = "Video Found!";
    thumbnail.src = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    thumbnail.style.display = "inline-block";

    const apiUrl = `https://api.vevioz.com/api/button/mp4?url=${encodeURIComponent(url)}`;
    downloadBtn.href = apiUrl;
}
