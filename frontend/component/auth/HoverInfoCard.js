import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";

const HoverInfoCard = ({ infoText, children }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <Box
      sx={{
        position: "relative",
        backgroundColor: isHovered ? "white" : "inherit",
        color: isHovered ? "black" : "inherit",
        transition: "background-color 0.3s, color 0.3s",
        cursor: "pointer",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isHovered && (
        <Typography
          sx={{
            borderRadius: "20px",
            position: "absolute",
            top: "100%",
            left: 0,
            width: "100%",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            color: "black",
            padding: "10px",
            boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.2)",
            zIndex: 1,
            textAlign: "center",
          }}
        >
          {infoText}
        </Typography>
      )}
    </Box>
  );
};

export default HoverInfoCard;
