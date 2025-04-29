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
    ["A simple, header image for an educational article about technology. Minimalistic design, abstract shapes, dark colors (blues, purples, black), plenty of empty space for text overlay.", "aiImageHeader"],
    ["An open notebook, a coffee cup, and a laptop on a sunlit desk, with small futuristic icons (like AI or light data streams) subtly floating above, symbolizing learning and technology blending naturally", "aiImageWelcome"],
    ["A cute 2D cartoon robot offering a short quiz on a digital clipboard, with soft question bubbles floating around it, set against a pastel background, inviting the viewer to participate.", "aiImageSurvey"],
    ["A cute 2D cartoon robot with a curious expression, surrounded by floating icons like gears (for technology), lightbulbs (for ideas), books (for knowledge), and chat bubbles (for communication), set against a bright, simple background", "aiImageExplanation"],
    ["A colorful 2D cartoon landscape showing small scenes of AI helping with different tasks: one AI assistant helping someone write, another AI robot helping fix code, another AI drawing on a digital tablet, and another offering directions on a map, all in a cheerful, bright style.", "aiImageFaces"],
    ["A colorful 2D cartoon showing four characters (either people or robots) each holding a small sign with an emotion: Excited, Curious, Cautious, Worried. In the middle floats a soft glowing AI icon, representing how different people view AI differently.", "aiImageStances"],
    ["A 2D cartoon showing a friendly robot carefully holding a glowing globe or glowing book, representing knowledge and responsibility, with a thoughtful expression.", "aiImageResponsibility"],
    ["A colorful 2D cartoon of a friendly robot presenting an open toolbox filled with creative AI tools like a notepad, paintbrush, gears, and a small glowing computer chip, with sparkles around it.", "aiImageTools"],
    ["A 2D minimalist cartoon of a person climbing glowing digital steps labeled 'Skill', 'Curiosity', 'Adaptability', 'Innovation', leading toward a bright future city skyline.", "aiImageCareer"],
    ["A 2D cartoonish friendly robot moving forward with new knowledge", "aiImageConclusion"]

  ];

  for (const [prompt, id] of imagesToGenerate) {
    console.log(`loading image ${id}`)
    await generateImage(prompt, id);
    console.log('finished loading')
    await delay(3000); // wait 3 seconds between each request
  }

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

