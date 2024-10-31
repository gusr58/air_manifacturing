import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Tab,
  Tabs,
  Paper,
  CircularProgress,
  Alert,
  IconButton,
} from "@mui/material";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import API from "@/helpers/ApiBuilder";
import AppContext from "@/AppContext";
import { BackendMediaPath } from "@/constants/BackendValues";
import Divider from "@mui/material/Divider";
import { useIsMobile } from "@/constants/Main";
import {
  Person,
  Face2,
  Work,
  SlowMotionVideo,
  ConnectWithoutContact,
  DirectionsRun,
  Place,
} from "@mui/icons-material";
import GeneralInfoContent from "@/component/auth/profile/GeneralInfoContent ";
import PhysicalFeaturesContent from "@/component/auth/profile/PhysicalFeaturesContent ";
import ContactInformation from "@/component/auth/profile/ContactInformation ";
import SocialMediaAccounts from "@/component/auth/profile/SocialMediaAccounts ";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Badge from "@mui/material/Badge";
import GeneralTable from "@/component/auth/profile/GeneralTable";
import PartTable from "@/component/auth/profile/PartTable";

const DetailPage = () => {
  const [selectedTab, setSelectedTab] = React.useState("1");
  const { router, query } = useRouter();
  const { userInfo } = useContext(AppContext);
  const userId = query.pathItem;
  const isMobile = useIsMobile(800);

  // Use state to manage the artist profile
  const [Profile, setProfile] = useState(null);

  useEffect(() => {
    // Define an async function to fetch data
    async function fetchProfile() {
      if (userInfo.user === null) {
        return;
      }
      if (!userInfo.loggedIn) {
        router.push("/login");
        return;
      }
      const accessToken = Cookies.get("accessToken");
      if (accessToken && userId) {
        const profile = await API.get(`get_profile/${userId}/`, accessToken);
        setProfile(profile?.data);
      }
    }
    fetchProfile();
    return () => {
      // Any cleanup logic goes here
    };
  }, [userInfo, router, userId]);

  if (!userInfo) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  } else if (Profile?.error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Alert severity="warning">
          <Typography variant="h6">{Profile?.error}</Typography>
        </Alert>
      </Box>
    );
  }

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <Box
      sx={{
        marginTop: "95px",
        p: 3,
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      {Profile && (
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} md={4} lg={3}>
            <Card sx={{minHeight:"760px"}}>
              <CardContent>
                <Box sx={{ textAlign: "center" }}>
                  <Avatar
                    alt={`${Profile.first_name} ${Profile.last_name}`}
                    src={
                      BackendMediaPath + Profile.photo ||
                      "path/to/default/image.jpg"
                    }
                    sx={{
                      width: { xs: "50vw", sm: "30vw", md: 200 },
                      height: { xs: "50vw", sm: "30vw", md: 200 },
                      margin: 2,
                    }}
                  />
                </Box>
                <Divider sx={{ bgcolor: "black", my: 1 }} />
                <Typography variant="h6">
                  {" "}
                  <Person sx={{ fontSize: 33 }} /> Kisisel bilgiler
                </Typography>
                <Typography variant="body1" m={2}>
                  <Typography
                    component="span"
                    variant="body1"
                    sx={{ fontWeight: "bold" }}
                  >
                    {" "}
                    Telefon numarasi:
                  </Typography>{" "}
                  {Profile?.phone}
                </Typography>

                <Typography variant="body1" m={2}>
                  <Typography
                    component="span"
                    variant="body1"
                    sx={{ fontWeight: "bold" }}
                  >
                    {" "}
                    Uyruk:
                  </Typography>{" "}
                  {Profile?.citizen}
                </Typography>
                
              </CardContent>
            </Card>
          </Grid>

          {/* Sağ taraf: Üst Alan ve Tablar İçerik */}
          <Grid item xs={12} md={8} lg={9}>
            <Paper square >
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{
                    mt: 1,
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  {`${Profile.first_name} ${Profile.last_name}`}{" "}
                  <Box component="span" sx={{ mx: 1 }}>
                    -
                  </Box>
                  <Place sx={{ fontSize: 21 }} />
                  {`${Profile?.citizen}`}
                </Typography>
                <IconButton color="inherit">
                  <Typography sx={{ p: 2 }}>favoriye alınma sayısı:</Typography>
                  <Badge badgeContent={4} color="secondary">
                    <FavoriteIcon sx={{ color: "red", margin: "5px" }} />
                  </Badge>
                </IconButton>
              </CardContent>
            </Paper>

            <Paper square sx={{ marginTop: "10px", minHeight:"600px" }}>
              <Tabs
                value={selectedTab}
                indicatorColor="primary"
                textColor="primary"
                onChange={handleTabChange}
                aria-label="profile tabs"
                variant="fullWidth"
              >
                <Tab label="sosyal medya" value="0" />
                <Tab label="HAKKIMDA" value="1" />
                <Tab label="İLETİŞİM BİLGİLERİ" value="2" />
                <Tab label="Üretilen Parçalar" value="3"/>
              </Tabs>

              <Card sx={{ mt: 2 }}>
                <CardContent>
                  {selectedTab === "0" && (
                    <SocialMediaAccounts Profile={Profile} />
                  )}
                  {selectedTab === "1" && (
                    <Grid item xs={6}>
                      <Typography>{Profile?.introduction}</Typography>
                    </Grid>
                  )}
                  {selectedTab === "2" && (
                    <ContactInformation Profile={Profile} />
                  )}
                  {selectedTab === "3" && (
                  <PartTable/>
                  )}
                  {selectedTab === "4" && (
                    <img
                      src={Profile ? BackendMediaPath + Profile.photo : ""}
                      style={{
                        width: "100%",
                        height: "250px",
                        display: "block",
                        objectFit: "cover",
                      }}
                    />
                  )}
                </CardContent>
              </Card>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default DetailPage;
