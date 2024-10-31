import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  FormControlLabel,
  Checkbox,
  MenuItem,
} from "@mui/material";
import Cookies from "js-cookie";
import API from "@/helpers/ApiBuilder";

function PartCreationForm({ initialData }) {
  const [formData, setFormData] = useState({
    name: "",
    color: "",
    stock_quantity: 0,
    team_responsible: "",
    in_stock: false,
  });
  const [teams, setTeams] = useState([]);
  const [resetTrigger, setResetTrigger] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  // Fetch options for teams
  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = Cookies.get("accessToken");
        // Get teams
        const teamResponse = await API.get("teams", accessToken);
        setTeams(teamResponse?.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
  };

  const handleCreatePart = async () => {
    try {
      const accessToken = Cookies.get("accessToken");
      const response = await API.post("create_part/", formData, accessToken);
      return response.error ? { error: response.error } : response;
    } catch (error) {
      console.error("Error creating part:", error);
      return { error: error };
    }
  };

  const handleUpdatePart = async (partId) => {
    try {
      const accessToken = Cookies.get("accessToken");
      const response = await API.post(`update_part/${partId}/`, formData, accessToken);
      return response.error ? { error: response.error } : response;
    } catch (error) {
      console.error("Error updating part:", error);
      return { error: error };
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const partId = formData.id;

    if (partId) {
      const result = await handleUpdatePart(partId);
      if (!result.error) {
        console.log("Part updated successfully!");
        handleReset(); // Reset the form after update
      }
    } else {
      const result = await handleCreatePart();
      if (!result.error) {
        console.log("Part created successfully!");
        handleReset(); // Reset the form after creation
      }
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      color: "",
      stock_quantity: 0,
      team_responsible: "",
      in_stock: false,
    });
    setResetTrigger(!resetTrigger);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
      <Typography variant="h6">Part Information</Typography>

      <TextField
        fullWidth
        label="Part Name"
        name="name"
        value={formData?.name || ""}
        onChange={handleChange}
        margin="normal"
      />

      <TextField
        fullWidth
        label="Color"
        name="color"
        value={formData?.color || ""}
        onChange={handleChange}
        margin="normal"
      />

      <TextField
        fullWidth
        label="Stock Quantity"
        name="stock_quantity"
        type="number"
        value={formData?.stock_quantity || ""}
        onChange={handleChange}
        margin="normal"
      />

      {/* Team Responsible field disabled */}
      <TextField
        fullWidth
        select
        label="Team Responsible"
        name="team_responsible"
        value={formData?.team_responsible || ""}
        onChange={handleChange}
        margin="normal"
        disabled // Disable the field
      >
        {teams.map((team) => (
          <MenuItem key={team.id} value={team.id}>
            {team.name}
          </MenuItem>
        ))}
      </TextField>

      {/* In Stock checkbox disabled */}
      <FormControlLabel
        control={
          <Checkbox
            checked={formData?.in_stock || false}
            onChange={handleChange}
            name="in_stock"
            disabled // Disable the checkbox
          />
        }
        label="In Stock"
      />

      <Button type="submit" variant="contained" color="primary">
        {formData?.id ? "Update Part" : "Create Part"}
      </Button>
      <Button type="button" variant="outlined" color="secondary" onClick={handleReset}>
        Reset
      </Button>
    </Box>
  );
}

export default PartCreationForm;
