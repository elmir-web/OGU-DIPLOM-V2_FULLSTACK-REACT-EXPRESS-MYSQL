import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import "./Profile.scss";

import BriefInformation from "./BRIEFINFORMATION/BriefInformation";

import changeFIO from "./ChangeFIO";
import changeFIOEvent from "./EventChangeFIO";
import changeAccessData from "./ChangeAccessData";
import changeAccessDataEvent from "./EventChangeAccessData";

import Avatar from "./AVATAR/Avatar";

const Profile = ({ workerAccount, setWorkerAccount }) => {
  const [changedFIO, setChangedFIO] = useState(false);
  const [dataFIO, setDataFIO] = useState(null);
  const [changedAccessData, setChangedAccessData] = useState(false);
  const [dataAccess, setDataAccess] = useState(null);

  return (
    <div className="Profile">
      <div className="profile-wrapper">
        <Avatar FunctionID={workerAccount?.Function?.ID} width="350" />

        <div className="content-main">
          <h2>
            {workerAccount?.Function?.Role} {workerAccount?.FIO}
          </h2>
          <p>ID аккаунта: {workerAccount?.ID}</p>
          <p>Автомобильная база: {workerAccount?.IDbase?.Name}</p>
          <p>Логин: {workerAccount?.loginUser}</p>
        </div>
      </div>

      <div className="settings-wrapper">
        {!changedFIO ? (
          <Button
            variant="outlined"
            fullWidth
            sx={{ mt: 1, mb: 1 }}
            onClick={() => changeFIO(workerAccount, setDataFIO, setChangedFIO)}
          >
            Изменить фамилию и инициалы
          </Button>
        ) : (
          <div className="form-fio">
            <h4>Изменение ФИО</h4>
            <TextField
              id="standard-basic"
              label="Введите имя"
              variant="standard"
              fullWidth
              sx={{ mt: 1 }}
              value={dataFIO.FIO1}
              onChange={(e) => {
                setDataFIO({ ...dataFIO, FIO1: e.target.value });
              }}
            />
            <TextField
              id="standard-basic"
              label="Введите фамилию"
              variant="standard"
              fullWidth
              value={dataFIO.FIO2}
              sx={{ mt: 1 }}
              onChange={(e) => {
                setDataFIO({ ...dataFIO, FIO2: e.target.value });
              }}
            />
            <TextField
              id="standard-basic"
              label="Введите отчество"
              variant="standard"
              fullWidth
              value={dataFIO.FIO3}
              sx={{ mt: 1 }}
              onChange={(e) => {
                setDataFIO({ ...dataFIO, FIO3: e.target.value });
              }}
            />
            <Button
              variant="outlined"
              sx={{ mt: 1, mb: 1 }}
              onClick={() =>
                changeFIOEvent(
                  dataFIO,
                  setWorkerAccount,
                  workerAccount,
                  setChangedFIO
                )
              }
            >
              Сохранить
            </Button>
            <Button
              variant="outlined"
              sx={{ ml: 1 }}
              onClick={() => setChangedFIO(false)}
            >
              Отмена
            </Button>
          </div>
        )}

        {!changedAccessData ? (
          <Button
            variant="outlined"
            fullWidth
            sx={{ mt: 1, mb: 1 }}
            onClick={() =>
              changeAccessData(
                setDataAccess,
                workerAccount,
                setChangedAccessData
              )
            }
          >
            Изменить логин и пароль
          </Button>
        ) : (
          <div className="access-form">
            <h4>Изменение логина и пароля</h4>

            <TextField
              id="standard-basic"
              label="Введите логин"
              variant="standard"
              fullWidth
              sx={{ mt: 1 }}
              value={dataAccess.loginUser}
              onChange={(e) => {
                setDataAccess({ ...dataAccess, loginUser: e.target.value });
              }}
            />
            <TextField
              id="standard-basic"
              label="Введите пароль"
              variant="standard"
              fullWidth
              value={dataAccess.passwordUser}
              sx={{ mt: 1 }}
              onChange={(e) => {
                setDataAccess({ ...dataAccess, passwordUser: e.target.value });
              }}
            />
            <Button
              variant="outlined"
              sx={{ mt: 1, mb: 1 }}
              onClick={() =>
                changeAccessDataEvent(
                  dataAccess,
                  setWorkerAccount,
                  workerAccount,
                  setChangedAccessData
                )
              }
            >
              Сохранить
            </Button>
            <Button
              variant="outlined"
              sx={{ ml: 1 }}
              onClick={() => setChangedAccessData(false)}
            >
              Отмена
            </Button>
          </div>
        )}
      </div>

      <BriefInformation workerAccount={workerAccount} />
    </div>
  );
};

export default Profile;
