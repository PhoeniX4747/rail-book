// This service ranks only the trains already filtered by trainService.
// It can be replaced by a structured OpenAI call without changing the UI.
export function getMockRecommendations({ userPreferences = {}, matchingTrains = [] }) {
  const preferenceText = (userPreferences.preferences || '').toLowerCase()
  const wantsComfort = /comfort|parent|premium|lower berth/.test(preferenceText)
  const wantsCheap = /cheap|budget|lowest/.test(preferenceText)
  const avoidWaitlist = /avoid waiting|confirm|waiting/.test(preferenceText)

  const ranked = [...matchingTrains]
    .map((train) => {
      let score = train.confirmationChance + train.comfort * 2
      if (wantsComfort) score += train.comfort * 5
      if (wantsCheap) score += Math.max(0, 1000 - train.fare) / 12
      if (avoidWaitlist && train.availabilityType === 'available') score += 16
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
        ? `${train.name} is the clearest fit for your priorities: ${train.insight.toLowerCase()}`
        : index === 1
          ? `A strong backup with ${train.confirmationChance}% estimated confirmation and ${train.duration} travel time.`
          : `Worth considering for its ${train.availabilityType === 'available' ? 'current availability' : 'reassuring confirmation outlook'} and ₹${train.fare} fare.`,
  }))
}
