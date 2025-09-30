/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useState } from "react";
import { Link } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import MuiLink from "@mui/material/Link";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Context và hooks
import { useAuth } from "context";
import { useAuthOperations } from "hooks/useAuthOperations";

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";

// Validation schema
const validationSchema = Yup.object({
  email: Yup.string().email("Email không hợp lệ").required("Email là bắt buộc"),
  password: Yup.string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .required("Mật khẩu là bắt buộc"),
});

function Basic() {
  const { loading, error } = useAuth();
  const { login, clearError } = useAuthOperations();

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Gọi login mà không cần rememberMe (luôn lưu localStorage)
      await login(values.email, values.password);
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setSubmitting(false);
    }
  };

  // Demo account info
  const demoCredentials = {
    email: "eve.holt@reqres.in",
    password: "cityslicka",
  };

  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Đăng nhập
          </MDTypography>
          <Grid container spacing={3} justifyContent="center" sx={{ mt: 1, mb: 2 }}>
            <Grid item xs={2}>
              <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                <FacebookIcon color="inherit" />
              </MDTypography>
            </Grid>
            <Grid item xs={2}>
              <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                <GitHubIcon color="inherit" />
              </MDTypography>
            </Grid>
            <Grid item xs={2}>
              <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                <GoogleIcon color="inherit" />
              </MDTypography>
            </Grid>
          </Grid>
        </MDBox>

        <MDBox px={3}>
          {/* Demo Credentials Info */}
          <MDBox mb={2} p={2} bgColor="grey-100" borderRadius="lg">
            <MDTypography variant="button" color="text" fontWeight="bold" mb={1}>
              Tài khoản demo:
            </MDTypography>
            <MDTypography variant="caption" color="text" display="block">
              Email: {demoCredentials.email}
            </MDTypography>
            <MDTypography variant="caption" color="text" display="block">
              Password: {demoCredentials.password}
            </MDTypography>
          </MDBox>

          {/* Error Alert */}
          {error && (
            <MDBox mb={2}>
              <Alert severity="error" onClose={clearError} sx={{ fontSize: "0.875rem" }}>
                {error}
              </Alert>
            </MDBox>
          )}

          {/* Login Form */}
          <Formik
            initialValues={{
              email: "", // Pre-fill demo email
              password: "", // Pre-fill demo password
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
              <Form>
                <MDBox mb={2}>
                  <MDInput
                    type="email"
                    label="Email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                    fullWidth
                    disabled={loading || isSubmitting}
                  />
                </MDBox>

                <MDBox mb={2}>
                  <MDInput
                    type="password"
                    label="Mật khẩu"
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                    fullWidth
                    disabled={loading || isSubmitting}
                  />
                </MDBox>

                <MDBox mt={4} mb={1}>
                  <MDButton
                    type="submit"
                    variant="gradient"
                    color="info"
                    fullWidth
                    disabled={loading || isSubmitting}
                    startIcon={
                      (loading || isSubmitting) && <CircularProgress size={16} color="inherit" />
                    }
                  >
                    {loading || isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
                  </MDButton>
                </MDBox>
              </Form>
            )}
          </Formik>

          <MDBox mt={3} mb={1} textAlign="center">
            <MDTypography variant="button" color="text">
              Chưa có tài khoản?{" "}
              <MDTypography
                component={Link}
                to="/authentication/sign-up"
                variant="button"
                color="info"
                fontWeight="medium"
                textGradient
              >
                Đăng ký
              </MDTypography>
            </MDTypography>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;
