"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@mui/material";
import Styles from "./Footer.module.css";

export const Footer = () => {
  return (
    <footer className={Styles["footer"]}>
      <div className={Styles["footer__container"]}>
        <Link href="/categories" passHref>
          <Button variant="contained" color="primary">
            Категории
          </Button>
        </Link>
        <Link href="/predpr" passHref>
          <Button variant="contained" color="primary">
            Предприятия{" "}
          </Button>
        </Link>
        <Link href="/prod" passHref>
          <Button variant="contained" color="primary">
            Продукция{" "}
          </Button>
        </Link>
        <Link href="/sklad" passHref>
          <Button variant="contained" color="primary">
            Склад{" "}
          </Button>
        </Link>
        <Link href="/orders" passHref>
          <Button variant="contained" color="primary">
            Заказы{" "}
          </Button>
        </Link>
        <Link href="/spec" passHref>
          <Button variant="contained" color="primary">
            Спецификация{" "}
          </Button>
        </Link>
      </div>
      <div className={Styles["footer__bot"]}>Directed by ISIP22/11</div>
    </footer>
  );
};
