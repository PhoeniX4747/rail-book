import trains from '../data/trains.json'

export function getAllTrains() {
  return trains
}

export function getTrainById(id) {
  return trains.find((train) => train.id === id)
}

export function searchTrains({ from = '', to = '' } = {}) {
  const source = from.trim().toLowerCase()
  const destination = to.trim().toLowerCase()

  return trains.filter((train) => {
    const matchesFrom = !source || `${train.from} ${train.fromCode}`.toLowerCase().includes(source)
    const matchesTo = !destination || `${train.to} ${train.toCode}`.toLowerCase().includes(destination)
    return matchesFrom && matchesTo
  })
}
