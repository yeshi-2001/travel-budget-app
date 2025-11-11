import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Users, User, MapPin, Plus, X, ArrowLeft, ArrowRight, Calculator, DollarSign, Calendar, Hotel, UtensilsCrossed, Car, Ticket } from 'lucide-react';
import { tripAPI } from '../services/api';

function CreateTrip() {
  const [currentStep, setCurrentStep] = useState(1);
  const [tripData, setTripData] = useState({
    // Step 1: Basic Info
    name: '',
    mode: 'individual',
    startDate: '',
    endDate: '',
    currency: 'LKR',
    description: '',
    numberOfTravelers: 1,
    
    // Initialize all required arrays
    participants: [],
    locations: [],
    destinations: [],
    accommodations: [],
    mealPlans: [],
    activities: [],
    
    // Expected expenses with default structure
    expectedExpenses: {
      accommodation: { amount: 0, perPerson: true },
      meals: { amount: 0, perPerson: true },
      transportation: { amount: 0, perPerson: false },
      tickets: { amount: 0, perPerson: true },
      miscellaneous: { amount: 0, perPerson: false }
    },
    
    // Transportation Planning
    transportPlans: {
      vehicleRental: { cost: 0, days: 0, driverCost: 0 },
      fuelBudget: { totalDistance: 0, efficiency: 15, fuelPrice: 180 },
      otherTransport: { tolls: 0, parking: 0, taxi: 0 }
    },
    
    // Miscellaneous Budget
    miscellaneous: {
      shopping: 0,
      emergency: 0,
      tips: 0,
      snacks: 0
    }
  });
  
  const [newParticipant, setNewParticipant] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const navigate = useNavigate();

  const calculateDays = () => {
    if (tripData.startDate && tripData.endDate) {
      const start = new Date(tripData.startDate);
      const end = new Date(tripData.endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays;
    }
    return 0;
  };

  const addParticipant = () => {
    if (newParticipant.trim()) {
      setTripData({
        ...tripData,
        participants: [...tripData.participants, { email: newParticipant.trim(), name: newParticipant.split('@')[0] }]
      });
      setNewParticipant('');
    }
  };

  const removeParticipant = (index) => {
    setTripData({
      ...tripData,
      participants: tripData.participants.filter((_, i) => i !== index)
    });
  };

  const addLocation = () => {
    if (newLocation.trim()) {
      setTripData({
        ...tripData,
        locations: [...tripData.locations, { name: newLocation.trim(), type: 'destination' }]
      });
      setNewLocation('');
    }
  };

  const removeLocation = (index) => {
    setTripData({
      ...tripData,
      locations: tripData.locations.filter((_, i) => i !== index)
    });
  };

  const updateExpectedExpense = (category, amount, perPerson) => {
    setTripData({
      ...tripData,
      expectedExpenses: {
        ...tripData.expectedExpenses,
        [category]: { amount: parseFloat(amount) || 0, perPerson }
      }
    });
  };

  const getTotalParticipants = () => {
    return tripData.mode === 'group' ? tripData.participants.length + 1 : 1;
  };

  const calculatePlannedBudget = () => {
    const participants = getTotalParticipants();
    let total = 0;
    
    Object.values(tripData.expectedExpenses).forEach(expense => {
      if (expense.perPerson) {
        total += expense.amount * participants;
      } else {
        total += expense.amount;
      }
    });
    
    return total;
  };

  const getPerPersonCost = () => {
    return calculatePlannedBudget() / getTotalParticipants();
  };

  const handleSubmit = async () => {
    try {
      const plannedBudget = calculatePlannedBudget();
      const response = await tripAPI.createTrip({
        name: tripData.name,
        mode: tripData.mode,
        startDate: tripData.startDate,
        endDate: tripData.endDate,
        plannedBudget: plannedBudget, // CALCULATED OUTPUT
        currency: tripData.currency,
        participants: tripData.participants,
        locations: tripData.locations,
        expectedExpenses: tripData.expectedExpenses
      });
      toast.success(`Trip created! Planned budget: ${tripData.currency} ${plannedBudget.toLocaleString()}`);
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to create trip');
    }
  };

  const nextStep = () => {
    if (currentStep < 8) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Trip</h1>
        <div className="flex items-center space-x-2">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {step}
              </div>
              {step < 8 && <div className={`w-12 h-1 mx-2 ${
                currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
              }`} />}
            </div>
          ))}
        </div>
        <div className="mt-2 text-sm text-gray-600">
          Step {currentStep} of 8: {
            currentStep === 1 ? 'Trip Basic Information' :
            currentStep === 2 ? 'Day-by-Day Destinations' :
            currentStep === 3 ? 'Accommodation Planning' :
            currentStep === 4 ? 'Meal Planning' :
            currentStep === 5 ? 'Transportation Planning' :
            currentStep === 6 ? 'Activities & Tickets' :
            currentStep === 7 ? 'Miscellaneous Budget' :
            'Review & Confirm'
          }
        </div>
        <div className="mt-1 text-xs text-blue-600">
          Phase: PRE-TRIP PLANNING | Status: DRAFT
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Trip Name</label>
              <input
                type="text"
                placeholder="e.g., Kandy & Nuwara Eliya Adventure"
                className="input-field"
                value={tripData.name}
                onChange={(e) => setTripData({...tripData, name: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">Trip Mode</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setTripData({...tripData, mode: 'individual'})}
                  className={`p-4 border-2 rounded-lg flex items-center space-x-3 ${
                    tripData.mode === 'individual' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <User className="h-6 w-6" />
                  <div className="text-left">
                    <div className="font-medium">Individual Trip</div>
                    <div className="text-sm text-gray-600">Manage your own expenses</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setTripData({...tripData, mode: 'group'})}
                  className={`p-4 border-2 rounded-lg flex items-center space-x-3 ${
                    tripData.mode === 'group' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <Users className="h-6 w-6" />
                  <div className="text-left">
                    <div className="font-medium">Group Trip</div>
                    <div className="text-sm text-gray-600">Share expenses with friends</div>
                  </div>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Start Date</label>
                <input
                  type="date"
                  className="input-field"
                  value={tripData.startDate}
                  onChange={(e) => setTripData({...tripData, startDate: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">End Date</label>
                <input
                  type="date"
                  className="input-field"
                  value={tripData.endDate}
                  onChange={(e) => setTripData({...tripData, endDate: e.target.value})}
                  required
                />
              </div>
            </div>

            {calculateDays() > 0 && (
              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                Duration: {calculateDays()} days
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Currency</label>
              <select
                className="input-field"
                value={tripData.currency}
                onChange={(e) => setTripData({...tripData, currency: e.target.value})}
              >
                <option value="LKR">LKR - Sri Lankan Rupee</option>
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
              </select>
            </div>
          </div>
        )}

        {/* Step 2: Day-by-Day Destinations */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Plan Your Destinations</h3>
              <p className="text-sm text-gray-600 mb-4">
                Add destinations in the order you'll visit them. Specify exact dates for each location.
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium mb-3 flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Trip Duration: {calculateDays()} days
              </h4>
              <div className="text-sm text-gray-700">
                {tripData.startDate && tripData.endDate && (
                  <span>{tripData.startDate} to {tripData.endDate}</span>
                )}
              </div>
            </div>

            {/* Add Destination Form */}
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-3">Add Destination</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Location name (e.g., Galle)"
                  className="input-field"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    placeholder="Arrival date"
                    className="input-field"
                    min={tripData.startDate}
                    max={tripData.endDate}
                  />
                  <input
                    type="date"
                    placeholder="Departure date"
                    className="input-field"
                    min={tripData.startDate}
                    max={tripData.endDate}
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={addLocation}
                className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Plus className="h-4 w-4 inline mr-2" />
                Add Destination
              </button>
            </div>

            {/* Destinations List */}
            <div className="space-y-3">
              <h4 className="font-medium">Your Itinerary ({tripData.locations.length} destinations)</h4>
              {tripData.locations.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <MapPin className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>Add your first destination to start planning</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {tripData.locations.map((location, index) => (
                    <div key={index} className="bg-white border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <h5 className="font-medium text-lg">{location.name}</h5>
                            <div className="text-sm text-gray-600 mt-1">
                              <div>📅 Nov 1-2, 2025 (2 days, 1 night)</div>
                              <div>📍 Distance from previous: 120 km</div>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => removeLocation(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Route Summary */}
            {tripData.locations.length > 1 && (
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  Route Summary
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-bold text-lg">250</div>
                    <div className="text-gray-600">Total KM</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg">4h 30m</div>
                    <div className="text-gray-600">Drive Time</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg">17L</div>
                    <div className="text-gray-600">Est. Fuel</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg">LKR 3,060</div>
                    <div className="text-gray-600">Fuel Cost</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Accommodation Planning */}
        {currentStep === 3 && (
          <div className="space-y-6">
            {tripData.mode === 'individual' ? (
              <div className="text-center py-12">
                <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Individual Trip Mode</h3>
                <p className="text-gray-600">No participants needed for individual trips.</p>
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium mb-3">Add Travel Companions</label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      placeholder="friend@email.com"
                      className="flex-1 input-field"
                      value={newParticipant}
                      onChange={(e) => setNewParticipant(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addParticipant()}
                    />
                    <button
                      type="button"
                      onClick={addParticipant}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Trip Members ({tripData.participants.length + 1})</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          Y
                        </div>
                        <div>
                          <div className="font-medium">You (Admin)</div>
                          <div className="text-sm text-gray-600">Trip organizer</div>
                        </div>
                      </div>
                    </div>
                    {tripData.participants.map((participant, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {participant.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium">{participant.name}</div>
                            <div className="text-sm text-gray-600">{participant.email}</div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeParticipant(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Step 3: Locations & Route */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-3">Add Destinations</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g., Kandy, Temple of Tooth"
                  className="flex-1 input-field"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addLocation()}
                />
                <button
                  type="button"
                  onClick={addLocation}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-3 flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                Trip Route ({tripData.locations.length} locations)
              </h4>
              {tripData.locations.length === 0 ? (
                <p className="text-gray-600 text-center py-4">Add destinations to plan your route</p>
              ) : (
                <div className="space-y-2">
                  {tripData.locations.map((location, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                          {index + 1}
                        </div>
                        <span className="font-medium">{location.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeLocation(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {tripData.locations.length > 1 && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Route Summary</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>📍 Total Destinations: {tripData.locations.length}</div>
                  <div>🗺️ Route planning will be available after trip creation</div>
                  <div>⛽ Fuel cost estimation will be calculated automatically</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Expected Expenses */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Expected Expenses</h3>
              <p className="text-sm text-gray-600 mb-4">
                Input estimated costs for each category. The system will calculate your planned budget.
              </p>
              <div className="bg-blue-50 p-3 rounded-lg mb-4">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Trip Participants: {getTotalParticipants()}</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {Object.entries(tripData.expectedExpenses).map(([category, expense]) => {
                const categoryNames = {
                  accommodation: '🏨 Accommodation',
                  meals: '🍽️ Meals & Dining',
                  transportation: '🚗 Transportation',
                  tickets: '🎟️ Activities & Tickets',
                  miscellaneous: '💊 Miscellaneous'
                };
                
                const totalCost = expense.perPerson ? expense.amount * getTotalParticipants() : expense.amount;
                
                return (
                  <div key={category} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                      <label className="font-medium text-lg">{categoryNames[category]}</label>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Total Cost</div>
                        <div className="font-bold text-lg">
                          {tripData.currency} {totalCost.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Amount ({expense.perPerson ? 'per person' : 'total'})
                        </label>
                        <input
                          type="number"
                          placeholder="0"
                          className="input-field"
                          value={expense.amount || ''}
                          onChange={(e) => updateExpectedExpense(category, e.target.value, expense.perPerson)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Cost Type</label>
                        <select
                          className="input-field"
                          value={expense.perPerson ? 'per-person' : 'total'}
                          onChange={(e) => updateExpectedExpense(category, expense.amount, e.target.value === 'per-person')}
                        >
                          <option value="per-person">Per Person</option>
                          <option value="total">Total Cost</option>
                        </select>
                      </div>
                    </div>
                    
                    {expense.perPerson && getTotalParticipants() > 1 && (
                      <div className="mt-2 text-xs text-gray-600">
                        {tripData.currency} {expense.amount} × {getTotalParticipants()} people = {tripData.currency} {totalCost.toLocaleString()}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Planned Budget Output */}
            <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Calculator className="h-5 w-5 text-green-600" />
                  <h4 className="text-lg font-bold text-green-800">Calculated Planned Budget</h4>
                </div>
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-800">
                    {tripData.currency} {calculatePlannedBudget().toLocaleString()}
                  </div>
                  <div className="text-sm text-green-600">Total Trip Budget</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-800">
                    {tripData.currency} {Math.round(getPerPersonCost()).toLocaleString()}
                  </div>
                  <div className="text-sm text-green-600">Per Person Cost</div>
                </div>
              </div>
              
              {calculateDays() > 0 && (
                <div className="mt-4 text-center">
                  <div className="text-lg font-semibold text-green-700">
                    {tripData.currency} {Math.round(getPerPersonCost() / calculateDays()).toLocaleString()}
                  </div>
                  <div className="text-sm text-green-600">Per Person Per Day</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 5: Create Checklists */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Trip Checklists & Tasks</h3>
              <p className="text-sm text-gray-600 mb-4">
                Organize your trip with pre-trip tasks and daily activities.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pre-Trip Checklist */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium mb-3 flex items-center">
                  📋 Pre-Trip Checklist
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span>Book accommodation</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span>Reserve transportation</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span>Get travel insurance</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span>Pack essentials</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span>Download offline maps</span>
                  </div>
                </div>
              </div>

              {/* Daily Activities */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium mb-3 flex items-center">
                  🎅 Daily Activities
                </h4>
                <div className="space-y-2 text-sm">
                  {tripData.locations.map((location, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span>Visit {location.name}</span>
                    </div>
                  ))}
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span>Log daily expenses</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span>Take photos</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">📝 Trip Preparation Summary</h4>
              <div className="text-sm text-gray-700 space-y-1">
                <div>• {calculateDays()} days planned</div>
                <div>• {tripData.locations.length} destinations to visit</div>
                <div>• {tripData.mode === 'group' ? tripData.participants.length + 1 : 1} traveler(s)</div>
                <div>• {tripData.currency} {calculatePlannedBudget().toLocaleString()} total budget</div>
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Review & Confirm */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Review & Confirm Trip</h3>
              <p className="text-sm text-gray-600 mb-4">
                Review all details before creating your trip. You can edit these later.
              </p>
            </div>

            {/* Trip Summary */}
            <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg border">
              <h4 className="text-xl font-bold text-gray-900 mb-4">{tripData.name}</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium mb-2">Trip Details</h5>
                  <div className="text-sm space-y-1">
                    <div>📅 {tripData.startDate} to {tripData.endDate}</div>
                    <div>🕰️ {calculateDays()} days</div>
                    <div>👥 {tripData.mode === 'group' ? `Group (${tripData.participants.length + 1} people)` : 'Individual'}</div>
                    <div>💰 {tripData.currency} {calculatePlannedBudget().toLocaleString()}</div>
                  </div>
                </div>
                
                <div>
                  <h5 className="font-medium mb-2">Destinations</h5>
                  <div className="text-sm space-y-1">
                    {tripData.locations.map((location, index) => (
                      <div key={index}>📍 {location.name}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Budget Breakdown */}
            <div className="bg-white p-4 rounded-lg border">
              <h5 className="font-medium mb-3">Budget Breakdown</h5>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                {Object.entries(tripData.expectedExpenses).map(([category, expense]) => {
                  const categoryNames = {
                    accommodation: '🏨 Accommodation',
                    meals: '🍽️ Meals',
                    transportation: '🚗 Transport',
                    tickets: '🎟️ Activities',
                    miscellaneous: '💊 Miscellaneous'
                  };
                  const totalCost = expense.perPerson ? expense.amount * getTotalParticipants() : expense.amount;
                  return totalCost > 0 ? (
                    <div key={category} className="text-center p-2 bg-gray-50 rounded">
                      <div className="font-medium">{categoryNames[category]}</div>
                      <div className="text-lg font-bold text-blue-600">
                        {tripData.currency} {totalCost.toLocaleString()}
                      </div>
                    </div>
                  ) : null;
                })}
              </div>
            </div>

            {/* Status Indicator */}
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-medium text-green-800">Ready to Create Trip</span>
              </div>
              <p className="text-sm text-green-700 mt-1">
                Your trip will be created with status: PLANNING. You can start adding expenses once you begin your journey.
              </p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`flex items-center px-4 py-2 rounded-lg ${
              currentStep === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </button>

          {currentStep < 8 ? (
            <button
              type="button"
              onClick={nextStep}
              disabled={
                (currentStep === 2 && tripData.mode === 'group' && tripData.participants.length === 0) ||
                (currentStep === 4 && calculatePlannedBudget() === 0)
              }
              className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={currentStep === 6 && calculatePlannedBudget() === 0}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Create Trip
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CreateTrip;