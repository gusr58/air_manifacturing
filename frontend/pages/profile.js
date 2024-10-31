import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Drawer,
  IconButton,
  Switch,
  Tabs,
  Tab,
  Avatar,
} from "@mui/material";
import { useRouter } from "next/router";
import {
  Settings,
  Close,
  VideoCameraFront,
  PhotoCamera,
} from "@mui/icons-material";
import GeneralInfoContent from "@/component/auth/profile/GeneralInfoContent ";
import PhysicalFeaturesContent from "@/component/auth/profile/PhysicalFeaturesContent ";
import ContactInformation from "@/component/auth/profile/ContactInformation ";
import SocialMediaAccounts from "@/component/auth/profile/SocialMediaAccounts ";
import EditProfileForm from "@/component/auth/profile/EditProfileForm";
import GeneralTable from "@/component/auth/profile/GeneralTable";
import { BASE_URL } from "@/constants/BackendValues";
import { useIsMobile } from "@/constants/Main";
import Cookies from "js-cookie";
import API from "@/helpers/ApiBuilder";
import AppContext from "@/AppContext";
import { BackendMediaPath } from "@/constants/BackendValues";
import { experienceColumns,partsColumns  } from "@/constants/Columns";
import Tooltip from "@mui/material/Tooltip";
import PartCreationForm from "@/component/auth/profile/PartCreationForm";


