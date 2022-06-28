import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Toast from "./../../../../Toast";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";

import "./GsmDayGarage.scss";

import CONFIG from "./../../../../CONFIG.json";

import eventGarageSelectToReport from "./EventGarageSelectToReport";
import eventDateOfSheetSelectToReport from "./EventDateOfSheetSelectToReport";

const GsmDayGarage = ({}) => {
  let [statusAccessEditing, setStatusAccessEditing] = useState(false);
  let [allAutoGarages, setAutoGarages] = useState([]);
  let [garageSelected, setSelectGarage] = useState(null);
  let [divGarageHidden, setDivGarageHidden] = useState(false);
  let [sheetLoaded, setSheetLoaded] = useState(false);
  let [allSheetsToGarage, setSheetsToGarage] = useState([]);
  let [sheetSelected, setSelectSheet] = useState(null);
  let [divTableReport, setDivTableReport] = useState(false);
  let [reportGSM, setReportGSM] = useState([]);

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

    let autoGarages = await fetch(`${CONFIG.URL_BACKEND}/api/autogarage/get/`, {
      method: "GET",
    });

    autoGarages = await autoGarages.json();

    setAutoGarages(autoGarages);
  }

  return (
    <div className="GsmDayGarage">
      <div>
        <h5>Отчет</h5>
        {garageSelected !== null ? (
          <h5>Выбрать гараж ID: {garageSelected}</h5>
        ) : (
          ""
        )}
        {sheetSelected !== null ? <h5>Дата выбрана: {sheetSelected}</h5> : ""}
      </div>

      {divGarageHidden === false ? (
        <div>
          <FormControl fullWidth sx={{ mt: 1 }}>
            <InputLabel id="signer-user-select-auto-garage">
              Выберите гараж
            </InputLabel>
            <Select
              labelId="signer-user-select-auto-garage"
              label="Выберите гараж"
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

                  setSelectGarage(null);
                  return;
                }

                setSelectGarage(e.target.value);
              }}
            >
              <MenuItem value={99999}>Выберите гараж</MenuItem>
              {allAutoGarages.map((autobase) => {
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
              eventGarageSelectToReport(
                garageSelected,
                setDivGarageHidden,
                setSheetsToGarage,
                setSheetLoaded,
                statusAccessEditing
              )
            }
          >
            Установить
          </Button>
        </div>
      ) : (
        ""
      )}

      {sheetLoaded === true ? (
        <div>
          <FormControl fullWidth sx={{ mt: 1 }}>
            <InputLabel id="signer-user-select-date-of-sheet">
              Выберите дату
            </InputLabel>
            <Select
              labelId="signer-user-select-date-of-sheet"
              label="Выберите дату"
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

                  setSelectSheet(null);
                  return;
                }

                setSelectSheet(e.target.value);
              }}
            >
              <MenuItem value={99999}>Выберите дату</MenuItem>

              {allSheetsToGarage.map((sheet) => {
                return (
                  <MenuItem key={sheet.ID} value={sheet.DateSheet}>
                    {sheet.DateSheet}
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
              eventDateOfSheetSelectToReport(
                setSheetLoaded,
                setDivTableReport,
                garageSelected,
                sheetSelected,
                setReportGSM,
                statusAccessEditing
              )
            }
          >
            Установить
          </Button>
        </div>
      ) : (
        ""
      )}

      {divTableReport === true ? (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Название ГСМ</th>
                <th>Литры</th>
                <th>Вес</th>
              </tr>
            </thead>
            {reportGSM.length ? (
              <tbody>
                {reportGSM.map((report, index) => {
                  return (
                    <tr key={index}>
                      <td>{report.Name}</td>
                      <td>{report.Liter}</td>
                      <td>{report.Kilo}</td>
                    </tr>
                  );
                })}
              </tbody>
            ) : (
              <tbody>
                <tr>
                  <td colSpan="3">Данные не найдены</td>
                </tr>
              </tbody>
            )}
          </table>

          <Button
            variant="contained"
            color="success"
            sx={{ mt: 1 }}
            fullWidth
            onClick={() => {
              setSelectGarage(null);
              setDivGarageHidden(false);
              setSheetLoaded(false);
              setSheetsToGarage([]);
              setSelectSheet(null);
              setDivTableReport(false);
              setReportGSM([]);
            }}
          >
            Сбросить таблицу
          </Button>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default GsmDayGarage;
