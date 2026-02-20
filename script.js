// 1. Firebase Configuration
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

// 2. Dark Mode Toggle Logic
const toggleSwitch = document.querySelector('#checkbox');
const modeText = document.querySelector('#mode-text');

function switchTheme(e) {
    if (e.target.checked) {
        document.body.classList.add('light-mode');
        modeText.innerText = "Light";
        localStorage.setItem('theme', 'light');
    } else {
        document.body.classList.remove('light-mode');
        modeText.innerText = "Dark";
        localStorage.setItem('theme', 'dark');
    }    
}

toggleSwitch.addEventListener('change', switchTheme, false);

// Check for saved user preference on load
const currentTheme = localStorage.getItem('theme');
if (currentTheme === 'light') {
    document.body.classList.add('light-mode');
    toggleSwitch.checked = true;
    modeText.innerText = "Light";
}
const toggleSwitch = document.querySelector('#checkbox');

function switchTheme(e) {
    if (e.target.checked) {
        document.body.classList.remove('light-mode');
        localStorage.setItem('theme', 'dark');
    } else {
        document.body.classList.add('light-mode');
        localStorage.setItem('theme', 'light');
    }    
}

toggleSwitch.addEventListener('change', switchTheme, false);

// Check local storage for preference on load
const currentTheme = localStorage.getItem('theme');
if (currentTheme === 'light') {
    document.body.classList.add('light-mode');
    toggleSwitch.checked = false; // Toggle is 'off' for light
} else {
    toggleSwitch.checked = true; // Toggle is 'on' for dark
}
