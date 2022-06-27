import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Toast from "./../../../../Toast";

import CONFIG from "./../../../../CONFIG.json";

import "./AutoGarages.scss";

import deleteAutoGarage from "./DeleteAutoGarage";
import beginUpdateAutoGaraga from "./BeginUpdateAutoGarage";
import eventChangedAutoGarage from "./EventChangedAutoGarage";
import eventCreatedAutoGarage from "./EventCreatedAutoGarage";

const AutoGarages = ({}) => {
  let [allAutoGarages, setAutoGarages] = useState([]);
  let [statusAccessEditing, setStatusAccessEditing] = useState(false);
  let [changedAutoGarage, setChangedAutoGarage] = useState(null);
  let [allAutoBases, setAutoBases] = useState([]);
  let [inputObjectAutoGarage, setInputObjectAutoGarage] = useState({
    ID: null,
    Name: "",
    IDbase: null,
  });
  let [createAutoBase, setCreateAutoBase] = useState(null);

  useEffect(loadAutoGarages, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function loadAutoGarages() {
    let tempUserAuthCookie = Cookies.get("OGU_DIPLOM_COOKIE_AUTHTOKEN");

    let tempGetAccess = await fetch(
      `${CONFIG.URL_BACKEND}/api/autogarage/access`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${tempUserAuthCookie}`,
        },
      }
    );

    tempGetAccess = await tempGetAccess.json();

    setStatusAccessEditing(tempGetAccess.access);

    let autoGarages = await fetch(`${CONFIG.URL_BACKEND}/api/autogarage/get`, {
      method: "GET",
    });

    autoGarages = await autoGarages.json();

    setAutoGarages(autoGarages);

    let autoBases = await fetch(`${CONFIG.URL_BACKEND}/api/autobase/get`, {
      method: "GET",
    });

    autoBases = await autoBases.json();

    setAutoBases(autoBases);
  }

  return (
    <div className="AutoGarages">
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID гаража</th>
              <th>Название гаража</th>
              <th>Название автобазы (ID автобазы)</th>
              <th>Действие</th>
            </tr>
          </thead>
          <tbody>
            {allAutoGarages.length ? (
              allAutoGarages.map((autogarage) => {
                return (
                  <tr key={autogarage.ID}>
                    <td>{autogarage.ID}</td>
                    <td>{autogarage.Name}</td>
                    <td>
                      {autogarage.IDbase.Name} ({autogarage.IDbase.ID})
                    </td>
                    <td className="table-buttons">
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() =>
                          deleteAutoGarage(
                            autogarage,
                            loadAutoGarages,
                            statusAccessEditing
                          )
                        }
                      >
                        <DeleteIcon fontSize="small" />
                      </Button>

                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        sx={{ ml: 1 }}
                        onClick={() => {
                          beginUpdateAutoGaraga(
                            autogarage,
                            changedAutoGarage,
                            setChangedAutoGarage,
                            setInputObjectAutoGarage,
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
                <td colSpan="4">Автомобильные гаражи не найдены</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {statusAccessEditing ? (
        <div className="editing-wrapper">
          <div className="changed-wrapper">
            {changedAutoGarage !== null ? (
              <div className="controller-changegsm">
                <h4>
                  Редактирование автомобильного гаража {changedAutoGarage.ID}:
                  {changedAutoGarage.Name}
                </h4>

                <TextField
                  id="standard-basic"
                  label="Введите название гаража"
                  variant="standard"
                  fullWidth
                  value={inputObjectAutoGarage.Name}
                  sx={{ mt: 1 }}
                  onChange={(e) => {
                    setInputObjectAutoGarage({
                      ...inputObjectAutoGarage,
                      ID: changedAutoGarage.ID,
                      Name: e.target.value,
                    });
                  }}
                />

                <FormControl fullWidth sx={{ mt: 1 }}>
                  <InputLabel id="auto-garage-change-select-auto-base">
                    Выберите автобазу
                  </InputLabel>
                  <Select
                    labelId="auto-garage-change-select-auto-base"
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

                        let tempThisGarage = {
                          ...inputObjectAutoGarage,
                          ID: changedAutoGarage.ID,
                          IDbase: -1,
                        };

                        setInputObjectAutoGarage(tempThisGarage);

                        return;
                      }

                      let tempThisGarage = {
                        ...inputObjectAutoGarage,
                        ID: changedAutoGarage.ID,
                        IDbase: tempAutoBase,
                      };

                      setInputObjectAutoGarage(tempThisGarage);
                    }}
                  >
                    <MenuItem value={99999}>
                      Выберите автомобильную базу
                    </MenuItem>

                    {allAutoBases.map((autobase) => {
                      return (
                        <MenuItem value={autobase.ID} key={autobase.ID}>
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
                  onClick={() => {
                    eventChangedAutoGarage(
                      loadAutoGarages,
                      inputObjectAutoGarage,
                      setChangedAutoGarage,
                      setInputObjectAutoGarage
                    );
                  }}
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
              Создать гараж{" "}
              {createAutoBase !== null
                ? ` - Название: ${createAutoBase.Name}`
                : ""}
            </h4>

            <TextField
              id="standard-basic"
              label="Введите название гаража"
              variant="standard"
              fullWidth
              sx={{ mt: 1 }}
              onChange={(e) => {
                setCreateAutoBase({ ...createAutoBase, Name: e.target.value });
              }}
            />

            <FormControl fullWidth sx={{ mt: 1 }}>
              <InputLabel id="auto-garage-create-select-auto-base">
                Выберите автобазу
              </InputLabel>
              <Select
                labelId="auto-garage-create-select-auto-base"
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

                    setCreateAutoBase({ ...createAutoBase, IDbase: -1 });

                    return;
                  }

                  setCreateAutoBase({
                    ...createAutoBase,
                    IDbase: tempAutoBase,
                  });
                }}
              >
                <MenuItem value={99999}>Выберите автомобильную базу</MenuItem>
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
                eventCreatedAutoGarage(
                  loadAutoGarages,
                  createAutoBase,
                  setCreateAutoBase
                )
              }
            >
              Создать
            </Button>
          </div>
        </div>
      ) : (
        <h4>У вас нет доступа для создания или изменения гаражей</h4>
      )}
    </div>
  );
};

export default AutoGarages;
