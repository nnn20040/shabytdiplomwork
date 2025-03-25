
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
	return getAIResponse(question)
}

// getAIResponse gets a response from the Google Gemini API
func getAIResponse(question string) (string, error) {
	// Using Google Gemini API for better AI responses
	apiKey := os.Getenv("GEMINI_API_KEY")
	if apiKey == "" {
		apiKey = "AIzaSyDJC5a7eWgwlPqRPjoQeR0rrxnDPVDXZY0" // Default API key for demo purposes
	}

	url := "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"
	
	// Prepare request body
	requestBody := map[string]interface{}{
		"contents": []map[string]interface{}{
			{
				"parts": []map[string]interface{}{
					{
						"text": fmt.Sprintf(`Ты - образовательный ассистент для подготовки к ЕНТ (Единому Национальному Тестированию) в Казахстане.
						Отвечай на вопросы студентов по школьной программе.
						Будь полезным, информативным и точным.
						Если ты не знаешь ответа, так и скажи.
						Вопрос: %s`, question),
					},
				},
			},
		},
		"generationConfig": map[string]interface{}{
			"temperature":     0.5,
			"maxOutputTokens": 1024,
			"topP":            0.8,
			"topK":            40,
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
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		log.Printf("Error sending request: %v", err)
		return getFallbackResponse(question), nil
	}
	defer resp.Body.Close()

	// Check response status
	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		log.Printf("API response error: %s", string(body))
		return getFallbackResponse(question), nil
	}

	// Parse response
	var response GeminiResponse
	if err := json.NewDecoder(resp.Body).Decode(&response); err != nil {
		log.Printf("Error parsing response: %v", err)
		return getFallbackResponse(question), nil
	}

	// Extract text from response
	if len(response.Candidates) > 0 && len(response.Candidates[0].Content.Parts) > 0 {
		return response.Candidates[0].Content.Parts[0].Text, nil
	}

	return getFallbackResponse(question), nil
}

// getFallbackResponse provides a fallback response when the AI API fails
func getFallbackResponse(question string) string {
	lowercaseQuestion := strings.ToLower(question)
	
	if strings.Contains(lowercaseQuestion, "казахстан") {
		return "Казахстан — государство в Центральной Азии, бывшая советская республика. Столица — Астана. Население составляет более 19 миллионов человек. Государственным языком является казахский, а русский имеет статус языка межнационального общения. Казахстан обрел независимость в 1991 году после распада Советского Союза."
	} else if strings.Contains(lowercaseQuestion, "ент") {
		return "ЕНТ (Единое Национальное Тестирование) - это стандартизированный экзамен для выпускников школ в Казахстане. Он используется для поступления в высшие учебные заведения. Основные предметы включают математику, историю Казахстана, грамматику казахского/русского языка и предметы по выбору в зависимости от выбранной специальности."
	} else if strings.Contains(lowercaseQuestion, "математик") || strings.Contains(lowercaseQuestion, "алгебр") || strings.Contains(lowercaseQuestion, "геометр") {
		return "В математической части ЕНТ тестируются знания по алгебре, геометрии и математическому анализу. Ключевые темы включают функции, уравнения, неравенства, векторы, производные и интегралы. Рекомендую начать с базовых концепций и постепенно переходить к более сложным задачам."
	} else if strings.Contains(lowercaseQuestion, "физик") {
		return "Физика на ЕНТ охватывает механику, термодинамику, электричество и магнетизм, оптику и элементы квантовой физики. Особое внимание уделяется умению решать задачи и применять физические законы. Регулярная практика решения задач - ключ к успеху в этом разделе."
	} else if strings.Contains(lowercaseQuestion, "истори") {
		return "История Казахстана на ЕНТ охватывает периоды от древности до современности. Важные темы включают: древние государства на территории Казахстана, средневековые ханства, присоединение к Российской империи, советский период и независимый Казахстан. Необходимо знать ключевые даты, личности и события."
	} else if strings.Contains(lowercaseQuestion, "химия") || strings.Contains(lowercaseQuestion, "хими") {
		return "Химия на ЕНТ включает общую, неорганическую и органическую химию. Важно знать периодическую таблицу, химические реакции, уметь решать задачи на расчет массы, объема и концентрации веществ. Рекомендую регулярно практиковаться в решении химических задач и уравнений."
	} else if strings.Contains(lowercaseQuestion, "биолог") {
		return "Биология на ЕНТ включает цитологию, ботанику, зоологию, анатомию, генетику и экологию. Особое внимание уделяется терминологии, классификации организмов и пониманию биологических процессов. Используйте мнемонические приемы для запоминания сложных терминов и систематики."
	} else if strings.Contains(lowercaseQuestion, "английск") || strings.Contains(lowercaseQuestion, "англ") {
		return "Английский язык на ЕНТ проверяет навыки грамматики, лексики, чтения и понимания текста. Важно знать основные времена, конструкции, фразовые глаголы и иметь хороший словарный запас. Рекомендую регулярно читать тексты на английском и решать практические задания."
	} else if strings.Contains(lowercaseQuestion, "привет") || strings.Contains(lowercaseQuestion, "здравств") {
		return "Здравствуйте! Я Shabyt ЕНТ-ассистент. Я могу помочь вам с подготовкой к экзамену, ответить на вопросы по школьной программе или объяснить сложные темы. Что вас интересует?"
	} else if strings.Contains(lowercaseQuestion, "как дела") || strings.Contains(lowercaseQuestion, "как у тебя дела") {
		return "У меня всё хорошо, спасибо! Я готов помочь вам с вопросами по подготовке к ЕНТ. Какой предмет вас интересует?"
	} else if strings.Contains(lowercaseQuestion, "помощь") || strings.Contains(lowercaseQuestion, "помоги") {
		return "Я могу помочь вам с подготовкой к ЕНТ по разным предметам, объяснить сложные концепции и предложить стратегии обучения. Просто задайте мне конкретный вопрос по любому предмету."
	} else {
		return "Я могу помочь вам с информацией по предметам ЕНТ, стратегиям подготовки и различным темам школьной программы. Задайте мне вопрос о конкретном предмете или теме, и я постараюсь предоставить полезную информацию."
	}
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
