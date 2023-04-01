export class ArrayUtils {
  // deduplicate array of objects
  static deduplicate<T>(array: T[], key: keyof T): T[] {
    return array.filter((obj, pos, arr) => {
      return arr.map((mapObj) => mapObj[key]).indexOf(obj[key]) === pos;
    });
  }
}
