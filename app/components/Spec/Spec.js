"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
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
import Styles from "./Spec.module.css";

const Specs = () => {
  const [specs, setSpecs] = useState([]);
  const [products, setProducts] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const fetchData = async () => {
    try {
      const [specsResponse, productsResponse] = await Promise.all([
        axios.get("http://localhost:5000/spec"),
        axios.get("http://localhost:5000/prod"),
      ]);
      setSpecs(specsResponse.data);
      setProducts(productsResponse.data);
    } catch (error) {
      setSnackbarMessage(
        "Ошибка при загрузке данных: " +
          (error.response?.data?.message || "Неизвестная ошибка.")
      );
      setSnackbarSeverity("error");
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
      <h2>ПРОСМОТР СПЕЦИФИКАЦИЙ</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ textAlign: "center" }}>ID</TableCell>
              <TableCell sx={{ textAlign: "center" }}>Продукт</TableCell>
              <TableCell sx={{ textAlign: "center" }}>Количество</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {specs.map((spec) => {
              const product = products.find((p) => p.id === spec.prod_id);
              return (
                <TableRow key={spec.id}>
                  <TableCell sx={{ textAlign: "center" }}>{spec.id}</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {product ? product.name : "Не найден"}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>{spec.kol}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

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

export default Specs;
