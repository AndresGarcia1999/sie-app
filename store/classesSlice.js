import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Thunk action creators
export const fetchClasses = createAsyncThunk(
  "classes/fetchClasses",
  async () => {
    const response = await fetch("/api/classes");
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error);
    }
    return response.json();
  }
);

export const addClass = createAsyncThunk(
  "classes/addClass",
  async (newClass) => {
    const response = await fetch("/api/classes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newClass),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error);
    }
    return response.json();
  }
);

export const editClass = createAsyncThunk("classes/editClass", async (data) => {
  const { id, ...updatedClass } = data;
  const response = await fetch(`/api/classes/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedClass),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error);
  }
  return response.json();
});

export const deleteClass = createAsyncThunk(
  "classes/deleteClass",
  async (id) => {
    const response = await fetch(`/api/classes/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error);
    }
    return id;
  }
);

// Initial state
const initialState = {
  classes: [],
  status: {
    fetch: "idle", // idle | loading | succeeded | failed
    add: "idle",
    edit: "idle",
    delete: "idle",
  },
  error: null,
};

// Create the slice
const classeslice = createSlice({
  name: "classes",
  initialState,
  reducers: {
    //actions to reset the status
    resetStatus(state) {
      state.status.fetch = "idle";
      state.status.add = "idle";
      state.status.edit = "idle";
      state.status.delete = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClasses.pending, (state) => {
        state.status.fetch = "loading";
        state.error = null;
      })
      .addCase(fetchClasses.fulfilled, (state, action) => {
        state.status.fetch = "succeeded";
        state.error = null;
        state.classes = action.payload;
      })
      .addCase(fetchClasses.rejected, (state, action) => {
        state.status.fetch = "failed";
        state.error = action.error.message;
      })
      .addCase(addClass.pending, (state) => {
        state.status.add = "loading";
        state.error = null;
      })
      .addCase(addClass.fulfilled, (state, action) => {
        state.status.add = "succeeded";
        state.error = null;
        state.classes.push(action.payload);
      })
      .addCase(addClass.rejected, (state, action) => {
        state.status.add = "failed";
        state.error = action.error.message;
      })
      .addCase(editClass.pending, (state) => {
        state.status.edit = "loading";
        state.error = null;
      })
      .addCase(editClass.fulfilled, (state, action) => {
        state.status.edit = "succeeded";
        state.error = null;
        const updatedClass = action.payload;
        state.classes = state.classes.map((cl) =>
          cl.id === updatedClass.id ? updatedClass : cl
        );
      })
      .addCase(editClass.rejected, (state, action) => {
        state.status.edit = "failed";
        state.error = action.error.message;
      })
      .addCase(deleteClass.pending, (state) => {
        state.status.delete = "loading";
        state.error = null;
      })
      .addCase(deleteClass.fulfilled, (state, action) => {
        state.status.delete = "succeeded";
        state.error = null;
        state.classes = state.classes.filter((cl) => cl.id !== action.payload);
      })
      .addCase(deleteClass.rejected, (state, action) => {
        state.status.delete = "failed";
        state.error = action.error.message;
      });
  },
});

export default classeslice.reducer;
export const { resetStatus } = classeslice.actions;
