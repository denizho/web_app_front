"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductTable from "./components/ProductOrder/ProductOrder";
import Cart from "./components/Cart/Cart";
import {
  Grid,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import Styles from "./page.module.css";

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [cart, setCart] = useState([]);
  const [openOrderDialog, setOpenOrderDialog] = useState(false);
  const [predprs, setEnterprises] = useState([]);
  const [selectedEnterprise, setSelectedEnterprise] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [stock, setStock] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const response = await axios.get("http://localhost:5000/sklad");
        setStock(response.data);
      } catch (error) {
        setErrorMessage("Ошибка при загрузке склада");
      }
    };

    fetchStock();
  }, []);

  useEffect(() => {
    const fetchEnterprises = async () => {
      try {
        const response = await axios.get("http://localhost:5000/predpr");
        setEnterprises(response.data);
      } catch (error) {
        setErrorMessage("Ошибка при загрузке предприятий");
      }
    };

    fetchEnterprises();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:5000/categories");
        setCategories(response.data);
      } catch (error) {
        setErrorMessage("Ошибка при загрузке категорий");
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      if (selectedCategory) {
        try {
          const response = await axios.get(
            `http://localhost:5000/prod?categ_id=${selectedCategory}`
          );
          const allProducts = response.data;

          const availableProducts = allProducts.filter((product) => {
            const stockItem = stock.find((s) => s.prod_id === product.id);
            return stockItem && stockItem.kol > 0;
          });

          setProducts(availableProducts);
        } catch (error) {
          setErrorMessage("Ошибка при загрузке продуктов");
        }
      } else {
        setProducts([]);
      }
    };

    fetchProducts();
  }, [selectedCategory, stock]);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const addToCart = (product, quantity) => {
    const existingProduct = cart.find((item) => item.product.id === product.id);

    if (existingProduct) {
      const updatedCart = cart.map((item) =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    } else {
      const newItem = {
        product,
        quantity,
      };
      const updatedCart = [...cart, newItem];
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    }
  };

  const handleRemoveFromCart = (productId) => {
    const updatedCart = cart.filter((item) => item.product.id !== productId);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setProducts([]);
  };

  const handleOrder = async () => {
    if (cart.length === 0 || !selectedEnterprise) {
      setErrorMessage("Корзина пуста или предприятие не выбрано");
      return;
    }

    try {
      const createdSpecs = [];
      let totalCost = 0;

      for (const item of cart) {
        const productResponse = await axios.get(
          `http://localhost:5000/prod/${item.product.id}`
        );
        const product = productResponse.data;

        if (!product || typeof product.price !== "number") {
          setErrorMessage(
            `Не удалось получить цену для продукта с ID ${item.product.id}`
          );
          continue;
        }

        const stockItem = stock.find((s) => s.prod_id === item.product.id);
        if (!stockItem || stockItem.kol < item.quantity) {
          setErrorMessage(
            `Недостаточно товара на складе для продукта ID ${item.product.id}`
          );
          continue;
        }

        const response = await axios.post("http://localhost:5000/spec", {
          prod_id: item.product.id,
          kol: item.quantity,
        });
        createdSpecs.push(response.data.id);
        totalCost += product.price * item.quantity;
      }

      if (totalCost <= 0) {
        throw new Error("Не удалось рассчитать общую стоимость заказа.");
      }

      const orderName = `Заказ ${new Date().getTime()}`;
      const orderResponse = await axios.post("http://localhost:5000/orders", {
        name: orderName,
        predpr_id: selectedEnterprise,
        spec_ids: createdSpecs,
        cost: totalCost,
      });

      console.log("Заказ создан успешно:", orderResponse.data);

      setCart([]);
      localStorage.removeItem("cart");

      const updatedStock = await axios.get("http://localhost:5000/sklad");
      setStock(updatedStock.data);

      setOpenOrderDialog(false);
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Ошибка при создании заказа:", error);
      setErrorMessage(
        "Ошибка при создании заказа. Пожалуйста, попробуйте еще раз."
      );
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <div className={Styles["container"]}>
      <Grid container spacing={2}>
        <Grid item xs={7}>
          <div className={Styles["container__table"]}>
            <h1>Выбор товаров</h1>
            <FormControl fullWidth>
              <InputLabel
                id="category-select-label"
                sx={{
                  color: "black",
                  "&.Mui-focused": {
                    color: "black",
                  },
                  backgroundColor: "white",
                  borderRadius: 1,
                }}
              >
                Категория
              </InputLabel>
              <Select
                sx={{
                  backgroundColor: "white",
                }}
                labelId="category-select-label"
                label="Категория"
                value={selectedCategory}
                onChange={handleCategoryChange}
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <ProductTable
              products={products}
              addToCart={addToCart}
              quantity={cart.reduce((acc, item) => {
                acc[item.product.id] = item.quantity;
                return acc;
              }, {})}
              stockInfo={stock}
            />

            <Button
              variant="contained"
              onClick={() => setOpenOrderDialog(true)}
              disabled={cart.length === 0}
              sx={{ mt: 1 }}
              color="success"
            >
              Сделать заказ
            </Button>
          </div>
        </Grid>
        <Grid item xs={5}>
          <div className={Styles["container__table"]}>
            <h1>Корзина</h1>
            <Cart cartItems={cart} onRemoveFromCart={handleRemoveFromCart} />
          </div>
        </Grid>
      </Grid>

      <Dialog
        open={openOrderDialog}
        onClose={() => setOpenOrderDialog(false)}
        PaperProps={{
          style: { width: "80%", maxWidth: "1000px" },
        }}
      >
        <DialogTitle>Оформление заказа</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ marginTop: 1 }}>
            <InputLabel id="predpr-select-label">Предприятие</InputLabel>
            <Select
              labelId="predpr-select-label"
              value={selectedEnterprise}
              onChange={(e) => setSelectedEnterprise(e.target.value)}
              label="Предприятие"
            >
              {predprs.map((predpr) => (
                <MenuItem key={predpr.id} value={predpr.id}>
                  {predpr.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Typography variant="h6" gutterBottom>
            Содержимое корзины:
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Товар</TableCell>
                  <TableCell>Количество</TableCell>
                  <TableCell>Цена</TableCell>
                  <TableCell>Итог</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cart.map((item) => {
                  const productPrice = item.product.price || 0;
                  const totalPrice = productPrice * item.quantity;
                  return (
                    <TableRow key={item.product.id}>
                      <TableCell>{item.product.name}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{productPrice.toFixed(2)} ₽</TableCell>
                      <TableCell>{totalPrice.toFixed(2)} ₽</TableCell>
                    </TableRow>
                  );
                })}
                <TableRow>
                  <TableCell colSpan={3} align="right">
                    <strong>Итого:</strong>
                  </TableCell>
                  <TableCell>
                    <strong>
                      {cart
                        .reduce((acc, item) => {
                          const productPrice = item.product.price || 0;
                          return acc + productPrice * item.quantity;
                        }, 0)
                        .toFixed(2)}{" "}
                      ₽
                    </strong>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          {errorMessage && (
            <Typography color="error" variant="body2">
              {errorMessage}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenOrderDialog(false)} color="primary">
            Отмена
          </Button>
          <Button
            onClick={handleOrder}
            color="primary"
            disabled={!selectedEnterprise} // Дизаблируем кнопку, если предприятие не выбрано
          >
            Подтвердить
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          Заказ успешно оформлен!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default HomePage;
