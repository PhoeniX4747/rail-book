import { getAllTrains, getTrainById, searchTrains } from '../repositories/trainRepository'

export { getAllTrains, getTrainById }

export function findTrains(search) {
  return searchTrains(search)
}

export function formatDate(value) {
  if (!value) return 'Select a date'
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(
    new Date(`${value}T00:00:00`),
  )
}
