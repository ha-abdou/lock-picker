import LockPicker from "..";

export default function testHelper(
  exp: string,
  callback: (instance: LockPicker) => void
) {
  const lockPicker = new LockPicker(exp);
  const res: any = [];

  callback(lockPicker);
  lockPicker.compile();
  while (!lockPicker.done) {
    res.push(lockPicker.get());
  }
  return res;
}
