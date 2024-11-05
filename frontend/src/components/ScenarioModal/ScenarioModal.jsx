import React, { useState, useEffect } from 'react';

const ScenarioModal = ({ isOpen, onClose, onSave, onLoad, onDelete }) => {
  const [scenarios, setScenarios] = useState([]);
  const [newScenarioName, setNewScenarioName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadingScenario, setLoadingScenario] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchScenarios();
    }
  }, [isOpen]);

  const fetchScenarios = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch('/api/scenarios', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch scenarios');
      const data = await response.json();
      setScenarios(data);
    } catch (err) {
      console.error('Error fetching scenarios:', err);
      setError('Failed to load scenarios. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!newScenarioName.trim()) {
      setError('Please enter a scenario name');
      return;
    }

    try {
      setSaving(true);
      setError('');
      const response = await fetch('/api/scenarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          name: newScenarioName,
          data: onSave()
        })
      });

      if (!response.ok) throw new Error('Failed to save scenario');
      
      setNewScenarioName('');
      await fetchScenarios();
    } catch (err) {
      console.error('Error saving scenario:', err);
      setError('Failed to save scenario. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleLoad = async (scenarioId, scenarioName) => {
    try {
      if (window.confirm(`Load scenario "${scenarioName}"? This will replace your current data.`)) {
        setLoadingScenario(true);
        setError('');
        
        const response = await fetch(`/api/scenarios/${scenarioId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!response.ok) throw new Error('Failed to load scenario');
        
        const scenario = await response.json();
        onLoad(scenario.data);
        onClose();
      }
    } catch (err) {
      console.error('Error loading scenario:', err);
      setError('Failed to load scenario. Please try again.');
    } finally {
      setLoadingScenario(false);
    }
  };

  const handleDelete = async (scenarioId, scenarioName) => {
    if (window.confirm(`Are you sure you want to delete "${scenarioName}"? This cannot be undone.`)) {
      try {
        setDeleting(true);
        setError('');
        
        const response = await fetch(`/api/scenarios/${scenarioId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) throw new Error('Failed to delete scenario');
        
        await fetchScenarios();
      } catch (err) {
        console.error('Error deleting scenario:', err);
        setError('Failed to delete scenario. Please try again.');
      } finally {
        setDeleting(false);
      }
    }
  };

  return (
    <div className={`fixed inset-0 z-50 overflow-y-auto ${isOpen ? '' : 'hidden'}`}>
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Manage Scenarios</h2>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="Close modal"
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
                    disabled={saving}
                  />
                  <button
                    onClick={handleSave}
                    className={`px-4 py-2 rounded text-white ${
                      saving
                        ? 'bg-blue-400 cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                    disabled={saving || !newScenarioName.trim()}
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>

              {/* Existing Scenarios */}
              <div className="space-y-3">
                <h3 className="font-medium text-gray-700">Saved Scenarios</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  {loading ? (
                    <div className="text-center py-4 text-gray-500">
                      Loading scenarios...
                    </div>
                  ) : scenarios.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                      No saved scenarios
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {scenarios.map((scenario) => (
                        <div
                          key={scenario.id}
                          className="bg-white p-3 rounded-lg shadow-sm flex items-center justify-between group hover:shadow-md transition-shadow"
                        >
                          <div>
                            <h4 className="font-medium text-gray-900">{scenario.name}</h4>
                            <p className="text-sm text-gray-500">
                              Created: {new Date(scenario.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex space-x-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleLoad(scenario.id, scenario.name)}
                              className={`px-3 py-1 rounded text-white text-sm ${
                                loadingScenario
                                  ? 'bg-green-400 cursor-not-allowed'
                                  : 'bg-green-500 hover:bg-green-600'
                              }`}
                              disabled={loadingScenario}
                            >
                              {loadingScenario ? 'Loading...' : 'Load'}
                            </button>
                            <button
                              onClick={() => handleDelete(scenario.id, scenario.name)}
                              className={`px-3 py-1 rounded text-white text-sm ${
                                deleting
                                  ? 'bg-red-400 cursor-not-allowed'
                                  : 'bg-red-500 hover:bg-red-600'
                              }`}
                              disabled={deleting}
                            >
                              {deleting ? 'Deleting...' : 'Delete'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScenarioModal;