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

import "./Autos.scss";

import deleteVehicle from "./DeleteAuto";
import beginUpdateVeh from "./BeginUpdateAuto";
import eventChangedAuto from "./EventChangedAuto";
import eventCreatedAuto from "./EventCreatedAuto";

const Autos = ({ funcRequest }) => {
  let [statusAccessEditing, setStatusAccessEditing] = useState(false);
  let [allVehicles, setVehicles] = useState([]);
  let [allTypesGSM, setTypesGSM] = useState([]);
  let [allAutoGarages, setAutoGarages] = useState([]);
  let [changedVehicle, setChangedVehicle] = useState(null);
  let [inputObjectVehicle, setInputObjectVehicle] = useState({
    ID: null,
    Model: "",
    Number: "",
    IDgarage: null,
  });
  let [createVehicle, setCreateVehicle] = useState(null);

  useEffect(loadVehicles, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function loadVehicles() {
    let tempUserAuthCookie = Cookies.get("OGU_DIPLOM_COOKIE_AUTHTOKEN");

    const tempGetAccess = await funcRequest(
      "/api/vehicle/access",
      "GET",
      null,
      tempUserAuthCookie
    );

    setStatusAccessEditing(tempGetAccess.responseFetch.access);

    const vehicles = await funcRequest(`/api/vehicles/get`, "GET", null, null);

    setVehicles(vehicles.responseFetch);

    console.log(vehicles.responseFetch);

    const typesGSM = await funcRequest(`/api/type-gsm/get`);

    setTypesGSM(typesGSM.responseFetch);

    const autoGarages = await funcRequest(`/api/autogarage/get`);

    setAutoGarages(autoGarages.responseFetch);
  }

  return (
    <div className="Autos">
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Модель</th>
              <th>Гос.номер</th>
              <th>Вид ГСМ</th>
              <th>Гараж (ID)</th>
              <th>Пробег</th>
              <th>Количество литров</th>
              <th>Действие</th>
            </tr>
          </thead>
          <tbody>
            {allVehicles.length ? (
              allVehicles.map((veh) => {
                return (
                  <tr key={veh.ID}>
                    <td>{veh.ID}</td>
                    <td>{veh.Model}</td>
                    <td>{veh.Number}</td>
                    <td>
                      {veh.IDgsm.Name} ({veh.IDgsm.ID})
                    </td>
                    <td>
                      {veh.IDgarage.Name} ({veh.IDgarage.ID})
                    </td>
                    <td>{veh.mileage}</td>
                    <td>{veh.liters}</td>
                    <td className="table-buttons">
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => {
                          deleteVehicle(
                            veh,
                            funcRequest,
                            loadVehicles,
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
                        sx={{ ml: 1 }}
                        onClick={() => {
                          beginUpdateVeh(
                            veh,
                            changedVehicle,
                            setChangedVehicle,
                            setInputObjectVehicle,
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
                <td colSpan="5">Автомобили не найдены</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {statusAccessEditing ? (
        <div className="editing-wrapper">
          <div className="changed-wrapper">
            {changedVehicle !== null ? (
              <div className="controller-changegsm">
                <h4>
                  Редактирование автомобиля {changedVehicle.ID}:
                  {changedVehicle.Model}:{changedVehicle.Number}:
                  {changedVehicle.IDgarage.ID}
                </h4>

                <TextField
                  id="standard-basic"
                  label="Введите модель автомобиля"
                  variant="standard"
                  fullWidth
                  value={inputObjectVehicle.Model}
                  sx={{ mt: 1 }}
                  onChange={(e) => {
                    setInputObjectVehicle({
                      ...inputObjectVehicle,
                      ID: changedVehicle.ID,
                      Model: e.target.value,
                    });
                  }}
                />

                <TextField
                  id="standard-basic"
                  label="Введите гос.номер автомобиля"
                  variant="standard"
                  fullWidth
                  value={inputObjectVehicle.Number}
                  sx={{ mt: 1 }}
                  onChange={(e) => {
                    setInputObjectVehicle({
                      ...inputObjectVehicle,
                      ID: changedVehicle.ID,
                      Number: e.target.value,
                    });
                  }}
                />

                <FormControl fullWidth sx={{ mt: 1 }}>
                  <InputLabel id="auto-change-select-auto-garage">
                    Выберите автогараж
                  </InputLabel>
                  <Select
                    labelId="auto-change-select-auto-garage"
                    label="Выберите автогараж"
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

                      let tempThisVeh = {
                        ...inputObjectVehicle,
                        ID: changedVehicle.ID,
                        IDgarage: tempAutoGarage,
                      };

                      setInputObjectVehicle(tempThisVeh);
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

                <Button
                  variant="contained"
                  color="success"
                  sx={{ mt: 1 }}
                  fullWidth
                  onClick={() => {
                    eventChangedAuto(
                      funcRequest,
                      loadVehicles,
                      inputObjectVehicle,
                      setChangedVehicle,
                      setInputObjectVehicle
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
              Создать автомобиль{" "}
              {createVehicle !== null
                ? ` - Модель: ${createVehicle.Model} | Гос.номер: ${createVehicle.Number}`
                : ""}
            </h4>

            <TextField
              id="standard-basic"
              label="Введите модель автомобиля"
              variant="standard"
              fullWidth
              sx={{ mt: 1 }}
              onChange={(e) => {
                setCreateVehicle({
                  ...createVehicle,
                  Model: e.target.value,
                });
              }}
            />

            <TextField
              id="standard-basic"
              label="Введите гос.номер автомобиля"
              variant="standard"
              fullWidth
              sx={{ mt: 1 }}
              onChange={(e) => {
                setCreateVehicle({
                  ...createVehicle,
                  Number: e.target.value,
                });
              }}
            />

            <FormControl fullWidth sx={{ mt: 1 }}>
              <InputLabel id="auto-create-select-auto-garage">
                Выберите вид ГСМ
              </InputLabel>
              <Select
                labelId="auto-create-select-auto-garage"
                label="Выберите вид ГСМ"
                defaultValue={99999}
                onChange={(e) => {
                  let tempTypeGSM = e.target.value;

                  if (tempTypeGSM === 99999) {
                    new Toast({
                      title: "Ошибка при выборе",
                      text: "Этот пукнт не доступен к выбору",
                      theme: "danger",
                      autohide: true,
                      interval: 10000,
                    });

                    setCreateVehicle({
                      ...createVehicle,
                      IDgsm: -1,
                    });
                    return;
                  }

                  setCreateVehicle({
                    ...createVehicle,
                    IDgsm: tempTypeGSM,
                  });
                }}
              >
                <MenuItem value={99999}>Выберите вид ГСМ</MenuItem>
                {allTypesGSM.map((typeGSM) => {
                  return (
                    <MenuItem key={typeGSM.ID} value={typeGSM.ID}>
                      {typeGSM.Name} | Вес в кг: {typeGSM.ForKilo}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mt: 1 }}>
              <InputLabel id="auto-create-select-auto-garage">
                Выберите автогараж
              </InputLabel>
              <Select
                labelId="auto-create-select-auto-garage"
                label="Выберите автогараж"
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

                    setCreateVehicle({
                      ...createVehicle,
                      IDgarage: -1,
                    });
                    return;
                  }

                  setCreateVehicle({
                    ...createVehicle,
                    IDgarage: tempAutoGarage,
                  });
                }}
              >
                <MenuItem value={99999}>Выберите автогараж</MenuItem>
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
              label="Введите пробег автомобиля"
              variant="standard"
              fullWidth
              sx={{ mt: 1 }}
              onChange={(e) => {
                setCreateVehicle({
                  ...createVehicle,
                  mileage: e.target.value,
                });
              }}
            />

            <TextField
              id="standard-basic"
              label="Введите количество литров"
              variant="standard"
              fullWidth
              sx={{ mt: 1 }}
              onChange={(e) => {
                setCreateVehicle({
                  ...createVehicle,
                  liters: e.target.value,
                });
              }}
            />

            <Button
              variant="contained"
              color="success"
              sx={{ mt: 1 }}
              fullWidth
              onClick={() =>
                eventCreatedAuto(
                  funcRequest,
                  loadVehicles,
                  createVehicle,
                  setCreateVehicle
                )
              }
            >
              Создать
            </Button>
          </div>
        </div>
      ) : (
        <h4>У вас нет доступа для создания или изменения автомобилей</h4>
      )}
    </div>
  );
};

export default Autos;
