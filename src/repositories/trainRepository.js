import mockRailData from '../data/trains.json'

function formatDuration(totalMinutes) {
  return `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`
}

function getArrivalTime(departure, durationMinutes) {
  const [hours, minutes] = departure.split(':').map(Number)
  const total = (hours * 60 + minutes + durationMinutes) % (24 * 60)
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`
}

function buildAllTrains() {
  const { cities, services } = mockRailData

  return cities.flatMap((from, fromIndex) => cities.flatMap((to, toIndex) => {
    if (from.value === to.value) return []

    const routeNumber = fromIndex * cities.length + toIndex
    return services.map((service, serviceIndex) => {
      const fare = 410 + Math.abs(fromIndex - toIndex) * 70 + service.fareOffset
      return {
        ...service,
        id: `RB-${from.code}-${to.code}-${serviceIndex + 1}`,
        number: `${12000 + routeNumber * 10 + serviceIndex}`,
        from: from.name,
        fromCode: from.code,
        to: to.name,
        toCode: to.code,
        arrival: getArrivalTime(service.departure, service.durationMinutes),
        duration: formatDuration(service.durationMinutes),
        fare,
        days: 'Daily',
        route: [from.value, 'Central Junction', to.value],
      }
    })
  }))
}

const trains = buildAllTrains()

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
