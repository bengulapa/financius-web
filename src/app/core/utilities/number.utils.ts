/**
 * https://expertcodeblog.wordpress.com/2018/02/12/typescript-javascript-round-number-by-decimal-pecision/
 * @param number
 * @param precision
 * @returns Rounded number
 */
export function round(number: number, precision: number = 2) {
  if (precision < 0) {
    let factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
  } else {
    return +(Math.round(Number(number + 'e+' + precision)) + 'e-' + precision);
  }
}

export function toPositive(value: number): number {
  return value < 0 ? value * -1 : value;
}
