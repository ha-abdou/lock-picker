export function iterate(arr: any[]) {
  return function* () {
    for (let i = 0; i < arr.length; i++) {
      yield arr[i];
    }
  };
}
