
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

    // Generate response based on keywords and content
    let response = '';
    const lowercaseQuestion = question.toLowerCase();

    if (lowercaseQuestion.includes('ент')) {
      response = 'ЕНТ (Единое Национальное Тестирование) - это стандартизированный экзамен для выпускников школ в Казахстане. Он используется для поступления в высшие учебные заведения. Основные предметы включают математику, историю Казахстана, грамматику казахского/русского языка и предметы по выбору в зависимости от выбранной специальности.';
    } else if (lowercaseQuestion.includes('математик')) {
      response = 'В математической части ЕНТ тестируются знания по алгебре, геометрии и математическому анализу. Ключевые темы включают функции, уравнения, неравенства, векторы, производные и интегралы. Рекомендую начать с базовых концепций и постепенно переходить к более сложным задачам.';
    } else if (lowercaseQuestion.includes('физик')) {
      response = 'Физика на ЕНТ охватывает механику, термодинамику, электричество и магнетизм, оптику и элементы квантовой физики. Особое внимание уделяется умению решать задачи и применять физические законы. Регулярная практика решения задач - ключ к успеху в этом разделе.';
    } else if (lowercaseQuestion.includes('истори')) {
      response = 'История Казахстана на ЕНТ включает периоды от древности до современности. Важно знать ключевые даты, исторические личности и события. Рекомендую использовать хронологические таблицы и карты для лучшего запоминания материала.';
    } else if (lowercaseQuestion.includes('подготов')) {
      response = 'Для эффективной подготовки к ЕНТ рекомендую: 1) Составить план подготовки по каждому предмету, 2) Регулярно решать тесты в формате ЕНТ, 3) Анализировать свои ошибки, 4) Использовать разнообразные учебные материалы, 5) Поддерживать режим дня и следить за здоровьем. Наша платформа предоставляет все необходимые ресурсы для успешной подготовки.';
    } else if (lowercaseQuestion.includes('литератур')) {
      response = 'Литература на ЕНТ проверяет знание ключевых произведений, их авторов, персонажей и основных тем. Важно читать произведения полностью, а не только краткие содержания. Обратите внимание на литературные течения, средства выразительности и анализ произведений.';
    } else if (lowercaseQuestion.includes('казахск')) {
      response = 'Казахский язык и литература на ЕНТ включают проверку грамматики, правописания, лексики, а также знание ключевых произведений казахской литературы. Регулярное чтение и письмо на казахском языке поможет улучшить ваши навыки.';
    } else if (lowercaseQuestion.includes('русск')) {
      response = 'Русский язык на ЕНТ проверяет знание грамматики, пунктуации, орфографии и лексики. Важно уделить внимание правилам построения предложений, использованию знаков препинания и правописанию сложных случаев.';
    } else if (lowercaseQuestion.includes('химия') || lowercaseQuestion.includes('химии')) {
      response = 'Химия на ЕНТ включает периодическую систему, химические элементы и соединения, типы реакций, основы органической и неорганической химии. Важно знать формулы, уметь составлять уравнения реакций и решать задачи на вычисления.';
    } else if (lowercaseQuestion.includes('биологи')) {
      response = 'Биология на ЕНТ охватывает клеточную биологию, генетику, эволюцию, анатомию и физиологию человека, экологию. Особое внимание уделяется пониманию биологических процессов и механизмов, а также умению анализировать биологические данные.';
    } else if (lowercaseQuestion.includes('географи')) {
      response = 'География на ЕНТ проверяет знание физической и экономической географии, карт, природных зон, стран и регионов. Важно знать географические объекты Казахстана и мира, климатические зоны и экономические особенности регионов.';
    } else if (lowercaseQuestion.includes('англ')) {
      response = 'Английский язык на ЕНТ проверяет знание грамматики, лексики, чтения и понимания текстов. Регулярная практика чтения, письма и выполнения грамматических упражнений поможет успешно сдать этот предмет.';
    } else {
      response = 'Я могу помочь с подготовкой к ЕНТ по различным предметам, объяснить сложные концепции и предложить стратегии обучения. Могу ответить на вопросы по математике, физике, истории, биологии, химии, языкам и другим предметам. Пожалуйста, уточните ваш вопрос для получения более конкретной информации.';
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
