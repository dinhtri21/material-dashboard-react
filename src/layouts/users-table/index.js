import { useState, useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import TablePagination from "@mui/material/TablePagination";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";

// Import từ src/context thay vì local
import { UsersProvider, useUsers } from "context";
import { useUsersOperations } from "hooks/useUsersOperations";

// Import local components
import UserForm from "./components/UserForm";
import tableData from "./data/tableData";

// Component chính sử dụng Context
function UsersTableContent() {
  const { searchTerm, page, rowsPerPage } = useUsers();

  const {
    loadUsers,
    createUser,
    updateUser,
    deleteUser,
    setSearchTerm,
    setPage,
    setRowsPerPage,
    setOrder,
  } = useUsersOperations();

  // State cho UI
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [snackbars, setSnackbars] = useState([]);

  // Load dữ liệu khi component mount
  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Snackbar functions
  const showSnackbar = (message, severity = "success") => {
    const newSnackbar = {
      id: Date.now(),
      message,
      severity,
      open: true,
    };
    setSnackbars((prev) => [...prev, newSnackbar]);
  };

  const handleCloseSnackbar = (snackbarId) => {
    setSnackbars((prev) =>
      prev.map((snackbar) => (snackbar.id === snackbarId ? { ...snackbar, open: false } : snackbar))
    );
    setTimeout(() => {
      setSnackbars((prev) => prev.filter((snackbar) => snackbar.id !== snackbarId));
    }, 150);
  };

  // Dialog handlers
  const handleOpenAddDialog = () => {
    setEditingUser(null);
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (user) => {
    setEditingUser(user);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingUser(null);
  };

  // CRUD handlers
  const handleSubmitUser = async (userData) => {
    try {
      if (editingUser) {
        await updateUser(editingUser.id, userData);
        showSnackbar("Đã cập nhật người dùng thành công!", "success");
      } else {
        await createUser(userData);
        showSnackbar("Đã thêm người dùng thành công!", "success");
      }
    } catch (error) {
      showSnackbar("Có lỗi xảy ra: " + error.message, "error");
      throw error;
    }
  };

  // Handler cho inline update
  const handleInlineUpdate = async (userId, userData) => {
    try {
      await updateUser(userId, userData);
      showSnackbar("Đã cập nhật thông tin thành công!", "success");
    } catch (error) {
      showSnackbar("Có lỗi xảy ra khi cập nhật: " + error.message, "error");
      throw error;
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      try {
        await deleteUser(userId);
        showSnackbar("Xóa người dùng thành công!", "success");
      } catch (error) {
        showSnackbar("Có lỗi xảy ra khi xóa: " + error.message, "error");
      }
    }
  };

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  // Sort handler
  const handleSort = (property, direction) => {
    setOrder(property, direction);
  };

  // Sử dụng hook tableData
  const { columns, rows, totalUsers } = tableData({
    onEdit: handleOpenEditDialog,
    onDelete: handleDeleteUser,
    onSort: handleSort,
    onUpdate: handleInlineUpdate,
  });

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        {/* Search và Add button */}
        <MDBox mb={3}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <MDInput
                placeholder="Tìm kiếm theo họ tên, email, vai trò..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                fullWidth
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <MDButton
                variant="gradient"
                color="success"
                fullWidth
                startIcon={<AddIcon />}
                onClick={handleOpenAddDialog}
              >
                Thêm Người Dùng
              </MDButton>
            </Grid>
          </Grid>
        </MDBox>

        {/* DataTable */}
        <Card>
          <MDBox>
            <DataTable
              table={{ columns, rows }}
              isSorted={false}
              entriesPerPage={false}
              showTotalEntries={false}
              noEndBorder
            />

            {/* Pagination */}
            <TablePagination
              component="div"
              count={totalUsers}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 15, 20]}
              labelRowsPerPage="Số hàng mỗi trang:"
              labelDisplayedRows={({ from, to, count }) =>
                `${from}–${to} của ${count !== -1 ? count : `hơn ${to}`}`
              }
              sx={{ borderTop: "1px solid rgba(0, 0, 0, 0.12)" }}
            />
          </MDBox>
        </Card>

        {/* User Form Dialog */}
        <UserForm
          open={openDialog}
          user={editingUser}
          onSubmit={handleSubmitUser}
          onClose={handleCloseDialog}
        />

        {/* Snackbar Notifications */}
        {snackbars.map((snackbar) => (
          <Snackbar
            key={snackbar.id}
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={() => handleCloseSnackbar(snackbar.id)}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          >
            <Alert
              onClose={() => handleCloseSnackbar(snackbar.id)}
              severity={snackbar.severity}
              sx={{ width: "100%" }}
              variant="filled"
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        ))}
      </MDBox>
    </DashboardLayout>
  );
}

// Component wrapper với Provider
export default function UsersTable() {
  return (
    <UsersProvider>
      <UsersTableContent />
    </UsersProvider>
  );
}
