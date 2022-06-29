import React, { useState, useEffect } from "react";
import { Link as LinkRouter } from "react-router-dom";

import "./BriefInformation.scss";

import CONFIG from "./../../../../../CONFIG.json";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const BriefInformation = ({ workerAccount }) => {
  let [allSheets, setSheets] = useState([]);
  let [allRecords, setRecords] = useState([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    let sheets = await fetch(`${CONFIG.URL_BACKEND}/api/sheets/get`, {
      method: "GET",
    });

    sheets = await sheets.json();

    sheets = sheets.filter((sheet, index) => {
      return sheet.IDsigner.ID === workerAccount.ID;
    });

    setSheets(sheets);

    let records = await fetch(`${CONFIG.URL_BACKEND}/api/records/get/`, {
      method: "GET",
    });

    records = await records.json();

    records = records.filter((record, index) => {
      return record?.IDsheet?.IDsigner?.ID === workerAccount.ID;
    });

    setRecords(records);
  }, []);

  if (workerAccount?.Function?.ID === 2)
    return (
      <div className="BriefInformation">
        <div className="BriefInformation__top">
          <h2>Мои ведомости</h2>

          <LinkRouter to="sheets">
            Ко всем ведомостям <ArrowForwardIcon />
          </LinkRouter>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID ведомости</th>
                <th>Номер ведомости</th>
                <th>Дата ведомости</th>
                <th>Гараж (ID)</th>
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

        <div className="BriefInformation__top">
          <h2>Мои путевые</h2>

          <LinkRouter to="records">
            Ко всем путевым листам <ArrowForwardIcon />
          </LinkRouter>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID путевого листа</th>
                <th>ГСМ (ID)</th>
                <th>Автомобиль (ID)</th>
                <th>Ведомость (ID)</th>
                <th>Водитель (ID)</th>
                <th>Номер путевого листа</th>
                <th>Литры</th>
                <th>Литры: Использ</th>
                <th>Пробег: Открытие</th>
                <th>Пробег: Закрытие</th>
                <th>Статус</th>
              </tr>
            </thead>
            <tbody>
              {allRecords.length ? (
                allRecords.map((record) => {
                  return (
                    <tr key={record.ID}>
                      <td>{record.ID}</td>
                      <td>
                        {record.IDgsm.Name} ({record.IDgsm.ID})
                      </td>
                      <td>
                        {record.IDcar.Model} : {record.IDcar.Number} (
                        {record.IDcar.ID})
                      </td>
                      <td>
                        {record.IDsheet.NumberSheet} ({record.IDsheet.ID})
                      </td>
                      <td>
                        {record.IDdriver.FIO} ({record.IDdriver.ID})
                      </td>
                      <td>{record.NumberPL}</td>
                      <td>{record.Liter}</td>
                      <td>{record.usedLiter}</td>
                      <td>{record.openMileage}</td>
                      <td>
                        {record.closeMileage === null
                          ? "Не закрыт"
                          : record.closeMileage}
                      </td>
                      <td>
                        {record.recStatus === 1 ? "Открыт (1)" : "Закрыт (0)"}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8">Путевых листов не найдено</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  else return <div className="BriefInformation"></div>;
};

export default BriefInformation;
