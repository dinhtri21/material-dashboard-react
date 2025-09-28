import { useState } from "react";
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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: "Complete React project", completed: false },
    { id: 2, text: "Learn Material UI", completed: true },
    { id: 3, text: "Update portfolio website", completed: false },
  ]);

  const [newTodo, setNewTodo] = useState("");

  const handleToggle = (id) => {
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
    }
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      addTodo();
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Card>
        <MDBox pt={3} pb={3} px={3}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="Add new todo"
                variant="outlined"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </Grid>
            <Grid item xs={12} md={4}>
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
          <MDBox mt={3}>
            <List>
              {todos.map((todo) => (
                <ListItem
                  key={todo.id}
                  dense
                  divider
                  secondaryAction={
                    <IconButton edge="end" aria-label="delete" onClick={() => deleteTodo(todo.id)}>
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={todo.completed}
                      tabIndex={-1}
                      disableRipple
                      onChange={() => handleToggle(todo.id)}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={
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
                    }
                  />
                </ListItem>
              ))}
            </List>
          </MDBox>
        </MDBox>
      </Card>
    </DashboardLayout>
  );
}

export default TodoList;
