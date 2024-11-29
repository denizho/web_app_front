"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@mui/material";
import Styles from "./Header.module.css";
import { usePathname } from "next/navigation";

export const Header = () => {
  const pathname = usePathname();

  return (
    <header className={Styles["header"]}>
      {pathname === "/" ? (
        <span className={Styles["logo"]}>
          <h3>WEB_APP</h3>
        </span>
      ) : (
        <Link href="/" className={Styles["logo"]}>
          <h3>WEB_APP</h3>
        </Link>
      )}
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
    </header>
  );
};
