// src/store/teacherSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import API from '../api'

export const fetchTeachers = createAsyncThunk('teachers/fetchAll', async () => {
  const response = await API.get('/teachers')
  return response.data
})

export const createTeacher = createAsyncThunk('teachers/create', async (teacherData) => {
  const response = await API.post('/teachers', teacherData)
  return response.data
})

export const updateTeacher = createAsyncThunk('teachers/update', async ({ id, data }) => {
  const response = await API.put(`/teachers/${id}`, data)
  return response.data
})

export const deleteTeacher = createAsyncThunk('teachers/delete', async (id) => {
  await API.delete(`/teachers/${id}`)
  return id
})

const teacherSlice = createSlice({
  name: 'teachers',
  initialState: {
    items: [], // Ensure items is initialized as an empty array
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeachers.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchTeachers.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(createTeacher.fulfilled, (state, action) => {
        state.items.push(action.payload)
      })
      .addCase(updateTeacher.fulfilled, (state, action) => {
        const index = state.items.findIndex(t => t._id === action.payload._id)
        if (index !== -1) state.items[index] = action.payload
      })
      .addCase(deleteTeacher.fulfilled, (state, action) => {
        state.items = state.items.filter(t => t._id !== action.payload)
      })
  }
})

export default teacherSlice.reducer