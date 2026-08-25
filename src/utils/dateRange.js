const DAY_MS = 24 * 60 * 60 * 1000

function toDateInputValue(date) {
  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000)
  return offsetDate.toISOString().slice(0, 10)
}

export function getBookingDateRange() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return {
    minDate: toDateInputValue(today),
    maxDate: toDateInputValue(new Date(today.getTime() + 45 * DAY_MS)),
  }
}

export function getDefaultBookingDate() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return toDateInputValue(new Date(today.getTime() + 7 * DAY_MS))
}
