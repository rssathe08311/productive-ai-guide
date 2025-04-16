// main.js

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

  document.addEventListener("DOMContentLoaded", () => {
    const burger = document.querySelector(".navbar-burger");
    const menu = document.getElementById(burger.dataset.target);

    burger.addEventListener("click", () => {
      burger.classList.toggle("is-active");
      menu.classList.toggle("is-active");
    });
  });

// Handle Quiz Answer
function handleQuizAnswer(answer) {
    localStorage.setItem('quizAnswer', answer);
  
    const feedback = document.getElementById('quizFeedback');
    feedback.classList.remove('is-hidden');
    feedback.classList.remove('is-success', 'is-danger');
  
    if (answer === 'false') {
      feedback.classList.add('is-success');
      feedback.innerHTML = '<i class="fas fa-check-circle"></i> Correct! AI is not always right.';
    } else {
      feedback.classList.add('is-danger');
      feedback.innerHTML = '<i class="fas fa-times-circle"></i> Not quite! AI can make mistakes, so it’s not always right.';
    }
  }
  
  // Save AI Definition
  function saveAIDefinition() {
    const definition = document.getElementById('aiDefinition').value.trim();
  
    if (definition) {
      localStorage.setItem('aiDefinition', definition);
  
      const feedback = document.getElementById('definitionFeedback');
      feedback.classList.remove('is-hidden');
      feedback.innerHTML = '<i class="fas fa-check-circle"></i> Thanks for your input!';
    }
  }

  const generateCheatSheet = async () => {
    const familiarity = getSelectedRadioValue("aiFamiliarity");
    const feeling = getSelectedRadioValue("aiFeeling");
    const change = getSelectedRadioValue("aiChange");
    const futureWord = document.getElementById("futurePhrase").value;
    const customUse = document.getElementById("customUseInput").value;
    const question = document.getElementById("questionBox").value;
  
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
  };
  

  // Populate summary at end of guide
document.addEventListener("DOMContentLoaded", () => {
    const aiDefinition = localStorage.getItem('aiDefinition');
    const quizAnswer = localStorage.getItem('quizAnswer');
  
    document.getElementById('summaryAIDefinition').textContent = aiDefinition || 'No definition provided.';
    
    if (quizAnswer === 'false') {
      document.getElementById('summaryQuizAnswer').textContent = 'False (Correct!)';
    } else if (quizAnswer === 'true') {
      document.getElementById('summaryQuizAnswer').textContent = 'True (Remember: AI can make mistakes!)';
    } else {
      document.getElementById('summaryQuizAnswer').textContent = 'No answer provided.';
    }
  });
  

// === Smooth Scroll ===
function nextSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
  }
  
  // === In-memory State ===
  const userAnswers = {};
  
  // === API Helper ===
  async function callAI(messages) {
    try {
      const response = await fetch('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages }),
      });
  
      const data = await response.json();
      if (data.assistantMessage) {
        return data.assistantMessage;
      } else {
        console.error('No assistant message returned:', data);
        return 'Sorry, something went wrong.';
      }
    } catch (error) {
      console.error('Error calling AI:', error);
      return 'Error contacting AI.';
    }
  }
  
  // === Form Handler Helper ===
  function setupFormHandler(formId, responseContainerId, buildMessages, onAnswerSave) {
    const form = document.getElementById(formId);
  
    if (!form) {
      console.warn(`Form with id '${formId}' not found.`);
      return;
    }
  
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      // Extract user input
      const formData = new FormData(form);
      const userInput = Object.fromEntries(formData.entries());
  
      // Save answers
      if (typeof onAnswerSave === 'function') {
        onAnswerSave(userInput);
      }
  
      // Build messages and call AI
      const messages = buildMessages(userInput);
      const aiResponse = await callAI(messages);
  
      // Update response container
      const responseContainer = document.getElementById(responseContainerId);
      if (responseContainer) {
        responseContainer.textContent = aiResponse;
      }
    });
  }
  
  // === Personalized Plan Generator ===
  function generatePlan() {
    const planContainer = document.getElementById('personalizedPlan');
    if (planContainer) {
      planContainer.textContent = JSON.stringify(userAnswers, null, 2);
    }
  }
  
  // === Event Listeners ===
  document.getElementById('wrap-up')?.addEventListener('mouseenter', generatePlan);
  
  // === Initialize Forms ===
  setupFormHandler(
    'stanceForm',
    'stanceResponse',
    (userInput) => [
      { role: 'system', content: 'You are a helpful AI advisor for students.' },
      { role: 'user', content: `A student feels "${userInput.stance}" about AI in education. Provide a short supportive message.` }
    ],
    (userInput) => {
      userAnswers.stance = userInput.stance;
    }
  );
  