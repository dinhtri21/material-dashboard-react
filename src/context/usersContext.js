import { createContext, useContext, useReducer } from "react";
import PropTypes from "prop-types";

// Initial state
const initialState = {
  users: [],
  loading: false,
  error: null,
  searchTerm: "",
  page: 0,
  rowsPerPage: 5,
  orderBy: "id",
  order: "asc",
};

// Action types
export const USERS_ACTIONS = {
  SET_LOADING: "SET_LOADING",
  SET_USERS: "SET_USERS",
  ADD_USER: "ADD_USER",
  UPDATE_USER: "UPDATE_USER",
  DELETE_USER: "DELETE_USER",
  SET_ERROR: "SET_ERROR",
  SET_SEARCH_TERM: "SET_SEARCH_TERM",
  SET_PAGE: "SET_PAGE",
  SET_ROWS_PER_PAGE: "SET_ROWS_PER_PAGE",
  SET_ORDER: "SET_ORDER",
};

// Reducer function
function usersReducer(state, action) {
  switch (action.type) {
    case USERS_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };

    case USERS_ACTIONS.SET_USERS:
      return { ...state, users: action.payload, loading: false };

    case USERS_ACTIONS.ADD_USER:
      return {
        ...state,
        users: [...state.users, action.payload],
        loading: false,
      };

    case USERS_ACTIONS.UPDATE_USER:
      return {
        ...state,
        users: state.users.map((user) => (user.id === action.payload.id ? action.payload : user)),
        loading: false,
      };

    case USERS_ACTIONS.DELETE_USER:
      return {
        ...state,
        users: state.users.filter((user) => user.id !== action.payload),
        loading: false,
      };

    case USERS_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };

    case USERS_ACTIONS.SET_SEARCH_TERM:
      return { ...state, searchTerm: action.payload, page: 0 };

    case USERS_ACTIONS.SET_PAGE:
      return { ...state, page: action.payload };

    case USERS_ACTIONS.SET_ROWS_PER_PAGE:
      return { ...state, rowsPerPage: action.payload, page: 0 };

    case USERS_ACTIONS.SET_ORDER:
      return {
        ...state,
        orderBy: action.payload.orderBy,
        order: action.payload.order,
      };

    default:
      return state;
  }
}

// Create contexts
const UsersContext = createContext();
const UsersDispatchContext = createContext();

// Provider component
export function UsersProvider({ children }) {
  const [state, dispatch] = useReducer(usersReducer, initialState);

  return (
    <UsersContext.Provider value={state}>
      <UsersDispatchContext.Provider value={dispatch}>{children}</UsersDispatchContext.Provider>
    </UsersContext.Provider>
  );
}

UsersProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Custom hooks
export function useUsers() {
  const context = useContext(UsersContext);
  if (!context) {
    throw new Error("useUsers must be used within a UsersProvider");
  }
  return context;
}

export function useUsersDispatch() {
  const context = useContext(UsersDispatchContext);
  if (!context) {
    throw new Error("useUsersDispatch must be used within a UsersProvider");
  }
  return context;
}
