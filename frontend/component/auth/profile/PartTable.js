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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Button, // Don't forget to import Button
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ClearIcon from "@mui/icons-material/Clear";

import Pagination from "@mui/material/Pagination";
import PartCreationForm from "./PartCreationForm";

const PartTable = ({ partsData = [], onUpdate, onDelete, teamPartTypes }) => {
  const [parts, setParts] = useState(partsData);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPart, setEditingPart] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    setParts(partsData);
  }, [partsData]);

  const handleOpenDialog = (part = null) => {
    setEditingPart(part);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingPart(null);
  };

  const handleConfirmDelete = async () => {
    await onDelete(deletingId);
    setParts(parts.filter(part => part.id !== deletingId));
    handleCloseDeleteDialog();
    setSnackbar({ open: true, message: "Parça silindi.", severity: "success" });
  };

  const handleOpenDeleteDialog = (id) => {
    setDeletingId(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setDeletingId(null);
  };

  const handleSave = async (newData) => {
    if (newData.id) {
      await onUpdate(newData.id, newData);
      setParts(parts.map(part => (part.id === newData.id ? newData : part)));
      setSnackbar({ open: true, message: "Parça güncellendi.", severity: "success" });
    }
    handleCloseDialog();
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Parça Adı</TableCell>
              <TableCell>Stok</TableCell>
              <TableCell align="center">İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {parts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center">Hiç parça bulunamadı.</TableCell>
              </TableRow>
            ) : (
              parts.slice((page - 1) * rowsPerPage, page * rowsPerPage).map((part) => (
                <TableRow key={part.id}>
                  <TableCell>{part.name}</TableCell>
                  <TableCell>{part.stock}</TableCell>
                  <TableCell align="center">
                    <IconButton onClick={() => handleOpenDialog(part)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleOpenDeleteDialog(part.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {parts.length > 0 && (
        <Pagination count={Math.ceil(parts.length / rowsPerPage)} page={page} onChange={(_, newPage) => setPage(newPage)} />
      )}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Silmek İstediğinize Emin misiniz?</DialogTitle>
        <DialogContent>Bu işlem geri alınamaz ve silinen veri kalıcı olarak kaybolacaktır.</DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>İptal</Button>
          <Button onClick={handleConfirmDelete} color="primary">Sil</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          Parça Düzenle
          <IconButton onClick={handleCloseDialog}><ClearIcon /></IconButton>
        </DialogTitle>
        <DialogContent>
          <PartCreationForm onSave={handleSave} partData={editingPart} teamPartTypes={teamPartTypes} />
        </DialogContent>
      </Dialog>
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default PartTable;
