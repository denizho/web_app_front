"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import Styles from "./Prod.module.css";

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({
    id: "",
    name: "",
    price: "",
    categ_id: "",
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          axios.get("http://localhost:5000/prod"),
          axios.get("http://localhost:5000/categories"),
        ]);
        setProducts(productsResponse.data);
        setCategories(categoriesResponse.data);
      } catch (error) {
        setSnackbarMessage("Ошибка при загрузке данных.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    };

    fetchData();
  }, []);

  const handleAddProduct = async () => {
    try {
      const productToAdd = {
        name: currentProduct.name,
        price: parseFloat(currentProduct.price),
        categ_id: currentProduct.categ_id,
      };

      await axios.post("http://localhost:5000/prod", productToAdd);
      setSnackbarMessage("Продукт успешно добавлен!");
      setSnackbarSeverity("success");
      resetFormAfterAction();
    } catch (error) {
      setSnackbarMessage(
        "Ошибка при добавлении продукта: " + error.response?.data?.message ||
          "Неизвестная ошибка."
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleEditProduct = async () => {
    try {
      const updatedProduct = {
        id: currentProduct.id,
        name: currentProduct.name,
        price: parseFloat(currentProduct.price),
        categ_id: currentProduct.categ_id,
      };

      await axios.put(
        `http://localhost:5000/prod/${currentProduct.id}`,
        updatedProduct
      );
      setSnackbarMessage("Продукт успешно обновлён!");
      setSnackbarSeverity("success");
      resetFormAfterAction();
    } catch (error) {
      setSnackbarMessage(
        "Ошибка при обновлении продукта: " + error.response?.data?.message ||
          "Неизвестная ошибка."
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Вы уверены, что хотите удалить этот продукт?")) {
      try {
        await axios.delete(`http://localhost:5000/prod/${productId}`);
        setProducts(products.filter((product) => product.id !== productId));
        setSnackbarMessage("Продукт успешно удалён!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      } catch (error) {
        setSnackbarMessage(
          "Ошибка при удалении продукта: " + error.response?.data?.message ||
            "Неизвестная ошибка."
        );
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    }
  };

  const resetFormAfterAction = async () => {
    setOpen(false);
    setCurrentProduct({ id: "", name: "", price: "", categ_id: "" });
    try {
      const response = await axios.get("http://localhost:5000/prod");
      setProducts(response.data);
    } catch (error) {
      setSnackbarMessage(
        "Ошибка при обновлении списка продуктов: " +
          error.response?.data?.message || "Неизвестная ошибка."
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleEditClick = (product) => {
    setCurrentProduct(product);
    setEditMode(true);
    setOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <div className={Styles["container__table"]}>
      <h2>УПРАВЛЕНИЕ ПРОДУКТАМИ</h2>
      <Button
        variant="contained"
        color="success"
        sx={{ mb: 1, width: 300 }}
        onClick={() => {
          setEditMode(false);
          setOpen(true);
        }}
      >
        Добавить продукт
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ textAlign: "center" }}>ID</TableCell>
              <TableCell sx={{ textAlign: "center" }}>Название</TableCell>
              <TableCell sx={{ textAlign: "center" }}>Цена</TableCell>
              <TableCell sx={{ textAlign: "center" }}>Категория</TableCell>
              <TableCell
                sx={{ textAlign: "center" }}
                style={{ minWidth: "100px", textAlign: "center" }}
              >
                Действия
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => {
              const category = categories.find(
                (c) => c.id === product.categ_id
              );
              return (
                <TableRow key={product.id}>
                  <TableCell sx={{ textAlign: "center" }}>
                    {product.id}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {product.name}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {product.price}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {category ? category.name : "Неизвестно"}
                  </TableCell>
                  <TableCell
                    sx={{ textAlign: "center" }}
                    style={{ minWidth: "100px", textAlign: "center" }}
                  >
                    <Button onClick={() => handleEditClick(product)}>
                      Редактировать
                    </Button>
                    <Button
                      onClick={() => handleDeleteProduct(product.id)}
                      color="error"
                    >
                      Удалить
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>
          {editMode ? "Редактировать продукт" : "Добавить новый продукт"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Название продукта"
            fullWidth
            value={currentProduct.name}
            onChange={(e) =>
              setCurrentProduct({ ...currentProduct, name: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Цена"
            type="number"
            fullWidth
            value={currentProduct.price}
            onChange={(e) =>
              setCurrentProduct({ ...currentProduct, price: e.target.value })
            }
          />
          <FormControl fullWidth sx={{ mt: 1 }}>
            <InputLabel id="category-select-label">Категория</InputLabel>
            <Select
              labelId="category-select-label"
              label="Категория"
              value={currentProduct.categ_id}
              onChange={(e) =>
                setCurrentProduct({
                  ...currentProduct,
                  categ_id: e.target.value,
                })
              }
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Отмена
          </Button>
          <Button
            onClick={() =>
              editMode ? handleEditProduct() : handleAddProduct()
            }
            color="primary"
          >
            {editMode ? "Сохранить изменения" : "Добавить"}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "300px" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ProductPage;
