const isValidEntity = (entityList, entityId) => {
  return !!(entityList.find(entity => entity.idn === Number(entityId)));
};

const isNameUnique = (entityList, name) => {
  return entityList.every(type => type.name !== name);
};

module.exports = {isValidEntity, isNameUnique};