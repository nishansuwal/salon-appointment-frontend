import {createSlice} from "@reduxjs/toolkit";

const createDataSlice = (tableName, extraReducers, initialState = null) => {
  initialState ||= {
    data: [], // Array to store data
    message: '', // Message from API response
    loading: false
  }

  return createSlice({
    name: tableName,
    initialState: initialState,
    reducers: {},
    extraReducers: extraReducers
  })
}

export default createDataSlice;
