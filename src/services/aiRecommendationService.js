// This service ranks only the trains already filtered by trainService.
// It can be replaced by a structured OpenAI call without changing the UI.
export function getMockRecommendations({ userPreferences = {}, matchingTrains = [] }) {
  const preferences = Array.isArray(userPreferences.preferences) ? userPreferences.preferences : []

  const ranked = [...matchingTrains]
    .map((train) => {
      let score = train.confirmationChance + train.comfort * 2
      const traits = train.traits || []
      preferences.forEach((preference) => {
        if (traits.includes(preference)) score += 22
        if (preference === 'cheapest') score += Math.max(0, 1100 - train.fare) / 7
        if (preference === 'avoid-waiting' && train.availabilityType === 'available') score += 20
        if (preference === 'lower-berth' && train.classes.includes('2A')) score += 12
        if (preference === 'tatkal' && train.availabilityType !== 'waitlist') score += 10
      })
      return { train, score }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)

  return ranked.map(({ train }, index) => ({
    trainId: train.id,
    rank: index + 1,
    confidence: Math.max(78, train.confirmationChance - index * 3),
    reason:
      index === 0
        ? `${train.name} is the clearest fit for your selected priorities: ${train.insight.toLowerCase()}`
        : index === 1
          ? `A strong backup with ${train.confirmationChance}% estimated confirmation and ${train.duration} travel time.`
          : `Worth considering for its ${train.availabilityType === 'available' ? 'current availability' : 'reassuring confirmation outlook'} and ₹${train.fare} fare.`,
  }))
}
