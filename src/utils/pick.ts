/**
 * Create an object composed of the picked object properties
 * @param {Record<string, any>} object
 * @param {string[]} keys
 * @returns {Record<string, any>}
 */
const pick = (
  object: Record<string, any>,
  keys: string[],
): Record<string, any> => {
  return keys.reduce(
    (result, key) => {
      if (object && Object.prototype.hasOwnProperty.call(object, key)) {
        result[key] = object[key];
      }
      return result;
    },
    {} as Record<string, any>,
  );
};

export default pick;
