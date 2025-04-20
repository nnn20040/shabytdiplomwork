package services

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"regexp"
	"strconv"
	"strings"
	"time"
)

// GeminiResponse represents the response from Google Gemini API
type GeminiResponse struct {
	Candidates []struct {
		Content struct {
			Parts []struct {
				Text string `json:"text"`
			} `json:"parts"`
		} `json:"content"`
	} `json:"candidates"`
	Error struct {
		Code    int    `json:"code"`
		Message string `json:"message"`
		Status  string `json:"status"`
	} `json:"error"`
}

// EvaluateMathExpression evaluates a mathematical expression
func EvaluateMathExpression(expression string) (string, error) {
	// Basic sanitization - remove all characters except numbers, basic operators and parentheses
	sanitized := regexp.MustCompile(`[^0-9+\-*/( ).]`).ReplaceAllString(expression, "")

	// Split the expression into tokens
	tokens := tokenize(sanitized)
	
	// Convert to postfix notation
	postfix, err := infixToPostfix(tokens)
	if err != nil {
		return "", err
	}
	
	// Evaluate the postfix expression
	result, err := evaluatePostfix(postfix)
	if err != nil {
		return "", err
	}
	
	return fmt.Sprintf("%g", result), nil
}

// IsMathExpression checks if a string is a mathematical expression
func IsMathExpression(text string) bool {
	// Simple regex to detect basic math operations
	return regexp.MustCompile(`^[\d\s+\-*/().]+$`).MatchString(strings.TrimSpace(text))
}

// GenerateAIResponse generates a response using AI based on the input question
func GenerateAIResponse(question, userRole string) (string, error) {
	// Log the interaction
	log.Printf("AI assistance request: %s", question)
	log.Printf("User role: %s", userRole)

	// Check if it's a math expression
	if IsMathExpression(question) {
		result, err := EvaluateMathExpression(question)
		if err != nil {
			log.Printf("Math evaluation error: %v", err)
			return "Не удалось вычислить выражение. Пожалуйста, проверьте синтаксис.", nil
		}
		return result, nil
	}

	// For text questions, use the Gemini API
	return getAIResponse(question, userRole)
}

// getAIResponse gets a response from the Google Gemini API
func getAIResponse(question, userRole string) (string, error) {
	// Using Google Gemini API for better AI responses
	apiKey := os.Getenv("GEMINI_API_KEY")
	if apiKey == "" {
		apiKey = "AIzaSyDJC5a7eWgwlPqRPjoQeR0rrxnDPVDXZY0" // Default API key for demo purposes
	}

	url := "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"
	
	// Prepare request body with system prompt tailored for educational content
	systemPrompt := `Вы - образовательный ассистент для подготовки к ЕНТ (Единому Национальному Тестированию) в Казахстане.
	Отвечайте на вопросы студентов по школьной программе на том языке, на котором задан вопрос (казахский или русский).
	Будьте полезным, информативным и точным.
	Если вы не знаете ответа, так и скажите.
	Приоритет точности информации над красотой изложения.
	Если вопрос задан на казахском, отвечайте на казахском.
	Если вопрос задан на русском, отвечайте на русском.`

	// Add role-specific instructions
	if userRole == "teacher" {
		systemPrompt += `\nВы общаетесь с преподавателем. Предлагайте методические рекомендации и профессиональные советы.`
	}

	requestBody := map[string]interface{}{
		"contents": []map[string]interface{}{
			{
				"parts": []map[string]interface{}{
					{
						"text": fmt.Sprintf("%s\nВопрос: %s", systemPrompt, question),
					},
				},
			},
		},
		"generationConfig": map[string]interface{}{
			"temperature":     0.3,
			"maxOutputTokens": 2048,
			"topP":            0.8,
			"topK":            40,
		},
		"safetySettings": []map[string]interface{}{
			{
				"category":    "HARM_CATEGORY_HATE_SPEECH",
				"threshold":   "BLOCK_MEDIUM_AND_ABOVE",
			},
			{
				"category":    "HARM_CATEGORY_DANGEROUS_CONTENT",
				"threshold":   "BLOCK_MEDIUM_AND_ABOVE",
			},
		},
	}

	requestJSON, err := json.Marshal(requestBody)
	if err != nil {
		log.Printf("Error marshaling request: %v", err)
		return getFallbackResponse(question), nil
	}

	// Create HTTP request
	req, err := http.NewRequest("POST", url, bytes.NewBuffer(requestJSON))
	if err != nil {
		log.Printf("Error creating request: %v", err)
		return getFallbackResponse(question), nil
	}

	// Set headers
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("x-goog-api-key", apiKey)

	// Send request
	client := &http.Client{Timeout: 30 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		log.Printf("Error sending request: %v", err)
		return getFallbackResponse(question), nil
	}
	defer resp.Body.Close()

	// Read response body
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Printf("Error reading response body: %v", err)
		return getFallbackResponse(question), nil
	}

	// Parse response
	var response GeminiResponse
	if err := json.Unmarshal(body, &response); err != nil {
		log.Printf("Error parsing response: %v", err)
		return getFallbackResponse(question), nil
	}

	// Check for API error
	if response.Error.Code != 0 {
		log.Printf("API error: %s", response.Error.Message)
		return getFallbackResponse(question), nil
	}

	// Extract text from response
	if len(response.Candidates) > 0 && len(response.Candidates[0].Content.Parts) > 0 {
		text := response.Candidates[0].Content.Parts[0].Text
		// Remove any leading/trailing whitespace
		text = strings.TrimSpace(text)
		return text, nil
	}

	return getFallbackResponse(question), nil
}

