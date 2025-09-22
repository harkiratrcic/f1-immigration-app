// Simple authentication for Railway deployment
// This is a temporary auth system - in production you'd want proper JWT auth

interface User {
  id: string
  email: string
  name: string
  role: 'ADMIN' | 'STAFF'
}

class AuthService {
  private user: User | null = null
  private listeners: Array<(user: User | null) => void> = []

  constructor() {
    // Check if user is already logged in
    this.loadUserFromStorage()
  }

  private loadUserFromStorage() {
    try {
      const userData = localStorage.getItem('f1_auth_user')
      if (userData) {
        this.user = JSON.parse(userData)
        this.notifyListeners()
      }
    } catch (error) {
      console.error('Error loading user from storage:', error)
    }
  }

  private saveUserToStorage(user: User | null) {
    if (user) {
      localStorage.setItem('f1_auth_user', JSON.stringify(user))
    } else {
      localStorage.removeItem('f1_auth_user')
    }
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.user))
  }

  // Simple login - in production this would validate against your database
  async signIn(email: string, password: string): Promise<{ user?: User; error?: string }> {
    try {
      // For demo purposes, accept any email ending with @f1immigration.com
      if (email.endsWith('@f1immigration.com') && password.length >= 6) {
        const user: User = {
          id: 'admin-' + Date.now(),
          email,
          name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
          role: 'ADMIN'
        }

        this.user = user
        this.saveUserToStorage(user)
        this.notifyListeners()

        return { user }
      } else {
        return { error: 'Invalid credentials. Use @f1immigration.com email and password with 6+ characters.' }
      }
    } catch (error) {
      return { error: 'Login failed. Please try again.' }
    }
  }

  async signOut(): Promise<void> {
    this.user = null
    this.saveUserToStorage(null)
    this.notifyListeners()
  }

  getCurrentUser(): User | null {
    return this.user
  }

  isAuthenticated(): boolean {
    return this.user !== null
  }

  onAuthStateChange(callback: (user: User | null) => void): () => void {
    this.listeners.push(callback)

    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(callback)
      if (index > -1) {
        this.listeners.splice(index, 1)
      }
    }
  }
}

export const authService = new AuthService()
export type { User }