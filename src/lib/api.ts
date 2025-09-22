const API_URL = import.meta.env.VITE_API_URL || (
  import.meta.env.PROD
    ? '/api'  // Production: use relative URL
    : 'http://localhost:3001/api'  // Development: use full URL
);

class ApiService {
  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_URL}${endpoint}`;

    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  // Client APIs
  async getClients() {
    return this.request('/clients');
  }

  async getClient(id: string) {
    return this.request(`/clients/${id}`);
  }

  async createClient(data: Record<string, any>) {
    return this.request('/clients', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateClient(id: string, data: Record<string, any>) {
    return this.request(`/clients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteClient(id: string) {
    return this.request(`/clients/${id}`, {
      method: 'DELETE',
    });
  }

  async getClientResponses(id: string) {
    return this.request(`/clients/${id}/responses`);
  }

  // Form APIs
  async getFormTemplates() {
    return this.request('/forms/templates');
  }

  async getFormTemplate(id: string) {
    return this.request(`/forms/templates/${id}`);
  }

  async createFormInstance(data: Record<string, any>) {
    return this.request('/forms/instances', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getFormInstance(id: string) {
    return this.request(`/forms/instances/${id}`);
  }

  async saveFormAnswers(id: string, answers: Record<string, any>) {
    return this.request(`/forms/instances/${id}/answers`, {
      method: 'POST',
      body: JSON.stringify({ answers }),
    });
  }

  async submitForm(id: string, data: Record<string, any>) {
    return this.request(`/forms/instances/${id}/submit`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async initializeFormTemplates() {
    return this.request('/forms/templates/init', {
      method: 'POST',
    });
  }

  // Invite APIs
  async getInvites() {
    return this.request('/invites');
  }

  async sendInvite(data: Record<string, any>) {
    return this.request('/invites/send', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getInviteByToken(token: string) {
    return this.request(`/invites/token/${token}`);
  }

  async resendInvite(id: string) {
    return this.request(`/invites/${id}/resend`, {
      method: 'POST',
    });
  }

  async markInviteAsUsed(id: string) {
    return this.request(`/invites/${id}/use`, {
      method: 'POST',
    });
  }

  async getClientInvites(clientId: string) {
    return this.request(`/invites/client/${clientId}`);
  }
}

export const api = new ApiService();