/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react'
import { createMockBooking } from '../services/bookingService'

const defaultSearch = {
  from: 'Hyderabad',
  to: 'Mumbai',
  date: '2026-10-01',
  travelClass: 'Any class',
  tatkal: false,
  flexible: false,
}

const BookingContext = createContext(null)

export function BookingProvider({ children }) {
  const [search, setSearch] = useState(defaultSearch)
  const [selectedTrain, setSelectedTrain] = useState(null)
  const [aiPreferences, setAiPreferences] = useState({})
  const [bookings, setBookings] = useState(() => JSON.parse(localStorage.getItem('railbook-bookings') || '[]'))
  const [lastBooking, setLastBooking] = useState(null)

  const createBooking = (passengers) => {
    const booking = createMockBooking({ train: selectedTrain, passengers })
    const nextBookings = [booking, ...bookings]
    localStorage.setItem('railbook-bookings', JSON.stringify(nextBookings))
    setBookings(nextBookings)
    setLastBooking(booking)
    return booking
  }

  const cancelBooking = (id) => {
    const nextBookings = bookings.map((booking) => (booking.id === id ? { ...booking, status: 'Cancelled' } : booking))
    localStorage.setItem('railbook-bookings', JSON.stringify(nextBookings))
    setBookings(nextBookings)
  }

  return (
    <BookingContext.Provider
      value={{
        search,
        setSearch,
        selectedTrain,
        setSelectedTrain,
        aiPreferences,
        setAiPreferences,
        bookings,
        lastBooking,
        createBooking,
        cancelBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  )
}

export function useBooking() {
  return useContext(BookingContext)
}
