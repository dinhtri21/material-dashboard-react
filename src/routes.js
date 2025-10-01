/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

/** 
  All of the routes for the Material Dashboard 2 React are added here,
  You can add a new route, customize the routes and delete the routes here.

  Once you add a new route on this file it will be visible automatically on
  the Sidenav.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav. 
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` prop is used for the name of the route on the Sidenav.
  5. The `key` prop is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` prop is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` prop is used for making a collapsible item on the Sidenav that has other routes
     inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` prop.
  8. The `route` prop is used for the route path on the browser.
  9. The `component` prop is used for the component to render.
*/

// Material Dashboard 2 React layouts
import Dashboard from "layouts/dashboard";
import Tables from "layouts/tables";
import Billing from "layouts/billing";
import RTL from "layouts/rtl";
import Notifications from "layouts/notifications";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
import UsersTable from "layouts/users-table";
import TodoList from "layouts/todo-list";
import UserTableAPI from "layouts/user-table-api";
import PuckEditor from "layouts/puck-editor";

// @mui icons
import Icon from "@mui/material/Icon";

// Protected Route Components
import ProtectedRoute from "components/ProtectedRoute";
import PublicRoute from "components/PublicRoute";

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
    protected: true, // Đánh dấu route cần bảo vệ
  },
  {
    type: "collapse",
    name: "Tables",
    key: "tables",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/tables",
    component: (
      <ProtectedRoute>
        <Tables />
      </ProtectedRoute>
    ),
    protected: true,
  },
  {
    type: "collapse",
    name: "Users Table",
    key: "users-table",
    icon: <Icon fontSize="small">people</Icon>,
    route: "/users-table",
    component: (
      <ProtectedRoute>
        <UsersTable />
      </ProtectedRoute>
    ),
    protected: true,
  },
  {
    type: "collapse",
    name: "User Table API",
    key: "user-table-api",
    icon: <Icon fontSize="small">people</Icon>,
    route: "/user-table-api",
    component: (
      <ProtectedRoute>
        <UserTableAPI />
      </ProtectedRoute>
    ),
    protected: true,
  },
  {
    type: "collapse",
    name: "Todo List",
    key: "todo-list",
    icon: <Icon fontSize="small">checklist</Icon>,
    route: "/todo-list",
    component: (
      <ProtectedRoute>
        <TodoList />
      </ProtectedRoute>
    ),
    protected: true,
  },
  {
    type: "collapse",
    name: "Puck Editor",
    key: "puck-editor",
    icon: <Icon fontSize="small">design_services</Icon>,
    route: "/puck-editor",
    component: (
      <ProtectedRoute>
        <PuckEditor />
      </ProtectedRoute>
    ),
    protected: true,
  },
  {
    type: "collapse",
    name: "Billing",
    key: "billing",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/billing",
    component: (
      <ProtectedRoute>
        <Billing />
      </ProtectedRoute>
    ),
    protected: true,
  },
  {
    type: "collapse",
    name: "RTL",
    key: "rtl",
    icon: <Icon fontSize="small">format_textdirection_r_to_l</Icon>,
    route: "/rtl",
    component: (
      <ProtectedRoute>
        <RTL />
      </ProtectedRoute>
    ),
    protected: true,
  },
  {
    type: "collapse",
    name: "Notifications",
    key: "notifications",
    icon: <Icon fontSize="small">notifications</Icon>,
    route: "/notifications",
    component: (
      <ProtectedRoute>
        <Notifications />
      </ProtectedRoute>
    ),
    protected: true,
  },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/profile",
    component: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
    protected: true,
  },
  {
    type: "collapse",
    name: "Sign In",
    key: "sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/authentication/sign-in",
    component: (
      <PublicRoute>
        <SignIn />
      </PublicRoute>
    ),
    protected: false, // Public route
  },
  {
    type: "collapse",
    name: "Sign Up",
    key: "sign-up",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/authentication/sign-up",
    component: (
      <PublicRoute>
        <SignUp />
      </PublicRoute>
    ),
    protected: false, // Public route
  },
];

export default routes;
