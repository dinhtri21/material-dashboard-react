import { useCallback } from "react";
import { useUsersDispatch, USERS_ACTIONS, useUsers } from "../context/usersContext";
import { usersApi } from "../api/services/usersService";

export function useUsersOperations() {
  const dispatch = useUsersDispatch();
  const { users } = useUsers();

  // GET - Gọi API thật để lấy dữ liệu
  const loadUsers = useCallback(async () => {
    dispatch({ type: USERS_ACTIONS.SET_LOADING, payload: true });
    try {
      const users = await usersApi.getUsers();
      dispatch({ type: USERS_ACTIONS.SET_USERS, payload: users });
    } catch (error) {
      dispatch({ type: USERS_ACTIONS.SET_ERROR, payload: error.message });
    }
  }, [dispatch]);

  // CREATE - Chỉ thao tác local, không gọi API
  const createUser = useCallback(
    async (userData) => {
      dispatch({ type: USERS_ACTIONS.SET_LOADING, payload: true });
      try {
        // Comment API call - chỉ thao tác local
        // const newUser = await usersApi.createUser(userData);

        // Tạo ID theo số thứ tự kế tiếp
        const maxId = users.length > 0 ? Math.max(...users.map((user) => user.id)) : 0;
        const newId = maxId + 1;

        // Tạo user mới với ID theo thứ tự
        const newUser = {
          ...userData,
          id: newId,
        };

        dispatch({ type: USERS_ACTIONS.ADD_USER, payload: newUser });
        return newUser;
      } catch (error) {
        dispatch({ type: USERS_ACTIONS.SET_ERROR, payload: error.message });
        throw error;
      }
    },
    [dispatch, users]
  );

  // UPDATE - Chỉ thao tác local, không gọi API
  const updateUser = useCallback(
    async (id, userData) => {
      dispatch({ type: USERS_ACTIONS.SET_LOADING, payload: true });
      try {
        // Comment API call - chỉ thao tác local
        // const updatedUser = await usersApi.updateUser(id, userData);

        // Cập nhật user local với ID và data mới
        const updatedUser = {
          ...userData,
          id: id,
        };

        dispatch({ type: USERS_ACTIONS.UPDATE_USER, payload: updatedUser });
        return updatedUser;
      } catch (error) {
        dispatch({ type: USERS_ACTIONS.SET_ERROR, payload: error.message });
        throw error;
      }
    },
    [dispatch]
  );

  // DELETE - Chỉ thao tác local, không gọi API
  const deleteUser = useCallback(
    async (id) => {
      dispatch({ type: USERS_ACTIONS.SET_LOADING, payload: true });
      try {
        // Comment API call - chỉ thao tác local
        // await usersApi.deleteUser(id);

        // Xóa user khỏi store local
        dispatch({ type: USERS_ACTIONS.DELETE_USER, payload: id });
      } catch (error) {
        dispatch({ type: USERS_ACTIONS.SET_ERROR, payload: error.message });
        throw error;
      }
    },
    [dispatch]
  );

  // Utility actions
  const setSearchTerm = useCallback(
    (term) => {
      dispatch({ type: USERS_ACTIONS.SET_SEARCH_TERM, payload: term });
    },
    [dispatch]
  );

  const setPage = useCallback(
    (page) => {
      dispatch({ type: USERS_ACTIONS.SET_PAGE, payload: page });
    },
    [dispatch]
  );

  const setRowsPerPage = useCallback(
    (rowsPerPage) => {
      dispatch({ type: USERS_ACTIONS.SET_ROWS_PER_PAGE, payload: rowsPerPage });
    },
    [dispatch]
  );

  const setOrder = useCallback(
    (orderBy, order) => {
      dispatch({ type: USERS_ACTIONS.SET_ORDER, payload: { orderBy, order } });
    },
    [dispatch]
  );

  const clearError = useCallback(() => {
    dispatch({ type: USERS_ACTIONS.CLEAR_ERROR });
  }, [dispatch]);

  return {
    loadUsers,
    createUser,
    updateUser,
    deleteUser,
    setSearchTerm,
    setPage,
    setRowsPerPage,
    setOrder,
    clearError,
  };
}
