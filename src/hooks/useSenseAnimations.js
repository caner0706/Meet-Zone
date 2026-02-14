import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

function animateCounter(el) {
  const target = parseFloat(el.getAttribute('data-target')) || 0
  const suffix = el.getAttribute('data-suffix') || ''
  const decimals = parseInt(el.getAttribute('data-decimals'), 10)
  const isDecimal = !isNaN(decimals) && decimals > 0
  const duration = parseInt(el.getAttribute('data-duration'), 10) || 1000
  let startTime = null
  function step(timestamp) {
    if (!startTime) startTime = timestamp
    const progress = Math.min((timestamp - startTime) / duration, 1)
    const ease = 1 - Math.pow(1 - progress, 2)
    const current = target * ease
    el.textContent = isDecimal ? current.toFixed(decimals) : Math.round(current) + suffix
    if (progress < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

export function useSenseAnimations() {
  const location = useLocation()

  useEffect(() => {
    const scrollObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible')
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    )
    const scrollEls = document.querySelectorAll('[data-animate].animate-on-scroll')
    scrollEls.forEach((el) => scrollObserver.observe(el))

    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !entry.target.dataset.animated) {
            entry.target.dataset.animated = '1'
            animateCounter(entry.target)
          }
        })
      },
      { threshold: 0.15 }
    )
    const counterEls = document.querySelectorAll('.counter[data-target]')
    counterEls.forEach((c) => counterObserver.observe(c))

    return () => {
      scrollObserver.disconnect()
      counterObserver.disconnect()
    }
  }, [location.pathname])
}
