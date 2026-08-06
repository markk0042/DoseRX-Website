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

  const form = document.getElementById('contact-form')
  const status = document.getElementById('form-status')
  const submitBtn = document.getElementById('contact-submit')
  const topic = document.getElementById('contact-topic')
  const subject = document.getElementById('form-subject')

  const routes = {
    general: {
      to: 'contact@doserx.ie',
      cc: 'support@doserx.ie,devteam@doserx.ie',
      subject: 'DoseRX website enquiry — General',
    },
    support: {
      to: 'support@doserx.ie',
      cc: 'contact@doserx.ie',
      subject: 'DoseRX website enquiry — Support',
    },
    development: {
      to: 'devteam@doserx.ie',
      cc: 'contact@doserx.ie',
      subject: 'DoseRX website enquiry — Development',
    },
  }

  const showStatus = (message, ok) => {
    if (!status) return
    status.hidden = false
    status.textContent = message
    status.classList.toggle('is-ok', ok)
    status.classList.toggle('is-err', !ok)
  }

  form?.addEventListener('submit', async (event) => {
    event.preventDefault()
    if (!form.checkValidity()) {
      form.reportValidity()
      return
    }

    const honey = form.querySelector('[name="_honey"]')
    if (honey && honey.value) return

    const route = routes[topic?.value] || routes.general
    if (subject) subject.value = route.subject

    const payload = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      organisation: form.organisation.value.trim(),
      topic: topic?.selectedOptions?.[0]?.text || topic?.value,
      message: form.message.value.trim(),
      _subject: route.subject,
      _cc: route.cc,
      _template: 'table',
      _replyto: form.email.value.trim(),
    }

    submitBtn.disabled = true
    submitBtn.textContent = 'Sending…'
    showStatus('Sending your message…', true)

    try {
      const res = await fetch(`https://formsubmit.co/ajax/${route.to}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        throw new Error(data.message || 'Could not send right now. Please email us directly.')
      }

      form.reset()
      showStatus(
        'Message sent. If this is your first submission, check the inbox for an activation email from FormSubmit and confirm it — then messages will arrive normally.',
        true,
      )
    } catch (err) {
      showStatus(
        err?.message || 'Something went wrong. Please email contact@doserx.ie directly.',
        false,
      )
    } finally {
      submitBtn.disabled = false
      submitBtn.textContent = 'Send message'
    }
  })
})()
