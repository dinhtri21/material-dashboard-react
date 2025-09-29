import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";

const vaiTroOptions = [
  { value: "User", label: "User" },
  { value: "Admin", label: "Admin" },
];

function CreateOrUpdateButton({
  open,
  type,
  formData,
  setFormData,
  onSubmit,
  onClose,
  loading = false,
}) {
  const isCreate = type === "create";
  const isUpdate = type === "update";

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  const isFormValid = formData.hoTen && formData.email;

  // Tiêu đề dialog dựa trên type
  const getDialogTitle = () => {
    if (isCreate) return "Thêm Người Dùng Mới";
    if (isUpdate) return "Chỉnh Sửa Người Dùng";
    return "Người Dùng";
  };

  // Text nút submit dựa trên type
  const getSubmitButtonText = () => {
    if (isCreate) return "Thêm";
    if (isUpdate) return "Cập Nhật";
    return "Lưu";
  };

  // Màu nút submit dựa trên type
  const getSubmitButtonColor = () => {
    if (isCreate) return "success";
    if (isUpdate) return "primary";
    return "primary";
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        component: "form",
        onSubmit: handleFormSubmit,
      }}
    >
      <DialogTitle>{getDialogTitle()}</DialogTitle>

      <DialogContent>
        <MDBox pt={2}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <TextField
                label="Họ Tên"
                fullWidth
                required
                value={formData.hoTen}
                onChange={(e) => setFormData({ ...formData, hoTen: e.target.value })}
                error={!formData.hoTen && formData.hoTen !== ""}
                helperText={!formData.hoTen && formData.hoTen !== "" ? "Họ tên là bắt buộc" : ""}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Email"
                fullWidth
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                error={!formData.email && formData.email !== ""}
                helperText={!formData.email && formData.email !== "" ? "Email là bắt buộc" : ""}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Vai Trò"
                fullWidth
                select
                value={formData.vaiTro}
                onChange={(e) => setFormData({ ...formData, vaiTro: e.target.value })}
                disabled={loading}
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
          </Grid>
        </MDBox>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Hủy
        </Button>
        <MDButton
          type="submit"
          variant="gradient"
          color={getSubmitButtonColor()}
          disabled={!isFormValid || loading}
        >
          {getSubmitButtonText()}
        </MDButton>
      </DialogActions>
    </Dialog>
  );
}

CreateOrUpdateButton.propTypes = {
  open: PropTypes.bool.isRequired,
  type: PropTypes.oneOf(["create", "update"]).isRequired,
  formData: PropTypes.shape({
    hoTen: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    vaiTro: PropTypes.string.isRequired,
  }).isRequired,
  setFormData: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default CreateOrUpdateButton;
