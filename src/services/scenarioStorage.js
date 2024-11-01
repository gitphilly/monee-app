export const scenarioStorage = {
    getScenarios() {
      try {
        const scenarios = localStorage.getItem('scenarios');
        return scenarios ? JSON.parse(scenarios) : [];
      } catch (error) {
        console.error('Error loading scenarios:', error);
        return [];
      }
    },
  
    saveScenario(name, data) {
      try {
        const scenarios = this.getScenarios();
        
        if (scenarios.some(s => s.name.toLowerCase() === name.toLowerCase())) {
          throw new Error('A scenario with this name already exists');
        }
  
        const newScenario = {
          id: Date.now(),
          name,
          data
        };
  
        scenarios.push(newScenario);
        localStorage.setItem('scenarios', JSON.stringify(scenarios));
        return newScenario;
      } catch (error) {
        console.error('Error saving scenario:', error);
        throw error;
      }
    },
  
    loadScenario(id) {
      try {
        const scenarios = this.getScenarios();
        const scenario = scenarios.find(s => s.id === id);
        if (!scenario) throw new Error('Scenario not found');
        return scenario;
      } catch (error) {
        console.error('Error loading scenario:', error);
        throw error;
      }
    },
  
    deleteScenario(id) {
      try {
        const scenarios = this.getScenarios();
        const updatedScenarios = scenarios.filter(s => s.id !== id);
        localStorage.setItem('scenarios', JSON.stringify(updatedScenarios));
      } catch (error) {
        console.error('Error deleting scenario:', error);
        throw error;
      }
    }
  };