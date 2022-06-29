import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import TextField from "@mui/material/TextField";
import Cookies from "js-cookie";

import deleteStore from "./DeleteStore";
import beginUpdateStore from "./BeginUpdateStore";
import eventChangedStoreHouse from "./EventChangedStoreHouse";

import CONFIG from "./../../../../CONFIG.json";

import "./StoreHouse.scss";

const StoreHouse = () => {
  let [statusAccessEditing, setStatusAccessEditing] = useState(false);
  const [storeHouse, SetStoreHouse] = useState([]);
  let [changedStoreItem, setChangedStoreItem] = useState(null);
  const [changeInputStoreItem, setChangeInputStoreItem] = useState({
    ID: null,
    liters: null,
  });

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

    tempGetAccess = await tempGetAccess.json();

    setStatusAccessEditing(tempGetAccess.access);

    let vehicles = await fetch(`${CONFIG.URL_BACKEND}/api/storehouse/get`, {
      method: "GET",
    });

    vehicles = await vehicles.json();

    SetStoreHouse(vehicles);
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
          </div>
        ) : (
          <h4>У вас нет доступа для создания или изменения частей склада</h4>
        )}
      </div>
    </div>
  );
};

export default StoreHouse;
