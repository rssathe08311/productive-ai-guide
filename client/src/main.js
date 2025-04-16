// === Navigation: Highlight active section on scroll ===
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".navbar-item");

window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (pageYOffset >= sectionTop - sectionHeight / 3) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach(link => {
    link.classList.remove("is-active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("is-active");
    }
  });
});

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

// === Navigation: Burger menu toggle ===
document.addEventListener("DOMContentLoaded", async () => {
  const burger = document.querySelector(".navbar-burger");
  const menu = document.getElementById(burger.dataset.target);

  burger.addEventListener("click", () => {
    burger.classList.toggle("is-active");
    menu.classList.toggle("is-active");
  });

  // Populate summary content at the end
  const aiDefinition = localStorage.getItem('aiDefinition');
  const quizAnswer = localStorage.getItem('quizAnswer');

  const summaryDef = document.getElementById('summaryAIDefinition');
if (summaryDef) {
  summaryDef.textContent = aiDefinition || 'No definition provided.';
}

//const summaryQuiz = document.getElementById('summaryQuizAnswer');
//if (summaryQuiz) {
//  summaryQuiz.textContent =
//    quizAnswer === 'false'
//      ? 'False (Correct!)'
//      : quizAnswer === 'true'
//      ? 'True (Remember: AI can make mistakes!)'
//      : 'No answer provided.';
//}
// else if (quizAnswer === 'true') {
//    document.getElementById('summaryQuizAnswer').textContent = 'True (Remember: AI can make mistakes!)';
//  } else {
//    document.getElementById('summaryQuizAnswer').textContent = 'No answer provided.';
//  }


  const imagesToGenerate = [
    ["A simple header spread that works for a technology focused guide", "aiImageHeader"],
    ["A futuristic college setting with welcome written on it", "aiImageWelcome"],
    ["A cartoonish friendly robot giving a quiz/survey", "aiImageSurvey"],
    ["A cartoonish friendly robot questioning what AI is", "aiImageExplanation"],
    ["The many sides of AI technology and its uses", "aiImageFaces"],
    ["A cartoonish friendly robot moving forward with new knowledge", "aiImageConclusion"]
  ];

  for (const [prompt, id] of imagesToGenerate) {
    console.log(`loading image ${id}`)
    await generateImage(prompt, id);
    console.log('finished loading')
    await delay(3000); // wait 3 seconds between each request
  }


  //generateImage("A simple header spread that works for a technology focused guide", "aiImageHeader");
  //generateImage("A cartoonish robot welcoming you to learn with it", "aiImageWelcome");
  //generateImage("A cartoonish friendly robot giving a quiz/survey", "aiImageSurvey");
  //generateImage("A cartoonish friendly robot questioning what AI is", "aiImageExplanation");
  //generateImage("The many sides of AI technology and its uses", "aiImageFaces");
  //generateImage("A cartoonish friendly robot moving forward with new knowledge", "aiImageFaces");

});

// === Smooth Scroll Navigation ===
function nextSection(sectionId) {
  document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
}

// === Handle Quiz Answer ===
function handleQuizAnswer(answer) {
  localStorage.setItem('quizAnswer', answer);

  const feedback = document.getElementById('quizFeedback');
  feedback.classList.remove('is-hidden', 'is-success', 'is-danger');

  if (answer === 'false') {
    feedback.classList.add('is-success');
    feedback.innerHTML = '<i class="fas fa-check-circle"></i> Correct! AI is not always right.';
  } else {
    feedback.classList.add('is-danger');
    feedback.innerHTML = '<i class="fas fa-times-circle"></i> Not quite! AI can make mistakes, so it’s not always right.';
  }
}

// === Save AI Definition ===
function saveAIDefinition() {
  const definition = document.getElementById('aiDefinition').value.trim();

  if (definition) {
    localStorage.setItem('aiDefinition', definition);

    const feedback = document.getElementById('definitionFeedback');
    feedback.classList.remove('is-hidden');
    feedback.innerHTML = '<i class="fas fa-check-circle"></i> Thanks for your input!';
  }
}

// === Generate Personalized AI Cheat Sheet ===
async function generateCheatSheet() {
  const familiarity = getSelectedRadioValue("aiFamiliarity");
  const feeling = getSelectedRadioValue("aiFeeling");
  const change = getSelectedRadioValue("aiChange");
  const futureWord = document.getElementById("futurePhrase").value.trim();
  const customUse = document.getElementById("customUseInput").value.trim();
  const question = document.getElementById("questionBox").value.trim();

  const prompt = `
    You are an assistant helping a student create a personalized “Responsible AI Cheat Sheet.” Based on their responses, create a friendly, practical, and clear guide.

    Their answers:
    - Familiarity with AI: ${familiarity}
    - Feeling about AI: ${feeling}
    - How they’ve used AI: ${change}
    - Word/phrase they associate with AI in the future: ${futureWord}
    - Example of how they currently use AI: ${customUse}
    - A question they have about AI: ${question}

    Please generate:
    1. A short summary of their approach to AI (1-2 sentences).
    2. 3–4 bullet points of personalized best practices for using AI responsibly.
    3. A final tip or encouragement for their next step.

    Keep it grounded, non-preachy, student-friendly, and realistic.
    `;

  try {
    console.log("Sending prompt to OpenAI:\n", prompt);

    const response = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();

    document.getElementById("personalizedPlan").innerHTML = `
      <div class="box has-background-light">
        <h3 class="title is-4">🎓 Your Responsible AI Cheat Sheet</h3>
        <div class="content">${data.result}</div>
      </div>
    `;
  } catch (error) {
    console.error("Error generating cheat sheet:", error);
    document.getElementById("personalizedPlan").innerHTML = `
      <div class="notification is-danger">Something went wrong while generating your cheat sheet. Please try again.</div>
    `;
  }
}

