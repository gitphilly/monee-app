// API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

const headers = {
  'Content-Type': 'application/json'
};

// Handle API responses and errors
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'An error occurred');
  }
  return response.json();
};

export const scenarioService = {
  // Get all scenarios
  async getScenarios() {
    try {
      const response = await fetch(`${API_BASE_URL}/scenarios`, {
        headers
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching scenarios:', error);
      throw error;
    }
  },

  // Save new scenario
  async saveScenario(name, data) {
    try {
      const response = await fetch(`${API_BASE_URL}/scenarios`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name,
          data
        })
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error saving scenario:', error);
      throw error;
    }
  },

  // Load specific scenario
  async loadScenario(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/scenarios/${id}`, {
        headers
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error loading scenario:', error);
      throw error;
    }
  },

  // Update existing scenario
  async updateScenario(id, data) {
    try {
      const response = await fetch(`${API_BASE_URL}/scenarios/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data)
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error updating scenario:', error);
      throw error;
    }
  },

  // Delete scenario
  async deleteScenario(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/scenarios/${id}`, {
        method: 'DELETE',
        headers
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error deleting scenario:', error);
      throw error;
    }
  },

  // Duplicate existing scenario
  async duplicateScenario(id, newName) {
    try {
      const response = await fetch(`${API_BASE_URL}/scenarios/${id}/duplicate`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ name: newName })
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error duplicating scenario:', error);
      throw error;
    }
  },

  // Export scenario data
  async exportScenario(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/scenarios/${id}/export`, {
        headers
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error exporting scenario:', error);
      throw error;
    }
  }
};