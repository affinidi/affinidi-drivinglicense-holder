import dayjs from 'dayjs';
import { unset } from 'lodash-es'

export const removeProp = (obj, propToDelete) =>
{
  for (let property in obj) {
    if (obj.hasOwnProperty(property)) {
      if (property === propToDelete) {
        unset(obj, property)
      } else if (typeof Object.prototype.hasOwnProperty.call(obj, property) == 'object') {
        removeProp(Object.prototype.hasOwnProperty.call(obj, property), propToDelete);
      }
    }
  }
  return obj;
};

export const ifDateThenFormat = (str) =>
{
  if (dayjs(str)) {
    return dayjs(str).format('DD/MMM/YYYY');
  } else return str;
};