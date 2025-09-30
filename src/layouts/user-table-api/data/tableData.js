import { useMemo, useState } from "react";
import { TableSortLabel, IconButton, CircularProgress, TextField } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import EmailIcon from "@mui/icons-material/Email";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import PropTypes from "prop-types";

import { createUserValidationSchema } from "../validation/userSchema";

// Table Cell Components with PropTypes
const AvatarCell = ({ value }) => <Avatar src={value} sx={{ width: 40, height: 40 }} />;

AvatarCell.propTypes = {
  value: PropTypes.string,
};

export default function useTableData({
  users,
  loading,
  searchTerm,
  onEdit,
  onDelete,
  onSort,
  onUpdate,
  orderBy = "id",
  order = "asc",
}) {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [validationErrors, setValidationErrors] = useState({});

  // Tạo validation schema cho inline editing
  const validationSchema = useMemo(() => {
    return createUserValidationSchema(users, editingId);
  }, [users, editingId]);

  // Tạo header với chức năng sort
  const createSortableHeader = (label, accessor) => {
    const canSort = ["first_name", "last_name", "email"];

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
      width: "5%",
      align: "center",
    },
    {
      Header: createSortableHeader("Avatar", "avatar"),
      accessor: "avatar",
      width: "10%",
      align: "center",
    },
    {
      Header: createSortableHeader("Tên", "first_name"),
      accessor: "first_name",
      width: "20%",
      align: "left",
    },
    {
      Header: createSortableHeader("Họ", "last_name"),
      accessor: "last_name",
      width: "20%",
      align: "left",
    },
    {
      Header: createSortableHeader("Email", "email"),
      accessor: "email",
      width: "30%",
      align: "left",
    },

    {
      Header: (
        <MDTypography
          variant="caption"
          fontWeight="bold"
          textTransform="uppercase"
          color="secondary"
        >
          Hành động
        </MDTypography>
      ),
      accessor: "actions",
      width: "15%",
      align: "center",
    },
  ];

  // Filter users
  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      `${user.first_name} ${user.last_name} ${user.email}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  // Sort users
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

  // Validation functions
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
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      job: user.job || "Developer",
    });
    setValidationErrors({});
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({});
    setValidationErrors({});
  };

  const handleSaveEdit = async (userId) => {
    const isValid = await validateAllFields(editData);

    if (!isValid) {
      return;
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
    await validateField(field, value, newData);
  };

  // Check if can save
  const canSave = useMemo(() => {
    const hasErrors = Object.values(validationErrors).some(
      (error) => error !== null && error !== undefined
    );
    const hasAllFields =
      editData.first_name && editData.last_name && editData.email && editData.job;
    return !hasErrors && hasAllFields;
  }, [validationErrors, editData]);

  // Editable Field Component
  const EditableField = ({ user, field, type = "text" }) => {
    const isEditing = editingId === user.id;
    const value = user[field];
    const error = validationErrors[field];

    if (isEditing) {
      return (
        <TextField
          size="small"
          type={type}
          value={editData[field]}
          onChange={(e) => handleFieldChange(field, e.target.value)}
          onBlur={() => validateField(field, editData[field])}
          fullWidth
          sx={{ minWidth: field === "first_name" || field === "last_name" ? 120 : 150 }}
          inputProps={{
            style: { fontSize: "0.75rem" },
          }}
          error={!!error}
          helperText={error}
        />
      );
    }

    const handleClick = () => {
      handleStartEdit(user);
    };

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
        title={`Click để chỉnh sửa ${
          field === "first_name" ? "tên" : field === "last_name" ? "họ" : "email"
        }`}
      >
        {value}
      </MDTypography>
    );
  };

  EditableField.propTypes = {
    user: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      first_name: PropTypes.string.isRequired,
      last_name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      job: PropTypes.string,
      avatar: PropTypes.string,
    }).isRequired,
    field: PropTypes.oneOf(["first_name", "last_name", "email", "job"]).isRequired,
    type: PropTypes.string,
  };

  // Actions Cell Component
  const ActionsCell = ({ user }) => {
    const isEditing = editingId === user.id;

    return (
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
            <IconButton size="small" color="error" onClick={handleCancelEdit} title="Hủy thay đổi">
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
    );
  };

  ActionsCell.propTypes = {
    user: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    }).isRequired,
  };

  // Loading state
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
          avatar: "",
          first_name: "",
          last_name: "",
          email: "",
          actions: "",
        },
      ],
      loading,
      totalUsers: 0,
    };
  }

  // Create rows from sorted data
  const rows = sortedUsers.map((user) => ({
    id: (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {user.id}
      </MDTypography>
    ),
    avatar: <AvatarCell value={user.avatar} />,
    first_name: <EditableField user={user} field="first_name" />,
    last_name: <EditableField user={user} field="last_name" />,
    email: <EditableField user={user} field="email" type="email" />,
    actions: <ActionsCell user={user} />,
  }));

  return {
    columns,
    rows,
    loading,
    totalUsers: filteredUsers.length,
  };
}

useTableData.propTypes = {
  users: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  searchTerm: PropTypes.string.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onSort: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  orderBy: PropTypes.string,
  order: PropTypes.string,
};
