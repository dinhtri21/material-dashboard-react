import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  CircularProgress,
} from "@mui/material";
import { Formik, Form } from "formik";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import PropTypes from "prop-types";

import { createUserValidationSchema } from "../validation/userSchema";

function UserForm({ open, user, onSubmit, onClose, loading = false, existingUsers = [] }) {
  const isEditing = !!user;

  const initialValues = {
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
  };

  // Tạo validation schema với check trùng email
  const validationSchema = createUserValidationSchema(existingUsers, user?.id);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await onSubmit(values);
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEditing ? "Cập nhật người dùng" : "Thêm người dùng mới"}</DialogTitle>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
          <Form>
            <DialogContent>
              <Grid container spacing={3}>
                {/* Tên */}
                <Grid item xs={12} sm={6}>
                  <MDInput
                    label="Tên"
                    name="first_name"
                    value={values.first_name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.first_name && Boolean(errors.first_name)}
                    helperText={touched.first_name && errors.first_name}
                    fullWidth
                    required
                  />
                </Grid>

                {/* Họ */}
                <Grid item xs={12} sm={6}>
                  <MDInput
                    label="Họ"
                    name="last_name"
                    value={values.last_name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.last_name && Boolean(errors.last_name)}
                    helperText={touched.last_name && errors.last_name}
                    fullWidth
                    required
                  />
                </Grid>

                {/* Email */}
                <Grid item xs={12}>
                  <MDInput
                    label="Email"
                    name="email"
                    type="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                    fullWidth
                    required
                  />
                </Grid>
              </Grid>
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 2 }}>
              <MDButton onClick={onClose} color="secondary">
                Hủy
              </MDButton>
              <MDButton
                type="submit"
                variant="gradient"
                color={isEditing ? "info" : "success"}
                disabled={isSubmitting || loading}
                startIcon={
                  (isSubmitting || loading) && <CircularProgress size={16} color="inherit" />
                }
              >
                {isEditing ? "Cập nhật" : "Thêm mới"}
              </MDButton>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
}

UserForm.propTypes = {
  open: PropTypes.bool.isRequired,
  user: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  existingUsers: PropTypes.array,
};

export default UserForm;