// getFallbackResponse provides a fallback response when the AI API fails
func getFallbackResponse(question string) string {
	// Detect language
	isKazakh := containsKazakhCharacters(question)
	
	lowercaseQuestion := strings.ToLower(question)
	
	if isKazakh {
		// Kazakh fallback responses
		if strings.Contains(lowercaseQuestion, "қазақстан") {
			return "Қазақстан — Орталық Азиядағы мемлекет, бұрынғы кеңестік республика. Астанасы — Астана. Халқы 19 миллионнан астам адамды құрайды. Мемлекеттік тіл — қазақ тілі, ал орыс тілі ұлтаралық қатынас тілі мәртебесіне ие. Қазақстан 1991 жылы Кеңес Одағы ыдырағаннан кейін тәуелсіздік алды."
		} else if strings.Contains(lowercaseQuestion, "ұбт") {
			return "ҰБТ (Ұлттық Бірыңғай Тестілеу) - Қазақстандағы мектеп бітірушілер үшін стандартталған емтихан. Ол жоғары оқу орындарына түсу үшін қолданылады. Негізгі пәндерге математика, Қазақстан тарихы, қазақ/орыс тілінің грамматикасы және таңдалған мамандыққа байланысты таңдау пәндері кіреді."
		} else if strings.Contains(lowercaseQuestion, "математика") || strings.Contains(lowercaseQuestion, "алгебра") || strings.Contains(lowercaseQuestion, "геометрия") {
			return "ҰБТ-ның математикалық бөлімінде алгебра, геометрия және математикалық талдау бойынша білім тексеріледі. Негізгі тақырыптарға функциялар, теңдеулер, теңсіздіктер, векторлар, туындылар және интегралдар кіреді. Негізгі ұғымдардан бастап, біртіндеп күрделі есептерге көшуді ұсынамын."
		} else if strings.Contains(lowercaseQuestion, "сәлем") || strings.Contains(lowercaseQuestion, "амансыз") {
			return "Сәлеметсіз бе! Мен Shabyt ҰБТ-көмекшісімін. Мен сізге емтиханға дайындалуға, мектеп бағдарламасы бойынша сұрақтарға жауап беруге немесе күрделі тақырыптарды түсіндіруге көмектесе аламын. Сізі не қызықтырады?"
		} else {
			return "Мен сізге ҰБТ пәндері, дайындық стратегиялары және мектеп бағдарламасының әртүрлі тақырыптары туралы ақпарат бере аламын. Маған нақты пән немесе тақырып туралы сұрақ қойыңыз, мен пайдалы ақпарат беруге тырысамын."
		}
	} else {
		// Russian fallback responses (keep existing fallback responses)
		if strings.Contains(lowercaseQuestion, "казахстан") {
			return "Казахстан — государство в Центральной Азии, бывшая советская республика. Столица — Астана. Население составляет более 19 миллионов человек. Государственным языком является казахский, а русский имеет статус языка межнационального общения. Казахстан обрел независимость в 1991 году после распада Советского Союза."
		} else if strings.Contains(lowercaseQuestion, "ент") {
			return "ЕНТ (Единое Национальное Тестирование) - это стандартизированный экзамен для выпускников школ в Казахстане. Он используется для поступления в высшие учебные заведения. Основные предметы включают математику, историю Казахстана, грамматику казахского/русского языка и предметы по выбору в зависимости от выбранной специальности."
		} else if strings.Contains(lowercaseQuestion, "математик") || strings.Contains(lowercaseQuestion, "алгебр") || strings.Contains(lowercaseQuestion, "геометр") {
			return "В математической части ЕНТ тестируются знания по алгебре, геометрии и математическому анализу. Ключевые темы включают функции, уравнения, неравенства, векторы, производные и интегралы. Рекомендую начать с базовых концепций и постепенно переходить к более сложным задачам."
		} else if strings.Contains(lowercaseQuestion, "привет") || strings.Contains(lowercaseQuestion, "здравств") {
			return "Здравствуйте! Я Shabyt ЕНТ-ассистент. Я могу помочь вам с подготовкой к экзамену, ответить на вопросы по школьной программе или объяснить сложные темы. Что вас интересует?"
		} else {
			return "Я могу помочь вам с информацией по предметам ЕНТ, стратегиям подготовки и различным темам школьной программы. Задайте мне вопрос о конкретном предмете или теме, и я постараюсь предоставить полезную информацию."
		}
	}
}

