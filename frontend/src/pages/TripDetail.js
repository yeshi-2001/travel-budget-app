import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, MapPin, DollarSign, Users, Calendar, Camera, Settings, Trash2, MoreVertical } from 'lucide-react';
import toast from 'react-hot-toast';
import { tripAPI } from '../services/api';

function TripDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [expenseForm, setExpenseForm] = useState({
    description: '',
    amount: '',
    category: 'meals',
    date: new Date().toISOString().split('T')[0]
  });

  // Mock trip data - replace with API call
  const trip = {
    id: id,
    name: 'Sample Trip',
    startDate: '2025-11-01',
    endDate: '2025-11-05',
    plannedBudget: 50000,
    totalSpent: 15000,
    status: 'planning'
  };

  const expenses = [
    { id: 1, description: 'Hotel Booking', amount: 12000, category: 'accommodation', date: '2025-11-01' },
    { id: 2, description: 'Lunch', amount: 3000, category: 'meals', date: '2025-11-02' }
  ];

  const handleAddExpense = (e) => {
    e.preventDefault();
    console.log('Adding expense:', expenseForm);
    setShowAddExpense(false);
    setExpenseForm({ description: '', amount: '', category: 'meals', date: new Date().toISOString().split('T')[0] });
  };

  const handleDeleteTrip = async () => {
    try {
      await tripAPI.deleteTrip(id);
      toast.success('Trip deleted successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to delete trip');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{trip.name}</h1>
          <p className="text-gray-600">{trip.startDate} - {trip.endDate} | {trip.status}</p>
        </div>
        <div className="relative">
          <button 
            onClick={() => setShowSettingsMenu(!showSettingsMenu)}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <MoreVertical className="h-6 w-6" />
          </button>
          
          {showSettingsMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-10">
              <button
                onClick={() => {
                  setShowSettingsMenu(false);
                  // Add edit functionality here
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Settings className="h-4 w-4 inline mr-2" />
                Trip Settings
              </button>
              <button
                onClick={() => {
                  setShowSettingsMenu(false);
                  setShowDeleteModal(true);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 inline mr-2" />
                Delete Trip
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Budget Overview */}
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
        <h2 className="text-lg font-semibold mb-4">Budget Overview</h2>
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>LKR {trip.totalSpent.toLocaleString()} / LKR {trip.plannedBudget.toLocaleString()}</span>
          <span>{Math.round((trip.totalSpent / trip.plannedBudget) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-blue-600 h-3 rounded-full"
            style={{ width: `${(trip.totalSpent / trip.plannedBudget) * 100}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-2">Remaining: LKR {(trip.plannedBudget - trip.totalSpent).toLocaleString()}</p>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-4 mb-8">
        <button 
          onClick={() => setShowAddExpense(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Expense
        </button>
        <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
          <Camera className="h-4 w-4 mr-2" />
          Scan Receipt
        </button>
        <button className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
          <MapPin className="h-4 w-4 mr-2" />
          Add Location
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {['overview', 'expenses', 'map', 'participants', 'analytics'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Recent Expenses</h3>
            <div className="space-y-4">
              {expenses.map((expense) => (
                <div key={expense.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">{expense.description}</h4>
                    <p className="text-sm text-gray-600">{expense.category} • {expense.date}</p>
                  </div>
                  <span className="font-semibold">LKR {expense.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'expenses' && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">All Expenses</h3>
            <button 
              onClick={() => setShowAddExpense(true)}
              className="btn-primary"
            >
              Add Expense
            </button>
          </div>
          <div className="space-y-4">
            {expenses.map((expense) => (
              <div key={expense.id} className="flex justify-between items-center p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">{expense.description}</h4>
                  <p className="text-sm text-gray-600">{expense.category} • {expense.date}</p>
                </div>
                <div className="text-right">
                  <span className="font-semibold">LKR {expense.amount.toLocaleString()}</span>
                  <div className="text-sm text-gray-600">Paid by: You</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'map' && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Trip Route & Locations</h3>
          <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Interactive map will be displayed here</p>
              <button className="mt-4 btn-primary">Plan Route</button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'participants' && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Trip Members</h3>
            <button className="btn-primary">Invite People</button>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  Y
                </div>
                <div className="ml-3">
                  <p className="font-medium">You (Admin)</p>
                  <p className="text-sm text-gray-600">yeshi@example.com</p>
                </div>
              </div>
              <span className="text-sm text-gray-600">Joined Nov 1</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Spending by Category</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>🏨 Accommodation</span>
                  <span>LKR 12,000 (80%)</span>
                </div>
                <div className="flex justify-between">
                  <span>🍽️ Meals</span>
                  <span>LKR 3,000 (20%)</span>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Daily Spending</h3>
              <p className="text-gray-600">Charts will be displayed here</p>
            </div>
          </div>
        </div>
      )}

      {/* Add Expense Modal */}
      {showAddExpense && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add Expense</h3>
            <form onSubmit={handleAddExpense} className="space-y-4">
              <input
                type="text"
                placeholder="What did you spend on?"
                className="input-field"
                value={expenseForm.description}
                onChange={(e) => setExpenseForm({...expenseForm, description: e.target.value})}
                required
              />
              <input
                type="number"
                placeholder="Amount (LKR)"
                className="input-field"
                value={expenseForm.amount}
                onChange={(e) => setExpenseForm({...expenseForm, amount: e.target.value})}
                required
              />
              <select
                className="input-field"
                value={expenseForm.category}
                onChange={(e) => setExpenseForm({...expenseForm, category: e.target.value})}
              >
                <option value="meals">🍽️ Meals & Dining</option>
                <option value="accommodation">🏨 Accommodation</option>
                <option value="transportation">🚗 Transportation</option>
                <option value="tickets">🎟️ Activities & Tickets</option>
                <option value="miscellaneous">💊 Miscellaneous</option>
              </select>
              <input
                type="date"
                className="input-field"
                value={expenseForm.date}
                onChange={(e) => setExpenseForm({...expenseForm, date: e.target.value})}
              />
              <div className="flex gap-3">
                <button type="submit" className="flex-1 btn-primary">Add Expense</button>
                <button 
                  type="button" 
                  onClick={() => setShowAddExpense(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-red-600">Delete Trip</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{trip.name}"? This will permanently remove all expenses, participants, and trip data. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDeleteTrip}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
              >
                Delete Trip
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TripDetail;