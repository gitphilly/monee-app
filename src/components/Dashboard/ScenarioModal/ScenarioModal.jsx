import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Modal } from '../Dashboard.utils'; // Updated path
import { formatDate } from '../../../utils/dates'; // Updated path

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
      const response = await fetch('/api/scenarios');
      const data = await response.json();
      setScenarios(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load scenarios');
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!newScenarioName.trim()) {
      setError('Please enter a scenario name');
      return;
    }

    const exists = scenarios.some(s => s.name.toLowerCase() === newScenarioName.toLowerCase());
    if (exists) {
      setError('A scenario with this name already exists');
      return;
    }

    try {
      await onSave(newScenarioName);
      setNewScenarioName('');
      fetchScenarios();
      setError('');
    } catch (err) {
      setError('Failed to save scenario');
    }
  };

  const handleLoad = async (scenarioId) => {
    try {
      await onLoad(scenarioId);
      onClose();
    } catch (err) {
      setError('Failed to load scenario');
    }
  };

  const handleDelete = async (scenarioId, scenarioName) => {
    if (window.confirm(`Are you sure you want to delete "${scenarioName}"?`)) {
      try {
        await onDelete(scenarioId);
        fetchScenarios();
      } catch (err) {
        setError('Failed to delete scenario');
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-4">
        <h2 className="text-xl font-bold mb-4">Manage Scenarios</h2>

        {/* Save New Scenario */}
        <div className="space-y-2">
          <h3 className="font-medium">Save Current Scenario</h3>
          <div className="flex space-x-2">
            <input
              type="text"
              value={newScenarioName}
              onChange={(e) => setNewScenarioName(e.target.value)}
              placeholder="Enter scenario name"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
            />
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </div>

        {/* Existing Scenarios */}
        <div className="space-y-2">
          <h3 className="font-medium">Saved Scenarios</h3>
          {loading ? (
            <p>Loading scenarios...</p>
          ) : scenarios.length === 0 ? (
            <p className="text-gray-500">No saved scenarios</p>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {scenarios.map((scenario) => (
                <div
                  key={scenario.id}
                  className="flex items-center justify-between bg-gray-50 p-3 rounded"
                >
                  <div>
                    <p className="font-medium">{scenario.name}</p>
                    <p className="text-sm text-gray-500">
                      Saved: {new Date(scenario.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleLoad(scenario.id)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
                    >
                      Load
                    </button>
                    <button
                      onClick={() => handleDelete(scenario.id, scenario.name)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

ScenarioModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onLoad: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default ScenarioModal;