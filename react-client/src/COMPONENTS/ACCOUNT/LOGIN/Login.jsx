import * as React from "react";
import { useState, useEffect } from "react";
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
import Toast from "./../../../Toast";

import authorizeAccount from "./AuthorizeAccount";

import { Link as RouterLink, useNavigate } from "react-router-dom";

const theme = createTheme();

export default function Login({ workerAccount, setWorkerAccount }) {
  const [buttonLoginUsingStatus, setButtonLoginUsingStatus] = useState(false);

  let navigate = useNavigate();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    let tempUserAuthCookie = Cookies.get("OGU_DIPLOM_COOKIE_AUTHTOKEN");

    if (tempUserAuthCookie !== undefined && workerAccount === false) {
      setButtonLoginUsingStatus(true);

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
            Авторизация
          </Typography>
          <Box
            component="form"
            onSubmit={(event) =>
              authorizeAccount(
                event,
                setButtonLoginUsingStatus,
                setWorkerAccount,
                navigate
              )
            }
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              autoFocus
              required
              fullWidth
              name="loginUser"
              label="Введите логин"
              type="text"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="passwordUser"
              label="Введите пароль"
              type="text"
            />

            {buttonLoginUsingStatus === false ? (
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Авторизировать аккаунт
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
                Авторизировать аккаунт
              </LoadingButton>
            )}

            <Grid container justifyContent="flex-end"></Grid>

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
                  to="/account/register"
                >
                  У вас нет аккаунта? Регистрация
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
