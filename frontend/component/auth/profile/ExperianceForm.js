import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import dayjs from "dayjs";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/tr";

const ExperianceForm = ({ onSave, onClose, rowData }) => {
  const [newData, setNewData] = useState({
    ...rowData,
    end_date: rowData?.end_date === "Current" ? null : rowData?.end_date,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDateChange = (name, value) => {
    setNewData((prevData) => ({
      ...prevData,
      [name]: value ? value.format("YYYY-MM-DD") : null,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let endDateToSend = newData.end_date ? dayjs(newData.end_date).format("YYYY-MM-DD") : dayjs().endOf('year').format("YYYY-MM-DD");
    let startDateToSend=newData.start_date ? dayjs(newData.start_date).format("YYYY-MM-DD") : dayjs().format("YYYY-MM-DD");

    const submitData = {
      ...newData,

      end_date: endDateToSend, 
      start_date:startDateToSend   };
    onSave(submitData);
    onClose();
  };

  return (
    <Box component="form" sx={{ padding: 2 }} onSubmit={handleSubmit}>
      <TextField
        name="title"
        label="Başlık"
        required
        fullWidth
        margin="normal"
        value={newData?.title || ""}
        onChange={handleChange}
        error={newData?.title === ""}
        helperText={newData?.title === "" ? "Bu alan boş bırakılamaz" : ""}
      />
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="tr">
          <Box sx={{ width: "100%" }}>
            {" "}
            <DatePicker
              label="Başlangıç Zamanı"
              value={newData.start_date ? dayjs(newData.start_date) : null}
              onChange={(newValue) => handleDateChange("start_date", newValue)}
              renderInput={(params) => (
                <TextField {...params} required fullWidth />
              )}
            />
          </Box>
          <Box sx={{ width: "100%" }}>
            {" "}
            <DatePicker
              label="Bitiş Zamanı"
              value={newData.end_date ? dayjs(newData.end_date) : null}
              onChange={(newValue) => handleDateChange("end_date", newValue)}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Box>
        </LocalizationProvider>
      </Box>
      <TextField
        name="company"
        label="Şirket"
        required
        fullWidth
        margin="normal"
        value={newData?.company || ""}
        onChange={handleChange}
        error={newData?.company === ""}
        helperText={newData?.company === "" ? "Bu alan boş bırakılamaz" : ""}
      />
      <TextField
        name="country"
        label="Ülke"
        required
        fullWidth
        margin="normal"
        value={newData?.country || ""}
        onChange={handleChange}
        error={newData?.country === ""}
        helperText={newData?.country === "" ? "Bu alan boş bırakılamaz" : ""}
      />
      <TextField
        name="city"
        label="Şehir"
        required
        fullWidth
        margin="normal"
        value={newData?.city || ""}
        onChange={handleChange}
        error={newData?.city === ""}
        helperText={newData?.city === "" ? "Bu alan boş bırakılamaz" : ""}
      />
      <TextField
        name="description"
        label="Açıklama"
        required
        fullWidth
        margin="normal"
        value={newData?.description || ""}
        onChange={handleChange}
        error={newData?.description === ""}
        helperText={
          newData?.description === "" ? "Bu alan boş bırakılamaz" : ""
        }
      />
      <Box
        sx={{ marginTop: 2, display: "flex", justifyContent: "space-between" }}
      >
        <Button
          type="submit"
          variant="contained"
          color="success"
          sx={{ mr: 1 }}
        >
          {rowData ? "Güncelle" : "Ekle"}
        </Button>
        <Button onClick={onClose} variant="outlined" color="error">
          İptal
        </Button>
      </Box>
    </Box>
  );
};

export default ExperianceForm;
