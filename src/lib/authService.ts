export const authService = {
  login: async (email: string, password: string): Promise<{ token: string; user: { email: string } }> => {
    // Simulating API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    if (email === "demo@xion.pro" && password === "password123") {
      const mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mocked-jwt-token";
      localStorage.setItem("xion_auth_token", mockToken);
      return { token: mockToken, user: { email } };
    }
    
    throw new Error("Invalid credentials");
  },
  logout: () => {
    localStorage.removeItem("xion_auth_token");
  },
  getToken: () => localStorage.getItem("xion_auth_token"),
  isAuthenticated: () => !!localStorage.getItem("xion_auth_token"),
};
