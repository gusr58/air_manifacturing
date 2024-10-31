import React, { useState, useEffect, useContext } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import { useRouter } from "next/navigation";
import { mainColor, mainTextColor } from "@/constants/Colors";
import API from "@/helpers/ApiBuilder";
import AppContext from "@/AppContext";
import Cookies from "js-cookie";
import { BackendMediaPath } from "@/constants/BackendValues";

function ResponsiveAppBar() {
  const { userInfo, setUserInfo } = useContext(AppContext);
  const router = useRouter();
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [user, setUser] = useState(null);
  const [photoPath, setPhotoPath] = useState("/static/images/avatar/2.jpg");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const curentUserSource = await API.get(
          "get_current_user",
          Cookies.get("accessToken")
        );
        const curentUser = curentUserSource.data;

        if (curentUser) {
          setUser(curentUser?.email);
          setUserInfo({
            user: curentUser,
            loggedIn: curentUser?.email ? true : false,
          });
          setPhotoPath(BackendMediaPath + curentUser?.photo);
        }
      } catch (error) {
        console.info("Not logged in");
      }
    };
    fetchData();
  }, [userInfo?.user?.photo, Cookies.get("accessToken")]);

  const handleLogout = () => {
    Cookies.remove("accessToken");
    setUser(null);
    setUserInfo({ user: null, loggedIn: false });
    handleCloseUserMenu(); // Close the user menu
    router.push("/login");
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const redirectToLogin = () => {
    router.push("/login");
  };

  const redirectToRegister = () => {
    router.push("/register");
  };

  return (
    <AppBar component="nav" sx={{ backgroundColor: mainColor }}>
      <Toolbar disableGutters>
        <img
          src="/logoy.png"
          alt="Topfıyt"
          onClick={() => router.push("/")}
          style={{
            width: "40px",
            height: "50px",
            marginRight: "1px",
            cursor: "pointer",
          }}
        />
        <Box sx={{ flexGrow: 1 }} />
        {!user ? (
          <>
            <MenuItem onClick={redirectToLogin}>
              <Typography textAlign="center">Giriş Yap</Typography>
            </MenuItem>
            <MenuItem onClick={redirectToRegister}>
              <Typography textAlign="center">Kayıt Ol</Typography>
            </MenuItem>
          </>
        ) : (
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Hesap">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="kullanıcı fotoğrafı" src={photoPath} />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
              PaperProps={{
                style: {
                  backgroundColor: mainColor,
                },
              }}
            >
              <MenuItem
                onClick={() => {
                  router.push("/profile");
                  handleCloseUserMenu();
                }}
                style={{ background: mainColor, color: mainTextColor }}
              >
                <Typography textAlign="center">Profil</Typography>
              </MenuItem>
              <MenuItem
                onClick={handleLogout}
                style={{ background: mainColor, color: mainTextColor }}
              >
                <Typography textAlign="center">Çıkış Yap</Typography>
              </MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default ResponsiveAppBar;
