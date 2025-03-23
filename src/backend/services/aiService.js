
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

    // Generate response based on keywords
    let response = '';

    if (question.toLowerCase().includes('ент')) {
      response = 'ЕНТ (Единое Национальное Тестирование) - это стандартизированный экзамен для выпускников школ в Казахстане. Он используется для поступления в высшие учебные заведения. Основные предметы включают математику, историю Казахстана, грамматику казахского/русского языка и предметы по выбору в зависимости от выбранной специальности.';
    } else if (question.toLowerCase().includes('математик')) {
      response = 'В математической части ЕНТ тестируются знания по алгебре, геометрии и математическому анализу. Ключевые темы включают функции, уравнения, неравенства, векторы, производные и интегралы. Рекомендую начать с базовых концепций и постепенно переходить к более сложным задачам.';
    } else if (question.toLowerCase().includes('физик')) {
      response = 'Физика на ЕНТ охватывает механику, термодинамику, электричество и магнетизм, оптику и элементы квантовой физики. Особое внимание уделяется умению решать задачи и применять физические законы. Регулярная практика решения задач - ключ к успеху в этом разделе.';
    } else if (question.toLowerCase().includes('истори')) {
      response = 'История Казахстана на ЕНТ включает периоды от древности до современности. Важно знать ключевые даты, исторические личности и события. Рекомендую использовать хронологические таблицы и карты для лучшего запоминания материала.';
    } else if (question.toLowerCase().includes('подготов')) {
      response = 'Для эффективной подготовки к ЕНТ рекомендую: 1) Составить план подготовки по каждому предмету, 2) Регулярно решать тесты в формате ЕНТ, 3) Анализировать свои ошибки, 4) Использовать разнообразные учебные материалы, 5) Поддерживать режим дня и следить за здоровьем. Наша платформа предоставляет все необходимые ресурсы для успешной подготовки.';
    } else {
      response = 'Спасибо за ваш вопрос. Я могу помочь с подготовкой к ЕНТ по различным предметам, объяснить сложные концепции и предложить стратегии обучения. Пожалуйста, уточните ваш вопрос, чтобы я мог предоставить более конкретную информацию.';
    }

    return response;
  } catch (error) {
    console.error('AI Service error:', error.message);
    throw new Error('Failed to generate AI response');
  }
};

module.exports = {
  generateAIResponse
};
