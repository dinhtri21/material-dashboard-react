import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from "context";
import { CircularProgress, Box } from "@mui/material";
import MDTypography from "components/MDTypography";

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Hiển thị loading khi đang check authentication
  if (loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        bgcolor="background.default"
      >
        <CircularProgress size={60} color="info" />
        <MDTypography variant="h6" color="text" mt={2}>
          Đang kiểm tra đăng nhập...
        </MDTypography>
      </Box>
    );
  }

  // Nếu chưa authenticated, redirect về login với state về trang hiện tại
  if (!isAuthenticated) {
    return <Navigate to="/authentication/sign-in" state={{ from: location.pathname }} replace />;
  }

  // Nếu đã authenticated, render children
  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
