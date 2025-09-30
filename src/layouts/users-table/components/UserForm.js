import { Formik, Form } from "formik";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
  Button,
} from "@mui/material";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import { createUserValidationSchema } from "../validation/userSchema";
import { useUsers } from "../context/UsersContext";

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
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, errors, touched, handleChange, handleBlur, isSubmitting, isValid }) => (
          <Form>
            <DialogTitle>{isEditing ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}</DialogTitle>

            <DialogContent>
              <MDBox pt={2}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      name="hoTen"
                      label="Họ Tên"
                      fullWidth
                      value={values.hoTen}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.hoTen && !!errors.hoTen}
                      helperText={touched.hoTen && errors.hoTen}
                      disabled={loading || isSubmitting}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      name="email"
                      label="Email"
                      type="email"
                      fullWidth
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.email && !!errors.email}
                      helperText={touched.email && errors.email}
                      disabled={loading || isSubmitting}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="vaiTro"
                      label="Vai Trò"
                      select
                      fullWidth
                      value={values.vaiTro}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.vaiTro && !!errors.vaiTro}
                      helperText={touched.vaiTro && errors.vaiTro}
                      disabled={loading || isSubmitting}
                      sx={{
                        "& .MuiInputBase-root": {
                          height: 44,
                        },
                      }}
                    >
                      {vaiTroOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="ngaySinh"
                      label="Ngày Sinh"
                      type="date"
                      fullWidth
                      value={values.ngaySinh}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.ngaySinh && !!errors.ngaySinh}
                      helperText={touched.ngaySinh && errors.ngaySinh}
                      disabled={loading || isSubmitting}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                </Grid>
              </MDBox>
            </DialogContent>

            <DialogActions>
              <Button onClick={onClose} disabled={loading || isSubmitting}>
                Hủy
              </Button>
              <MDButton
                type="submit"
                variant="gradient"
                color={isEditing ? "info" : "success"}
                disabled={!isValid || loading || isSubmitting}
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
