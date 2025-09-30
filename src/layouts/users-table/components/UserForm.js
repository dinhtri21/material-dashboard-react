import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { Formik, Form } from "formik";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import PropTypes from "prop-types";

// Import từ src/context thay vì local
import { useUsers } from "context";
import { createUserValidationSchema } from "../validation/userSchema";

const vaiTroOptions = [
  { value: "Admin", label: "Admin" },
  { value: "User", label: "User" },
  { value: "Guest", label: "Guest" },
];

function UserForm({ open, user, onSubmit, onClose, loading = false }) {
  const { users } = useUsers();
  const isEditing = !!user;

  const initialValues = {
    hoTen: user?.hoTen || "",
    email: user?.email || "",
    vaiTro: user?.vaiTro || "User",
    ngaySinh: user?.ngaySinh || "",
  };

  // Tạo validation schema với check trùng email
  const validationSchema = createUserValidationSchema(users, user?.id);

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
                {/* Họ tên */}
                <Grid item xs={12}>
                  <MDInput
                    label="Họ và tên"
                    name="hoTen"
                    value={values.hoTen}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.hoTen && Boolean(errors.hoTen)}
                    helperText={touched.hoTen && errors.hoTen}
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

                {/* Vai trò */}
                <Grid item xs={12} sm={6}>
                  <MDInput
                    label="Vai trò"
                    name="vaiTro"
                    select
                    value={values.vaiTro}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.vaiTro && Boolean(errors.vaiTro)}
                    helperText={touched.vaiTro && errors.vaiTro}
                    fullWidth
                    required
                  >
                    {vaiTroOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </MDInput>
                </Grid>

                {/* Ngày sinh */}
                <Grid item xs={12} sm={6}>
                  <MDInput
                    label="Ngày sinh"
                    name="ngaySinh"
                    type="date"
                    value={values.ngaySinh}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.ngaySinh && Boolean(errors.ngaySinh)}
                    helperText={touched.ngaySinh && errors.ngaySinh}
                    fullWidth
                    required
                    InputLabelProps={{
                      shrink: true,
                    }}
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
};

export default UserForm;
