import { useState, useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import TablePagination from "@mui/material/TablePagination";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";

// API Service
import { getUsers, createUser, updateUser, deleteUser } from "api/services/reqresService";

// Local components
import UserForm from "./components/UserForm";
import useTableData from "./data/tableData";

function UserTableAPI() {
  // State management
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [orderBy, setOrderBy] = useState("id");
  const [order, setOrder] = useState("asc");
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 6,
    total: 0,
    totalPages: 0,
  });

  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState("create"); // 'create' | 'edit'
  const [selectedUser, setSelectedUser] = useState(null);

  // Snackbar state
  const [snackbars, setSnackbars] = useState([]);

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

  // Load users
  const loadUsers = async (page = 1) => {
    setLoading(true);
    try {
      const response = await getUsers(page, pagination.perPage);
      setUsers(response.data);
      setPagination({
        page: response.page,
        perPage: response.per_page,
        total: response.total,
        totalPages: response.total_pages,
      });
    } catch (error) {
      showSnackbar(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // Handle sort
  const handleSort = (field, direction) => {
    setOrderBy(field);
    setOrder(direction);
  };

  // Handle page change
  const handlePageChange = (event, newPage) => {
    loadUsers(newPage + 1); // TablePagination is 0-indexed, API is 1-indexed
  };

  const handleRowsPerPageChange = (event) => {
    const newPerPage = parseInt(event.target.value, 10);
    setPagination((prev) => ({ ...prev, perPage: newPerPage }));
    loadUsers(1); // Reset to first page
  };

  // Dialog handlers
  const handleOpenCreateDialog = () => {
    setDialogMode("create");
    setSelectedUser(null);
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (user) => {
    setDialogMode("edit");
    setSelectedUser(user);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
  };

  // CRUD operations
  const handleCreateUser = async (values) => {
    try {
      // Thêm job mặc định cho API reqres
      const userData = { ...values, job: "Developer" };
      await createUser(userData);
      showSnackbar("Tạo người dùng thành công!", "success");
      handleCloseDialog();
      loadUsers(pagination.page); // Reload current page
    } catch (error) {
      showSnackbar(error.message, "error");
    }
  };

  const handleUpdateUser = async (userId, values) => {
    try {
      // Thêm job mặc định cho API reqres
      const userData = { ...values, job: "Developer" };
      await updateUser(userId, userData);
      showSnackbar("Cập nhật người dùng thành công!", "success");
      handleCloseDialog();
      loadUsers(pagination.page); // Reload current page
    } catch (error) {
      showSnackbar(error.message, "error");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      try {
        await deleteUser(userId);
        showSnackbar("Xóa người dùng thành công!", "success");
        loadUsers(pagination.page); // Reload current page
      } catch (error) {
        showSnackbar(error.message, "error");
      }
    }
  };

  // Get table data using custom hook
  const { columns, rows, totalUsers } = useTableData({
    users,
    loading,
    searchTerm,
    onEdit: handleOpenEditDialog,
    onDelete: handleDeleteUser,
    onSort: handleSort,
    onUpdate: handleUpdateUser,
    orderBy,
    order,
  });

  // Load users on component mount
  useEffect(() => {
    loadUsers();
  }, []);

  // Search filter
  const filteredUsers = users.filter((user) =>
    `${user.first_name} ${user.last_name} ${user.email}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        {/* Search và Add button */}
        <MDBox mb={3}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <MDInput
                placeholder="Tìm kiếm theo họ tên, email..."
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
                onClick={handleOpenCreateDialog}
              >
                Thêm Người Dùng
              </MDButton>
            </Grid>
          </Grid>
        </MDBox>

        {/* DataTable */}
        <Card>
          <MDBox>
            {loading ? (
              <MDBox display="flex" justifyContent="center" p={3}>
                <CircularProgress />
              </MDBox>
            ) : (
              <DataTable
                table={{ columns, rows }}
                isSorted={false}
                entriesPerPage={false}
                showTotalEntries={false}
                noEndBorder
              />
            )}

            {/* Pagination */}
            <TablePagination
              component="div"
              count={pagination.total}
              page={pagination.page - 1} // TablePagination is 0-indexed
              onPageChange={handlePageChange}
              rowsPerPage={pagination.perPage}
              onRowsPerPageChange={handleRowsPerPageChange}
              rowsPerPageOptions={[6, 12, 18, 24]}
              labelRowsPerPage="Số hàng mỗi trang:"
              labelDisplayedRows={({ from, to, count }) =>
                `${from}–${to} của ${count !== -1 ? count : `hơn ${to}`}`
              }
              sx={{ borderTop: "1px solid rgba(0, 0, 0, 0.12)" }}
            />
          </MDBox>
        </Card>
      </MDBox>

      {/* Create/Edit User Dialog */}
      <UserForm
        open={openDialog}
        user={selectedUser}
        onSubmit={
          dialogMode === "create"
            ? handleCreateUser
            : (values) => handleUpdateUser(selectedUser.id, values)
        }
        onClose={handleCloseDialog}
        loading={loading}
        existingUsers={users}
      />

      {/* Snackbar Notifications */}
      {snackbars.map((snackbar) => (
        <Snackbar
          key={snackbar.id}
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => handleCloseSnackbar(snackbar.id)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={() => handleCloseSnackbar(snackbar.id)}
            severity={snackbar.severity}
            variant="filled"
            sx={{ minWidth: "300px" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      ))}
    </DashboardLayout>
  );
}

export default UserTableAPI;
