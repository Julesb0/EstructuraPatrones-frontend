export const useSocialAuth = () => {
  // Este hook ya no se usa, la lógica está en el contexto de autenticación
  return {
    loading: false,
    error: null,
    handleSocialLogin: async () => {},
    handleOAuthCallback: async () => {}
  }
}