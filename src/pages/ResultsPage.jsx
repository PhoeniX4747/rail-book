import { ArrowRight, CalendarDays, ChevronRight, CircleHelp, Clock3, Lightbulb, MapPin, RefreshCw, ShieldCheck, Sparkles, Ticket, WandSparkles } from 'lucide-react'
import { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import TrainCard from '../components/train/TrainCard'
import { useBooking } from '../context/BookingContext'
import { getMockRecommendations } from '../services/aiRecommendationService'
import { findTrains, formatDate } from '../services/trainService'

export default function ResultsPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { search, aiPreferences } = useBooking()
  const smartMode = new URLSearchParams(location.search).get('mode') === 'smart'
  const matches = useMemo(() => findTrains(search), [search])
  const recommendations = useMemo(() => getMockRecommendations({ userPreferences: aiPreferences, matchingTrains: matches }), [aiPreferences, matches])
  const recommendationMap = new Map(recommendations.map((item) => [item.trainId, item]))
  const sortedTrains = smartMode ? [...matches].sort((a, b) => (recommendationMap.get(a.id)?.rank || 9) - (recommendationMap.get(b.id)?.rank || 9)) : matches

  return (
    <div className="page results-page">
      <div className="results-crumb"><button onClick={() => navigate(smartMode ? '/assistant' : '/search')}>{smartMode ? 'Smart assistant' : 'Search trains'}</button><ChevronRight size={15} /><span>Train options</span></div>
      <section className="results-header">
        <div><span className="eyebrow">{smartMode ? <><Sparkles size={13} /> Your tailored shortlist</> : 'Your search results'}</span><h1>{smartMode ? 'Here’s what we’d take.' : 'Trains for your journey.'}</h1><p><MapPin size={15} /> {search.from} <ArrowRight size={15} /> {search.to} <span className="result-date"><CalendarDays size={15} /> {formatDate(search.date)}</span></p></div>
        <button className="button button--secondary" onClick={() => navigate('/search')}><RefreshCw size={16} /> Edit search</button>
      </section>

      {smartMode && matches.length > 0 && <section className="ai-summary"><div className="ai-summary-icon"><WandSparkles size={20} /></div><div><strong>We filtered the route first, then ranked {matches.length} relevant train{matches.length !== 1 ? 's' : ''}.</strong><p>{aiPreferences.preferences || 'We prioritized a balanced journey with a strong chance of confirmation.'}</p></div><span className="ai-chip"><ShieldCheck size={15} /> No invented data</span></section>}

      <div className="results-layout">
        <section className="results-list">
          <div className="results-list-heading"><div><strong>{matches.length} option{matches.length !== 1 ? 's' : ''}</strong><span>Sorted for clarity, not clutter.</span></div><span className="sort-note"><Clock3 size={15} /> Direct routes</span></div>
          {sortedTrains.length ? sortedTrains.map((train) => <TrainCard key={train.id} train={train} recommendation={recommendationMap.get(train.id)} showReason={smartMode && Boolean(recommendationMap.get(train.id))} />) : <NoResults onNewSearch={() => navigate('/search')} />}
          {search.tatkal && <TatkalHelper />}
        </section>
        <aside className="results-aside">
          <div className="info-card info-card--highlight"><span className="info-icon"><Lightbulb size={18} /></span><h3>What does the chance mean?</h3><p>It’s an estimate based on this train’s typical availability patterns—not a promise.</p><button className="text-button">How it works <ArrowRight size={15} /></button></div>
          <div className="info-card"><span className="info-icon info-icon--soft"><CircleHelp size={18} /></span><h3>Railway terms, translated</h3><div className="plain-term"><strong>RAC</strong><p>You can travel, and may share a berth until it gets confirmed.</p></div><div className="plain-term"><strong>Waiting list</strong><p>You’ll need a seat to open up. We show how likely that is.</p></div></div>
          <div className="support-card"><Ticket size={18} /><span>Need a different route?<small>We can help you plan a comfortable connection.</small></span><button onClick={() => navigate('/assistant')}><ArrowRight size={16} /></button></div>
        </aside>
      </div>
    </div>
  )
}

function NoResults({ onNewSearch }) {
  return <div className="no-results"><span><MapPin size={23} /></span><h2>We couldn’t find a direct match.</h2><p>Try a nearby city, a flexible date, or ask the Smart Travel Assistant to find a connection.</p><button className="button button--primary" onClick={onNewSearch}>Adjust search <ArrowRight size={16} /></button></div>
}

function TatkalHelper() {
  return <div className="tatkal-helper"><div><span className="eyebrow eyebrow--amber">Tatkal plan</span><h3>We’ve kept backups in view.</h3><p>Pick a primary train, then save two alternatives with strong confirmation potential.</p></div><button className="button button--secondary button--compact">See backup options <ArrowRight size={16} /></button></div>
}
