/**
 * 把query参数中的number转化成string
 * @param input Object
 */
export const toStringLocal: <T extends { [propName: string]: any }>(
  input: T,
) => { [k in keyof T]: string } = function(input) {
  for (const prop in input) {
    if (typeof input[prop] === 'number' || typeof input[prop] === 'boolean') {
      input[prop] = input[prop].toString()
    }
  }
  return input
}
