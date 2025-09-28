import { useState, useEffect } from "react";
import {
  Card,
  Checkbox,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

function TodoList() {
  // Load todos localStorage or []
  const loadTodos = () => {
    const savedTodos = localStorage.getItem("todos");
    return savedTodos ? JSON.parse(savedTodos) : [];
  };

  const [todos, setTodos] = useState(loadTodos);

  const [newTodo, setNewTodo] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [snackbars, setSnackbars] = useState([]);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

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

  const handleToggle = (id) => {
    const todo = todos.find((t) => t.id === id);
    setTodos(
      todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo))
    );
  };

  const addTodo = () => {
    if (newTodo.trim() !== "") {
      const newToDoItem = {
        id: Date.now(),
        text: newTodo,
        completed: false,
      };
      setTodos([...todos, newToDoItem]);
      setNewTodo("");
      showSnackbar("Đã thêm công việc thành công!", "success");
    }
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
    showSnackbar("Đã xóa công việc thành công!", "error");
  };

  const startEdit = (id, text) => {
    setEditingId(id);
    setEditingText(text);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText("");
  };

  const saveEdit = () => {
    if (editingText.trim() !== "") {
      setTodos(
        todos.map((todo) => (todo.id === editingId ? { ...todo, text: editingText } : todo))
      );
      showSnackbar("Đã cập nhật công việc thành công!", "success");
      setEditingId(null);
      setEditingText("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      addTodo();
    }
  };

  const handleEditKeyDown = (e) => {
    if (e.key === "Enter") {
      saveEdit();
    } else if (e.key === "Escape") {
      cancelEdit();
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Card sx={{ maxWidth: 800, mx: "auto", mt: 4, mb: 4 }}>
        <MDBox pt={3} pb={3} px={3}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={9}>
              <TextField
                fullWidth
                label="Add new todo"
                variant="outlined"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <MDButton
                fullWidth
                variant="gradient"
                color="info"
                onClick={addTodo}
                sx={{ height: "100%" }}
              >
                Add
              </MDButton>
            </Grid>
          </Grid>
          <MDBox px={2} mt={2}>
            <List>
              {todos.map((todo) => (
                <ListItem
                  key={todo.id}
                  dense
                  secondaryAction={
                    <MDBox display="flex" gap={1}>
                      {editingId === todo.id ? (
                        <>
                          <IconButton
                            edge="end"
                            aria-label="save"
                            onClick={saveEdit}
                            color="success"
                          >
                            <SaveIcon />
                          </IconButton>
                          <IconButton
                            edge="end"
                            aria-label="cancel"
                            onClick={cancelEdit}
                            color="error"
                          >
                            <CancelIcon />
                          </IconButton>
                        </>
                      ) : (
                        <>
                          <IconButton
                            edge="end"
                            aria-label="edit"
                            onClick={() => startEdit(todo.id, todo.text)}
                            color="info"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() => deleteTodo(todo.id)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </>
                      )}
                    </MDBox>
                  }
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Checkbox
                      edge="start"
                      checked={todo.completed}
                      tabIndex={-1}
                      disableRipple
                      onChange={() => handleToggle(todo.id)}
                      disabled={editingId === todo.id}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      editingId === todo.id ? (
                        <TextField
                          fullWidth
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          onKeyDown={handleEditKeyDown}
                          variant="standard"
                          autoFocus
                          sx={{
                            pr: 2,
                          }}
                        />
                      ) : (
                        <MDTypography
                          variant="button"
                          fontWeight="medium"
                          sx={{
                            textDecoration: todo.completed ? "line-through" : "none",
                            opacity: todo.completed ? 0.6 : 1,
                          }}
                        >
                          {todo.text}
                        </MDTypography>
                      )
                    }
                  />
                </ListItem>
              ))}
            </List>
          </MDBox>
        </MDBox>
      </Card>

      {/* Notifications */}
      {snackbars.map((snackbar, index) => (
        <Snackbar
          key={snackbar.id}
          open={snackbar.open}
          autoHideDuration={3000}
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

export default TodoList;
