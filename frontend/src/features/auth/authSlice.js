import { createSlice } from '@reduxjs/toolkit';

// Retrieve default sessions from localStorage if present
const getInitialUser = () => {
  try {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  } catch (e) {
    return null;
  }
};

// Seed default users in localStorage for easy testing
const seedDefaultUsers = () => {
  try {
    const users = localStorage.getItem('registeredUsers');
    if (!users) {
      const defaultUsers = [
        { name: 'Demo Student', email: 'student@acdyon.com', password: 'password123', role: 'student' },
        { name: 'Demo Admin', email: 'admin@acdyon.com', password: 'password123', role: 'admin' }
      ];
      localStorage.setItem('registeredUsers', JSON.stringify(defaultUsers));
    }
  } catch (e) {
    // Fail silently in restricted sandbox
  }
};

seedDefaultUsers();

const initialState = {
  user: getInitialUser(),
  isAuthenticated: !!getInitialUser(),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
      localStorage.setItem('currentUser', JSON.stringify(action.payload));
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logoutSuccess: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('currentUser');
    },
    clearError: (state) => {
      state.error = null;
    }
  }
});

export const { loginStart, loginSuccess, loginFailure, logoutSuccess, clearError } = authSlice.actions;

// Async Simulated Actions (Thunk-like simple dispatch wrapper)
export const loginUser = (credentials) => (dispatch) => {
  dispatch(loginStart());
  
  // Simulate network latency
  setTimeout(() => {
    try {
      const usersRaw = localStorage.getItem('registeredUsers') || '[]';
      const users = JSON.parse(usersRaw);
      
      const matchedUser = users.find(
        u => u.email.toLowerCase() === credentials.email.toLowerCase() && u.password === credentials.password
      );
      
      if (matchedUser) {
        const sessionUser = { name: matchedUser.name, email: matchedUser.email, role: matchedUser.role };
        dispatch(loginSuccess(sessionUser));
      } else {
        dispatch(loginFailure('Invalid email or password. Try student@acdyon.com / password123'));
      }
    } catch (e) {
      dispatch(loginFailure('An error occurred during authentication.'));
    }
  }, 800);
};

export const registerUser = (userData) => (dispatch) => {
  dispatch(loginStart());
  
  setTimeout(() => {
    try {
      const usersRaw = localStorage.getItem('registeredUsers') || '[]';
      const users = JSON.parse(usersRaw);
      
      const exists = users.some(u => u.email.toLowerCase() === userData.email.toLowerCase());
      if (exists) {
        dispatch(loginFailure('An account with this email already exists.'));
        return;
      }
      
      const newUser = {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: userData.role
      };
      
      users.push(newUser);
      localStorage.setItem('registeredUsers', JSON.stringify(users));
      
      const sessionUser = { name: newUser.name, email: newUser.email, role: newUser.role };
      dispatch(loginSuccess(sessionUser));
    } catch (e) {
      dispatch(loginFailure('An error occurred during registration.'));
    }
  }, 800);
};

export const loginWithGoogle = (role) => (dispatch) => {
  dispatch(loginStart());
  
  setTimeout(() => {
    const sessionUser = {
      name: 'Google User',
      email: 'user.google@gmail.com',
      role: role
    };
    dispatch(loginSuccess(sessionUser));
  }, 1200); // Latency for visual Google popup loader
};

export const logoutUser = () => (dispatch) => {
  dispatch(logoutSuccess());
};

export default authSlice.reducer;
