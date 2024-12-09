const apiUrl = "https://raw.githubusercontent.com/cesarmcuellar/CuestionarioWeb/main/cuestionario.json";

const quizContainer = document.getElementById("quiz-container");
const submitBtn = document.getElementById("submit-btn");
const resultContainer = document.getElementById("result-container");

let questions = [];

// Función para obtener y procesar las preguntas desde la API
async function fetchQuestions() {
  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`Error al obtener las preguntas. Estado: ${response.status}`);//aqui me ayude con ia
    }

    const data = await response.json();
    
    // Combinar las preguntas de opción múltiple y verdadero/falso en un solo array
    questions = [
      ...data.multiple_choice_questions.map(q => ({
        question: q.question,
        options: q.options,
        correct_answer: q.correct_answer,
        type: "multiple_choice"
      })),
      ...data.true_false_questions.map(q => ({
        question: q.question,
        options: ["Verdadero", "Falso"],
        correct_answer: q.correct_answer ? "Verdadero" : "Falso",
        type: "true_false"
      }))
    ];

    questions = shuffleArray(questions); // Mezclar las preguntas
    displayQuestions(); // Mostrar las preguntas
  } catch (error) {
    console.error("Error al obtener las preguntas:", error);
  }
}

// Función para mostrar las preguntas
function displayQuestions() {
  quizContainer.innerHTML = ""; // Limpiar el contenedor antes de mostrar preguntas

  questions.forEach((question, index) => {
    const questionDiv = document.createElement("div");
    questionDiv.classList.add("question");

    const questionText = document.createElement("p");
    questionText.textContent = `${index + 1}. ${question.question}`;
    questionDiv.appendChild(questionText);

    const optionsDiv = document.createElement("div");
    optionsDiv.classList.add("options");

    question.options.forEach(option => {
      const label = document.createElement("label");
      const input = document.createElement("input");
      input.type = "radio";
      input.name = `question-${index}`;
      input.value = option;
      label.appendChild(input);
      label.appendChild(document.createTextNode(option));
      optionsDiv.appendChild(label);
      optionsDiv.appendChild(document.createElement("br"));
    });

    questionDiv.appendChild(optionsDiv);
    quizContainer.appendChild(questionDiv);
  });
}

// Función para calcular el resultado
function calculateResult() {
  let correctAnswers = 0;

  questions.forEach((question, index) => {
    const selectedOption = document.querySelector(`input[name="question-${index}"]:checked`);
    if (selectedOption && selectedOption.value === question.correct_answer) {
      correctAnswers++;
    }
  });

  const percentage = ((correctAnswers / questions.length) * 100).toFixed(2);
  resultContainer.textContent = `Tu resultado es: ${percentage}% (${correctAnswers} de ${questions.length} correctas)`;
}

// Función para mezclar el array
function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);//aqui me ayude con ia
}

submitBtn.addEventListener("click", calculateResult);

fetchQuestions();
