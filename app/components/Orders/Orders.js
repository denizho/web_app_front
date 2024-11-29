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
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import Styles from "./Orders.module.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [predprs, setPredprs] = useState([]);
  const [specs, setSpecs] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:5000/orders");
      setOrders(response.data);
    } catch (error) {
      setSnackbarMessage("Ошибка при загрузке заказов.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/prod");
      setProducts(response.data);
    } catch (error) {
      setSnackbarMessage("Ошибка при загрузке продуктов.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const fetchPredprs = async () => {
    try {
      const response = await axios.get("http://localhost:5000/predpr");
      setPredprs(response.data);
    } catch (error) {
      setSnackbarMessage("Ошибка при загрузке предприятий.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const fetchSpecs = async () => {
    try {
      const response = await axios.get("http://localhost:5000/spec");
      setSpecs(response.data);
    } catch (error) {
      setSnackbarMessage("Ошибка при получении спецификаций.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleDeleteOrder = async (id) => {
    if (window.confirm("Вы уверены, что хотите удалить этот заказ?")) {
      try {
        await axios.delete(`http://localhost:5000/orders/${id}`);
        setSnackbarMessage("Заказ успешно удален!");
        setSnackbarSeverity("success");
        fetchOrders(); // Обновляем список после удаления
      } catch (error) {
        setSnackbarMessage("Ошибка при удалении заказа.");
        setSnackbarSeverity("error");
      } finally {
        setSnackbarOpen(true);
      }
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchProducts();
    fetchPredprs();
    fetchSpecs();
  }, []);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <div className={Styles["container__table"]}>
      <h2>УПРАВЛЕНИЕ ЗАКАЗАМИ</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ textAlign: "center" }}>Id</TableCell>
              <TableCell sx={{ textAlign: "center" }}>Название</TableCell>
              <TableCell sx={{ textAlign: "center" }}>Предприятие</TableCell>
              <TableCell sx={{ textAlign: "center" }}>Спецификации</TableCell>
              <TableCell sx={{ textAlign: "center" }}>Количество</TableCell>
              <TableCell sx={{ textAlign: "center" }}>Стоимость</TableCell>
              <TableCell
                sx={{ textAlign: "center" }}
                sx={{ textAlign: "center" }}
                style={{ minWidth: "100px", textAlign: "center" }}
              >
                Действия
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell sx={{ textAlign: "center" }}>{order.id}</TableCell>
                <TableCell sx={{ textAlign: "center" }}>{order.name}</TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  {predprs.find((predpr) => predpr.id === order.predpr_id)
                    ?.name || "Неизвестное предприятие"}
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  {Array.isArray(order.spec_ids)
                    ? order.spec_ids
                        .map((specId) => {
                          const spec = specs.find((s) => s.id === specId);
                          const product = products.find(
                            (prod) => prod.id === (spec ? spec.prod_id : null)
                          );
                          return product ? product.name : "Неизвестный продукт";
                        })
                        .join(", ")
                    : "Нет спецификаций"}
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  {Array.isArray(order.spec_ids)
                    ? order.spec_ids
                        .map((specId) => {
                          const spec = specs.find((s) => s.id === specId);
                          return spec ? spec.kol : "Неизвестный продукт";
                        })
                        .join(", ")
                    : "Нет спецификаций"}
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>{order.cost}</TableCell>
                <TableCell
                  sx={{ textAlign: "center" }}
                  style={{ minWidth: "100px", textAlign: "center" }}
                >
                  <Button
                    onClick={() => handleDeleteOrder(order.id)}
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

export default Orders;
