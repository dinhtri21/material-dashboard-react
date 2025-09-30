import { createContext, useContext, useReducer, useEffect } from "react";
import PropTypes from "prop-types";
import { tokenUtils } from "../api/services/authService";

// Initial state
const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: false,
  error: null,
};

// Action types
export const AUTH_ACTIONS = {
  LOGIN_START: "LOGIN_START",
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGIN_FAILURE: "LOGIN_FAILURE",
  LOGOUT: "LOGOUT",
  SET_USER: "SET_USER",
  CLEAR_ERROR: "CLEAR_ERROR",
  CHECK_AUTH: "CHECK_AUTH",
};

// Reducer function
function authReducer(state, action) {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        token: action.payload.token,
        user: action.payload.user || null,
        loading: false,
        error: null,
      };

    case AUTH_ACTIONS.LOGIN_FAILURE:
      return {
        ...state,
        isAuthenticated: false,
        token: null,
        user: null,
        loading: false,
        error: action.payload,
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        token: null,
        user: null,
        loading: false,
        error: null,
      };

    case AUTH_ACTIONS.SET_USER:
      return {
        ...state,
        user: action.payload,
      };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case AUTH_ACTIONS.CHECK_AUTH:
      return {
        ...state,
        isAuthenticated: action.payload.isAuthenticated,
        token: action.payload.token,
        user: action.payload.user,
      };

    default:
      return state;
  }
}

// Create contexts
const AuthContext = createContext();
const AuthDispatchContext = createContext();

// Provider component
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check authentication status on app load từ localStorage
  useEffect(() => {
    const token = tokenUtils.getToken(); // Chỉ check localStorage
    if (token) {
      // Token exists trong localStorage, consider user authenticated
      console.log("Found token in localStorage:", token);
      dispatch({
        type: AUTH_ACTIONS.CHECK_AUTH,
        payload: {
          isAuthenticated: true,
          token,
          user: null, // You can fetch user data here if needed
        },
      });
    } else {
      console.log("No token found in localStorage");
    }
  }, []);

  return (
    <AuthContext.Provider value={state}>
      <AuthDispatchContext.Provider value={dispatch}>{children}</AuthDispatchContext.Provider>
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Custom hooks
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function useAuthDispatch() {
  const context = useContext(AuthDispatchContext);
  if (!context) {
    throw new Error("useAuthDispatch must be used within an AuthProvider");
  }
  return context;
}

// Export reducer for testing or other usage
export { authReducer, initialState };
