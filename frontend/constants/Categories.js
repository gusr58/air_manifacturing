

import {
  Movie,
  DrawOutlined,
  EmergencyRecordingOutlined,
  GroupsOutlined,
  SettingsApplicationsOutlined,
  ArtTrackOutlined,
  AutoFixHighOutlined,
  Groups2Outlined,
  CameraEnhanceTwoTone,
  Groups,
  VolumeUp,
  LightModeTwoTone,
  RecordVoiceOverTwoTone,
  AccessibilityTwoTone,
  WcTwoTone,
  MusicNoteTwoTone,
  CameraIndoorTwoTone,
  LocationCityTwoTone,
  DirectionsCarTwoTone,
  LiveTvTwoTone,
  ComputerTwoTone,
  LocalMoviesTwoTone,
  CameraOutdoorTwoTone,
  HomeRepairServiceTwoTone,
  AppRegistrationTwoTone,
  PhotoSizeSelectActualTwoTone,
  LocalShippingTwoTone,
  FoodBankTwoTone,
  ConstructionTwoTone,
  HeadphonesBatteryTwoTone,
  MosqueTwoTone,
  EditNoteTwoTone,
  MuseumTwoTone,
  BrushTwoTone,
  SecurityTwoTone,
  GavelTwoTone,
  DryCleaningTwoTone,
  CardTravelTwoTone,
  TwoWheelerTwoTone,
  SportsMmaTwoTone,
  AirportShuttleTwoTone,
  ApartmentTwoTone,
  SanitizerTwoTone,
  CleaningServicesTwoTone,
  AirplanemodeActive,
} from "@mui/icons-material";

export const CategoriesJSON = {
  teams: {
    CategoryTitle: "EKİPLER",
    SubCategories: [
      {
        subCategoryTitle: "Kanat Takımı",
        icon: <Movie />,
        urlPath: "/teams/teams-wings",
        id: "teams-wings",
      },
      {
        subCategoryTitle: "Gövde Takımı",
        icon: <DrawOutlined />,
        urlPath: "/teams/teams-body",
        id: "teams-body",
      },
      {
        subCategoryTitle: "Kuyruk Takımı",
        icon: <EmergencyRecordingOutlined />,
        urlPath: "/teams/tails",
        id: "teams-tails",
      },
      {
        subCategoryTitle: "Aviyonik Takımı",
        icon: <GroupsOutlined />,
        urlPath: "/teams/avionics",
        id: "teams-avionics",
      },
     
      {
        subCategoryTitle: "Montaj Takımı",
        icon: <Groups2Outlined />,
        urlPath: "/teams/teams-assembly",
        id: "teams-assembly",
      },
    ],
  },
  planes: { 
    CategoryTitle: "UÇAKLAR",
    SubCategories: [
      {
        subCategoryTitle: "TB2",
        icon: <AirplanemodeActive />,
        urlPath: "/planes/tb2",
        id: "tb2",
      },
      {
        subCategoryTitle: "TB3",
        icon: <AirplanemodeActive />,
        urlPath: "/planes/tb3",
        id: "tb3",
      },
      {
        subCategoryTitle: "AKINCI",
        icon: <AirplanemodeActive />,
        urlPath: "/planes/akinci",
        id: "akinci",
      },
      {
        subCategoryTitle: "KIZILELMA",
        icon: <AirplanemodeActive />,
        urlPath: "/planes/kizilelma",
        id: "kizilelma",
      },
    ],
  },
};
