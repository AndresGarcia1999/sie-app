import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Thunk action creators
export const fetchStudents = createAsyncThunk(
  "students/fetchStudents",
  async () => {
    const response = await fetch("/api/students");
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error);
    }
    return response.json();
  }
);

export const addStudent = createAsyncThunk(
  "students/addStudent",
  async (newStudent) => {
    const response = await fetch("/api/students", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newStudent),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error);
    }
    return response.json();
  }
);

export const editStudent = createAsyncThunk(
  "students/editStudent",
  async (data) => {
    const { id, ...updatedStudent } = data;
    const response = await fetch(`/api/students/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedStudent),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error);
    }
    return response.json();
  }
);

export const deleteStudent = createAsyncThunk(
  "students/deleteStudent",
  async (id) => {
    const response = await fetch(`/api/students/${id}`, {
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
  students: [],
  status: {
    fetch: "idle", // idle | loading | succeeded | failed
    add: "idle",
    edit: "idle",
    delete: "idle",
  },
  error: null,
};

// Create the slice
const studentslice = createSlice({
  name: "students",
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
      .addCase(fetchStudents.pending, (state) => {
        state.status.fetch = "loading";
        state.error = null;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.status.fetch = "succeeded";
        state.error = null;
        state.students = action.payload;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.status.fetch = "failed";
        state.error = action.error.message;
      })
      .addCase(addStudent.pending, (state) => {
        state.status.add = "loading";
        state.error = null;
      })
      .addCase(addStudent.fulfilled, (state, action) => {
        console.log(action.payload);
        state.status.add = "succeeded";
        state.error = null;
        state.students.push(action.payload);
      })
      .addCase(addStudent.rejected, (state, action) => {
        state.status.add = "failed";
        state.error = action.error.message;
      })
      .addCase(editStudent.pending, (state) => {
        state.status.edit = "loading";
        state.error = null;
      })
      .addCase(editStudent.fulfilled, (state, action) => {
        state.status.edit = "succeeded";
        state.error = null;
        console.log("edit payload", action.payload);
        const updatedStudent = action.payload;
        state.students = state.students.map((student) =>
          student.id === updatedStudent.id ? updatedStudent : student
        );
      })
      .addCase(editStudent.rejected, (state, action) => {
        state.status.edit = "failed";
        state.error = action.error.message;
      })
      .addCase(deleteStudent.pending, (state) => {
        state.status.delete = "loading";
        state.error = null;
      })
      .addCase(deleteStudent.fulfilled, (state, action) => {
        state.status.delete = "succeeded";
        state.error = null;
        state.students = state.students.filter(
          (student) => student.id !== action.payload
        );
      })
      .addCase(deleteStudent.rejected, (state, action) => {
        state.status.delete = "failed";
        state.error = action.error.message;
      });
  },
});

export default studentslice.reducer;
export const { resetStatus } = studentslice.actions;
