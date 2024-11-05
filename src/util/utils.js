const isValidEntity = (entityList, entityId) => {
  return entityList.find(entity => entity.id === entityId) ? true : false;
};

const isValidName = (entityList, name) => {
  return entityList.every(type => type.name !== name) ? true : false;
};

module.exports = {isValidEntity, isValidName};