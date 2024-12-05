const isValidEntity = (entityList, entityId) => {
  return !!entityList.find((entity) => entity.idn === Number(entityId));
};

const isNameUnique = (entityList, name) => {
  return entityList.every((type) => type.name !== name);
};

const generateIdforEntity = (currentCount, entityName) => {
  return `${++currentCount}${entityName
    .split(' ')
    .shift()
    .split('')
    .filter((al) => al.match(/([a-z]|[0-9])/gi))
    .join('')}${new Date().getMilliseconds()}`;
};

module.exports = { isValidEntity, isNameUnique, generateIdforEntity };
