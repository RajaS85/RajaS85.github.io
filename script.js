// 1. Initialize Firebase (Ensure your Firebase Config is here)
// const firebaseConfig = { ... }; 
// firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// 2. Save Story Logic (Wordpad Version)
async function saveStory() {
    const titleInput = document.getElementById('storyTitle');
    const contentInput = document.getElementById('storyText'); // This is the editable div

    const title = titleInput.value;
    const content = contentInput.innerHTML; // Captures Bold, Italic, and Emojis
    const author = prompt("Enter your Name (Author):");
    const secretCode = prompt("Create a secret code to Delete/Edit this story later:");

    // Basic Validation
    if (!title || content === "Start your script here..." || !secretCode) {
        return alert("Please fill in the title, content, and secret code!");
    }

    try {
        await db.collection("stories").add({
            title: title,
            content: content,
            author: author || "Anonymous",
            editCode: secretCode,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        alert("Success! Your story is published to the Factory.");
        
        // Clear fields and reload
        titleInput.value = "";
        contentInput.innerHTML = "Start your script here...";
        location.reload();
    } catch (error) {
        console.error("Error adding document: ", error);
        alert("Error publishing story. Check console.");
    }
}

// 3. Load Story Index (Displaying cards on manhwa.html)
const storiesList = document.getElementById('storiesList');
if (storiesList) {
    // Listen for real-time updates from Firestore
    db.collection("stories").orderBy("timestamp", "desc").onSnapshot((querySnapshot) => {
        storiesList.innerHTML = ""; // Clear list before reloading
        
        querySnapshot.forEach((doc) => {
            const story = doc.data();
            const id = doc.id;

            // Create a Bootstrap card for the Index
            storiesList.innerHTML += `
                <div class="col-md-6 col-lg-4 mb-4">
                    <div class="card h-100 shadow-sm" style="background: #1a1a1a; border: 1px solid #333; color: white;">
                        <div class="card-body">
                            <h4 class="card-title" style="color: #FFB400;">${story.title}</h4>
                            <p class="card-text text-muted small">By: ${story.author}</p>
                            <div class="d-flex justify-content-between align-items-center mt-3">
                                <a href="reader.html?id=${id}" class="btn btn-sm btn-warning">Read Full Story →</a>
                                <button onclick="secureDelete('${id}', '${story.editCode}')" class="btn btn-sm btn-outline-danger">Delete</button>
                            </div>
                        </div>
                    </div>
                </div>`;
        });
    });
}

// 4. Secure Delete Function (Author-Only)
async function secureDelete(docId, correctCode) {
    const userInput = prompt("Enter the Secret Edit Code for this story:");

    // Allow Raja (Admin) or the correct Author to delete
    if (userInput === correctCode || userInput === "RajaAdmin79") {
        if (confirm("Are you sure you want to permanently delete this story?")) {
            await db.collection("stories").doc(docId).delete();
            alert("Story deleted successfully.");
        }
    } else {
        alert("Permission Denied: Incorrect Secret Code.");
    }
}

// 5. Theme Toggle Logic (Matches index.html)
const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
if (toggleSwitch) {
    toggleSwitch.addEventListener('change', (e) => {
        if (e.target.checked) {
            document.body.classList.add('light-mode');
            document.getElementById('mode-text').innerText = "Light";
        } else {
            document.body.classList.remove('light-mode');
            document.getElementById('mode-text').innerText = "Dark";
        }
    });
}
