interface NumberCheckFn<T> {
  (): T
}

export function determineNumber<T> (isPositive: NumberCheckFn<T>, isNegative: NumberCheckFn<T>, isNeutral: NumberCheckFn<T>) {
  return (value: number) => {
    if (value > 0) {
      return isPositive()
    }
    if (value < 0) {
      return isNegative()
    }
    return isNeutral()
  }
}
