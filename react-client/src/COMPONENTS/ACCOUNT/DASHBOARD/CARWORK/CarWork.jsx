import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Toast from "./../../../../Toast";

import "./CarWork.scss";

import CONFIG from "./../../../../CONFIG.json";

const CarWork = ({ workerAccount }) => {
  let [allVehicles, setVehicles] = useState([]);
  let [allRecords, setRecords] = useState([]);
  let allMyVehIDsArray = [];
  let [liters, setLiters] = useState(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadCarWork = async () => {
    let records = await fetch(`${CONFIG.URL_BACKEND}/api/records/get/`, {
      method: "GET",
    });

    records = await records.json();

    records = records.filter((record) => {
      return record?.IDdriver.ID === workerAccount.ID;
    });

    setRecords(records);

    for (let index = 0; index < records.length; index++) {
      allMyVehIDsArray.push(records[index]?.IDcar?.ID);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    allMyVehIDsArray = [...new Set(allMyVehIDsArray)];

    for (let index = 0; index < allMyVehIDsArray.length; index++) {
      let vehicle = await fetch(
        `${CONFIG.URL_BACKEND}/api/vehicle/get/${allMyVehIDsArray[index]}`,
        {
          method: "GET",
        }
      );

      vehicle = await vehicle.json();

      setVehicles([...allVehicles, vehicle]);
    }
  };

  useEffect(loadCarWork, []);

  return (
    <div className="CarWork">
      <div className="vehichles">
        {allVehicles.map((vehicle, index) => {
          return (
            <div key={index} className="veh">
              <div className="veh-config">
                ID: {vehicle.ID}
                <br />
                Модель: {vehicle.Model}
                <br />
                Гос.номер: {vehicle.Number}
                <br />
                Вид ГСМ: {vehicle.IDgsm.Name}
                <br />
                Гараж ГСМ: {vehicle.IDgarage.Name}
                <br />
                Пробег: {vehicle.mileage}
                <br />
                Количество литров: {vehicle.liters}
                <br />
                Расход: {vehicle.expense}
              </div>

              <div className="veh-controll">
                <TextField
                  id="standard-basic"
                  label="Введите количество литров"
                  variant="standard"
                  fullWidth
                  sx={{ mt: 1 }}
                  onChange={(e) => {
                    setLiters(e.target.value);
                  }}
                />

                <Button
                  variant="outlined"
                  fullWidth
                  sx={{ mt: 1, mb: 1 }}
                  onClick={() => {
                    if (!window.isValidDouble(liters)) {
                      new Toast({
                        title: "Ошибка при заправке транспорта",
                        text: `Поле ввода литров не должно быть пустым и должно иметь в себе число вида 3.54`,
                        theme: "danger",
                        autohide: true,
                        interval: 10000,
                      });
                      return;
                    }

                    for (let index = 0; index < allRecords.length; index++) {
                      let currentRecord = allRecords[index];
                      if (currentRecord.IDcar.ID === vehicle.ID) {
                        if (
                          Number.parseFloat(currentRecord.usedLiter) +
                            Number.parseFloat(liters) >
                          currentRecord.Liter
                        ) {
                          new Toast({
                            title: "Ошибка при заправке транспорта",
                            text: `Вы не можете заправить топлива больше положенного!`,
                            theme: "danger",
                            autohide: true,
                            interval: 10000,
                          });
                        }

                        return;
                      }
                    }
                  }}
                >
                  Заправить
                </Button>

                <TextField
                  id="standard-basic"
                  label="Введите количество километров"
                  variant="standard"
                  fullWidth
                  sx={{ mt: 1 }}
                  onChange={(e) => {}}
                />

                <Button variant="outlined" fullWidth sx={{ mt: 1, mb: 1 }}>
                  Проехать
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CarWork;
