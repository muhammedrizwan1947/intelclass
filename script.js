// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA88fPkOvcI4QA9qD3ROpk-ay-V6ibQQlc",
  authDomain: "my-application-7fd40.firebaseapp.com",
  projectId: "my-application-7fd40",
  storageBucket: "my-application-7fd40.appspot.com",
  messagingSenderId: "269589994279",
  appId: "1:269589994279:web:4c617a622c328a1224e702",
  measurementId: "G-D8MD1J28GR",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);
const urlParams = new URLSearchParams(window.location.search);
const collectionName = urlParams.get("collection");
const playPauseButtonImg = document.getElementById("play_pause_img");
document.getElementById("spinner_div").style.display = "none";

const audio = document.getElementById("audio");
const playPauseButton = document.getElementById("play-pause");
const seekBar = document.getElementById("seek");
const popup = document.getElementById("popup");
const minimizeButton = document.getElementById("minimize-button");

// Data for the list items
const data = [
  {
    heading: "Chapter 1 Solutions",
    items: [
      "What is Henry's law",
      "Write any two applications of Henry’s law",
      "State Raoult’s law",
      "What are ideal solutions",
      "non-ideal solutions",
      "What type of deviation is shown by a mixture of chloroform and acetone? Give reason",
      "What are azeotropes?",
      "Explain the different types of azeotropes?",
      "What are colligative properties? Name the four types of colligative properties.",
      "What is osmosis",
      "What is osmotic pressure?",
      "What is reverse osmosis? Write any one of its applications",
      "For determining the molecular mass of polymers, osmotic pressure is preferred to other properties. Why?",
      "Write any 2 advantages of osmotic pressure measurement over other colligative property measurements?",
      "What are isotonic solutions? Give an example.",
      "For intravenous injections only solutions with osmotic pressure equal to that of 0.9% NaCl solution is used. Why?",
      "Define van’t Hoff factor. What is its value for KCl solution, if there is100% dissociation.",
      "What happens to the colligative properties when ethanoic acid is treated with benzene? Give reason.",
    ],
  },
  {
    heading: "Chapter 2 Electrochemistry",
    items: [
      "What is a Galvanic cell?",
      "Working of daniel cell",
      "Define molar conductivity. ",
      "How does molar conductivity of a solution vary with concentration or dilution? Explain.",
      "What is meant by limiting molar conductivity",
      "State Kohlrausch’s law of independent migration of ions. State any one of its applications.",
      "Write any two differences between primary cell and secondary cell.",
      " The cell potential of a mercury cell is 1.35 V, and remains constant during its life. Give reason",
      "What are fuel cells?",
      "What is corrosion? Write any two methods to prevent the corrosion(rusting) of iron.",
    ],
  },
  {
    heading: "Chapter 3 CHEMICAL KINETICS",
    items: [
      " What do you mean by rate of a reaction ?",
      "Write any two factors influencing rate of a reaction",
      "What is order of a reaction ",
      "Write any three differences between order and molecularity.",
      "What is mean by zero order reaction? Give one example.",
      "What is mean by half–life period of a reaction?",
      "What are pseudo first order reactions? Give one example",
    ],
  },
];

// Variable to keep track of the currently active item
let activeItem = null;

// Function to check Firestore for a document with a matching question
async function checkFirestoreForQuestion(itemValue) {
  const q = query(
    collection(db, collectionName),
    where("question", "==", itemValue)
  );
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    querySnapshot.forEach((doc) => {
      console.log("Document found:", doc.data());
      openModal(
        doc.data().question,
        doc.data().imageUrl,
        doc.data().description,
        doc.data().audioUrl,
        doc.data().audioUrl2
      );
      audio.currentTime = 0;
    });
  } else {
    console.log("No matching document found for question:", itemValue);
    document.getElementById("popup").classList.add("minimized");

    document.getElementById("spinner_div").style.display = "none";
    showToast();
    stopAudio();
  }
}

// Function to populate the divs with data
function populateData() {
  const container = document.body;

  data.forEach((section) => {
    // Create and append the section heading
    const sectionHeading = document.createElement("h1");
    sectionHeading.textContent = section.heading;
    container.appendChild(sectionHeading);

    // Create the container for the section items
    const sectionContainer = document.createElement("div");
    sectionContainer.className = "container";

    // Create and append each item within the section
    section.items.forEach((item) => {
      const itemDiv = document.createElement("div");

      itemDiv.textContent = item;

      itemDiv.onclick = () => {
        seekBar.value = 0;

        console.log(item);
        document.getElementById("spinner_div").style.display = "inherit";

        // Remove active class from the previously active item
        if (activeItem) {
          activeItem.classList.remove("active");
        }

        // Add active class to the currently clicked item
        itemDiv.classList.add("active");

        // Update the active item
        activeItem = itemDiv;

        // Check Firestore for a matching document
        checkFirestoreForQuestion(item);
      };

      sectionContainer.appendChild(itemDiv);
    });

    // Append the section container to the body
    container.appendChild(sectionContainer);
  });
}

