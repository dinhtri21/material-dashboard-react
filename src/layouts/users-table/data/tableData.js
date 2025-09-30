import { useMemo, useState } from "react";
import { TableSortLabel, IconButton, CircularProgress, TextField, MenuItem } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import PropTypes from "prop-types";

// Import từ src chung
import { useUsers } from "../../../context/usersContext";
import { createUserValidationSchema } from "../validation/userSchema";

// Component hiển thị vai trò với màu sắc
const VaiTro = ({ vaiTro }) => {
  let color;
  switch (vaiTro) {
    case "Admin":
      color = "error";
      break;
    case "Guest":
      color = "warning";
      break;
    case "User":
    default:
      color = "info";
      break;
  }

  return (
    <MDTypography variant="caption" color={color} fontWeight="bold" textGradient>
      {vaiTro}
    </MDTypography>
  );
};

VaiTro.propTypes = {
  vaiTro: PropTypes.string.isRequired,
};

export default function useTableData({ onEdit, onDelete, onSort, onUpdate }) {
  const { users, loading, searchTerm, page, rowsPerPage, orderBy, order } = useUsers();
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [validationErrors, setValidationErrors] = useState({});

  // Tạo validation schema cho inline editing
  const validationSchema = useMemo(() => {
    return createUserValidationSchema(users, editingId);
  }, [users, editingId]);

  // Tạo header với chức năng sort
  const createSortableHeader = (label, accessor) => {
    const canSort = ["hoTen", "email"];

    if (!canSort.includes(accessor)) {
      return (
        <MDTypography
          variant="caption"
          fontWeight="bold"
          textTransform="uppercase"
          color="secondary"
        >
          {label}
        </MDTypography>
      );
    }

    return (
      <TableSortLabel
        active={orderBy === accessor}
        direction={orderBy === accessor ? order : "asc"}
        onClick={() => onSort(accessor, orderBy === accessor && order === "asc" ? "desc" : "asc")}
        sx={{
          "& .MuiTableSortLabel-icon": {
            fontSize: "1.2rem !important",
            opacity: orderBy === accessor ? 1 : 0,
          },
          "&:hover .MuiTableSortLabel-icon": {
            opacity: 0.5,
          },
          "&.Mui-active .MuiTableSortLabel-icon": {
            opacity: 1,
          },
        }}
      >
        <MDTypography
          variant="caption"
          fontWeight="bold"
          textTransform="uppercase"
          color="secondary"
        >
          {label}
        </MDTypography>
      </TableSortLabel>
    );
  };

  // Columns definition
  const columns = [
    {
      Header: createSortableHeader("ID", "id"),
      accessor: "id",
      width: "8%",
      align: "center",
    },
    {
      Header: createSortableHeader("Họ Tên", "hoTen"),
      accessor: "hoTen",
      width: "22%",
      align: "left",
    },
    {
      Header: createSortableHeader("Email", "email"),
      accessor: "email",
      width: "25%",
      align: "left",
    },
    {
      Header: createSortableHeader("Vai Trò", "vaiTro"),
      accessor: "vaiTro",
      width: "12%",
      align: "center",
    },
    {
      Header: createSortableHeader("Ngày Sinh", "ngaySinh"),
      accessor: "ngaySinh",
      width: "15%",
      align: "center",
    },
    {
      Header: (
        <MDTypography
          variant="caption"
          fontWeight="bold"
          textTransform="uppercase"
          color="secondary"
        >
          Thao Tác
        </MDTypography>
      ),
      accessor: "actions",
      width: "18%",
      align: "center",
    },
  ];

  // Filter and sort users
  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.hoTen.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.vaiTro.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const sortedUsers = useMemo(() => {
    return [...filteredUsers].sort((a, b) => {
      const aValue = a[orderBy];
      const bValue = b[orderBy];

      if (aValue < bValue) {
        return order === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return order === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [filteredUsers, orderBy, order]);

  const paginatedUsers = useMemo(() => {
    return sortedUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [sortedUsers, page, rowsPerPage]);

  // Validation function
  const validateField = async (field, value, allData = editData) => {
    try {
      const dataToValidate = { ...allData, [field]: value };
      await validationSchema.validateAt(field, dataToValidate);
      setValidationErrors((prev) => ({ ...prev, [field]: null }));
      return true;
    } catch (error) {
      setValidationErrors((prev) => ({ ...prev, [field]: error.message }));
      return false;
    }
  };

  const validateAllFields = async (data) => {
    try {
      await validationSchema.validate(data, { abortEarly: false });
      setValidationErrors({});
      return true;
    } catch (error) {
      const errors = {};
      error.inner.forEach((err) => {
        errors[err.path] = err.message;
      });
      setValidationErrors(errors);
      return false;
    }
  };

  // Inline editing functions
  const handleStartEdit = (user) => {
    setEditingId(user.id);
    setEditData({
      hoTen: user.hoTen,
      email: user.email,
      vaiTro: user.vaiTro,
      ngaySinh: user.ngaySinh,
    });
    setValidationErrors({});
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({});
    setValidationErrors({});
  };

  const handleSaveEdit = async (userId) => {
    // Validate tất cả fields trước khi save
    const isValid = await validateAllFields(editData);

    if (!isValid) {
      return; // Không save nếu có lỗi validation
    }

    try {
      await onUpdate(userId, editData);
      setEditingId(null);
      setEditData({});
      setValidationErrors({});
    } catch (error) {
      console.error("Error saving edit:", error);
    }
  };

  const handleFieldChange = async (field, value) => {
    const newData = { ...editData, [field]: value };
    setEditData(newData);

    // Validate field real-time
    await validateField(field, value, newData);
  };

  // Kiểm tra xem có thể save không (không có lỗi validation)
  const canSave = useMemo(() => {
    const hasErrors = Object.values(validationErrors).some(
      (error) => error !== null && error !== undefined
    );
    const hasAllFields = editData.hoTen && editData.email && editData.vaiTro && editData.ngaySinh;
    return !hasErrors && hasAllFields;
  }, [validationErrors, editData]);

  // Component để render field có thể edit
  const EditableField = ({ user, field, type = "text" }) => {
    const isEditing = editingId === user.id;
    const value = user[field];
    const error = validationErrors[field];

    if (isEditing) {
      if (field === "vaiTro") {
        return (
          <TextField
            size="small"
            select
            value={editData[field]}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            fullWidth
            error={!!error}
            helperText={error}
            sx={{
              "& .MuiInputBase-root": {
                height: 40,
              },
            }}
          >
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="User">User</MenuItem>
            <MenuItem value="Guest">Guest</MenuItem>
          </TextField>
        );
      }

      if (field === "ngaySinh") {
        return (
          <TextField
            size="small"
            type="date"
            value={editData[field]}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            onBlur={() => validateField(field, editData[field])}
            fullWidth
            sx={{
              minWidth: 180,
              '& input[type="date"]': {
                fontSize: "0.75rem",
                paddingRight: "8px",
              },
              "& .MuiInputBase-input": {
                fontSize: "0.75rem",
              },
            }}
            InputLabelProps={{
              shrink: true,
              style: { fontSize: "0.875rem" },
            }}
            inputProps={{
              style: {
                fontSize: "0.75rem",
                cursor: "text",
              },
              placeholder: "dd/mm/yyyy",
            }}
            error={!!error}
            helperText={error}
          />
        );
      }

      return (
        <TextField
          size="small"
          type={type}
          value={editData[field]}
          onChange={(e) => handleFieldChange(field, e.target.value)}
          onBlur={() => validateField(field, editData[field])}
          fullWidth
          sx={{ minWidth: field === "hoTen" ? 120 : 150 }}
          inputProps={{
            style: { fontSize: "0.75rem" },
          }}
          error={!!error}
          helperText={error}
        />
      );
    }

    // Hiển thị bình thường với khả năng click để edit
    const handleClick = () => {
      // Cho phép edit tất cả các field (trừ ID)
      if (field !== "id") {
        handleStartEdit(user);
      }
    };

    if (field === "vaiTro") {
      return (
        <div style={{ cursor: "pointer" }} onClick={handleClick} title="Click để chỉnh sửa vai trò">
          <VaiTro vaiTro={value} />
        </div>
      );
    }

    if (field === "ngaySinh") {
      return (
        <MDTypography
          variant="caption"
          color="text"
          fontWeight="medium"
          sx={{
            cursor: "pointer",
            "&:hover": {
              backgroundColor: "rgba(0,0,0,0.04)",
              borderRadius: 1,
              padding: "2px 4px",
              margin: "-2px -4px",
            },
          }}
          onClick={handleClick}
          title="Click để chỉnh sửa ngày sinh"
        >
          {new Date(value).toLocaleDateString("vi-VN")}
        </MDTypography>
      );
    }

    return (
      <MDTypography
        variant="caption"
        color="text"
        fontWeight="medium"
        sx={{
          cursor: "pointer",
          "&:hover": {
            backgroundColor: "rgba(0,0,0,0.04)",
            borderRadius: 1,
            padding: "2px 4px",
            margin: "-2px -4px",
          },
        }}
        onClick={handleClick}
        title={`Click để chỉnh sửa ${field === "hoTen" ? "họ tên" : "email"}`}
      >
        {value}
      </MDTypography>
    );
  };

  // Thêm PropTypes cho EditableField component
  EditableField.propTypes = {
    user: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      hoTen: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      vaiTro: PropTypes.string.isRequired,
      ngaySinh: PropTypes.string.isRequired,
    }).isRequired,
    field: PropTypes.oneOf(["hoTen", "email", "vaiTro", "ngaySinh"]).isRequired,
    type: PropTypes.string,
  };

  // Loading state cho rows
  if (loading) {
    return {
      columns,
      rows: [
        {
          id: (
            <MDBox display="flex" justifyContent="center" p={3} colSpan={6}>
              <CircularProgress size={40} />
            </MDBox>
          ),
          hoTen: "",
          email: "",
          vaiTro: "",
          ngaySinh: "",
          actions: "",
        },
      ],
      loading,
      totalUsers: 0,
    };
  }

  // Tạo rows từ dữ liệu đã phân trang
  const rows = paginatedUsers.map((user) => {
    const isEditing = editingId === user.id;

    return {
      id: (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {user.id}
        </MDTypography>
      ),
      hoTen: <EditableField user={user} field="hoTen" />,
      email: <EditableField user={user} field="email" type="email" />,
      vaiTro: <EditableField user={user} field="vaiTro" />,
      ngaySinh: <EditableField user={user} field="ngaySinh" />,
      actions: (
        <MDBox display="flex" alignItems="center" justifyContent="center">
          {isEditing ? (
            <>
              <IconButton
                size="small"
                color="success"
                onClick={() => handleSaveEdit(user.id)}
                sx={{ mr: 1 }}
                title="Lưu thay đổi"
                disabled={!canSave}
              >
                <SaveIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                color="error"
                onClick={handleCancelEdit}
                title="Hủy thay đổi"
              >
                <CancelIcon fontSize="small" />
              </IconButton>
            </>
          ) : (
            <>
              <IconButton
                size="small"
                color="primary"
                onClick={() => onEdit(user)}
                sx={{ mr: 1 }}
                title="Chỉnh sửa trong dialog"
              >
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                color="error"
                onClick={() => onDelete(user.id)}
                title="Xóa người dùng"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </>
          )}
        </MDBox>
      ),
    };
  });

  return {
    columns,
    rows,
    loading,
    totalUsers: filteredUsers.length,
  };
}

// Thêm PropTypes cho hook parameters
useTableData.propTypes = {
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onSort: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};
