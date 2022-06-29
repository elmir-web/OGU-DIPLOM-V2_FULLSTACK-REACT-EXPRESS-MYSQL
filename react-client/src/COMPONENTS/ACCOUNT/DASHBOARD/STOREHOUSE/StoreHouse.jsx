import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import Cookies from "js-cookie";

import deleteStore from "./DeleteStore";

import CONFIG from "./../../../../CONFIG.json";

import STOREHOUSE from "./StoreHouse.scss";

const StoreHouse = () => {
  let [statusAccessEditing, setStatusAccessEditing] = useState(false);
  const [storeHouse, SetStoreHouse] = useState([]);

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
                        {/*
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
                        </Button> */}
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
      </div>
    </div>
  );
};

export default StoreHouse;