// Call the function to populate the data
populateData();

function openModal(qstn, imageUrl, desc, audioUrl1, audioUrl2) {
  const popup = document.getElementById("popup");
  const popupQuestion = document.getElementById("popup-question");
  const popupImg = document.getElementById("popup-img");
  const description = document.getElementById("description");
  const audio = document.getElementById("audio");
  const easyTab = document.getElementById("easy-tab");
  const straightTab = document.getElementById("straight-tab");

  popupImg.src = imageUrl;
  playPauseButtonImg.src = "pause1.png";

  popupImg.onload = () => {
    const aspectRatio = (popupImg.naturalHeight / popupImg.naturalWidth) * 100;
    document.getElementById("popup-image").style.paddingBottom = `1%`;
    popupImg.style.display = "block";
  };
  popupQuestion.innerHTML = qstn;

  if (desc) {
    description.innerHTML = desc;
    document.getElementById("description_div").style.display = "block";
  } else {
    description.innerHTML = "";
    document.getElementById("description_div").style.display = "none";
  }

  audio.src = audioUrl1; // Default to Straight audio
  audio.addEventListener("canplaythrough", () => {
    console.log("Audio is ready to play");
    audio.play();
    document.getElementById("spinner_div").style.display = "none";
  });

  if (audioUrl2) {
    easyTab.style.display = "block";
    easyTab.dataset.audioUrl = audioUrl2;
  } else {
    easyTab.style.display = "none";
    straightTab.style.display = "none";
  }

  straightTab.dataset.audioUrl = audioUrl1;
  popup.classList.remove("minimized");
}

playPauseButton.addEventListener("click", () => {
  if (audio.paused) {
    playPauseButtonImg.src = "pause1.png";
    audio.play();
  } else {
    playPauseButtonImg.src = "play.png";
    audio.pause();
  }
});

audio.addEventListener("play", () => {
  playPauseButtonImg.src = "pause1.png";
});

audio.addEventListener("pause", () => {
  playPauseButtonImg.src = "play.png";
});

audio.addEventListener("ended", () => {
  playPauseButtonImg.src = "play.png";
  seekBar.value = 0;
});

audio.addEventListener("timeupdate", () => {
  seekBar.value = (audio.currentTime / audio.duration) * 100;
});

audio.addEventListener("loadedmetadata", () => {
  seekBar.value = 0;
});

seekBar.addEventListener("input", () => {
  audio.currentTime = (seekBar.value / 100) * audio.duration;
});

minimizeButton.addEventListener("click", () => {
  popup.classList.toggle("minimized");
  if (popup.classList.contains("minimized")) {
    audio.pause();
    playPauseButtonImg.src = "play.png";
  }
});

// Tab functionality
const easyTab = document.getElementById("easy-tab");
const straightTab = document.getElementById("straight-tab");
const easyContent = document.getElementById("easy-content");
const straightContent = document.getElementById("straight-content");

easyTab.addEventListener("click", () => {
  easyTab.classList.add("active");
  straightTab.classList.remove("active");
  easyContent.classList.add("active");
  straightContent.classList.remove("active");
  audio.src = "";
  audio.src = easyTab.dataset.audioUrl; // Set audio to Easy version
  audio.play();
  playPauseButtonImg.src = "pause1.png";
});

straightTab.addEventListener("click", () => {
  straightTab.classList.add("active");
  easyTab.classList.remove("active");
  straightContent.classList.add("active");
  easyContent.classList.remove("active");
  audio.src = "";
  audio.src = straightTab.dataset.audioUrl; // Set audio to Straight version
  audio.play();
  playPauseButton.src = "pause1.png";
});

function stopAudio() {
  audio.pause();
  audio.currentTime = 0;
  audio.src = "";
  playPauseButtonImg.src = "play.png";
}

function showToast() {
  const toast = document.getElementById("toast");
  toast.className = "toast show";

  // Hide the toast after 3 seconds
  setTimeout(() => {
    toast.className = "toast";
    console.log("toasted");
  }, 3000);
}

// function locationAlert() {
//   alert("opposite St.Ignatius school , Kanjiramattom , 7012935811");
// }

window.addEventListener("scroll", function () {
  document.getElementById("navBar").classList.add("floatingNav");
  //   if (window.scrollY > 10) {
  //     document.getElementById("navBar").classList.add("floatingNav");
  //   } else {
  //     document.getElementById("navBar").classList.remove("floatingNav");
  //   }
});