// ===Generate Images===
//async function generateIntroImage() {
//    const prompt = "An image showing a cartoon robot being confused about what AI is";
//  
//    const loader = document.getElementById("imageLoader");
//    if (loader) loader.style.display = "block";
//  
//    try {
//        console.log("loading image")
//      const response = await fetch("/image", {
//        method: "POST",
//        headers: { "Content-Type": "application/json" },
//        body: JSON.stringify({
//            prompt,
//            n: 1,
//            size: "1024x1024"
//        }),
//      });
//  
//      const data = await response.json();
//      console.log("image loaded")
//  
//      if (data.images && data.images.length > 0) {
//        const imgUrl = data.images[0].url;
//        const imageElement = document.getElementById("aiGeneratedImage");
//        if (imageElement) {
//          imageElement.src = imgUrl;
//        }
//      } else {
//        console.warn("No image returned.");
//      }
//    } catch (error) {
//      console.error("Image generation failed:", error);
//    } finally {
//      if (loader) loader.style.display = "none";
//    }
//  }
  
async function generateImage(prompt, imgElementId) {
    const imageElement = document.getElementById(imgElementId);
    if (!imageElement) return;
  
    // Optional loading effect
    imageElement.src = "/assets/img/loading.gif"; // if you have a spinner or placeholder
  
    try {
      const response = await fetch("/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          n: 1,
          size: "1024x1024",
        }),
      });
  
      const data = await response.json();
  
      if (data.images && data.images.length > 0) {
        imageElement.src = data.images[0].url;
      } else {
        console.warn("No image returned for prompt:", prompt);
        imageElement.src = "/assets/img/error.png"; // fallback
      }
    } catch (error) {
      console.error("Image generation failed:", error);
      imageElement.src = "/assets/img/error.png"; // fallback
    }
  }
  
//== Generate TTS===
let currentAudio = null;
let currentStatusEl = null;

async function playSectionById(sectionId, buttonEl) {
  const section = document.getElementById(sectionId);
  const statusEl = document.getElementById(`ttsStatus-${sectionId}`);

  if (!section || !statusEl) return;

  const text = section.innerText.replace(/\s+/g, " ").trim().slice(0, 4000); // keep under OpenAI limit

  if (!text) return;

  // If audio is already playing, toggle pause/resume
  if (currentAudio && !currentAudio.paused) {
    currentAudio.pause();
    statusEl.textContent = "";
    buttonEl.textContent = "▶️ Resume";
    return;
  }

  // If audio is paused and we're clicking again, resume
  if (currentAudio && currentAudio.paused) {
    currentAudio.play();
    statusEl.textContent = "";
    buttonEl.textContent = "⏸️ Pause";
    return;
  }

  // If nothing playing, start new
  statusEl.textContent = "Generating audio... it may take a few seconds";
  buttonEl.disabled = true;

  try {
    const response = await fetch("/audio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: text, voice: "alloy" }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`TTS request failed: ${response.status} - ${errorText}`);
      }
      

      const audioBlob = await response.blob();
      if (audioBlob.size === 0) {
        throw new Error("TTS audio blob was empty.");
      }
      
    const audioUrl = URL.createObjectURL(audioBlob);

    const audio = new Audio(audioUrl);
    currentAudio = audio;
    currentStatusEl = statusEl;

    audio.play();
    statusEl.textContent = "";
    buttonEl.textContent = "⏸️ Pause";

    audio.onended = () => {
      statusEl.textContent = "";
      buttonEl.textContent = "🔊 Listen";
      buttonEl.disabled = false;
      currentAudio = null;
    };
  } catch (err) {
    console.error("TTS error:", err);
    statusEl.textContent = "❌ Error playing audio";
  } finally {
    buttonEl.disabled = false;
  }
}


//async function playSectionById(sectionId) {
//  const section = document.getElementById(sectionId);
//  if (!section) {
//    console.warn(`Section "${sectionId}" not found.`);
//    return;
//  }
//
//  const text = section.innerText.trim();
//  if (!text) {
//    console.warn("No text found in section.");
//    return;
//  }
//
//  try {
//    const response = await fetch("/audio", {
//      method: "POST",
//      headers: { "Content-Type": "application/json" },
//      body: JSON.stringify({ input: text, voice: "nova" }) // you can also try "shimmer", "fable", etc.
//    });
//
//    const audioBlob = await response.blob();
//    const audioUrl = URL.createObjectURL(audioBlob);
//    const audio = new Audio(audioUrl);
//    audio.play();
//  } catch (error) {
//    console.error("TTS playback failed:", error);
//  }
//}
  
  

// === Helper: Get selected radio button value ===
function getSelectedRadioValue(name) {
  const radios = document.getElementsByName(name);
  for (let radio of radios) {
    if (radio.checked) {
      return radio.value;
    }
  }
  return 'Not answered';
}
