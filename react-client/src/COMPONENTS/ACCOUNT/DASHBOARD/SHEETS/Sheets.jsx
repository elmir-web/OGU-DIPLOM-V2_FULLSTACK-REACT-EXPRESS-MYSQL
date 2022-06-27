import React, { useState, useEffect } from "react";
import moment from "moment";
import Cookies from "js-cookie";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import Toast from "./../../../../Toast";
import MenuItem from "@mui/material/MenuItem";

import "./Sheets.scss";

import deleteSheet from "./DeleteSheet";
import beginUpdateSheet from "./BeginUpdateSheet";
import eventChangedSheet from "./EventChangedSheet";
import eventCreatedSheet from "./EventCreatedSheet";

const Sheets = ({ funcRequest, workerAccount }) => {
  let [statusAccessEditing, setStatusAccessEditing] = useState(false);
  let [allSheets, setSheets] = useState([]);
  let [allAutoGarages, setAutoGarages] = useState([]);
  let [changedSheet, setChangedSheet] = useState(null);
  let [inputObjectSheet, setInputObjectSheet] = useState({
    ID: null,
    NumberSheet: null,
    DateSheet: moment(new Date()).format("YYYY-MM-DD"),
    IDgarage: null,
    IDsigner: null,
  });
  let [createSheet, setCreateSheet] = useState(null);

  useEffect(loadSheets, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function loadSheets() {
    let tempUserAuthCookie = Cookies.get("OGU_DIPLOM_COOKIE_AUTHTOKEN");

    const tempGetAccess = await funcRequest(
      "/api/sheet/access",
      "GET",
      null,
      tempUserAuthCookie
    );

    setStatusAccessEditing(tempGetAccess.responseFetch.access);

    const sheets = await funcRequest(`/api/sheets/get`);

    setSheets(sheets.responseFetch);

    const autoGarages = await funcRequest(`/api/autogarage/get/`);

    setAutoGarages(autoGarages.responseFetch);
  }

  return (
    <div className="Sheets">
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID ведомости</th>
              <th>Номер ведомости</th>
              <th>Дата ведомости</th>
              <th>Гараж (ID)</th>
              <th>Подписант (ID)</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {allSheets.length ? (
              allSheets.map((sheet) => {
                return (
                  <tr key={sheet.ID}>
                    <td>{sheet.ID}</td>
                    <td>{sheet.NumberSheet}</td>
                    <td>{sheet.DateSheet}</td>
                    <td>
                      {sheet.IDgarage.Name} ({sheet.IDgarage.ID})
                    </td>
                    <td>
                      {sheet.IDsigner.FIO} ({sheet.IDsigner.ID})
                    </td>
                    <td className="table-buttons">
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => {
                          deleteSheet(
                            sheet,
                            funcRequest,
                            loadSheets,
                            statusAccessEditing
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
                          beginUpdateSheet(
                            sheet,
                            changedSheet,
                            setChangedSheet,
                            setInputObjectSheet,
                            statusAccessEditing,
                            workerAccount
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
                <td colSpan="6">Ведомости не найдены</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {statusAccessEditing ? (
        <div className="editing-wrapper">
          <div className="changed-wrapper">
            {changedSheet !== null ? (
              <div>
                <h4>
                  Редактирование ведомости {changedSheet.NumberSheet}:
                  {changedSheet.DateSheet}
                </h4>

                <TextField
                  id="standard-basic"
                  label="Введите номер ведомости"
                  variant="standard"
                  fullWidth
                  sx={{ mt: 1 }}
                  onChange={(e) => {
                    setInputObjectSheet({
                      ...inputObjectSheet,
                      ID: changedSheet.ID,
                      NumberSheet: e.target.value,
                    });
                  }}
                />

                <TextField
                  id="date"
                  label="Дата ведомости"
                  type="date"
                  value={inputObjectSheet.DateSheet}
                  sx={{ mt: 1 }}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={(e) => {
                    setInputObjectSheet({
                      ...inputObjectSheet,
                      ID: changedSheet.ID,
                      DateSheet: e.target.value,
                    });
                  }}
                />

                <FormControl fullWidth sx={{ mt: 1 }}>
                  <InputLabel id="sheet-change-select-auto-garage">
                    Выберите гараж
                  </InputLabel>
                  <Select
                    labelId="sheet-change-select-auto-garage"
                    label="Выберите гараж"
                    defaultValue={99999}
                    onChange={(e) => {
                      let tempAutoGarage = e.target.value;

                      if (tempAutoGarage === 99999) {
                        new Toast({
                          title: "Ошибка при выборе",
                          text: "Этот пукнт не доступен к выбору",
                          theme: "danger",
                          autohide: true,
                          interval: 10000,
                        });
                        return;
                      }

                      let tempThisSheet = {
                        ...inputObjectSheet,
                        ID: changedSheet.ID,
                        IDgarage: tempAutoGarage,
                      };

                      setInputObjectSheet(tempThisSheet);
                    }}
                  >
                    <MenuItem value={99999}>Выберите гараж</MenuItem>
                    {allAutoGarages.map((autogarage) => {
                      return (
                        <MenuItem key={autogarage.ID} value={autogarage.ID}>
                          {autogarage.Name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>

                <TextField
                  id="standard-basic"
                  label="Подписант"
                  variant="standard"
                  fullWidth
                  sx={{ mt: 1 }}
                  disabled
                  value={workerAccount.FIO}
                />

                <Button
                  variant="contained"
                  color="success"
                  sx={{ mt: 1 }}
                  fullWidth
                  onClick={() =>
                    eventChangedSheet(
                      funcRequest,
                      loadSheets,
                      inputObjectSheet,
                      setChangedSheet,
                      setInputObjectSheet,
                      changedSheet
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
              Создать ведомость{" "}
              {createSheet !== null
                ? ` - Номер: ${createSheet.NumberSheet}`
                : ""}
            </h4>

            <TextField
              id="standard-basic"
              label="Введите номер ведомости"
              variant="standard"
              fullWidth
              sx={{ mt: 1 }}
              onChange={(e) => {
                setCreateSheet({
                  ...createSheet,
                  NumberSheet: e.target.value,
                });
              }}
            />

            <TextField
              id="date"
              label="Дата ведомости"
              type="date"
              value={inputObjectSheet.DateSheet}
              sx={{ mt: 1 }}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e) => {
                setCreateSheet({
                  ...createSheet,
                  DateSheet: e.target.value,
                });
              }}
            />

            <FormControl fullWidth sx={{ mt: 1 }}>
              <InputLabel id="sheet-create-select-auto-garage">
                Выберите гараж
              </InputLabel>
              <Select
                labelId="sheet-create-select-auto-garage"
                label="Выберите гараж"
                defaultValue={99999}
                onChange={(e) => {
                  let tempAutoGarage = e.target.value;

                  if (tempAutoGarage === 99999) {
                    new Toast({
                      title: "Ошибка при выборе",
                      text: "Этот пукнт не доступен к выбору",
                      theme: "danger",
                      autohide: true,
                      interval: 10000,
                    });
                    return;
                  }

                  let tempThisSheet = {
                    ...createSheet,
                    IDgarage: tempAutoGarage,
                  };

                  setCreateSheet(tempThisSheet);
                }}
              >
                <MenuItem value={99999}>Выберите гараж</MenuItem>
                {allAutoGarages.map((autogarage) => {
                  return (
                    <MenuItem key={autogarage.ID} value={autogarage.ID}>
                      {autogarage.Name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>

            <TextField
              disabled
              label="Подписант"
              defaultValue="Вы"
              fullWidth
              variant="standard"
              sx={{ mt: 1 }}
            />

            <Button
              variant="contained"
              color="success"
              sx={{ mt: 1 }}
              fullWidth
              onClick={async () =>
                eventCreatedSheet(
                  funcRequest,
                  loadSheets,
                  createSheet,
                  setCreateSheet,
                  workerAccount
                )
              }
            >
              Создать
            </Button>
          </div>
        </div>
      ) : (
        <h4>У вас нет доступа для создания или изменения ведомостей</h4>
      )}
    </div>
  );
};

export default Sheets;
