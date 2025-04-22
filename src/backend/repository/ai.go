package repository

import (
	"context"

	"github.com/nnn20040/shabytdiplomwork/src/backend/database"
	"github.com/nnn20040/shabytdiplomwork/src/backend/models"
)

func CreateAIInteraction(c context.Context, userId, question, response string) models.AIInteraction {
	var interaction models.AIInteraction
	database.QueryRowContext(c, `INSERT INTO ai_assistant (user_id, question, response, created_at) VALUES ($1, $2, $3, NOW()) 
		RETURNING id, user_id, question, response, created_at`,
		userId, question, response).Scan(&interaction.ID, &interaction.UserID, &interaction.Question, &interaction.Response, &interaction.CreatedAt)
	return interaction

}

func GetAIInteractions(c context.Context, userId string) ([]models.AIInteraction, error) {
	rows, err := database.QueryContext(c, "SELECT id, user_id, question, response, created_at FROM ai_assistant WHERE user_id = $1 ORDER BY created_at DESC", userId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var interactions []models.AIInteraction
	for rows.Next() {
		var interaction models.AIInteraction
		rows.Scan(&interaction.ID, &interaction.UserID, &interaction.Question, &interaction.Response, &interaction.CreatedAt)

		interactions = append(interactions, interaction)
	}
	return interactions, nil
}
