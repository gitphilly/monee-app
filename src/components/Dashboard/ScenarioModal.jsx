import React, { useState, useEffect } from 'react';
import { Modal } from './Dashboard.utils';
import { formatDate } from '../../utils/dates';

const ScenarioModal = ({ isOpen, onClose, onSave, onLoad, onDelete }) => {
  const [scenarios, setScenarios] = useState([]);
  const [newScenarioName, setNewScenarioName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch existing scenarios on modal open
  useEffect(() => {
    if (isOpen) {
      fetchScenarios();
    }
  }, [isOpen]);

  const fetchScenarios = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/scenarios');
      if (!response.ok) throw new Error('Failed to fetch scenarios');
      const data = await response.json();
      setScenarios(data);
    } catch (err) {
      setError('Failed to load scenarios');
      console.error('Error fetching scenarios:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!newScenarioName.trim()) {
      setError('Please enter a scenario name');
      return;
    }

    const exists = scenarios.some(s => 
      s.name.toLowerCase() === newScenarioName.toLowerCase()
    );
    
    if (exists) {
      setError('A scenario with this name already exists');
      return;
    }

    try {
      setError('');
      await onSave(newScenarioName);
      setNewScenarioName('');
      await fetchScenarios();
    } catch (err) {
      setError('Failed to save scenario');
      console.error('Error saving scenario:', err);
    }
  };

  const handleLoad = async (scenarioId, scenarioName) => {
    try {
      if (window.confirm(`Load scenario "${scenarioName}"? This will replace your current data.`)) {
        await onLoad(scenarioId);
        onClose();
      }
    } catch (err) {
      setError('Failed to load scenario');
      console.error('Error loading scenario:', err);
    }
  };

  const handleDelete = async (scenarioId, scenarioName) => {
    if (window.confirm(`Are you sure you want to delete "${scenarioName}"?`)) {
      try {
        await onDelete(scenarioId);
        await fetchScenarios();
      } catch (err) {
        setError('Failed to delete scenario');
        console.error('Error deleting scenario:', err);
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Manage Scenarios</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        {/* Save New Scenario */}
        <div className="space-y-3">
          <h3 className="font-medium text-gray-700">Save Current Scenario</h3>
          <div className="flex space-x-2">
            <input
              type="text"
              value={newScenarioName}
              onChange={(e) => {
                setNewScenarioName(e.target.value);
                setError('');
              }}
              placeholder="Enter scenario name"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Save
            </button>
          </div>
        </div>

        {/* Existing Scenarios */}
        <div className="space-y-3">
          <h3 className="font-medium text-gray-700">Saved Scenarios</h3>
          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="text-center py-4 text-gray-500">
                Loading scenarios...
              </div>
            ) : scenarios.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                No saved scenarios
              </div>
            ) : (
              <div className="space-y-2">
                {scenarios.map((scenario) => (
                  <div
                    key={scenario.id}
                    className="bg-gray-50 p-3 rounded-lg flex items-center justify-between group"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{scenario.name}</h4>
                      <p className="text-sm text-gray-500">
                        Saved: {formatDate(scenario.created_at)}
                      </p>
                    </div>
                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleLoad(scenario.id, scenario.name)}
                        className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition-colors"
                      >
                        Load
                      </button>
                      <button
                        onClick={() => handleDelete(scenario.id, scenario.name)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <div className="flex justify-end pt-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ScenarioModal;