(() => {
  const year = document.getElementById('year')
  if (year) year.textContent = String(new Date().getFullYear())

  const nav = document.getElementById('nav')
  const burger = document.querySelector('.burger')
  const menu = document.getElementById('mobile-menu')
  const heroBg = document.querySelector('.hero-bg')
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const setMenu = (open) => {
    if (!burger || !menu) return
    burger.classList.toggle('open', open)
    burger.setAttribute('aria-expanded', open ? 'true' : 'false')
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu')
    menu.hidden = !open
  }

  burger?.addEventListener('click', () => {
    setMenu(menu?.hidden !== false)
  })

  menu?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenu(false))
  })

  const onScroll = () => {
    const y = window.scrollY
    nav?.classList.toggle('solid', y > 40)

    if (!reduceMotion && heroBg) {
      const shift = Math.min(y * 0.18, 70)
      heroBg.style.transform = `scale(1.06) translate3d(0, ${shift}px, 0)`
    }
  }

  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })

  const reveals = document.querySelectorAll('.reveal')
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -48px 0px' },
    )
    reveals.forEach((el) => io.observe(el))
  } else {
    reveals.forEach((el) => el.classList.add('visible'))
  }
})()
