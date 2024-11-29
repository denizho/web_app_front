import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";

const Cart = ({ cartItems, onRemoveFromCart }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: 150, textAlign: "center" }}>
              Продукт
            </TableCell>
            <TableCell sx={{ textAlign: "center" }}>Количество</TableCell>
            <TableCell sx={{ textAlign: "center" }}>Действие</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cartItems.map((item) => (
            <TableRow key={item.product.id}>
              <TableCell sx={{ textAlign: "center" }}>
                {item.product.name}
              </TableCell>
              <TableCell sx={{ textAlign: "center" }}>
                {item.quantity}
              </TableCell>
              <TableCell sx={{ textAlign: "center" }}>
                <Button
                  variant="contained"
                  onClick={() => onRemoveFromCart(item.product.id)}
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
  );
};

export default Cart;