// containsKazakhCharacters checks if a string contains Kazakh-specific characters
func containsKazakhCharacters(text string) bool {
	// Kazakh-specific characters not in Russian: Әә, Ғғ, Ққ, Ңң, Өө, Ұұ, Үү, Һһ, Іі
	kazakh := []string{"Ә", "ә", "Ғ", "ғ", "Қ", "қ", "Ң", "ң", "Ө", "ө", "Ұ", "ұ", "Ү", "ү", "Һ", "һ", "І", "і"}
	
	for _, char := range kazakh {
		if strings.Contains(text, char) {
			return true
		}
	}
	
	// If no Kazakh-specific characters are found, check for Kazakh words
	kazakhWords := []string{"мен", "біз", "сен", "с��з", "ол", "олар", "бұл", "қазақ", "қазақша", "рақмет"}
	
	words := strings.Fields(strings.ToLower(text))
	for _, word := range words {
		for _, kazakhWord := range kazakhWords {
			if word == kazakhWord {
				return true
			}
		}
	}
	
	return false
}

// Helper functions for math expression evaluation
func tokenize(expr string) []string {
	expr = strings.ReplaceAll(expr, " ", "")
	var tokens []string
	var numBuilder strings.Builder

	for i := 0; i < len(expr); i++ {
		c := expr[i]
		if isDigit(c) || c == '.' {
			numBuilder.WriteByte(c)
		} else {
			if numBuilder.Len() > 0 {
				tokens = append(tokens, numBuilder.String())
				numBuilder.Reset()
			}
			tokens = append(tokens, string(c))
		}
	}

	if numBuilder.Len() > 0 {
		tokens = append(tokens, numBuilder.String())
	}

	return tokens
}

func isDigit(c byte) bool {
	return c >= '0' && c <= '9'
}

func precedence(op string) int {
	switch op {
	case "+", "-":
		return 1
	case "*", "/":
		return 2
	}
	return 0
}

func infixToPostfix(tokens []string) ([]string, error) {
	var result []string
	var stack []string

	for _, token := range tokens {
		if token == "(" {
			stack = append(stack, token)
		} else if token == ")" {
			for len(stack) > 0 && stack[len(stack)-1] != "(" {
				result = append(result, stack[len(stack)-1])
				stack = stack[:len(stack)-1]
			}
			if len(stack) == 0 {
				return nil, errors.New("mismatched parentheses")
			}
			// Pop the "("
			stack = stack[:len(stack)-1]
		} else if token == "+" || token == "-" || token == "*" || token == "/" {
			for len(stack) > 0 && stack[len(stack)-1] != "(" && precedence(stack[len(stack)-1]) >= precedence(token) {
				result = append(result, stack[len(stack)-1])
				stack = stack[:len(stack)-1]
			}
			stack = append(stack, token)
		} else {
			// Number
			result = append(result, token)
		}
	}

	for len(stack) > 0 {
		if stack[len(stack)-1] == "(" {
			return nil, errors.New("mismatched parentheses")
		}
		result = append(result, stack[len(stack)-1])
		stack = stack[:len(stack)-1]
	}

	return result, nil
}

func evaluatePostfix(tokens []string) (float64, error) {
	var stack []float64

	for _, token := range tokens {
		if token == "+" || token == "-" || token == "*" || token == "/" {
			if len(stack) < 2 {
				return 0, errors.New("invalid expression")
			}
			b := stack[len(stack)-1]
			a := stack[len(stack)-2]
			stack = stack[:len(stack)-2]

			var result float64
			switch token {
			case "+":
				result = a + b
			case "-":
				result = a - b
			case "*":
				result = a * b
			case "/":
				if b == 0 {
					return 0, errors.New("division by zero")
				}
				result = a / b
			}
			stack = append(stack, result)
		} else {
			// Number
			num, err := strconv.ParseFloat(token, 64)
			if err != nil {
				return 0, err
			}
			stack = append(stack, num)
		}
	}

	if len(stack) != 1 {
		return 0, errors.New("invalid expression")
	}
	return stack[0], nil
}
