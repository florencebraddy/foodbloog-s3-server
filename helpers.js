module.exports = async function asyncMap(arr) {
  return await Promise.all(arr.map(async item => await item));
};
