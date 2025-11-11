import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  trips: [],
  currentTrip: null,
  loading: false,
  error: null,
};

const tripSlice = createSlice({
  name: 'trips',
  initialState,
  reducers: {
    setTrips: (state, action) => {
      state.trips = action.payload;
      state.loading = false;
    },
    setCurrentTrip: (state, action) => {
      state.currentTrip = action.payload;
      state.loading = false;
    },
    addTrip: (state, action) => {
      state.trips.push(action.payload);
    },
    updateTrip: (state, action) => {
      const index = state.trips.findIndex(trip => trip.id === action.payload.id);
      if (index !== -1) {
        state.trips[index] = action.payload;
      }
      if (state.currentTrip?.id === action.payload.id) {
        state.currentTrip = action.payload;
      }
    },
    removeTrip: (state, action) => {
      state.trips = state.trips.filter(trip => trip.id !== action.payload);
      if (state.currentTrip?.id === action.payload) {
        state.currentTrip = null;
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { 
  setTrips, 
  setCurrentTrip, 
  addTrip, 
  updateTrip, 
  removeTrip, 
  setLoading, 
  setError 
} = tripSlice.actions;

export default tripSlice.reducer;