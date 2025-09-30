import { Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from "context";
import { CircularProgress, Box } from "@mui/material";
import MDTypography from "components/MDTypography";

function PublicRoute({ children }) {
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

  // Nếu đã authenticated và đang ở trang login, redirect về dashboard hoặc trang intended
  if (isAuthenticated) {
    const intendedPath = location.state?.from || "/dashboard";
    return <Navigate to={intendedPath} replace />;
  }

  // Nếu chưa authenticated, render children (login/register pages)
  return children;
}

PublicRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PublicRoute;
