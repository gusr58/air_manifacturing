import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import ExperianceForm from "./ExperianceForm";
import { mainColor, mainTextColor } from "@/constants/Colors";
import { Grid } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import Pagination from "@mui/material/Pagination";

const GeneralTable = ({
  columns,
  tableData,
  tableOnCreate,
  tableOnUpdate,
  tableOnDelete,
}) => {
  const [data, setData] = useState(tableData);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  //Search alanı için
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  //pagination için alan
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  //search alanı için
  useEffect(() => {
    const results = data.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredData(results);
  }, [searchTerm, data]);

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingRow(null);
  };

  const handleOpenDeleteDialog = (id) => {
    setDeletingId(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setDeletingId(null);
  };

  const handleConfirmDelete = async () => {
    let response = await tableOnDelete(deletingId);
    if (response?.message) {
      const filteredData = data.filter((item) => item.id !== deletingId);
      setData(filteredData);
    } else {
      // TODO add error message
    }
    handleCloseDeleteDialog();
  };

  const handleOpenDialog = (row = null) => {
    setEditingRow(row);
    setOpenDialog(true);
  };

  const handleSave = async (newData) => {
    if (newData.id) {
      // Update
      let responseUpdate = await tableOnUpdate(newData.id, newData);
      if (responseUpdate?.message) {
        const updatedData = data.map((item) =>
          item.id === newData.id ? newData : item
        );
        setData(updatedData);
      } else {
        // TODO add error message
      }
    } else {
      // Create
      const newEntry = { ...newData, id: data.length + 1 };
      let responseCreate = await tableOnCreate(newEntry);
      if (responseCreate?.message) {
        setData([...data, newEntry]);
      } else {
        // TODO add error message
      }
    }
    handleCloseDialog();
  };

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between", m: 2 }}>
        <TextField
          id="search-input"
          label="Arama"
          type="search"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 2, width: "25%" }}
        />
        <Tooltip title="Yeni bir iş deneyimi satırı ekle">
          <Button
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{
              backgroundColor: mainColor,
              color: mainTextColor,
              "&:hover": {
                backgroundColor: mainColor,
                opacity: 0.8,
              },
            }}
          >
            Ekle
          </Button>
        </Tooltip>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TableContainer
            component={Paper}
            sx={{ boxShadow: 2, borderRadius: 2 }}
          >
            <Table>
              <TableHead sx={{ backgroundColor: mainColor }}>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align || "left"}
                      sx={{ color: mainTextColor }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                  <TableCell align="center" sx={{ color: mainTextColor }}>
                    İşlemler
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData
                  .slice((page - 1) * rowsPerPage, page * rowsPerPage)
                  .map((row) => (
                    <TableRow key={row.id}>
                      {columns.map((column) => (
                        <TableCell
                          key={column.id}
                          align={column.align || "left"}
                        >
                          {row[column.id]}
                        </TableCell>
                      ))}
                      <TableCell align="center">
                        <Tooltip title="Güncelle">
                          <IconButton onClick={() => handleOpenDialog(row)}>
                            <EditIcon sx={{ color: "blue" }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Sil">
                          <IconButton
                            onClick={() => handleOpenDeleteDialog(row.id)}
                          >
                            <DeleteIcon sx={{ color: "red" }} />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box
            sx={{ display: "flex", justifyContent: "center", padding: "20px" }}
          >
            <Pagination
              count={Math.ceil(filteredData.length / rowsPerPage)}
              page={page}
              onChange={handleChangePage}
              color="secondary"
              variant="outlined"
              shape="rounded"
            />
          </Box>
        </Grid>
      </Grid>
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Silmek İstediğinize Emin misiniz?</DialogTitle>
        <DialogContent>
          Bu işlem geri alınamaz ve silinen veri kalıcı olarak kaybolacaktır.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>İptal</Button>
          <Button onClick={handleConfirmDelete} color="primary">
            Sil
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #ccc",
          }}
        >
          <span>{editingRow ? "Deneyimi Düzenle" : "Deneyim Ekle"}</span>
          <IconButton onClick={handleCloseDialog}>
            <ClearIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
          sx={{
            "& .MuiTextField-root": {
              margin: "10px 0",
            },
          }}
        >
          <ExperianceForm
            onSave={handleSave}
            onClose={handleCloseDialog}
            rowData={editingRow}
          />
        </DialogContent>
        <DialogActions
          sx={{
            padding: "8px 24px",
            "& .MuiButton-root": {
              margin: "0 8px",

              "&:hover": {
                backgroundColor: "#005f73",
              },
            },
          }}
        ></DialogActions>
      </Dialog>
    </>
  );
};
export default GeneralTable;
