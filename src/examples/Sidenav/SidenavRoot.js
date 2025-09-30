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

// @mui material components
import Drawer from "@mui/material/Drawer";
import { styled } from "@mui/material/styles";

export default styled(Drawer)(({ theme, ownerState }) => {
  const { palette, boxShadows, transitions, breakpoints, functions } = theme;
  const { transparentSidenav, whiteSidenav, miniSidenav, darkMode } = ownerState;

  const sidebarWidth = 250;
  const { transparent, gradients, white, background } = palette;
  const { xxl } = boxShadows;

  // Safeguard để tránh lỗi khi functions undefined
  const { pxToRem, linearGradient } = functions || {};

  let backgroundValue = darkMode
    ? background.sidenav
    : linearGradient
    ? linearGradient(gradients.dark.main, gradients.dark.state)
    : gradients.dark.main;

  if (transparentSidenav) {
    backgroundValue = transparent.main;
  } else if (whiteSidenav) {
    backgroundValue = white.main;
  }

  // styles for the sidenav when miniSidenav={false}
  const drawerOpenStyles = () => ({
    background: backgroundValue,
    transform: "translateX(0)",
    transition: transitions.create("transform", {
      easing: transitions.easing.sharp,
      duration: transitions.duration.shorter,
    }),

    [breakpoints.up("xl")]: {
      boxShadow: transparentSidenav ? "none" : xxl,
      marginBottom: transparentSidenav ? 0 : "inherit",
      left: "0",
      width: sidebarWidth,
      transform: "translateX(0)",
      transition: transitions.create(["width", "background-color"], {
        easing: transitions.easing.sharp,
        duration: transitions.duration.enteringScreen,
      }),
    },
  });

  // styles for the sidenav when miniSidenav={true}
  const drawerCloseStyles = () => ({
    background: backgroundValue,
    transform: pxToRem ? `translateX(${pxToRem(-320)})` : `translateX(-320px)`,
    transition: transitions.create("transform", {
      easing: transitions.easing.sharp,
      duration: transitions.duration.shorter,
    }),

    [breakpoints.up("xl")]: {
      boxShadow: transparentSidenav ? "none" : xxl,
      marginBottom: transparentSidenav ? 0 : "inherit",
      left: "0",
      width: pxToRem ? pxToRem(96) : "96px",
      overflowX: "hidden",
      transform: "translateX(0)",
      transition: transitions.create(["width", "background-color"], {
        easing: transitions.easing.sharp,
        duration: transitions.duration.shorter,
      }),
    },
  });

  return {
    "& .MuiDrawer-paper": {
      boxShadow: xxl,
      border: "none",

      ...(miniSidenav ? drawerCloseStyles() : drawerOpenStyles()),
    },
  };
});
