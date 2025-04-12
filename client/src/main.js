// main.js

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
  