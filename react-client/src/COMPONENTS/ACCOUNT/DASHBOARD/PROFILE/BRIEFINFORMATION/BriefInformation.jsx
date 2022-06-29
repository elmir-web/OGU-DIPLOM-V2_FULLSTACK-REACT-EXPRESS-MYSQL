import React, { useState, useEffect } from "react";

import CONFIG from "./../../../../../CONFIG.json";

const BriefInformation = ({ workerAccount }) => {
  let [allSheets, setSheets] = useState([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    let sheets = await fetch(`${CONFIG.URL_BACKEND}/api/sheets/get`, {
      method: "GET",
    });

    sheets = await sheets.json();

    setSheets(sheets);
  }, []);

  if (workerAccount?.Function?.ID === 2)
    return (
      <div className="BriefInformation">
        <h2>Мои ведомости</h2>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID ведомости</th>
                <th>Номер ведомости</th>
                <th>Дата ведомости</th>
                <th>Гараж (ID)</th>
                <th>Подписант (ID)</th>
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
                      <td>
                        {sheet.IDsigner.FIO} ({sheet.IDsigner.ID})
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
      </div>
    );
  else return <div className="BriefInformation"></div>;
};

export default BriefInformation;
