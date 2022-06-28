import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import LockIcon from "@mui/icons-material/Lock";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import Toast from "./../../../../Toast";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";

import CONFIG from "./../../../../CONFIG.json";

import "./Records.scss";

import deleteRecord from "./DeleteRecord";
import beginUpdateRecord from "./BeginUpdateRecord";
import closeStatusRecord from "./CloseStatusRecord";
import eventChangedRecord from "./EventChangedRecord";
import eventCreatedRecord from "./EventCreatedRecord";

const Records = ({ workerAccount }) => {
  let [statusAccessEditing, setStatusAccessEditing] = useState(false);
  let [allRecords, setRecords] = useState([]);
  let [changedRecord, setChangedRecord] = useState(null);
  let [inputObjectRecord, setInputObjectRecord] = useState({
    ID: null,
    IDsheet: null,
    IDcar: null,
    IDdriver: null,
    NumberPL: null,
    IDgsm: null,
    Liter: null,
  });
  let [allSheets, setSheets] = useState([]);
  let [allVehicles, setVehicles] = useState([]);
  let [allWorkers, setWorkers] = useState([]);
  let [allTypesGSM, setTypesGSM] = useState([]);
  let [createRecord, setCreateRecord] = useState(null);

  useEffect(loadRecords, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function loadRecords() {
    let tempUserAuthCookie = Cookies.get("OGU_DIPLOM_COOKIE_AUTHTOKEN");

    let tempGetAccess = await fetch(`${CONFIG.URL_BACKEND}/api/record/access`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${tempUserAuthCookie}`,
      },
    });

    tempGetAccess = await tempGetAccess.json();

    setStatusAccessEditing(tempGetAccess.access);

    let records = await fetch(`${CONFIG.URL_BACKEND}/api/records/get/`, {
      method: "GET",
    });

    records = await records.json();

    setRecords(records);

    let sheets = await fetch(`${CONFIG.URL_BACKEND}/api/sheets/get`, {
      method: "GET",
    });

    sheets = await sheets.json();

    sheets = sheets.filter((sheet) => {
      return sheet.IDsigner.ID === workerAccount.ID;
    });

    setSheets(sheets);

    let vehicles = await fetch(`${CONFIG.URL_BACKEND}/api/vehicles/get`, {
      method: "GET",
    });

    vehicles = await vehicles.json();

    setVehicles(vehicles);

    let workers = await fetch(`${CONFIG.URL_BACKEND}/api/workers/get`, {
      method: "GET",
    });

    workers = await workers.json();

    workers = workers.filter((worker) => {
      return worker.Function.ID === 1;
    });

    setWorkers(workers);

    let typesGSM = await fetch(`${CONFIG.URL_BACKEND}/api/type-gsm/get`, {
      method: "GET",
    });

    typesGSM = await typesGSM.json();

    setTypesGSM(typesGSM);
  }

  return (
    <div className="Records">
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
              <th>Пробег: Открытие</th>
              <th>Пробег: Закрытие</th>
              <th>Статус</th>
              <th>Действия</th>
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
                    <td>{record.openMileage}</td>
                    <td>
                      {!record.closeMileage ? "Не закрыт" : record.closeMileage}
                    </td>
                    <td>
                      {record.recStatus === 1 ? "Открыт (1)" : "Закрыт (0)"}
                    </td>
                    <td className="table-buttons">
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => {
                          deleteRecord(
                            record,
                            loadRecords,
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
                        sx={{ mt: 1 }}
                        onClick={() => {
                          beginUpdateRecord(
                            record,
                            changedRecord,
                            setChangedRecord,
                            setInputObjectRecord,
                            workerAccount,
                            statusAccessEditing
                          );
                        }}
                      >
                        <BorderColorIcon fontSize="small" />
                      </Button>

                      <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        sx={{
                          ml: 2,
                        }}
                        onClick={() => {
                          closeStatusRecord(
                            statusAccessEditing,
                            record,
                            workerAccount,
                            loadRecords
                          );
                        }}
                      >
                        <LockIcon fontSize="small" />
                      </Button>
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

      {statusAccessEditing ? (
        <div className="editing-wrapper">
          <div className="changed-wrapper">
            {changedRecord !== null ? (
              <div>
                <h4>Редактирование путевого листа {changedRecord.ID}</h4>

                <FormControl fullWidth sx={{ mt: 1 }}>
                  <InputLabel id="record-change-select-sheet">
                    Выберите ведомость
                  </InputLabel>
                  <Select
                    labelId="record-change-select-sheet"
                    label="Выберите ведомость"
                    defaultValue={99999}
                    onChange={(e) => {
                      // !продолжить тут!
                      let tempSheet = e.target.value;

                      if (tempSheet === 99999) {
                        new Toast({
                          title: "Ошибка при выборе",
                          text: "Этот пукнт не доступен к выбору",
                          theme: "danger",
                          autohide: true,
                          interval: 10000,
                        });

                        let tempThisRecord = {
                          ...inputObjectRecord,
                          ID: changedRecord.ID,
                          IDsheet: -1,
                        };

                        setInputObjectRecord(tempThisRecord);
                        return;
                      }

                      let tempThisRecord = {
                        ...inputObjectRecord,
                        ID: changedRecord.ID,
                        IDsheet: tempSheet,
                      };

                      setInputObjectRecord(tempThisRecord);
                    }}
                  >
                    <MenuItem value={99999}>Выберите ведомость</MenuItem>
                    {allSheets.map((sheet) => {
                      return (
                        <MenuItem key={sheet.ID} value={sheet.ID}>
                          {sheet.NumberSheet}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>

                <FormControl fullWidth sx={{ mt: 1 }}>
                  <InputLabel id="record-change-select-auto">
                    Выберите автомобиль
                  </InputLabel>

                  <Select
                    labelId="record-change-select-auto"
                    label="Выберите автомобиль"
                    defaultValue={99999}
                    onChange={(e) => {
                      let tempVehicle = e.target.value;

                      if (tempVehicle === 99999) {
                        new Toast({
                          title: "Ошибка при выборе",
                          text: "Этот пукнт не доступен к выбору",
                          theme: "danger",
                          autohide: true,
                          interval: 10000,
                        });

                        let tempThisRecord = {
                          ...inputObjectRecord,
                          ID: changedRecord.ID,
                          IDcar: -1,
                        };

                        setInputObjectRecord(tempThisRecord);
                        return;
                      }

                      let tempThisRecord = {
                        ...inputObjectRecord,
                        ID: changedRecord.ID,
                        IDcar: tempVehicle,
                      };

                      setInputObjectRecord(tempThisRecord);
                    }}
                  >
                    <MenuItem value={99999}>Выберите автомобиль</MenuItem>
                    {allVehicles.map((vehicle) => {
                      return (
                        <MenuItem key={vehicle.ID} value={vehicle.ID}>
                          {vehicle.Model} : {vehicle.Number}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>

                <FormControl fullWidth sx={{ mt: 1 }}>
                  <InputLabel id="record-change-select-worker">
                    Выберите водителя
                  </InputLabel>
                  <Select
                    labelId="record-change-select-worker"
                    label="Выберите водителя"
                    defaultValue={99999}
                    onChange={(e) => {
                      let tempWorker = e.target.value;

                      if (tempWorker === 99999) {
                        new Toast({
                          title: "Ошибка при выборе",
                          text: "Этот пукнт не доступен к выбору",
                          theme: "danger",
                          autohide: true,
                          interval: 10000,
                        });

                        let tempThisRecord = {
                          ...inputObjectRecord,
                          ID: changedRecord.ID,
                          IDdriver: -1,
                        };

                        setInputObjectRecord(tempThisRecord);
                        return;
                      }

                      let tempThisRecord = {
                        ...inputObjectRecord,
                        ID: changedRecord.ID,
                        IDdriver: tempWorker,
                      };

                      setInputObjectRecord(tempThisRecord);
                    }}
                  >
                    <MenuItem value={99999}>Выберите водителя</MenuItem>
                    {allWorkers.map((worker) => {
                      return (
                        <MenuItem key={worker.ID} value={worker.ID}>
                          {worker.FIO} ({worker.ID})
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>

                <TextField
                  id="standard-basic"
                  label="Введите номер путевого листа"
                  variant="standard"
                  fullWidth
                  sx={{ mt: 1 }}
                  onChange={(e) => {
                    setInputObjectRecord({
                      ...inputObjectRecord,
                      ID: changedRecord.ID,
                      NumberPL: e.target.value,
                    });
                  }}
                />

                <FormControl fullWidth sx={{ mt: 1 }}>
                  <InputLabel id="record-change-select-type-gsm">
                    Выберите ГСМ
                  </InputLabel>
                  <Select
                    labelId="record-change-select-type-gsm"
                    label="Выберите ГСМ"
                    defaultValue={99999}
                    onChange={(e) => {
                      let tempGSM = e.target.value;

                      if (tempGSM === 99999) {
                        new Toast({
                          title: "Ошибка при выборе",
                          text: "Этот пукнт не доступен к выбору",
                          theme: "danger",
                          autohide: true,
                          interval: 10000,
                        });

                        let tempThisRecord = {
                          ...inputObjectRecord,
                          ID: changedRecord.ID,
                          IDgsm: -1,
                        };

                        setInputObjectRecord(tempThisRecord);
                        return;
                      }

                      let tempThisRecord = {
                        ...inputObjectRecord,
                        ID: changedRecord.ID,
                        IDgsm: tempGSM,
                      };

                      setInputObjectRecord(tempThisRecord);
                    }}
                  >
                    <MenuItem value={99999}>Выберите ГСМ</MenuItem>
                    {allTypesGSM.map((gsm) => {
                      return (
                        <MenuItem key={gsm.ID} value={gsm.ID}>
                          {gsm.Name} ({gsm.ID})
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
                    setInputObjectRecord({
                      ...inputObjectRecord,
                      ID: changedRecord.ID,
                      Liter: e.target.value,
                    });
                  }}
                />

                <Button
                  variant="contained"
                  color="success"
                  sx={{ mt: 1 }}
                  fullWidth
                  onClick={() =>
                    eventChangedRecord(
                      loadRecords,
                      inputObjectRecord,
                      setChangedRecord,
                      setInputObjectRecord,
                      changedRecord
                    )
                  }
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
              Создать путевой лист{" "}
              {createRecord !== null
                ? ` - Номер: ${createRecord.NumberPL}`
                : ""}
            </h4>

            <FormControl fullWidth sx={{ mt: 1 }}>
              <InputLabel id="record-change-select-type-gsm">
                Выберите ГСМ
              </InputLabel>
              <Select
                labelId="record-change-select-type-gsm"
                label="Выберите ГСМ"
                defaultValue={99999}
                onChange={(e) => {
                  let tempGSM = e.target.value;

                  if (tempGSM === 99999) {
                    new Toast({
                      title: "Ошибка при выборе",
                      text: "Этот пукнт не доступен к выбору",
                      theme: "danger",
                      autohide: true,
                      interval: 10000,
                    });

                    let tempThisRecord = {
                      ...createRecord,
                      IDgsm: -1,
                    };

                    setCreateRecord(tempThisRecord);
                    return;
                  }

                  let tempThisRecord = {
                    ...createRecord,
                    IDgsm: tempGSM,
                  };

                  setCreateRecord(tempThisRecord);
                }}
              >
                <MenuItem value={99999}>Выберите ГСМ</MenuItem>
                {allTypesGSM.map((gsm) => {
                  return (
                    <MenuItem key={gsm.ID} value={gsm.ID}>
                      {gsm.Name} ({gsm.ID})
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mt: 1 }}>
              <InputLabel id="record-change-select-auto">
                Выберите автомобиль
              </InputLabel>
              <Select
                labelId="record-change-select-auto"
                label="Выберите автомобиль"
                defaultValue={99999}
                onChange={(e) => {
                  let tempVehicle = e.target.value;

                  if (tempVehicle === 99999) {
                    new Toast({
                      title: "Ошибка при выборе",
                      text: "Этот пукнт не доступен к выбору",
                      theme: "danger",
                      autohide: true,
                      interval: 10000,
                    });

                    let tempThisRecord = {
                      ...createRecord,
                      IDcar: -1,
                    };

                    setCreateRecord(tempThisRecord);
                    return;
                  }

                  let tempThisRecord = {
                    ...createRecord,
                    IDcar: tempVehicle,
                  };

                  setCreateRecord(tempThisRecord);
                }}
              >
                <MenuItem value={99999}>Выберите автомобиль</MenuItem>
                {allVehicles.map((vehicle) => {
                  return (
                    <MenuItem key={vehicle.ID} value={vehicle.ID}>
                      {vehicle.Model} : {vehicle.Number}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mt: 1 }}>
              <InputLabel id="record-change-select-sheet">
                Выберите ведомость
              </InputLabel>
              <Select
                labelId="record-change-select-sheet"
                label="Выберите ведомость"
                defaultValue={99999}
                onChange={(e) => {
                  let tempSheet = e.target.value;

                  if (tempSheet === 99999) {
                    new Toast({
                      title: "Ошибка при выборе",
                      text: "Этот пукнт не доступен к выбору",
                      theme: "danger",
                      autohide: true,
                      interval: 10000,
                    });

                    let tempThisRecord = {
                      ...createRecord,
                      IDsheet: -1,
                    };

                    setCreateRecord(tempThisRecord);
                    return;
                  }

                  let tempThisRecord = {
                    ...createRecord,
                    IDsheet: tempSheet,
                  };

                  setCreateRecord(tempThisRecord);
                }}
              >
                <MenuItem value={99999}>Выберите ведомость</MenuItem>
                {allSheets.map((sheet) => {
                  return (
                    <MenuItem key={sheet.ID} value={sheet.ID}>
                      {sheet.NumberSheet}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mt: 1 }}>
              <InputLabel id="record-change-select-worker">
                Выберите водителя
              </InputLabel>
              <Select
                labelId="record-change-select-worker"
                label="Выберите водителя"
                defaultValue={99999}
                onChange={(e) => {
                  let tempWorker = e.target.value;

                  if (tempWorker === 99999) {
                    new Toast({
                      title: "Ошибка при выборе",
                      text: "Этот пукнт не доступен к выбору",
                      theme: "danger",
                      autohide: true,
                      interval: 10000,
                    });

                    let tempThisRecord = {
                      ...createRecord,
                      IDdriver: -1,
                    };

                    setCreateRecord(tempThisRecord);
                    return;
                  }

                  let tempThisRecord = {
                    ...createRecord,
                    IDdriver: tempWorker,
                  };

                  setCreateRecord(tempThisRecord);
                }}
              >
                <MenuItem value={99999}>Выберите водителя</MenuItem>
                {allWorkers.map((worker) => {
                  return (
                    <MenuItem key={worker.ID} value={worker.ID}>
                      {worker.FIO} ({worker.ID})
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>

            <TextField
              id="standard-basic"
              label="Введите номер путевого листа"
              variant="standard"
              fullWidth
              sx={{ mt: 1 }}
              onChange={(e) => {
                setCreateRecord({
                  ...createRecord,
                  NumberPL: e.target.value,
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
                setCreateRecord({
                  ...createRecord,
                  Liter: e.target.value,
                });
              }}
            />

            <TextField
              id="standard-basic"
              label="Пробег на момент открытия"
              variant="standard"
              fullWidth
              sx={{ mt: 1 }}
              onChange={(e) => {
                setCreateRecord({
                  ...createRecord,
                  openMileage: e.target.value,
                });
              }}
            />

            <Button
              variant="contained"
              color="success"
              sx={{ mt: 1 }}
              fullWidth
              onClick={() =>
                eventCreatedRecord(loadRecords, createRecord, setCreateRecord)
              }
            >
              Создать
            </Button>
          </div>
        </div>
      ) : (
        <h4>У вас нет доступа для создания или изменения ведомостей</h4>
      )}
    </div>
  );
};

export default Records;
