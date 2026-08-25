export function createMockBooking({ train, passengers, userId }) {
  const bookingId = `RB${Date.now().toString().slice(-8)}`
  const pnr = `${Math.floor(1000000000 + Math.random() * 8999999999)}`

  return {
    id: bookingId,
    userId,
    pnr,
    status: train.availabilityType === 'available' ? 'Confirmed' : 'RAC — likely to confirm',
    createdAt: new Date().toISOString(),
    train,
    passengers,
    fare: train.fare * passengers.length,
  }
}
