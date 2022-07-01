import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Toast from "./../../../../Toast";

import "./CarWork.scss";

import CONFIG from "./../../../../CONFIG.json";

const CarWork = ({ workerAccount }) => {
  let [statusAccessEditing, setStatusAccessEditing] = useState(false);
  let [allVehicles, setVehicles] = useState([]);
  let [allRecords, setRecords] = useState([]);
  const [storeHouse, SetStoreHouse] = useState([]);
  let [tempCar, setTempCar] = useState({
    liters: null,
    mileage: null,
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadCarWork = async () => {
    let tempUserAuthCookie = Cookies.get("OGU_DIPLOM_COOKIE_AUTHTOKEN");

    let tempGetAccess = await fetch(
      `${CONFIG.URL_BACKEND}/api/carwork/access`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${tempUserAuthCookie}`,
        },
      }
    );

    tempGetAccess = await tempGetAccess.json();

    setStatusAccessEditing(tempGetAccess.access);

    //

    let records = await fetch(
      `${CONFIG.URL_BACKEND}/api/carwork/my-records/get/worker/${workerAccount.ID}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${tempUserAuthCookie}`,
        },
      }
    );

    records = await records.json();

    setRecords(records);

    //

    let vehicles = await fetch(
      `${CONFIG.URL_BACKEND}/api/carwork/my-cars/get/worker/${workerAccount.ID}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${tempUserAuthCookie}`,
        },
      }
    );

    vehicles = await vehicles.json();

    setVehicles(vehicles);

    //

    let storeItems = await fetch(`${CONFIG.URL_BACKEND}/api/storehouse/get`, {
      method: "GET",
    });

    storeItems = await storeItems.json();

    SetStoreHouse(storeItems);
  };

  useEffect(loadCarWork, []);

  return (
    <div className="CarWork">
      {!statusAccessEditing ? (
        <div>
          <h4>У вас нет доступа для работы с автомобилями</h4>
        </div>
      ) : (
        <div>
          <h4>Мои автомобили</h4>

          <div className="CarWork__items">
            {allVehicles.length ? (
              allVehicles.map((veh) => {
                return (
                  <div key={veh.ID} className="CarWork__item">
                    <div>ID: {veh.ID}</div>
                    <div>Модель: {veh.Model}</div>
                    <div>Гос.номер: {veh.Number}</div>
                    <div>
                      ГСМ: {veh.IDgsm.Name} ({veh.IDgsm.ID})
                    </div>
                    <div>
                      Гараж: {veh.IDgarage.Name} ({veh.IDgarage.ID})
                    </div>
                    <div>Пробег: {veh.mileage}км.</div>
                    <div>Литры: {veh.liters}л</div>
                    <div>Расход: {veh.expense}л/100км</div>

                    <div>
                      <TextField
                        id="standard-basic"
                        label="Введите количество литров"
                        variant="standard"
                        fullWidth
                        sx={{ mt: 1 }}
                        value={tempCar.liters}
                        onChange={(e) => {
                          setTempCar({ ...tempCar, liters: e.target.value });
                        }}
                      />

                      <Button
                        variant="contained"
                        color="success"
                        sx={{ mt: 1 }}
                        fullWidth
                        onClick={async () => {
                          if (
                            !("liters" in tempCar) ||
                            tempCar.liters === null ||
                            !window.isValidDouble(tempCar.liters)
                          ) {
                            new Toast({
                              title: "Ошибка при заправке транспорта",
                              text: `Поле ввода литров не должно быть пустым и должно иметь в себе число вида 3.54`,
                              theme: "danger",
                              autohide: true,
                              interval: 10000,
                            });
                            return;
                          }

                          let tempRecord = null;
                          let tempStoreItem = null;

                          for (
                            let index = 0;
                            index < allRecords.length;
                            index++
                          ) {
                            if (allRecords[index].IDcar.ID === veh.ID) {
                              tempRecord = allRecords[index];
                            }
                          }

                          if (
                            tempRecord.Liter <
                            Number(tempRecord.usedLiter) +
                              Number(tempCar.liters)
                          ) {
                            new Toast({
                              title: "Ошибка при заправке транспорта",
                              text: `Вы не можете заправить литров больше чем выдано в путевом листе!`,
                              theme: "danger",
                              autohide: true,
                              interval: 10000,
                            });
                            return;
                          }

                          if (!veh.IDgsm.ID === tempRecord.IDgsm.ID) {
                            new Toast({
                              title: "Ошибка при заправке транспорта",
                              text: `Неизвестная ошибка #1!`,
                              theme: "danger",
                              autohide: true,
                              interval: 10000,
                            });
                            return;
                          }

                          for (
                            let index = 0;
                            index < storeHouse.length;
                            index++
                          ) {
                            if (storeHouse[index].IDgsm.ID === veh.IDgsm.ID) {
                              tempStoreItem = storeHouse[index];
                            }
                          }

                          tempStoreItem.IDgsm = tempStoreItem.IDgsm.ID;

                          if (
                            Number.parseFloat(tempStoreItem.liters) -
                              Number(tempCar.liters) <=
                            0
                          ) {
                            new Toast({
                              title: "Ошибка при заправке транспорта",
                              text: `Такого количества топлива нет на складе для категории топлива автомобиля`,
                              theme: "danger",
                              autohide: true,
                              interval: 10000,
                            });
                            return;
                          }

                          tempStoreItem.liters =
                            Number.parseFloat(tempStoreItem.liters) -
                            Number(tempCar.liters);

                          tempCar = {
                            ...tempCar,
                            liters: Number(tempCar.liters) + Number(veh.liters),
                            mileage: veh.mileage,
                            expense: veh.expense,
                            Number: veh.Number,
                            Model: veh.Model,
                            IDgsm: veh.IDgsm.ID,
                            IDgarage: veh.IDgarage.ID,
                            ID: veh.ID,
                          };

                          tempRecord.usedLiter = tempCar.liters;

                          tempRecord.IDcar = tempRecord.IDcar.ID;
                          tempRecord.IDdriver = tempRecord.IDdriver.ID;
                          tempRecord.IDgsm = tempRecord.IDgsm.ID;
                          tempRecord.IDsheet = tempRecord.IDsheet.ID;

                          let tempUserAuthCookie = Cookies.get(
                            "OGU_DIPLOM_COOKIE_AUTHTOKEN"
                          );

                          let responseFetch = await fetch(
                            `${CONFIG.URL_BACKEND}/api/carwork/my-cars/change/`,
                            {
                              method: "PUT",
                              headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${tempUserAuthCookie}`,
                              },
                              body: JSON.stringify(tempCar),
                            }
                          );

                          let { ok, status } = responseFetch;
                          responseFetch = await responseFetch.json();

                          if (ok === false && status === 400) {
                            new Toast({
                              title: "Ошибка при изменении автомобиля",
                              text: responseFetch,
                              theme: "danger",
                              autohide: true,
                              interval: 10000,
                            });
                            return;
                          }

                          new Toast({
                            title: "Вас ждет успех!",
                            text: responseFetch,
                            theme: "success",
                            autohide: true,
                            interval: 10000,
                          });

                          responseFetch = await fetch(
                            `${CONFIG.URL_BACKEND}/api/carwork/my-records/change/`,
                            {
                              method: "PUT",
                              headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${tempUserAuthCookie}`,
                              },
                              body: JSON.stringify(tempRecord),
                            }
                          );

                          let { ok1, status1 } = responseFetch;
                          responseFetch = await responseFetch.json();

                          if (ok1 === false && status1 === 400) {
                            new Toast({
                              title: "Ошибка при изменении автомобиля",
                              text: responseFetch,
                              theme: "danger",
                              autohide: true,
                              interval: 10000,
                            });
                            return;
                          }

                          new Toast({
                            title: "Вас ждет успех!",
                            text: responseFetch,
                            theme: "success",
                            autohide: true,
                            interval: 10000,
                          });

                          responseFetch = await fetch(
                            `${CONFIG.URL_BACKEND}/api/carwork/storehouse/change/`,
                            {
                              method: "PUT",
                              headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${tempUserAuthCookie}`,
                              },
                              body: JSON.stringify(tempStoreItem),
                            }
                          );

                          let { ok2, status2 } = responseFetch;
                          responseFetch = await responseFetch.json();

                          if (ok2 === false && status2 === 400) {
                            new Toast({
                              title: "Ошибка при изменении автомобиля",
                              text: responseFetch,
                              theme: "danger",
                              autohide: true,
                              interval: 10000,
                            });
                            return;
                          }

                          new Toast({
                            title: "Вас ждет успех!",
                            text: responseFetch,
                            theme: "success",
                            autohide: true,
                            interval: 10000,
                          });

                          loadCarWork();
                        }}
                      >
                        Заправить
                      </Button>

                      <TextField
                        id="standard-basic"
                        label="Введите проезжанное количество километров"
                        variant="standard"
                        fullWidth
                        sx={{ mt: 1 }}
                        value={tempCar.mileage}
                        onChange={(e) => {
                          setTempCar({ ...tempCar, mileage: e.target.value });
                        }}
                      />

                      <Button
                        variant="outlined"
                        sx={{ mt: 1, mb: 1 }}
                        fullWidth
                        onClick={async (e) => {
                          if (!Number.isInteger(parseFloat(tempCar.mileage))) {
                            new Toast({
                              title: "Ошибка при проезде километров",
                              text: `Поле ввода пробега должно быть числом`,
                              theme: "danger",
                              autohide: true,
                              interval: 10000,
                            });
                            return;
                          }

                          let tempThisExpenseToMiliage =
                            (Number.parseFloat(veh.expense) / 100) *
                            Number.parseInt(tempCar.mileage);

                          if (tempThisExpenseToMiliage > veh.liters) {
                            new Toast({
                              title: "Ошибка при проезде километров",
                              text: `Вам не хватает топлива, чтобы проехать это количество километров`,
                              theme: "danger",
                              autohide: true,
                              interval: 10000,
                            });
                            return;
                          }

                          veh.liters =
                            Number(veh.liters) - tempThisExpenseToMiliage;
                          veh.mileage =
                            Number(veh.mileage) + Number(tempCar.mileage);

                          let tempThisCar = JSON.parse(JSON.stringify(veh));

                          tempThisCar.IDgarage = tempThisCar.IDgarage.ID;
                          tempThisCar.IDgsm = tempThisCar.IDgsm.ID;

                          let tempUserAuthCookie = Cookies.get(
                            "OGU_DIPLOM_COOKIE_AUTHTOKEN"
                          );

                          let responseFetch = await fetch(
                            `${CONFIG.URL_BACKEND}/api/carwork/my-cars/change/`,
                            {
                              method: "PUT",
                              headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${tempUserAuthCookie}`,
                              },
                              body: JSON.stringify(tempThisCar),
                            }
                          );

                          let { ok, status } = responseFetch;
                          responseFetch = await responseFetch.json();

                          if (ok === false && status === 400) {
                            new Toast({
                              title: "Ошибка при изменении автомобиля",
                              text: responseFetch,
                              theme: "danger",
                              autohide: true,
                              interval: 10000,
                            });
                            return;
                          }

                          new Toast({
                            title: "Вас ждет успех!",
                            text: responseFetch,
                            theme: "success",
                            autohide: true,
                            interval: 10000,
                          });

                          loadCarWork();
                        }}
                      >
                        Проехать
                      </Button>
                    </div>
                  </div>
                );
              })
            ) : (
              <h4>Вам не прикомандировали автомобили</h4>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CarWork;
