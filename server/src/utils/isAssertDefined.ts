export function isAssertDefined<T>(val: T): asserts val is NonNullable<T> {
  console.log(val);
  if (!val) {
    throw Error("Expected 'val' to be defined, but received " + val);
  }
}
