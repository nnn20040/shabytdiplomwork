
func RequireTwoFactorSetup(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        user, ok := r.Context().Value(UserKey).(*models.User)
        if !ok {
            http.Error(w, "Unauthorized", http.StatusUnauthorized)
            return
        }

        // Если 2FA включен, но настройка не завершена - редирект
        if user.TwoFactorEnabled && !user.TwoFactorSetupCompleted {
            http.Redirect(w, r, "/2fa-setup", http.StatusTemporaryRedirect)
            return
        }

        next.ServeHTTP(w, r)
    })
}
