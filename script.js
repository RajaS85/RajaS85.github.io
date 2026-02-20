// Pull Stories in Real-Time
const storiesList = document.getElementById('storiesList');
if(storiesList) {
    db.collection("stories").orderBy("timestamp", "desc").onSnapshot(snap => {
        storiesList.innerHTML = "";
        snap.forEach(doc => {
            const s = doc.data();
            const storyId = doc.id; // Get the unique ID for each story
            storiesList.innerHTML += `
                <div class="card">
                    <h3>${s.title}</h3>
                    <p>${s.content}</p>
                    <button class="btn-delete" onclick="deleteStory('${storyId}')">Delete</button>
                </div>`;
        });
    });
}

// Secret Delete Function
async function deleteStory(id) {
    const password = prompt("Enter Admin Password to Delete:");
    if (password === "Raja123") { 
        if(confirm("Are you sure you want to delete this story forever?")) {
            try {
                await db.collection("stories").doc(id).delete();
                alert("Story deleted successfully.");
            } catch (error) {
                alert("Error deleting story: " + error.message);
            }
        }
    } else {
        alert("Incorrect password!");
    }
}
