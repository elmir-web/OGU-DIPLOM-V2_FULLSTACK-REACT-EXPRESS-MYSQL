import React, { useState, useEffect } from "react";
import { Link as LinkRouter } from "react-router-dom";

import "./BriefInformation.scss";

import CONFIG from "./../../../../../CONFIG.json";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import FoundationIcon from "@mui/icons-material/Foundation";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import EngineeringIcon from "@mui/icons-material/Engineering";
import AgricultureIcon from "@mui/icons-material/Agriculture";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import GarageIcon from "@mui/icons-material/Garage";

const BriefInformation = ({ workerAccount }) => {
  let [allSheets, setSheets] = useState([]);
  let [allRecords, setRecords] = useState([]);
  let [allWorkers, setWorkers] = useState([]);
  let [allVehicles, setVehicles] = useState([]);
  let [allAutoGarages, setAutoGarages] = useState([]);
  let [allTypesGSM, setTypesGSM] = useState([]);
  let [allAutoBases, setAutoBases] = useState([]);
  const [storeHouse, SetStoreHouse] = useState([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    let autoBases = await fetch(`${CONFIG.URL_BACKEND}/api/autobase/get`, {
      method: "GET",
    });

    autoBases = await autoBases.json();

    setAutoBases(autoBases);

    let gsm = await fetch(`${CONFIG.URL_BACKEND}/api/type-gsm/get`, {
      method: "GET",
    });

    gsm = await gsm.json();

    setTypesGSM(gsm);

    let autoGarages = await fetch(`${CONFIG.URL_BACKEND}/api/autogarage/get`, {
      method: "GET",
    });

    autoGarages = await autoGarages.json();

    setAutoGarages(autoGarages);

    let vehicles = await fetch(`${CONFIG.URL_BACKEND}/api/vehicles/get`, {
      method: "GET",
    });

    vehicles = await vehicles.json();

    setVehicles(vehicles);

    let storeItems = await fetch(`${CONFIG.URL_BACKEND}/api/storehouse/get`, {
      method: "GET",
    });

    storeItems = await storeItems.json();

    SetStoreHouse(storeItems);

    let sheets = await fetch(`${CONFIG.URL_BACKEND}/api/sheets/get`, {
      method: "GET",
    });

    sheets = await sheets.json();

    sheets = sheets.filter((sheet, index) => {
      if (workerAccount?.Function?.ID === 2)
        return sheet.IDsigner.ID === workerAccount.ID;
      else return true;
    });

    setSheets(sheets);

    let records = await fetch(`${CONFIG.URL_BACKEND}/api/records/get/`, {
      method: "GET",
    });

    records = await records.json();

    records = records.filter((record, index) => {
      if (workerAccount?.Function?.ID === 2)
        return record?.IDsheet?.IDsigner?.ID === workerAccount.ID;
      else return true;
    });

    setRecords(records);

    let workers = await fetch(`${CONFIG.URL_BACKEND}/api/workers/get`, {
      method: "GET",
    });

    workers = await workers.json();

    setWorkers(workers);
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
  else if (workerAccount?.Function?.ID === 3)
    return (
      <div className="BriefInformation">
        <div className="BriefInformation__top">
          <h2>Статистика</h2>
        </div>

        <div className="BriefInformation__items">
          <div className="static-item">
            <FoundationIcon fontSize="large" />

            <div className="item-info">
              <div className="item-value">{allAutoBases.length}</div>
              <div className="item-title">Автомобильные базы</div>
            </div>
          </div>

          <div className="static-item">
            <LocalGasStationIcon fontSize="large" />

            <div className="item-info">
              <div className="item-value">{allTypesGSM.length}</div>
              <div className="item-title">Виды гсм</div>
            </div>
          </div>

          <div className="static-item">
            <GarageIcon fontSize="large" />

            <div className="item-info">
              <div className="item-value">{allAutoGarages.length}</div>
              <div className="item-title">Все гаражи</div>
            </div>
          </div>

          <div className="static-item">
            <AgricultureIcon fontSize="large" />

            <div className="item-info">
              <div className="item-value">{allVehicles.length}</div>
              <div className="item-title">Все автомобили</div>
            </div>
          </div>

          <div className="static-item">
            <EngineeringIcon fontSize="large" />

            <div className="item-info">
              <div className="item-value">{allWorkers.length}</div>
              <div className="item-title">Рабочий персонал</div>
            </div>
          </div>

          <div className="static-item">
            <WarehouseIcon fontSize="large" />

            <div className="item-info">
              <div className="item-value">{storeHouse.length}</div>
              <div className="item-title">Элементов на складе</div>
            </div>
          </div>

          <div className="static-item">
            <AppRegistrationIcon fontSize="large" />

            <div className="item-info">
              <div className="item-value">{allSheets.length}</div>
              <div className="item-title">ведомости</div>
            </div>
          </div>

          <div className="static-item">
            <ListAltIcon fontSize="large" />

            <div className="item-info">
              <div className="item-value">{allRecords.length}</div>
              <div className="item-title">путевые листы</div>
            </div>
          </div>
        </div>
      </div>
    );
  else return <div className="BriefInformation"></div>;
};

export default BriefInformation;
