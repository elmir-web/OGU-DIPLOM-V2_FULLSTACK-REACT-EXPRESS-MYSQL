import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import TextField from "@mui/material/TextField";
import Cookies from "js-cookie";
import Toast from "./../../../../Toast";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import deleteStore from "./DeleteStore";
import beginUpdateStore from "./BeginUpdateStore";
import eventChangedStoreHouse from "./EventChangedStoreHouse";
import eventCreatedStoreItem from "./EventCreatedStoreItem";

import CONFIG from "./../../../../CONFIG.json";

import "./StoreHouse.scss";

const StoreHouse = () => {
  let [statusAccessEditing, setStatusAccessEditing] = useState(false);
  let [allTypesGSM, setTypesGSM] = useState([]);
  const [storeHouse, SetStoreHouse] = useState([]);
  let [changedStoreItem, setChangedStoreItem] = useState(null);
  const [changeInputStoreItem, setChangeInputStoreItem] = useState({
    ID: null,
    IDgsm: null,
    liters: null,
  });
  let [createStoreItem, setCreateStoreItem] = useState(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadStoreHouse = async () => {
    let tempUserAuthCookie = Cookies.get("OGU_DIPLOM_COOKIE_AUTHTOKEN");

    let tempGetAccess = await fetch(
      `${CONFIG.URL_BACKEND}/api/storehouse/access`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${tempUserAuthCookie}`,
        },
      }
    );

    let typesGSM = await fetch(`${CONFIG.URL_BACKEND}/api/type-gsm/get`, {
      method: "GET",
    });

    typesGSM = await typesGSM.json();

    setTypesGSM(typesGSM);

    tempGetAccess = await tempGetAccess.json();

    setStatusAccessEditing(tempGetAccess.access);

    let storeItems = await fetch(`${CONFIG.URL_BACKEND}/api/storehouse/get`, {
      method: "GET",
    });

    storeItems = await storeItems.json();

    SetStoreHouse(storeItems);
  };

  useEffect(loadStoreHouse, []);

  return (
    <div className="StoreHouse">
      <div className="Autos">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Вид ГСМ</th>
                <th>Количество литров</th>
                <th>Действие</th>
              </tr>
            </thead>
            <tbody>
              {storeHouse.length ? (
                storeHouse.map((storeItem) => {
                  return (
                    <tr key={storeItem.ID}>
                      <td>{storeItem.ID}</td>
                      <td>
                        {storeItem.IDgsm.Name} ({storeItem.IDgsm.ID})
                      </td>
                      <td>{storeItem.liters}</td>
                      <td className="table-buttons">
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => {
                            deleteStore(
                              statusAccessEditing,
                              loadStoreHouse,
                              storeItem
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
                            beginUpdateStore(
                              storeItem,
                              statusAccessEditing,
                              setChangeInputStoreItem,
                              setChangedStoreItem,
                              changedStoreItem
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
                  <td colSpan="3">Автомобили не найдены</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {statusAccessEditing ? (
          <div className="editing-wrapper">
            <div className="changed-wrapper">
              {changedStoreItem !== null ? (
                <div className="controller-changegsm">
                  <h4>Редактирование ГСМ {changedStoreItem.IDgsm.Name}:</h4>

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

                          setChangeInputStoreItem({
                            ...changeInputStoreItem,
                            ID: changedStoreItem.ID,
                            IDgsm: -1,
                          });
                          return;
                        }

                        setChangeInputStoreItem({
                          ...changeInputStoreItem,
                          ID: changedStoreItem.ID,
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

                  <TextField
                    id="standard-basic"
                    label="Введите количество литров"
                    variant="standard"
                    fullWidth
                    sx={{ mt: 1 }}
                    onChange={(e) => {
                      setChangeInputStoreItem({
                        ...changeInputStoreItem,
                        ID: changedStoreItem.ID,
                        liters: e.target.value,
                      });
                    }}
                  />

                  <Button
                    variant="contained"
                    color="success"
                    sx={{ mt: 1 }}
                    fullWidth
                    onClick={() => {
                      eventChangedStoreHouse(
                        loadStoreHouse,
                        changeInputStoreItem,
                        setChangedStoreItem,
                        setChangeInputStoreItem
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
                Создать элемент склада{" "}
                {createStoreItem !== null
                  ? ` - ID gsm: ${createStoreItem.ID} | Литры: ${createStoreItem.liters}`
                  : ""}
              </h4>

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

                      setCreateStoreItem({
                        ...createStoreItem,
                        IDgsm: -1,
                      });
                      return;
                    }

                    setCreateStoreItem({
                      ...createStoreItem,
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

              <TextField
                id="standard-basic"
                label="Введите количество литров"
                variant="standard"
                fullWidth
                sx={{ mt: 1 }}
                onChange={(e) => {
                  setCreateStoreItem({
                    ...createStoreItem,
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
                  eventCreatedStoreItem(
                    loadStoreHouse,
                    createStoreItem,
                    setCreateStoreItem
                  )
                }
              >
                Создать
              </Button>
            </div>
          </div>
        ) : (
          <h4>У вас нет доступа для создания или изменения частей склада</h4>
        )}
      </div>
    </div>
  );
};

export default StoreHouse;
