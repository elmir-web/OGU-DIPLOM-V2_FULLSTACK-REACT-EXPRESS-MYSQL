import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import Toast from "./../../../../Toast";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";

import "./ReportSheet.scss";

import CONFIG from "./../../../../CONFIG.json";

import eventSelectedSheet from "./EventSelectedSheet";

const ReportSheet = ({}) => {
  let [statusAccessEditing, setStatusAccessEditing] = useState(false);
  let [allSheets, setSheets] = useState([]);
  let [sheetSelected, setSheetSelected] = useState(null);
  let [divSheetHidden, setDivSheetHidden] = useState(false);
  let [sheetReport, setSheetReport] = useState([]);

  useEffect(loadComponent, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function loadComponent() {
    let tempUserAuthCookie = Cookies.get("OGU_DIPLOM_COOKIE_AUTHTOKEN");

    let tempGetAccess = await fetch(`${CONFIG.URL_BACKEND}/api/sheet/access`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${tempUserAuthCookie}`,
      },
    });

    tempGetAccess = await tempGetAccess.json();

    setStatusAccessEditing(tempGetAccess.access);

    let sheets = await fetch(`${CONFIG.URL_BACKEND}/api/sheets/get`, {
      method: "GET",
    });

    sheets = await sheets.json();

    setSheets(sheets);
  }

  return (
    <div className="ReportSheet">
      {divSheetHidden === false ? (
        <div>
          <FormControl fullWidth sx={{ mt: 1 }}>
            <InputLabel id="signer-user-select-sheet">
              Выберите ведомость
            </InputLabel>
            <Select
              labelId="signer-user-select-sheet"
              label="Выберите ведомость"
              defaultValue={99999}
              onChange={(e) => {
                if (e.target.value === 99999) {
                  new Toast({
                    title: "Ошибка при выборе",
                    text: "Этот пукнт не доступен к выбору",
                    theme: "danger",
                    autohide: true,
                    interval: 10000,
                  });

                  setSheetSelected(null);
                  return;
                }

                setSheetSelected(e.target.value);
              }}
            >
              <MenuItem value={99999}>Выберите ведомость</MenuItem>
              {allSheets.map((sheet) => {
                return (
                  <MenuItem key={sheet.ID} value={sheet.ID}>
                    {sheet.NumberSheet} - {sheet.DateSheet} -{" "}
                    {sheet.IDgarage.ID}:{sheet.IDgarage.Name} -{" "}
                    {sheet.IDsigner.ID}:{sheet.IDsigner.FIO}
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
              eventSelectedSheet(
                sheetSelected,
                setDivSheetHidden,
                setSheetReport,
                statusAccessEditing
              )
            }
          >
            Установить
          </Button>
        </div>
      ) : (
        <div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Автобаза</th>
                  <th>Гараж</th>
                  <th>Номер ведомости</th>
                  <th>Дата</th>
                  <th>Подписант</th>
                </tr>
              </thead>
              <tbody>
                {sheetReport[0]?.map((rep, index) => {
                  return (
                    <tr key={index}>
                      <td>{rep["Название базы"]}</td>
                      <td>{rep["Название гаража"]}</td>
                      <td>{rep["Учетный номер ведомости"]}</td>
                      <td>{rep["Дата ведомости"]}</td>
                      <td>{rep["ФИО подписанта"]}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <br />
            <br />
            <br />

            <table>
              <thead>
                <tr>
                  <th>Автомобиль</th>
                  <th>Номер</th>
                  <th>Номер путевого листа</th>
                  <th>Водитель</th>
                  <th>ГСМ</th>
                  <th>Литры</th>
                </tr>
              </thead>
              <tbody>
                {sheetReport[1]?.map((rep, index) => {
                  return (
                    <tr key={index}>
                      <td>{rep["Модель автомобиля"]}</td>
                      <td>{rep["Гос.номер"]}</td>
                      <td>{rep["Учетный номе путевого листа"]}</td>
                      <td>{rep["Водитель"]}</td>
                      <td>{rep["Название ГСМ"]}</td>
                      <td>{rep["Выданное ГСМ"]}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <Button
            variant="contained"
            color="success"
            sx={{ mt: 1 }}
            fullWidth
            onClick={() => {
              setDivSheetHidden(false);
            }}
          >
            Сбросить таблицу
          </Button>
        </div>
      )}
    </div>
  );
};

export default ReportSheet;
