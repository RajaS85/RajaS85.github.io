// Initialize Firebase (Keep your existing config here)
const db = firebase.firestore();

// SAVE STORY WITH SECURITY
async function saveStory() {
    const title = document.getElementById('storyTitle').value;
    const text = document.getElementById('storyText').value;
    const author = prompt("Enter Your Name:");
    const secretCode = prompt("Create a Secret Code to edit/delete this later:");

    if(!title || !text || !secretCode) return alert("All fields are required!");

    try {
        await db.collection("stories").add({
            title: title,
            content: text,
            author: author,
            editCode: secretCode,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        alert("Story Published!");
        location.reload(); 
    } catch (e) { alert("Error: " + e.message); }
}

// LOAD INDEX (Only titles and authors)
const storiesList = document.getElementById('storiesList');
if(storiesList) {
    db.collection("stories").orderBy("timestamp", "desc").onSnapshot(snap => {
        storiesList.innerHTML = "";
        snap.forEach(doc => {
            const s = doc.data();
            const id = doc.id;
            storiesList.innerHTML += `
                <div class="card p-3 mb-3" style="background: var(--card-bg); border: 1px solid var(--border);">
                    <h3>${s.title}</h3>
                    <p>By: <strong>${s.author || 'Anonymous'}</strong></p>
                    <div class="d-flex gap-2">
                        <a href="reader.html?id=${id}" class="btn btn-warning btn-sm">Read Full Story →</a>
                        <button onclick="secureDelete('${id}', '${s.editCode}')" class="btn btn-danger btn-sm">Delete My Story</button>
                    </div>
                </div>`;
        });
    });
}

// SECURITY CHECK
async function secureDelete(id, correctCode) {
    const userInput = prompt("Enter the Secret Code for this story:");
    if(userInput === correctCode || userInput === "Raja123") {
        await db.collection("stories").doc(id).delete();
        alert("Deleted successfully!");
    } else {
        alert("Wrong code! You can only delete your own stories.");
    }
}
async function saveStory() {
    const title = document.getElementById('storyTitle').value;
    const author = prompt("Enter your Name:");
    const editCode = prompt("Create a secret Edit Code for this story:");
    const text = document.getElementById('storyText').value;

    if(!title || !text || !editCode) return alert("Please fill everything!");

    await db.collection("stories").add({
        title: title,
        author: author,
        content: text,
        editCode: editCode, // Saved secretly
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    alert("Story Published!");
}
snap.forEach(doc => {
    const s = doc.data();
    const id = doc.id;
    storiesList.innerHTML += `
        <div class="card p-3 mb-3">
            <h3>${s.title}</h3>
            <p>By: <strong>${s.author || 'Anonymous'}</strong></p>
            <a href="reader.html?id=${id}" class="btn-outline">Read Full Story →</a>
            <button class="btn-sm btn-danger mt-2" onclick="secureDelete('${id}', '${s.editCode}')">Delete My Story</button>
        </div>`;
});

// Secure Delete Logic
async function secureDelete(id, correctCode) {
    const inputCode = prompt("Enter the secret Edit Code for this story:");
    if(inputCode === correctCode || inputCode === "Raja123") { // Raja (Admin) can always delete
        await db.collection("stories").doc(id).delete();
        alert("Deleted!");
    } else {
        alert("Permission Denied! You are not the author.");
    }
}
