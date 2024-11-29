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
import Styles from "./Categories.module.css";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:5000/categories");
      setCategories(response.data);
    } catch (error) {
      setSnackbarMessage("Ошибка при загрузке категорий.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleAddCategory = async () => {
    try {
      await axios.post("http://localhost:5000/categories", {
        name: newCategoryName,
      });
      setSnackbarMessage("Категория успешно добавлена!");
      setSnackbarSeverity("success");
      fetchCategories(); // Обновляем список после добавления
    } catch (error) {
      setSnackbarMessage("Ошибка при добавлении категории.");
      setSnackbarSeverity("error");
    } finally {
      setNewCategoryName("");
      setOpenDialog(false);
      setSnackbarOpen(true);
    }
  };

  const handleEditCategory = async () => {
    try {
      await axios.put(
        `http://localhost:5000/categories/${selectedCategory.id}`,
        {
          name: newCategoryName,
        }
      );
      setSnackbarMessage("Категория успешно отредактирована!");
      setSnackbarSeverity("success");
      fetchCategories(); // Обновляем список после редактирования
    } catch (error) {
      setSnackbarMessage("Ошибка при редактировании категории.");
      setSnackbarSeverity("error");
    } finally {
      setNewCategoryName("");
      setSelectedCategory(null);
      setOpenDialog(false);
      setSnackbarOpen(true);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm("Вы уверены, что хотите удалить эту категорию?")) {
      try {
        await axios.delete(`http://localhost:5000/categories/${id}`);
        setSnackbarMessage("Категория успешно удалена!");
        setSnackbarSeverity("success");
        fetchCategories(); // Обновляем список после удаления
      } catch (error) {
        setSnackbarMessage("Ошибка при удалении категории.");
        setSnackbarSeverity("error");
      } finally {
        setSnackbarOpen(true);
      }
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <div className={Styles["container__table"]}>
      <h2>УПРАВЛЕНИЕ КАТЕГОРИЯМИ</h2>
      <Button
        variant="contained"
        onClick={() => setOpenDialog(true)}
        color="success"
        sx={{ mb: 1, width: 300 }}
      >
        Добавить категорию
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ textAlign: "center" }}>Id</TableCell>
              <TableCell sx={{ textAlign: "center" }}>Название</TableCell>
              <TableCell style={{ maxWidth: "80px", textAlign: "center" }}>
                Действия
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell sx={{ textAlign: "center" }}>
                  {category.id}
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  {category.name}
                </TableCell>
                <TableCell
                  sx={{ textAlign: "center" }}
                  style={{ maxWidth: "80px", textAlign: "center" }}
                >
                  <Button
                    onClick={() => {
                      setSelectedCategory(category);
                      setNewCategoryName(category.name);
                      setOpenDialog(true);
                    }}
                  >
                    Редактировать
                  </Button>
                  <Button
                    onClick={() => handleDeleteCategory(category.id)}
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
          {selectedCategory ? "Редактировать категорию" : "Добавить категорию"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Название"
            fullWidth
            variant="outlined"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Отмена</Button>
          {selectedCategory ? (
            <Button onClick={handleEditCategory}>Сохранить</Button>
          ) : (
            <Button onClick={handleAddCategory}>Добавить</Button>
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

export default Categories;