// === Show Advice Based on AI Stance ===
function showAdviceBasedOnStance() {
  const selected = document.querySelector('input[name="aiStance"]:checked');
  const adviceBox = document.getElementById('stanceAdvice');

  if (!selected) {
    adviceBox.innerHTML = '<p class="has-text-danger">Please select an option to see advice!</p>';
    return;
  }

  // Save the stance to localStorage
  localStorage.setItem('aiStance', selected.value);

  // Disable all stance radio buttons so they can't change
  const stanceRadios = document.getElementsByName('aiStance');
  stanceRadios.forEach(radio => {
    radio.disabled = true;
  });

  const advice = {
    "Excited": `
      <strong>Excited Users:</strong>
      <p> If you’re excited about using AI, that’s fantastic, enthusiasm is a powerful starting point! To make the most of it, it’s important to balance excitement with a little critical thinking. AI can speed up your work, spark new ideas, and teach you things you might not have learned otherwise. But it’s not perfect. Sometimes it makes mistakes, sometimes it sounds confident but is wrong. Use your excitement to fuel exploration, but always stay in the driver’s seat. Double-check outputs, keep learning the underlying skills, and think of AI as a boost, not a replacement.</p>
    `,
    "Curious": `
      <strong>Curious Users:</strong>
      <p> If you’re curious but cautious, you’re in a great position. Curiosity means you’re open to exploring new tools, while caution keeps you grounded. Start by using AI for low-stakes tasks: brainstorming ideas, summarizing articles, drafting outlines. Notice where it helps and where it struggles. As you experiment, keep asking good questions: Why is it giving me this answer? What assumptions might it be making? Curiosity and critical thinking are exactly what make a responsible AI user.</p>
    `,
    "Skeptical": `
      <strong>Skeptical Users:</strong>
      <p>Skepticism is healthy, it’s not only normal, it’s necessary. AI outputs are only as good as the data and assumptions that go into them, and it’s smart to question both. If you’re skeptical, try using AI in a way that keeps you fully in control: for example, asking it for multiple approaches to a problem, or using it to challenge your own ideas, not replace them. You don’t have to “trust” AI to use it effectively, you just have to know how to test and verify what it gives you.</p>
    `,
    "Scared": `
      <strong>Scared Users:</strong>
      <p>Feeling anxious about AI doesn’t mean you’re behind, it means you care about the future of learning and work. A good way to move forward is to start small. You don’t have to dive into complex AI tools right away. Try something low-pressure: use AI to suggest synonyms for a word, or to brainstorm questions you might research further. The more you see AI as a tool you can shape and question, not something that controls you, the more confident you’ll feel over time. Also something that always helps manage fear is knowledge, more than just this guide I’d recommend that you continue your learning and look at what others are saying about AI, really look into what it is, the impact it has, and how others use it.</p>
    `,
    "Avoidant": `
      <strong>Avoidant Users:</strong>
      <p> If you’d rather not engage with AI, that’s valid too. It’s important to know your boundaries and values. That said, because AI is becoming more embedded into everyday tools (sometimes invisibly), it’s still helpful to have a basic understanding — even if you choose to keep your use minimal. Think of it like learning the rules of the road even if you don’t want to drive: it helps you navigate the world more safely. You can engage just enough to stay informed without letting AI take over your workflow.</p>
    `,
    "Overconfident": `
      <strong>Confident Users:</strong>
      <p>If you find yourself trusting AI a little too much (“it generated it, so it must be right!”), it’s worth taking a small step back. AI can be incredibly helpful, but it’s not a substitute for your own judgment or expertise. Before accepting its suggestions, ask: Does this make sense? Can I explain it to someone else? AI is most powerful when it augments your thinking, not when it replaces it.</p>
    `,
    "Frustrated": `
      <strong>Frustrated Users:</strong>
      <p> If you’ve tried using AI tools and found the experience confusing or disappointing, you’re definitely not alone. Not every AI interaction is smooth, sometimes it takes a little practice to ask the right questions, or pick the right tool for the task. One tip: start with very specific, small asks (“Explain this error message”) rather than open-ended ones (“Solve my whole problem”). Building a little structure into how you use AI can make it feel much more manageable.</p>
    `
  };

  adviceBox.innerHTML = advice[selected.value] || '<p>Advice not found for your selection.</p>';
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
  const aiStance = localStorage.getItem('aiStance') || 'Not answered';
  const dreamJobReflection = document.getElementById('dreamJobReflection').value.trim();


  const prompt = `
    You are an assistant helping a student create a personalized “Responsible AI Cheat Sheet.” Based on their responses, create a friendly, practical, and clear guide.

    Their answers:
    - Familiarity with AI: ${familiarity}
    - Feeling about AI: ${feeling}
    - How they’ve used AI: ${change}
    - Word/phrase they associate with AI in the future: ${futureWord}
    - Example of how they currently use AI: ${customUse}
    - Their current stance towards AI in their own Education: ${aiStance}
    - Reflection on AI in their future job: ${dreamJobReflection}
    - A question they have about AI: ${question}

    Please generate:
    1. A short summary of their approach to AI (4-6 sentences).
    2. 3–4 bullet points of personalized best practices for using AI responsibly.
    3. A final tip or encouragement for their next step.

    IMPORTANT: 
  - Format the output **in valid HTML** so it can be directly inserted into a webpage.
  - Use <p> for paragraphs and <ul><li> for bullet points.
  - Do not include any headers (like <h1> or <h2>), just the main content in simple HTML.

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
      <div class="box has-background-light" id="cheatSheetContent" style="padding: 1em;">
        <h3 class="title is-4">🎓 Your Responsible AI Cheat Sheet</h3>
        <div id="cheatSheetBody" class="content" style="min-height: 200px;"></div>
      </div>
      <div id="cheatSheetActions">
        <button id="downloadButton" class="button is-primary mt-3" disabled>⬇️ Download as PDF</button>
        <button id="downloadButtonHTML" class="button is-primary mt-3" disabled>⬇️ Download as HTML</button>
      </div>    
    `;
    
    // 1. Insert real HTML
    const cheatSheetBody = document.getElementById("cheatSheetBody");
    cheatSheetBody.innerHTML = data.result;
    
    // 2. Wait a bit
    await delay(200);
    
    // 3. Enable download
    const downloadButton = document.getElementById('downloadButton');
    const downloadButtonHTML = document.getElementById('downloadButtonHTML');
    downloadButton.disabled = false;
    downloadButtonHTML.disabled = false;
    downloadButton.onclick = downloadCheatSheetPDF;
    downloadButtonHTML.onclick = downloadCheatSheet;
  

  } catch (error) {
    console.error("Error generating cheat sheet:", error);
    document.getElementById("personalizedPlan").innerHTML = `
      <div class="notification is-danger">Something went wrong while generating your cheat sheet. Please try again.</div>
    `;
  }
}

async function downloadCheatSheetPDF() {
  const cheatSheetElement = document.getElementById("cheatSheetBody");
  if (!cheatSheetElement) {
    console.error("Cheat Sheet element not found!");
    return;
  }

  await new Promise(resolve => setTimeout(resolve, 100));

  html2canvas(cheatSheetElement, {
    scale: 2,
    useCORS: true
  }).then(canvas => {
    const imgData = canvas.toDataURL('image/png');

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4"
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const marginLeft = 40; 
    let marginTop = 40; 

    pdf.setFont("Helvetica", "bold");     // or "times", "courier"
    pdf.setFontSize(20);                  // title size
    pdf.text("Your Responsible AI Cheat Sheet", marginLeft, marginTop);

    marginTop += 40; // extra space below the title

    const availableWidth = pageWidth - marginLeft * 2;
    const imgHeight = (canvas.height * availableWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', marginLeft, marginTop, availableWidth, imgHeight);

    pdf.save('My_Responsible_AI_Cheat_Sheet.pdf');
  }).catch(error => {
    console.error("Error generating PDF:", error);
  });
}





function downloadCheatSheet() {
  const cheatSheetHTML = document.getElementById("cheatSheetContent").innerHTML;
  
  const blob = new Blob(
    [
      `
      <html>
      <head><meta charset="utf-8"><title>My AI Cheat Sheet</title></head>
      <body>${cheatSheetHTML}</body>
      </html>
      `
    ],
    { type: "text/html" }
  );

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "My_Responsible_AI_Cheat_Sheet.html";
  a.click();
  URL.revokeObjectURL(url);
}


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
