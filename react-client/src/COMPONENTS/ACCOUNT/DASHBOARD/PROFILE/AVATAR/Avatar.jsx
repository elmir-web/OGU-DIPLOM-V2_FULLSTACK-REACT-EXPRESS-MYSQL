import React from "react";

import "./Avatar.scss";

import imgKandidat from "./../../../../../IMAGES/1.Кандидат.jpg";
import imgDriver from "./../../../../../IMAGES/2.Водитель.jpg";
import imgPodpisant from "./../../../../../IMAGES/3.Подписант.jpg";
import imgAdmin from "./../../../../../IMAGES/4.Админ.jpg";

const Avatar = ({ FunctionID, width }) => {
  switch (FunctionID) {
    case 0:
      return (
        // eslint-disable-next-line jsx-a11y/alt-text
        <img
          className="Avatar"
          src={imgKandidat}
          style={{
            width: `${width}px`,
          }}
        />
      );
    case 1:
      return (
        // eslint-disable-next-line jsx-a11y/alt-text
        <img
          className="Avatar"
          src={imgDriver}
          style={{
            width: `${width}px`,
          }}
        />
      );
    case 2:
      return (
        // eslint-disable-next-line jsx-a11y/alt-text
        <img
          className="Avatar"
          src={imgPodpisant}
          style={{
            width: `${width}px`,
          }}
        />
      );
    case 3:
      return (
        // eslint-disable-next-line jsx-a11y/alt-text
        <img
          className="Avatar"
          src={imgAdmin}
          style={{
            width: `${width}px`,
          }}
        />
      );
    default:
      return <div>stop</div>;
  }
};

export default Avatar;
