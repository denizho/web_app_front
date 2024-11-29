import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Typography,
} from "@mui/material";

const ProductTable = ({ products, addToCart, stockInfo }) => {
  const [localQuantities, setLocalQuantities] = useState({});

  const handleQuantityChange = (productId, newValue) => {
    setLocalQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(1, newValue),
    }));
  };

  const handleAddToCart = (product) => {
    const amountToAdd = localQuantities[product.id] || 1;
    if (amountToAdd >= 1) {
      addToCart(product, amountToAdd);
      setLocalQuantities((prev) => ({ ...prev, [product.id]: 1 }));
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ textAlign: "center" }}>Продукт</TableCell>
            <TableCell sx={{ textAlign: "center", width: 100 }}>Цена</TableCell>
            <TableCell sx={{ textAlign: "center" }}>Количество</TableCell>
            <TableCell sx={{ textAlign: "center" }}>Действие</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product) => {
            const stockItem = stockInfo.find(
              (item) => item.prod_id === product.id
            );
            const availableQuantity = stockItem ? stockItem.kol : 0;

            return (
              <TableRow key={product.id}>
                <TableCell sx={{ textAlign: "center" }}>
                  {product.name}
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  {product.price} ₽
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  <TextField
                    type="number"
                    value={localQuantities[product.id] || 1}
                    onChange={(e) => {
                      const newValue = Number(e.target.value);
                      if (newValue >= 1 && newValue <= availableQuantity) {
                        handleQuantityChange(product.id, newValue);
                      }
                    }}
                    inputProps={{
                      max: availableQuantity,
                      min: 1,
                      style: { height: "5px" },
                    }}
                  />
                  <br></br>
                  <Typography variant="caption" color="textSecondary">
                    Доступно: {availableQuantity}
                  </Typography>
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  <Button onClick={() => handleAddToCart(product)}>
                    Добавить в корзину
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ProductTable;
