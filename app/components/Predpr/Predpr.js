"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Alert,
} from "@mui/material";
import Styles from "./Predpr.module.css";

const Predprs = () => {
  const [predprs, setPredprs] = useState([]);
  const [selectedPredpr, setSelectedPredpr] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [newPredprName, setNewPredprName] = useState("");
  const [newPredprAddress, setNewPredprAddress] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const fetchPredprs = async () => {
    try {
      const response = await axios.get("http://localhost:5000/predpr");
      setPredprs(response.data);
    } catch (error) {
      setSnackbarMessage("Ошибка при загрузке данных.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleAddPredpr = async () => {
    try {
      await axios.post("http://localhost:5000/predpr", {
        name: newPredprName,
        address: newPredprAddress,
      });
      setSnackbarMessage("Предприятие успешно добавлено!");
      setSnackbarSeverity("success");
      fetchPredprs();
    } catch (error) {
      setSnackbarMessage("Ошибка при добавлении предприятия.");
      setSnackbarSeverity("error");
    } finally {
      setNewPredprName("");
      setNewPredprAddress("");
      setOpenDialog(false);
      setSnackbarOpen(true);
    }
  };

  const handleEditPredpr = async () => {
    try {
      await axios.put(`http://localhost:5000/predpr/${selectedPredpr.id}`, {
        name: newPredprName,
        address: newPredprAddress,
      });
      setSnackbarMessage("Предприятие успешно отредактировано!");
      setSnackbarSeverity("success");
      fetchPredprs();
    } catch (error) {
      setSnackbarMessage("Ошибка при редактировании предприятия.");
      setSnackbarSeverity("error");
    } finally {
      setNewPredprName("");
      setNewPredprAddress("");
      setSelectedPredpr(null);
      setOpenDialog(false);
      setSnackbarOpen(true);
    }
  };

  const handleDeletePredpr = async (id) => {
    if (window.confirm("Вы уверены, что хотите удалить это предприятие?")) {
      try {
        await axios.delete(`http://localhost:5000/predpr/${id}`);
        setSnackbarMessage("Предприятие успешно удалено!");
        setSnackbarSeverity("success");
        fetchPredprs();
      } catch (error) {
        setSnackbarMessage("Ошибка при удалении предприятия.");
        setSnackbarSeverity("error");
      } finally {
        setSnackbarOpen(true);
      }
    }
  };

  useEffect(() => {
    fetchPredprs();
  }, []);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <div className={Styles["container__table"]}>
      <h2>УПРАВЛЕНИЕ ПРЕДПРИЯТИЯМИ</h2>
      <Button
        variant="contained"
        onClick={() => setOpenDialog(true)}
        color="success"
        sx={{ mb: 1, width: 300 }}
      >
        Добавить предприятие
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ textAlign: "center" }}>Id</TableCell>
              <TableCell sx={{ textAlign: "center" }}>Название</TableCell>
              <TableCell sx={{ textAlign: "center" }}>Адрес</TableCell>
              <TableCell
                sx={{ textAlign: "center" }}
                style={{ minWidth: "100px", textAlign: "center" }}
              >
                Действия
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {predprs.map((predpr) => (
              <TableRow key={predpr.id}>
                <TableCell sx={{ textAlign: "center" }}>{predpr.id}</TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  {predpr.name}
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  {predpr.address}
                </TableCell>
                <TableCell
                  sx={{ textAlign: "center" }}
                  style={{ minWidth: "90px", textAlign: "center" }}
                >
                  <Button
                    onClick={() => {
                      setSelectedPredpr(predpr);
                      setNewPredprName(predpr.name);
                      setNewPredprAddress(predpr.address);
                      setOpenDialog(true);
                    }}
                  >
                    Редактировать
                  </Button>
                  <Button
                    onClick={() => handleDeletePredpr(predpr.id)}
                    color="error"
                  >
                    Удалить
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          {selectedPredpr
            ? "Редактировать предприятие"
            : "Добавить предприятие"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Название"
            fullWidth
            variant="outlined"
            value={newPredprName}
            onChange={(e) => setNewPredprName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Адрес"
            fullWidth
            variant="outlined"
            value={newPredprAddress}
            onChange={(e) => setNewPredprAddress(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Отмена</Button>
          {selectedPredpr ? (
            <Button onClick={handleEditPredpr}>Сохранить</Button>
          ) : (
            <Button onClick={handleAddPredpr}>Добавить</Button>
          )}
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Predprs;
