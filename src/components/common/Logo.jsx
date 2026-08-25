import { Link } from 'react-router-dom'

export default function Logo({ inverse = false }) {
  return (
    <Link className={`brand ${inverse ? 'brand--inverse' : ''}`} to="/dashboard" aria-label="RailBook home">
      <span className="brand-mark" aria-hidden="true">
        <span></span>
        <span></span>
        <span></span>
      </span>
      <span>rail<span>book</span></span>
    </Link>
  )
}
