import { getAllStations } from '../repositories/stationRepository'

export function getStationOptions() {
  return getAllStations()
}
