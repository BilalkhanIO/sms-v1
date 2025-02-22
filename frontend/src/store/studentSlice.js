// src/store/studentSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import API from '../api'

export const fetchStudents = createAsyncThunk('students/fetchAll', async () => {
  const response = await API.get('/students')
  return response.data
})

export const createStudent = createAsyncThunk('students/create', async (studentData) => {
  const response = await API.post('/students', studentData)
  return response.data
})

const studentSlice = createSlice({
  name: 'students',
  initialState: {
    items: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudents.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(createStudent.fulfilled, (state, action) => {
        state.items.push(action.payload)
      })
  }
})

export default studentSlice.reducer