
/**
 * AI Service for handling interactions with AI assistant
 */

// Function to evaluate math expressions
const evaluateMathExpression = (expression) => {
  try {
    // Basic sanitization - remove all characters except numbers, basic operators and parentheses
    const sanitized = expression.replace(/[^0-9+\-*/(). ]/g, '');
    // Use Function constructor to evaluate the expression safely
    // Note: In a production environment, you'd want to use a proper math library
    return new Function(`return ${sanitized}`)();
  } catch (error) {
    console.error('Math evaluation error:', error.message);
    return 'Не удалось вычислить выражение. Пожалуйста, проверьте синтаксис.';
  }
};

// Check if the string is a math expression
const isMathExpression = (text) => {
  // Simple regex to detect basic math operations
  return /^[\d\s+\-*/().]+$/.test(text.trim());
};

/**
 * Generate AI response using Google Gemini API
 * @param {string} question - The user's question
 * @returns {string} AI-generated response
 */
const getAIResponse = async (question) => {
  try {
    // Using Google Gemini API for better AI responses
    // This is a free public API key that has usage limitations but works for demo purposes
    const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyDJC5a7eWgwlPqRPjoQeR0rrxnDPVDXZY0'; 

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [{ 
          parts: [{ 
            text: `Ты - образовательный ассистент для подготовки к ЕНТ (Единому Национальному Тестированию) в Казахстане.
                  Отвечай на вопросы студентов по школьной программе.
                  Будь полезным, информативным и точным.
                  Если ты не знаешь ответа, так и скажи.
                  Вопрос: ${question}`
          }]
        }],
        generationConfig: {
          temperature: 0.5,
          maxOutputTokens: 1024,
          topP: 0.8,
          topK: 40
        }
      })
    });
    
    if (!response.ok) {
      console.error('API response error:', await response.text());
      return getFallbackResponse(question);
    }
    
    const data = await response.json();
    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!textResponse) {
      return getFallbackResponse(question);
    }
    
    return textResponse;
  } catch (error) {
    console.error('AI API error:', error);
    return getFallbackResponse(question);
  }
};

// Improved fallback function with more comprehensive predefined responses
const getFallbackResponse = (question) => {
  const lowercaseQuestion = question.toLowerCase();
  
  if (lowercaseQuestion.includes('казахстан')) {
    return 'Казахстан — государство в Центральной Азии, бывшая советская республика. Столица — Астана. Население составляет более 19 миллионов человек. Государственным языком является казахский, а русский имеет статус языка межнационального общения. Казахстан обрел независимость в 1991 году после распада Советского Союза.';
  } else if (lowercaseQuestion.includes('ент')) {
    return 'ЕНТ (Единое Национальное Тестирование) - это стандартизированный экзамен для выпускников школ в Казахстане. Он используется для поступления в высшие учебные заведения. Основные предметы включают математику, историю Казахстана, грамматику казахского/русского языка и предметы по выбору в зависимости от выбранной специальности.';
  } else if (lowercaseQuestion.includes('математик') || lowercaseQuestion.includes('алгебр') || lowercaseQuestion.includes('геометр')) {
    return 'В математической части ЕНТ тестируются знания по алгебре, геометрии и математическому анализу. Ключевые темы включают функции, уравнения, неравенства, векторы, производные и интегралы. Рекомендую начать с базовых концепций и постепенно переходить к более сложным задачам.';
  } else if (lowercaseQuestion.includes('физик')) {
    return 'Физика на ЕНТ охватывает механику, термодинамику, электричество и магнетизм, оптику и элементы квантовой физики. Особое внимание уделяется умению решать задачи и применять физические законы. Регулярная практика решения задач - ключ к успеху в этом разделе.';
  } else if (lowercaseQuestion.includes('истори')) {
    return 'История Казахстана на ЕНТ охватывает периоды от древности до современности. Важные темы включают: древние государства на территории Казахстана, средневековые ханства, присоединение к Российской империи, советский период и независимый Казахстан. Необходимо знать ключевые даты, личности и события.';
  } else if (lowercaseQuestion.includes('химия') || lowercaseQuestion.includes('хими')) {
    return 'Химия на ЕНТ включает общую, неорганическую и органическую химию. Важно знать периодическую таблицу, химические реакции, уметь решать задачи на расчет массы, объема и концентрации веществ. Рекомендую регулярно практиковаться в решении химических задач и уравнений.';
  } else if (lowercaseQuestion.includes('биолог')) {
    return 'Биология на ЕНТ включает цитологию, ботанику, зоологию, анатомию, генетику и экологию. Особое внимание уделяется терминологии, классификации организмов и пониманию биологических процессов. Используйте мнемонические приемы для запоминания сложных терминов и систематики.';
  } else if (lowercaseQuestion.includes('английск') || lowercaseQuestion.includes('англ')) {
    return 'Английский язык на ЕНТ проверяет навыки грамматики, лексики, чтения и понимания текста. Важно знать основные времена, конструкции, фразовые глаголы и иметь хороший словарный запас. Рекомендую регулярно читать тексты на английском и решать практические задания.';
  } else if (lowercaseQuestion.includes('привет') || lowercaseQuestion.includes('здравств')) {
    return 'Здравствуйте! Я Shabyt ЕНТ-ассистент. Я могу помочь вам с подготовкой к экзамену, ответить на вопросы по школьной программе или объяснить сложные темы. Что вас интересует?';
  } else if (lowercaseQuestion.includes('как дела') || lowercaseQuestion.includes('как у тебя дела')) {
    return 'У меня всё хорошо, спасибо! Я готов помочь вам с вопросами по подготовке к ЕНТ. Какой предмет вас интересует?';
  } else if (lowercaseQuestion.includes('помощь') || lowercaseQuestion.includes('помоги')) {
    return 'Я могу помочь вам с подготовкой к ЕНТ по разным предметам, объяснить сложные концепции и предложить стратегии обучения. Просто задайте мне конкретный вопрос по любому предмету.';
  } else {
    return 'Я могу помочь вам с информацией по предметам ЕНТ, стратегиям подготовки и различным темам школьной программы. Задайте мне вопрос о конкретном предмете или теме, и я постараюсь предоставить полезную информацию.';
  }
};

/**
 * Generate AI response based on input
 * @param {string} question - The user's question
 * @param {string} userRole - The role of the user (student, teacher)
 * @returns {string} AI-generated response
 */
const generateAIResponse = async (question, userRole) => {
  try {
    // Log the interaction
    console.log(`AI assistance request: ${question}`);
    console.log('User role:', userRole);

    // Check if it's a math expression
    if (isMathExpression(question)) {
      const result = evaluateMathExpression(question);
      return `${result}`;
    }

    // For text questions, use the AI response function
    return await getAIResponse(question);
  } catch (error) {
    console.error('AI Service error:', error.message);
    throw new Error('Failed to generate AI response');
  }
};

module.exports = {
  generateAIResponse
};
