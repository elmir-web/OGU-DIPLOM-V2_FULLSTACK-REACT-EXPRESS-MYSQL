import React, { useState, useEffect } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Cookies from "js-cookie";
import SaveIcon from "@mui/icons-material/Save";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import Toast from "./../../../Toast";

import createAccount from "./CreateAccount";

const theme = createTheme();

export default function Register({ workerAccount }) {
  const [buttonRegisterUsingStatus, setButtonRegisterUsingStatus] =
    useState(false);
  let navigate = useNavigate();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    let tempUserAuthCookie = Cookies.get("OGU_DIPLOM_COOKIE_AUTHTOKEN");

    if (tempUserAuthCookie !== undefined && workerAccount === false) {
      setButtonRegisterUsingStatus(true);

      new Toast({
        title: "Ошибка",
        text: `Вы уже авторизированы под аккаунт. Подождите 5 секунд, вас перенаправит на профиль!`,
        theme: "danger",
        autohide: true,
        interval: 10000,
      });
      setTimeout(() => navigate("/account/dashboard"), 5000);
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            Регистрация
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={(event) =>
              createAccount(event, setButtonRegisterUsingStatus, navigate)
            }
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoFocus
                  required
                  fullWidth
                  name="FIO1"
                  label="Фамилия"
                  type="text"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="FIO2"
                  label="Имя"
                  type="text"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="FIO3"
                  label="Отчество"
                  type="text"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="loginUser"
                  label="Придумайте логин"
                  type="text"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="passwordUser"
                  label="Придумайте пароль"
                  type="text"
                />
              </Grid>
            </Grid>

            {buttonRegisterUsingStatus === false ? (
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={(e) => {}}
              >
                Создать аккаунт
              </Button>
            ) : (
              <LoadingButton
                fullWidth
                loading
                loadingPosition="start"
                startIcon={<SaveIcon />}
                variant="outlined"
                sx={{ mt: 3, mb: 2 }}
              >
                Создать аккаунт
              </LoadingButton>
            )}

            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2" component={RouterLink} to="/">
                  На главную
                </Link>
              </Grid>

              <Grid item>
                <Link
                  component={RouterLink}
                  variant="body2"
                  to="/account/login"
                >
                  Уже есть аккаунт? Авторизация
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
