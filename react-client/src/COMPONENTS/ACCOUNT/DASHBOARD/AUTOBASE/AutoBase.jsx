import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import BorderColorIcon from "@mui/icons-material/BorderColor";

import CONFIG from "./../../../../CONFIG.json";

import "./AutoBase.scss";

import deleteAutoBase from "./DeleteAutoBase";
import beginUpdateAutoBase from "./BeginUpdateAutoBase";
import eventChangedAutoBase from "./EventChangedAutoBase";
import eventCreatedAutoBase from "./EventCreatedAutoBase";

const AutoBase = ({}) => {
  let [allAutoBases, setAutoBases] = useState([]);
  let [statusAccessEditing, setStatusAccessEditing] = useState(false);
  let [changedAutoBase, setChangedAutoBase] = useState(null);
  let [inputNameAutoBase, setInputNameAutoBase] = useState("");
  let [createNameAutoBase, setCreateNameAutoBase] = useState("");

  useEffect(loadAutoBases, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function loadAutoBases() {
    let tempUserAuthCookie = Cookies.get("OGU_DIPLOM_COOKIE_AUTHTOKEN");

    let responseFetch = await fetch(
      `${CONFIG.URL_BACKEND}/api/autobase/access`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${tempUserAuthCookie}`,
        },
      }
    );

    responseFetch = await responseFetch.json();

    setStatusAccessEditing(responseFetch.access);

    let autoBases = await fetch(`${CONFIG.URL_BACKEND}/api/autobase/get`, {
      method: "GET",
    });

    autoBases = await autoBases.json();

    setAutoBases(autoBases);
    return;
  }

  return (
    <div className="AutoBase">
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID автобазы</th>
              <th>Название автобазы</th>
              <th>Действие</th>
            </tr>
          </thead>
          <tbody>
            {allAutoBases.length ? (
              allAutoBases.map((itemAutoBase) => {
                return (
                  <tr key={itemAutoBase.ID}>
                    <td>{itemAutoBase.ID}</td>
                    <td>{itemAutoBase.Name}</td>
                    <td className="table-buttons">
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => {
                          deleteAutoBase(
                            itemAutoBase,
                            statusAccessEditing,
                            loadAutoBases
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
                          beginUpdateAutoBase(
                            itemAutoBase,
                            statusAccessEditing,
                            changedAutoBase,
                            setChangedAutoBase
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
                <td colSpan="3">Автомобильные базы не найдены</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {statusAccessEditing ? (
        <div className="editing-wrapper">
          <div className="changed-wrapper">
            {changedAutoBase !== null ? (
              <div className="controller-changeautobase">
                <h4>
                  Редактирование автомобильной базы {changedAutoBase.ID}:
                  {changedAutoBase.Name}
                </h4>
                <TextField
                  id="standard-basic"
                  label="Введите название автомобильной базы"
                  variant="standard"
                  fullWidth
                  value={inputNameAutoBase}
                  sx={{ mt: 1 }}
                  onChange={(e) => {
                    setInputNameAutoBase(e.target.value);
                  }}
                />
                <Button
                  variant="contained"
                  color="success"
                  sx={{ mt: 1 }}
                  fullWidth
                  onClick={() => {
                    eventChangedAutoBase(
                      loadAutoBases,
                      changedAutoBase,
                      inputNameAutoBase,
                      setChangedAutoBase,
                      setInputNameAutoBase
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
              Создать автомобильную базу
              {createNameAutoBase !== ""
                ? ` - Название новой автомобильной базы: ${createNameAutoBase}`
                : ""}
            </h4>

            <TextField
              id="standard-basic"
              label="Введите название новой автомобильной базы"
              variant="standard"
              fullWidth
              value={createNameAutoBase}
              onChange={(e) => {
                setCreateNameAutoBase(e.target.value);
              }}
            />
            <Button
              variant="contained"
              color="success"
              sx={{ mt: 1 }}
              fullWidth
              onClick={async () => {
                eventCreatedAutoBase(
                  loadAutoBases,
                  createNameAutoBase,
                  setCreateNameAutoBase
                );
              }}
            >
              Создать
            </Button>
          </div>
        </div>
      ) : (
        <h4>У вас нет доступа для создания или изменения автомобильной базы</h4>
      )}
    </div>
  );
};

export default AutoBase;
