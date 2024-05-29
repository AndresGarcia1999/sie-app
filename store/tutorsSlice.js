import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Thunk action creators
export const fetchTutors = createAsyncThunk("tutors/fetchTutors", async () => {
  const response = await fetch("/api/tutors");
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error);
  }
  return response.json();
});

export const addTutor = createAsyncThunk(
  "tutors/addTutor",
  async (newTutor) => {
    const response = await fetch("/api/tutors", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTutor),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error);
    }
    return response.json();
  }
);

export const editTutor = createAsyncThunk("tutors/editTutor", async (data) => {
  const { id, ...updatedTutor } = data;
  const response = await fetch(`/api/tutors/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedTutor),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error);
  }
  return response.json();
});

export const deleteTutor = createAsyncThunk(
  "tutors/deleteTutor",
  async (id) => {
    const response = await fetch(`/api/tutors/${id}`, {
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
  tutors: [],
  status: {
    fetch: "idle", // idle | loading | succeeded | failed
    add: "idle",
    edit: "idle",
    delete: "idle",
  },
  error: null,
};

// Create the slice
const tutorSlice = createSlice({
  name: "tutors",
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
      .addCase(fetchTutors.pending, (state) => {
        state.status.fetch = "loading";
        state.error = null;
      })
      .addCase(fetchTutors.fulfilled, (state, action) => {
        state.status.fetch = "succeeded";
        state.error = null;
        state.tutors = action.payload;
      })
      .addCase(fetchTutors.rejected, (state, action) => {
        state.status.fetch = "failed";
        state.error = action.error.message;
      })
      .addCase(addTutor.pending, (state) => {
        state.status.add = "loading";
        state.error = null;
      })
      .addCase(addTutor.fulfilled, (state, action) => {
        console.log(action.payload);
        state.status.add = "succeeded";
        state.error = null;
        state.tutors.push(action.payload);
      })
      .addCase(addTutor.rejected, (state, action) => {
        state.status.add = "failed";
        state.error = action.error.message;
      })
      .addCase(editTutor.pending, (state) => {
        state.status.edit = "loading";
        state.error = null;
      })
      .addCase(editTutor.fulfilled, (state, action) => {
        state.status.edit = "succeeded";
        state.error = null;
        console.log("edit payload", action.payload);
        const updatedTutor = action.payload;
        state.tutors = state.tutors.map((tutor) =>
          tutor.id === updatedTutor.id ? updatedTutor : tutor
        );
      })
      .addCase(editTutor.rejected, (state, action) => {
        state.status.edit = "failed";
        state.error = action.error.message;
      })
      .addCase(deleteTutor.pending, (state) => {
        state.status.delete = "loading";
        state.error = null;
      })
      .addCase(deleteTutor.fulfilled, (state, action) => {
        state.status.delete = "succeeded";
        state.error = null;
        state.tutors = state.tutors.filter(
          (tutor) => tutor.id !== action.payload
        );
      })
      .addCase(deleteTutor.rejected, (state, action) => {
        state.status.delete = "failed";
        state.error = action.error.message;
      });
  },
});

export default tutorSlice.reducer;
export const { resetStatus } = tutorSlice.actions;
