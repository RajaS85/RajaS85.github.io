// 1. FIREBASE INITIALIZATION
// Make sure you paste your specific Firebase Config here!
const db = firebase.firestore();

// 2. THEME TOGGLE LOGIC (Light/Dark Mode)
const toggleSwitch = document.querySelector('#checkbox');
const currentTheme = localStorage.getItem('theme');

// Check for saved user preference on page load
if (currentTheme) {
    document.body.classList.add(currentTheme);
    if (currentTheme === 'light-mode') {
        if (toggleSwitch) toggleSwitch.checked = true;
        updateModeText("Light");
    }
}

function updateModeText(text) {
    const modeText = document.getElementById('mode-text');
    if (modeText) modeText.innerText = text;
}

function switchTheme(e) {
    if (e.target.checked) {
        document.body.classList.add('light-mode');
        localStorage.setItem('theme', 'light-mode');
        updateModeText("Light");
    } else {
        document.body.classList.remove('light-mode');
        localStorage.setItem('theme', 'dark-mode');
        updateModeText("Dark");
    }    
}

if (toggleSwitch) {
    toggleSwitch.addEventListener('change', switchTheme, false);
}

// 3. WORDPAD SAVING LOGIC (For Manhwa & Shayari)
async function saveStory() {
    const titleInput = document.getElementById('storyTitle');
    const contentInput = document.getElementById('storyText'); // The contenteditable div

    if (!titleInput || !contentInput) return;

    const title = titleInput.value;
    const content = contentInput.innerHTML; // Saves Bold, Italic, and Emojis
    const author = prompt("Enter your Name:");
    const secretCode = prompt("Create a secret code to manage this story later:");

    // Validation
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
        alert("Error publishing. Check console.");
    }
}

// 4. LOAD STORY INDEX (Displayed on manhwa.html and shayari.html)
const storiesList = document.getElementById('storiesList');
if (storiesList) {
    db.collection("stories").orderBy("timestamp", "desc").onSnapshot((snap) => {
        storiesList.innerHTML = ""; // Clear existing list
        
        snap.forEach((doc) => {
            const s = doc.data();
            const id = doc.id;

            // Generate card for the index
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

// 5. AUTHOR SECURITY (Delete check)
async function secureDelete(id, correctCode) {
    const userInput = prompt("Enter the Secret Code for this story:");
    
    // Authorization check
    if (userInput === correctCode || userInput === "RajaAdmin79") {
        if (confirm("Are you sure you want to delete this permanently?")) {
            await db.collection("stories").doc(id).delete();
            alert("Deleted!");
        }
    } else {
        alert("Incorrect Code. Access Denied.");
    }
}
