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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import Styles from "./Sklad.module.css";

const Sklad = () => {
  const [sklad, setSklad] = useState([]);
  const [prod, setProd] = useState([]);
  const [selectedSklad, setSelectedSklad] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [prodId, setProdId] = useState("");
  const [kol, setKol] = useState("");
  const [dateIn, setDateIn] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const fetchData = async () => {
    try {
      const [skladResponse, productsResponse] = await Promise.all([
        axios.get("http://localhost:5000/sklad"),
        axios.get("http://localhost:5000/prod"),
      ]);
      setSklad(skladResponse.data);
      setProd(productsResponse.data);
    } catch (error) {
      setSnackbarMessage(
        "Ошибка при загрузке данных: " +
          (error.response?.data?.message || "Неизвестная ошибка.")
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleAddSklad = async () => {
    try {
      await axios.post("http://localhost:5000/sklad", {
        prod_id: prodId,
        kol: kol,
        date_in: dateIn,
      });
      setSnackbarMessage("Запись успешно добавлена!");
      setSnackbarSeverity("success");
      fetchData(); // Обновляем список после добавления
    } catch (error) {
      setSnackbarMessage(
        "Ошибка при добавлении записи: " +
          (error.response?.data?.message || "Неизвестная ошибка.")
      );
      setSnackbarSeverity("error");
    }
    setProdId("");
    setKol("");
    setDateIn("");
    setOpenDialog(false);
    setSnackbarOpen(true);
  };

  const handleEditSklad = async () => {
    try {
      await axios.put(`http://localhost:5000/sklad/${selectedSklad.id}`, {
        prod_id: prodId,
        kol: kol,
        date_in: dateIn,
      });
      setSnackbarMessage("Запись успешно изменена!");
      setSnackbarSeverity("success");
      fetchData(); // Обновляем список после редактирования
    } catch (error) {
      setSnackbarMessage(
        "Ошибка при редактировании записи: " +
          (error.response?.data?.message || "Неизвестная ошибка.")
      );
      setSnackbarSeverity("error");
    }
    setProdId("");
    setKol("");
    setDateIn("");
    setSelectedSklad(null);
    setOpenDialog(false);
    setSnackbarOpen(true);
  };

  const handleDeleteSklad = async (id) => {
    if (window.confirm("Вы уверены, что хотите удалить эту запись?")) {
      try {
        await axios.delete(`http://localhost:5000/sklad/${id}`);
        setSnackbarMessage("Запись успешно удалена!");
        setSnackbarSeverity("success");
        fetchData(); // Обновляем список после удаления
      } catch (error) {
        setSnackbarMessage(
          "Ошибка при удалении записи: " +
            (error.response?.data?.message || "Неизвестная ошибка.")
        );
        setSnackbarSeverity("error");
      }
      setSnackbarOpen(true);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <div className={Styles["container__table"]}>
      <h2>УПРАВЛЕНИЕ СКЛАДОМ</h2>
      <Button
        variant="contained"
        color="success"
        sx={{ mb: 1, width: 300 }}
        onClick={() => setOpenDialog(true)}
      >
        Добавить запись на склад
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ textAlign: "center" }}>Id</TableCell>
              <TableCell sx={{ textAlign: "center" }}>Продукт</TableCell>
              <TableCell sx={{ textAlign: "center" }}>Количество</TableCell>
              <TableCell sx={{ textAlign: "center" }}>Дата ввоза</TableCell>
              <TableCell
                sx={{ textAlign: "center" }}
                style={{ minWidth: "100px", textAlign: "center" }}
              >
                Действия
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sklad.map((item) => (
              <TableRow key={item.id}>
                <TableCell sx={{ textAlign: "center" }}>{item.id}</TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  {prod.find((product) => product.id === item.prod_id)?.name ||
                    "Неизвестный продукт"}
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>{item.kol}</TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  {item.date_in}
                </TableCell>
                <TableCell
                  sx={{ textAlign: "center" }}
                  style={{ minWidth: "100px", textAlign: "center" }}
                >
                  <Button
                    onClick={() => {
                      setSelectedSklad(item);
                      setProdId(item.prod_id);
                      setKol(item.kol);
                      setDateIn(item.date_in);
                      setOpenDialog(true);
                    }}
                  >
                    Редактировать
                  </Button>
                  <Button
                    onClick={() => handleDeleteSklad(item.id)}
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
          {selectedSklad ? "Редактировать запись" : "Добавить запись"}
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel id="prod-select-label">Продукт</InputLabel>
            <Select
              labelId="prod-select-label"
              label="Продукт"
              value={prodId}
              onChange={(e) => setProdId(e.target.value)}
            >
              {prod.map((product) => (
                <MenuItem key={product.id} value={product.id}>
                  {product.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Количество"
            type="number"
            fullWidth
            value={kol}
            onChange={(e) => setKol(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Дата ввоза"
            type="date"
            fullWidth
            value={dateIn}
            onChange={(e) => setDateIn(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Отмена</Button>
          <Button onClick={selectedSklad ? handleEditSklad : handleAddSklad}>
            {selectedSklad ? "Сохранить" : "Добавить"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Sklad;
