import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthDispatch, AUTH_ACTIONS } from "../context/authContext";
import { authApi, tokenUtils } from "../api/services/authService";

export function useAuthOperations() {
  const dispatch = useAuthDispatch();
  const navigate = useNavigate();

  // Đăng nhập
  const login = useCallback(
    async (email, password, rememberMe = false) => {
      dispatch({ type: AUTH_ACTIONS.LOGIN_START });

      try {
        const response = await authApi.login(email, password);

        // Luôn lưu token vào localStorage (bỏ logic sessionStorage)
        tokenUtils.setToken(response.token);

        // Dispatch login success
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: {
            token: response.token,
            user: response.user || null,
          },
        });

        // Điều hướng đến dashboard
        navigate("/dashboard");

        return response;
      } catch (error) {
        dispatch({
          type: AUTH_ACTIONS.LOGIN_FAILURE,
          payload: error.message,
        });
        throw error;
      }
    },
    [dispatch, navigate]
  );

  // Đăng ký
  const register = useCallback(
    async (email, password) => {
      dispatch({ type: AUTH_ACTIONS.LOGIN_START });

      try {
        const response = await authApi.register(email, password);

        // Tự động login sau khi đăng ký thành công
        if (response.token) {
          // Lưu token vào localStorage
          tokenUtils.setToken(response.token);

          dispatch({
            type: AUTH_ACTIONS.LOGIN_SUCCESS,
            payload: {
              token: response.token,
              user: response.user || null,
            },
          });

          navigate("/dashboard");
        }

        return response;
      } catch (error) {
        dispatch({
          type: AUTH_ACTIONS.LOGIN_FAILURE,
          payload: error.message,
        });
        throw error;
      }
    },
    [dispatch, navigate]
  );

  // Đăng xuất
  const logout = useCallback(() => {
    // Chỉ xóa token khỏi localStorage
    tokenUtils.removeToken();

    // Dispatch logout action
    dispatch({ type: AUTH_ACTIONS.LOGOUT });

    // Điều hướng về trang login
    navigate("/authentication/sign-in");
  }, [dispatch, navigate]);

  // Lấy thông tin user
  const fetchUserInfo = useCallback(
    async (userId) => {
      try {
        // Chỉ lấy token từ localStorage
        const token = tokenUtils.getToken();
        if (!token) {
          throw new Error("No token found");
        }

        const user = await authApi.getUserInfo(userId, token);

        dispatch({
          type: AUTH_ACTIONS.SET_USER,
          payload: user,
        });

        return user;
      } catch (error) {
        console.error("Error fetching user info:", error);
        throw error;
      }
    },
    [dispatch]
  );

  // Clear error
  const clearError = useCallback(() => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  }, [dispatch]);

  return {
    login,
    register,
    logout,
    fetchUserInfo,
    clearError,
  };
}
