import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Toast from "./../../../../Toast";

import CONFIG from "./../../../../CONFIG.json";

import "./Workers.scss";

import deleteWorker from "./DeleteWorker";
import beginUpdateWorker from "./BeginUpdateWorker";
import eventChangedWorker from "./EventChangedWorker";
import eventCreatedWorker from "./EventCreatedWorker";

const Workers = ({ workerAccount, dashboardExit }) => {
  let [statusAccessEditing, setStatusAccessEditing] = useState(false);
  let [allWorkers, setWorkers] = useState([]);
  let [allAutoBases, setAutoBases] = useState([]);
  let [allPositions, setPositions] = useState([]);
  let [changedWorker, setChangedWorker] = useState(null);
  let [inputObjectWorker, setInputObjectWorker] = useState({
    ID: null,
    FIO: "",
    loginUser: "",
    passwordUser: "",
    Function: null,
    IDbase: null,
  });
  let [createWorker, setCreateWorker] = useState(null);

  useEffect(loadWorkers, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function loadWorkers() {
    let tempUserAuthCookie = Cookies.get("OGU_DIPLOM_COOKIE_AUTHTOKEN");

    let tempGetAccess = await fetch(`${CONFIG.URL_BACKEND}/api/worker/access`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${tempUserAuthCookie}`,
      },
    });

    const { ok, status } = tempGetAccess;

    tempGetAccess = await tempGetAccess.json();

    setStatusAccessEditing(tempGetAccess.access);

    let workers = await fetch(`${CONFIG.URL_BACKEND}/api/workers/get`, {
      method: "GET",
    });

    workers = await workers.json();

    setWorkers(workers);

    let autoBases = await fetch(`${CONFIG.URL_BACKEND}/api/autobase/get`, {
      method: "GET",
    });

    autoBases = await autoBases.json();

    setAutoBases(autoBases);

    let positions = await fetch(`${CONFIG.URL_BACKEND}/api/positions/get`, {
      method: "GET",
    });

    positions = await positions.json();

    setPositions(positions);
  }

  return (
    <div className="Workers">
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID сотрудника</th>
              <th>ФИО</th>
              <th>Логин</th>
              <th>Пароль</th>
              <th>Должность</th>
              <th>Автобаза (ID)</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {allWorkers.length ? (
              allWorkers.map((worker) => {
                return (
                  <tr key={worker.ID}>
                    <td>{worker.ID}</td>
                    <td>{worker.FIO}</td>
                    <td>{worker.loginUser}</td>
                    <td>
                      {worker.passwordUser.length === 0
                        ? "Не установлен"
                        : "Пароль установлен"}
                    </td>
                    <td>
                      {worker.Function.Role} ({worker.Function.ID})
                    </td>
                    <td>
                      {worker.IDbase.Name} ({worker.IDbase.ID})
                    </td>
                    <td className="table-buttons">
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => {
                          deleteWorker(
                            worker,
                            loadWorkers,
                            statusAccessEditing,
                            workerAccount,
                            dashboardExit
                          );
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </Button>

                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        sx={{ mt: 1 }}
                        onClick={() => {
                          beginUpdateWorker(
                            worker,
                            setChangedWorker,
                            changedWorker,
                            setInputObjectWorker,
                            statusAccessEditing
                          );
                        }}
                      >
                        <BorderColorIcon fontSize="small" />
                      </Button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7">Рабочий персонал не найден</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {statusAccessEditing ? (
        <div className="editing-wrapper">
          <div className="changed-wrapper">
            {changedWorker !== null ? (
              <div>
                <h4>
                  Редактирование сотрудника {changedWorker.FIO} :{" "}
                  {changedWorker.Function.Role} : {changedWorker.IDbase.ID}
                </h4>

                <TextField
                  id="standard-basic"
                  label="Введите ФИО сотрудника"
                  variant="standard"
                  fullWidth
                  value={inputObjectWorker.FIO}
                  sx={{ mt: 1 }}
                  onChange={(e) => {
                    setInputObjectWorker({
                      ...inputObjectWorker,
                      ID: changedWorker.ID,
                      FIO: e.target.value,
                    });
                  }}
                />

                <TextField
                  id="standard-basic"
                  label="Введите логин сотрудника"
                  variant="standard"
                  fullWidth
                  value={inputObjectWorker.loginUser}
                  sx={{ mt: 1 }}
                  onChange={(e) => {
                    setInputObjectWorker({
                      ...inputObjectWorker,
                      ID: changedWorker.ID,
                      loginUser: e.target.value,
                    });
                  }}
                />

                <TextField
                  id="standard-basic"
                  label="Введите пароль сотрудника"
                  variant="standard"
                  fullWidth
                  value={inputObjectWorker.passwordUser}
                  sx={{ mt: 1 }}
                  onChange={(e) => {
                    setInputObjectWorker({
                      ...inputObjectWorker,
                      ID: changedWorker.ID,
                      passwordUser: e.target.value,
                    });
                  }}
                />

                <FormControl fullWidth sx={{ mt: 1 }}>
                  <InputLabel id="worker-change-select-position">
                    Выберите должность
                  </InputLabel>
                  <Select
                    labelId="worker-change-select-position"
                    label="Выберите должность"
                    defaultValue={99999}
                    onChange={(e) => {
                      let tempFunction = e.target.value;

                      if (tempFunction === 99999) {
                        new Toast({
                          title: "Ошибка при выборе",
                          text: "Этот пукнт не доступен к выбору",
                          theme: "danger",
                          autohide: true,
                          interval: 10000,
                        });
                        return;
                      }

                      let objFunction = null;

                      for (let i = 0; i < allPositions.length; i++) {
                        if (allPositions[i].ID === tempFunction) {
                          objFunction = allPositions[i];
                        }
                      }

                      let tempThisWorker = {
                        ...inputObjectWorker,
                        ID: changedWorker.ID,
                        Function: objFunction,
                      };

                      setInputObjectWorker(tempThisWorker);
                    }}
                  >
                    <MenuItem value={99999}>
                      Выберите должность (Текущая должность:{" "}
                      {inputObjectWorker.Function.Role})
                    </MenuItem>

                    {allPositions.map((position) => {
                      return (
                        <MenuItem key={position.ID} value={position.ID}>
                          {position.Role}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>

                <FormControl fullWidth sx={{ mt: 1 }}>
                  <InputLabel id="worker-change-select-auto-base">
                    Выберите автобазу
                  </InputLabel>
                  <Select
                    labelId="worker-change-select-auto-base"
                    label="Выберите автобазу"
                    defaultValue={99999}
                    onChange={(e) => {
                      let tempAutoBase = e.target.value;

                      if (tempAutoBase === 99999) {
                        new Toast({
                          title: "Ошибка при выборе",
                          text: "Этот пукнт не доступен к выбору",
                          theme: "danger",
                          autohide: true,
                          interval: 10000,
                        });
                        return;
                      }

                      let objBase = null;

                      for (let i = 0; i < allAutoBases.length; i++) {
                        if (allAutoBases[i].ID === tempAutoBase) {
                          objBase = allAutoBases[i];
                        }
                      }

                      let tempThisWorker = {
                        ...inputObjectWorker,
                        ID: changedWorker.ID,
                        IDbase: objBase,
                      };

                      setInputObjectWorker(tempThisWorker);
                    }}
                  >
                    <MenuItem value={99999}>
                      Выберите автобазу (Текущая автобаза:{" "}
                      {inputObjectWorker.IDbase.Name})
                    </MenuItem>
                    {allAutoBases.map((autobase) => {
                      return (
                        <MenuItem key={autobase.ID} value={autobase.ID}>
                          {autobase.Name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>

                <Button
                  variant="contained"
                  color="success"
                  sx={{ mt: 1 }}
                  fullWidth
                  onClick={() =>
                    eventChangedWorker(
                      inputObjectWorker,
                      changedWorker,
                      setChangedWorker,
                      setInputObjectWorker,
                      loadWorkers,
                      workerAccount,
                      dashboardExit
                    )
                  }
                >
                  Изменить
                </Button>
              </div>
            ) : (
              ""
            )}
          </div>

          <div className="created-wrapper">
            <h4>
              Создать сотрудника{" "}
              {createWorker !== null
                ? ` - ФИО: ${createWorker?.FIO} Логин: ${createWorker?.loginUser} Пароль: ${createWorker?.passwordUser} Должность: ${createWorker?.Function?.Role} ID автобазы: ${createWorker?.IDbase?.Name}`
                : ""}
            </h4>

            <TextField
              id="standard-basic"
              label="Введите ФИО сотрудника"
              variant="standard"
              fullWidth
              sx={{ mt: 1 }}
              onChange={(e) => {
                let tempFIO = e.target.value;

                if (createWorker === null) {
                  setCreateWorker({ FIO: tempFIO });
                } else {
                  setCreateWorker({ ...createWorker, FIO: tempFIO });
                }
              }}
            />

            <TextField
              id="standard-basic"
              label="Введите логин сотрудника"
              variant="standard"
              fullWidth
              sx={{ mt: 1 }}
              onChange={(e) => {
                let tempLogin = e.target.value;

                if (createWorker === null) {
                  setCreateWorker({ loginUser: tempLogin });
                } else {
                  setCreateWorker({ ...createWorker, loginUser: tempLogin });
                }
              }}
            />

            <TextField
              id="standard-basic"
              label="Введите пароль сотрудника"
              variant="standard"
              fullWidth
              sx={{ mt: 1 }}
              onChange={(e) => {
                let tempPassword = e.target.value;

                if (createWorker === null) {
                  setCreateWorker({
                    passwordUser: tempPassword,
                  });
                } else {
                  setCreateWorker({
                    ...createWorker,
                    passwordUser: tempPassword,
                  });
                }
              }}
            />

            <FormControl fullWidth sx={{ mt: 1 }}>
              <InputLabel id="worker-create-select-position">
                Выберите должность
              </InputLabel>
              <Select
                labelId="worker-create-select-position"
                label="Выберите должность"
                defaultValue={99999}
                onChange={(e) => {
                  let tempFunction = e.target.value;

                  if (tempFunction === 99999) {
                    new Toast({
                      title: "Ошибка при выборе",
                      text: "Этот пукнт не доступен к выбору",
                      theme: "danger",
                      autohide: true,
                      interval: 10000,
                    });

                    if (createWorker === null) {
                      setCreateWorker({ Function: null });
                    } else {
                      setCreateWorker({
                        ...createWorker,
                        Function: null,
                      });
                    }
                    return;
                  }

                  if (createWorker === null) {
                    setCreateWorker({ Function: tempFunction });
                  } else {
                    setCreateWorker({
                      ...createWorker,
                      Function: tempFunction,
                    });
                  }
                }}
              >
                <MenuItem value={99999}>Выберите должность</MenuItem>
                {allPositions.map((position) => {
                  return (
                    <MenuItem key={position.ID} value={position.ID}>
                      {position.Role}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mt: 1 }}>
              <InputLabel id="worker-create-select-auto-base">
                Выберите автобазу
              </InputLabel>
              <Select
                labelId="worker-create-select-auto-base"
                label="Выберите автобазу"
                defaultValue={99999}
                onChange={(e) => {
                  let tempAutoBase = e.target.value;

                  if (tempAutoBase === 99999) {
                    new Toast({
                      title: "Ошибка при выборе",
                      text: "Этот пукнт не доступен к выбору",
                      theme: "danger",
                      autohide: true,
                      interval: 10000,
                    });

                    if (createWorker === null) {
                      setCreateWorker({ IDbase: null });
                    } else {
                      setCreateWorker({
                        ...createWorker,
                        IDbase: null,
                      });
                    }
                    return;
                  }

                  if (createWorker === null) {
                    setCreateWorker({ IDbase: tempAutoBase });
                  } else {
                    setCreateWorker({
                      ...createWorker,
                      IDbase: tempAutoBase,
                    });
                  }
                }}
              >
                <MenuItem value={99999}>Выберите автобазу</MenuItem>
                {allAutoBases.map((autobase) => {
                  return (
                    <MenuItem key={autobase.ID} value={autobase.ID}>
                      {autobase.Name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>

            <Button
              variant="contained"
              color="success"
              sx={{ mt: 1 }}
              fullWidth
              onClick={() =>
                eventCreatedWorker(createWorker, loadWorkers, setCreateWorker)
              }
            >
              Создать
            </Button>
          </div>
        </div>
      ) : (
        <h4>У вас нет доступа для создания или изменения сотрудников</h4>
      )}
    </div>
  );
};

export default Workers;
