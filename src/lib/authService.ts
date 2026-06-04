export const authService = {
  login: async (email: string, password: string): Promise<{ token: string; user: { email: string; role: string } }> => {
    // Simulating API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    if (email === "admin@xion.pro" && password === "password123") {
      const mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mocked-super-token";
      localStorage.setItem("xion_auth_token", mockToken);
      localStorage.setItem("xion_user_role", "super_admin");
      return { token: mockToken, user: { email, role: "super_admin" } };
    } else if (email === "demo@xion.pro" && password === "password123") {
      const mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mocked-jwt-token";
      localStorage.setItem("xion_auth_token", mockToken);
      localStorage.setItem("xion_user_role", "pharmacy_admin");
      return { token: mockToken, user: { email, role: "pharmacy_admin" } };
    }
    
    throw new Error("Invalid credentials");
  },
  logout: () => {
    localStorage.removeItem("xion_auth_token");
    localStorage.removeItem("xion_user_role");
  },
  getToken: () => localStorage.getItem("xion_auth_token"),
  getRole: () => localStorage.getItem("xion_user_role") || "pharmacy_admin",
  isAuthenticated: () => !!localStorage.getItem("xion_auth_token"),
};
