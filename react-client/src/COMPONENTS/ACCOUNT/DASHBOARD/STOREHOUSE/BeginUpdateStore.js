import Toast from "./../../../../Toast";

async function beginUpdateVeh(
  storeItem = null,
  statusAccessEditing,
  setChangeInputStoreItem,
  setChangedStoreItem,
  changedStoreItem
) {
  if (!statusAccessEditing) {
    new Toast({
      title: "Ошибка при изменении данных автомобиля",
      text: "У вашего аккаунта не достаточный уровень доступа, чтобы изменить данные автомобиля!",
      theme: "danger",
      autohide: true,
      interval: 10000,
    });
    return;
  }

  if (changedStoreItem === null && storeItem !== null) {
    setChangedStoreItem(storeItem);

    setChangeInputStoreItem({
      ID: null,
      liters: null,
    });
  } else if (
    changedStoreItem !== null &&
    storeItem !== null &&
    changedStoreItem !== storeItem
  ) {
    setChangedStoreItem(storeItem);

    setChangeInputStoreItem({
      ID: null,
      liters: null,
    });
  } else {
    setChangedStoreItem(null);
  }
}

export default beginUpdateVeh;