function Profile() {
  const router = useRouter();
  const { userInfo, setUserInfo } = useContext(AppContext);
  const [isSwitchChecked, setIsSwitchChecked] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editedProfileData, setEditedProfileData] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [Profile, setProfile] = useState(null);
  const isMobile = useIsMobile(800);
  const [experiences, setExperiences] = useState([]);
  const updateEndpoint = "update_profile";
  const isArtist =
    userInfo &&
    userInfo.user &&
    userInfo.user.user_role &&
    userInfo.user.user_role.includes("artists");
    const [producedParts, setProducedParts] = useState([]);
  useEffect(() => {
    async function fetchProfileData() {
      if (userInfo.user === null) {
        return;
      }
      if (!userInfo.loggedIn) {
        router.push("/login");
        return;
      }
      const accessToken = Cookies.get("accessToken");
      if (!accessToken) {
        console.log("Access token bulunamadı.");
        return;
      }
      try {
        const response = await API.get("get_profile", accessToken);
        if (response && response.data) {
          setProfile(response.data);
          setIsSwitchChecked(response.data.is_active);
        }
      } catch (error) {
        console.error("Profil bilgisi yüklenirken bir hata oluştu:", error);
      }
    }

    fetchProfileData();
  }, [userInfo, router]);
  useEffect(() => {
    async function fetchProducedParts() {
      const accessToken = Cookies.get("accessToken");
      if (!accessToken) {
        console.log("Access token bulunamadı.");
        return;
      }

      try {
        const response = await API.get("get_parts", accessToken); // Replace with your actual endpoint
        if (response && response.data) {
          setProducedParts(response.data); // Set produced parts data
        }
      } catch (error) {
        console.error("Parça bilgileri yüklenirken bir hata oluştu:", error);
      }
    }

    fetchProducedParts(); // Call the function to fetch produced parts
  }, []); 
  if (!userInfo) {
    return <Box sx={{ marginTop: 10 }}>Loading...</Box>;
  }
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };
  const handleEditClick = () => {
    setDrawerOpen(true);

    setEditedProfileData(Profile || {});
  };
  /**
   * Recursively replaces all null values in an object with empty strings.
   * @param {Object} obj - The object to be processed.
   */
  const replaceNulls = (obj) => {
    Object.keys(obj).forEach((key) => {
      if (obj[key] === null) {
        obj[key] = "";
      } else if (typeof obj[key] === "object" && obj[key] !== null) {
        replaceNulls(obj[key]);
      }
    });
  };
  const handleSave = async (updatedProfile) => {
    replaceNulls(updatedProfile);
    delete updatedProfile["is_active"];
    const accessToken = Cookies.get("accessToken");
    if (accessToken) {
      await API.post(updateEndpoint, updatedProfile, accessToken);
      setProfile(updatedProfile);
      setDrawerOpen(false);
    }
  };

  const handleCancel = () => {
    setDrawerOpen(false);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const AboutContent = () => (
    <Box sx={{ margin: "auto", maxWidth: "300px", textAlign: "center" }}>
      <Typography
        variant="h5"
        sx={{
          fontSize: "2rem",
          fontFamily: "Varela Round",
          textAlign: "center",
        }}>
        Hakkımda
      </Typography>
      <Typography sx={{ marginBottom: "10px", fontSize: "1rem" }}>
        {Profile ? Profile.introduction : ""}
      </Typography>
    </Box>
  );
  const handleCameraClick = async () => {
    try {
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = "image/*";

      fileInput.onchange = async (e) => {
        const file = e.target.files[0];
        if (file) {
          const formData = new FormData();
          formData.append("avatar", file);
          const jwtToken = Cookies.get("accessToken");
          try {
            const response = await fetch(`${BASE_URL}${updateEndpoint}`, {
              method: "POST",
              headers: jwtToken
                ? {
                    Authorization: `Bearer ${jwtToken}`,
                  }
                : {},
              body: formData,
            });

            if (response.ok) {
              const dataSource = await response.json();
              const data = dataSource.data;

              setProfile((prevState) => ({
                ...prevState,
                photo: data.photo,
              }));
              setUserInfo((prevUserInfo) => ({
                ...prevUserInfo,
                user: {
                  ...prevUserInfo.user,
                  photo: data.photo,
                },
              }));
            } else {
              console.error(
                "Profil fotoğrafı güncellenirken hata oluştu:",
                response.status
              );
            }
          } catch (error) {
            console.error("Profil fotoğrafı güncelleme hatası:", error);
          }
          document.body.removeChild(fileInput);
        }
      };
      document.body.appendChild(fileInput);
       fileInput.click();
    } catch (error) {
      console.error("Dosya seçme hatası:", error);
    }
  };

  const handleVideoClick = async () => {
    try {
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = "video/*";

      fileInput.onchange = async (e) => {
        const file = e.target.files[0];
        if (file) {
          const formData = new FormData();
          formData.append("video", file);
          const jwtToken = Cookies.get("accessToken");
          try {
            const response = await fetch(`${BASE_URL}${updateEndpoint}`, {
              method: "POST",
              headers: jwtToken
                ? {
                    Authorization: `Bearer ${jwtToken}`,
                  }
                : {},
              body: formData,
            });
            if (response.ok) {
              const dataSource = await response.json();
              const data = dataSource.data;
              setProfile((prevState) => ({
                ...prevState,
                video: data.video,
              }));
            } else {
              console.error(
                "Profil fotoğrafı güncellenirken hata oluştu:",
                response.status
              );
            }
          } catch (error) {
            console.error("Profil fotoğrafı güncelleme hatası:", error);
          }
          document.body.removeChild(fileInput);
        }
      };
      document.body.appendChild(fileInput);
      fileInput.click();
    } catch (error) {
      console.error("Dosya seçme hatası:", error);
    }
  };
  //experiance istekleri
  useEffect(() => {
    async function fetchExperiences() {
      const accessToken = Cookies.get("accessToken"); // Token'ı cookie'den al
      if (!accessToken) {
        console.log("Access token bulunamadı.");
        return;
      }

      try {
        // API yardımcı fonksiyonunuzu kullanarak isteği yapın
        const response = await API.get("get_experience", accessToken);
        if (response && response.data) {
          setExperiences(response.data); // State'i API'den gelen verilerle güncelleyin
        }
      } catch (error) {
        console.error("Deneyim bilgileri yüklenirken bir hata oluştu:", error);
      }
    }

    fetchExperiences();
  }, []);
  /**
   * Creates a new experience with the provided data.
   * @param {Object} experienceData - The data for the new experience.
   * @returns {Promise<Object>} A promise that resolves to an object containing either a success message or an error.
   */
  const handleCreateExperience = async (experienceData) => {
    try {
      const accessToken = Cookies.get("accessToken");
      const response = await API.post(
        "create_experience",
        experienceData,
        accessToken
      );
      return response.error ? { error: response.error } : response;
    } catch (error) {
      console.error("Deneyim oluşturulurken bir hata oluştu:", error);
      return { error: error };
    }
  };
  /**
   * Updates an existing experience by its ID.
   * @param {string} experienceId - The ID of the experience to update.
   * @param {Object} updatedData - The updated data for the experience.
   * @returns {Promise<Object>} A promise that resolves to an object containing either a success message or an error.
   */
  const handleUpdateExperience = async (experienceId, updatedData) => {
    try {
      const accessToken = Cookies.get("accessToken");
      const response = await API.post(
        `update_experience/${experienceId}`,
        updatedData,
        accessToken
      );
      return response.error ? { error: response.error } : response;
      // Burada güncellenen deneyimle ilgili geri dönüş yapabilirsiniz.
    } catch (error) {
      console.error("Deneyim güncellenirken bir hata oluştu:", error);
      return { error: error };
    }
  };
  /**
   * Deletes an experience by its ID.
   * @param {string} experienceId - The ID of the experience to delete.
   * @returns {Promise<Object>} A promise that resolves to an object containing either a success message or an error.
   */
  const handleDeleteExperience = async (experienceId) => {
    try {
      const accessToken = Cookies.get("accessToken");
      const response = await API.delete(
        `delete_experience/${experienceId}`,
        accessToken
      );
      return response.error ? { error: response.error } : response;
    } catch (error) {
      console.error("Deneyim silinirken bir hata oluştu:", error);
      return { error: error };
    }
  };
  const handleCreatePart = async (partData) => {
    const accessToken = Cookies.get("accessToken");
    const response = await API.post("create_part", partData, accessToken);
    if (response && response.data) {
      setProducedParts((prev) => [...prev, response.data]);
    }
  };

  const handleUpdatePart = async (partId, updatedData) => {
    const accessToken = Cookies.get("accessToken");
    const response = await API.post(`update_part/${partId}`, updatedData, accessToken);
    if (response && response.data) {
      setProducedParts((prev) =>
        prev.map((part) => (part.id === partId ? response.data : part))
      );
    }
  };

  const handleDeletePart = async (partId) => {
    const accessToken = Cookies.get("accessToken");
    await API.delete(`delete_part/${partId}`, accessToken);
    setProducedParts((prev) => prev.filter((part) => part.id !== partId));
  };
  const handleActiveChange = async (event) => {
    const newActiveStatus = event.target.checked;

    try {
      const accessToken = Cookies.get("accessToken");
      if (accessToken) {
        const accessToken = Cookies.get("accessToken");
        let responseSource = await API.post(
          updateEndpoint,
          { is_active: newActiveStatus },
          accessToken
        );
        let response = responseSource.data;
        if (response?.error) {
          console.error(
            "Aktif durumu güncellenirken hata oluştu:",
            response.status
          );
          setIsSwitchChecked(Profile.is_active);
        } else {
          setIsSwitchChecked(response.is_active);
        }
      }
    } catch (error) {
      console.error("Aktif durumu güncelleme hatası:", error);
      setIsSwitchChecked(Profile.is_active);
    }
  };
  const tabContents = [
    {
      label: "Genel Bilgiler",
      content: <GeneralInfoContent Profile={Profile} />,
    },
    isArtist && {
      label: "Fiziksel Özellikler",
      content: <PhysicalFeaturesContent Profile={Profile} />,
    },
    {
      label: "Sosyal Medya Hesapları",
      content: <SocialMediaAccounts Profile={Profile} />,
    },
    {
      label: "İletişim Bilgileri",
      content: <ContactInformation Profile={Profile} />,
    },
    {
      label: "Deneyimler",
      content: (
        <GeneralTable
          columns={experienceColumns}
          tableData={experiences}
          tableOnCreate={handleCreateExperience}
          tableOnUpdate={handleUpdateExperience}
          tableOnDelete={handleDeleteExperience}
        />
      ),
    },
    {
      label: "Üretilen Parçalar",
      content: (
        <GeneralTable
          columns={partsColumns}
          tableData={producedParts}
          tableOnCreate={handleCreatePart} // Implement these functions
          tableOnUpdate={handleUpdatePart}
          tableOnDelete={handleDeletePart}
        />
      ),
    },
    {
      label: "Parça Üret",
      content: (
        <PartCreationForm 
          // onProduce={handleProducePart} // Implement this function
        />
      ),
    },
  ].filter(Boolean);
  return (
    <Box p={5}>
      {Profile && (
        <Box>
          <Typography
            variant="h6"
            sx={{
              marginTop: 5,
              textAlign: "center",
              fontSize: "3rem",
              fontFamily: "Varela Round",
            }}
            gutterBottom>
            Profil
          </Typography>
          <Box
            sx={{
              position: "absolute",
              right: 40,
              top: 90,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Switch
                  checked={isSwitchChecked}
                  onChange={handleActiveChange}
                />
              </Box>
              <Tooltip title="Ayarlar">
                <IconButton
                  aria-label="ayarlar"
                  onClick={() => {
                    handleClose();
                    handleEditClick();
                  }}
                  sx={{ width: 50 }}>
                  <Settings />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 3,
              marginLeft: isMobile ? "" : "150px",
            }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginRight: { md: 3 },
              }}>
              <Box sx={{ position: "relative", display: "inline-block" }}>
                <Avatar
                  src={Profile ? BackendMediaPath + Profile.photo : ""}
                  sx={{
                    width: 200,
                    height: 200,
                    border: "2px solid #fff",
                    borderRadius: "50%",
                    position: "relative",
                  }}
                />
                <IconButton
                  color="primary"
                  onClick={handleCameraClick}
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    border: "2px solid #3f51b5",
                    backgroundColor: "background.paper",
                    borderRadius: "50%",
                    zIndex: 1,
                  }}>
                  <PhotoCamera />
                </IconButton>
              </Box>
              <Box sx={{ textAlign: "center", marginTop: 2 }}>
                <Typography variant="h6" gutterBottom>
                  {userInfo && userInfo.user
                    ? `${userInfo.user.first_name} ${userInfo.user.last_name}`
                    : ""}
                </Typography>
                <Typography>
                  {" "}
                  {userInfo && userInfo.user ? userInfo.user.email : ""}{" "}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ width: { xs: "100%", md: "50%" }, textAlign: "center" }}>
              <AboutContent />
            </Box>

            <Box
              sx={{
                position: "relative",
                width: { xs: "100%", md: "40%" },
                height: "auto",
                margin: 2,
              }}>
              <video
                controls
                key={Profile ? Profile.video : "default-key"}
                style={{ width: "100%", height: "auto", maxHeight: "325px" }}>
                <source
                  src={Profile ? BackendMediaPath + Profile.video : ""}
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
              <IconButton
                color="secondary"
                onClick={handleVideoClick}
                sx={{
                  position: "absolute",
                  bottom: 0,
                  right: isMobile ? "" : -10,
                  border: "2px solid #3f51b5",
                  backgroundColor: "background.paper",
                  borderRadius: "50%",
                }}>
                <VideoCameraFront />
              </IconButton>
            </Box>
          </Box>

          <Box sx={{ marginTop: 15, textAlign: "center" }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              centered={!isMobile}
              variant={isMobile ? "scrollable" : "standard"}
              scrollButtons="auto">
              {tabContents.map((tab, index) => (
                <Tab key={index} label={tab.label} />
              ))}
            </Tabs>

            {tabContents[activeTab] && tabContents[activeTab].content}
          </Box>

          <Drawer
            anchor="right"
            open={drawerOpen}
            onClose={toggleDrawer(false)}>
            <Box sx={{ width: isMobile ? "100%" : 750 }} role="presentation">
              <IconButton
                onClick={() => setDrawerOpen(false)}
                sx={{ position: "absolute", left: 8, top: 8 }}>
                <Close />
              </IconButton>
              <Typography
                sx={{ textAlign: "center", pt: 3 }}
                variant="h6"
                noWrap>
                Profili Düzenle
              </Typography>
              <EditProfileForm
                profile={editedProfileData}
                onSave={handleSave}
                onCancel={handleCancel}
                isArtist={isArtist}
              />
            </Box>
          </Drawer>
        </Box>
      )}
    </Box>
  );
}
export default Profile;
