import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import TablePagination from "@mui/material/TablePagination";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import tableData from "./data/tableData";
import CreateOrUpdateButton from "./components/CreateOrUpdateButton";

export default function UsersTable() {
  const {
    columns,
    rows,
    loading,
    searchTerm,
    setSearchTerm,
    openDialog,
    setOpenDialog,
    editingUser,
    formData,
    setFormData,
    handleAddUser,
    handleUpdateUser,
    openAddDialog,
    // Pagination
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    totalUsers,
  } = tableData();

  const dialogType = editingUser ? "update" : "create";

  const handleFormSubmit = () => {
    if (dialogType === "update") {
      handleUpdateUser();
    } else {
      handleAddUser();
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        {/* 5. Search nâng cao */}
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
                onClick={openAddDialog}
                disabled={loading}
              >
                Thêm Người Dùng
              </MDButton>
            </Grid>
          </Grid>
        </MDBox>

        {/* 1. Table */}
        <Card>
          <MDBox>
            <DataTable
              table={{ columns, rows }}
              isSorted={false}
              entriesPerPage={false}
              showTotalEntries={false}
              noEndBorder
              canSearch={false}
            />

            {/* 2. (Pagination) */}
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

        {/* 2. Thêm sửa */}
        <CreateOrUpdateButton
          open={openDialog}
          type={dialogType}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleFormSubmit}
          onClose={() => setOpenDialog(false)}
          loading={loading}
        />
      </MDBox>
    </DashboardLayout>
  );
}
