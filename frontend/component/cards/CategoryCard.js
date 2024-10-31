import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import HoverInfoCard from "../auth/HoverInfoCard";
import { useIsMobile } from "@/constants/Main";
const CategoryCard = ({ cardImage, cardTitle, urlPath, tooltipText }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const router = useRouter();
  const isMobile = useIsMobile(800);
  const handleHover = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleLeave = () => {
    setAnchorEl(null);
  };
  const calculateOverlayStyle = () => ({
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.6)",
    opacity: anchorEl ? 0 : 0.9,
    transition: "opacity 0.3s ease-in-out",
  });
  return (
    <HoverInfoCard infoText={tooltipText}>
      <Box>
        <Card
          style={{
            width: isMobile ? 150 : 200,
            height: isMobile ? 200 : 250,
            position: "relative",
            overflow: "hidden",
            margin: "10px",
            transition: "transform 0.3s",
            cursor: "pointer",
          }}
          onMouseEnter={handleHover}
          onMouseLeave={handleLeave}
          onClick={() => router.push(urlPath)}
        >
          <Box style={calculateOverlayStyle()} />
          <CardMedia
            component="img"
            height="140"
            image={cardImage}
            alt={cardTitle}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              zIndex: 0,
            }}
          />
          <CardContent
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
              color: "white",
            }}
          >
            <Typography gutterBottom variant="h5" component="div">
              {cardTitle}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </HoverInfoCard>
  );
};
export default CategoryCard;
