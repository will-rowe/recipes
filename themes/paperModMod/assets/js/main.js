// navigation
const navMenu = document.querySelector('.navMenu')
const navCloser = document.querySelector('.navCloser')
const navGus = document.getElementById('navGusR')
const navGusL = document.getElementById('navGusL')

function openMenu () {
  navGus.classList.remove('duckWalkOn')
  navGus.style.display = 'none'
  navGusL.style.display = 'block'
  navGusL.classList.add('duckWalkOff')
  navMenu.classList.add('active')
}

function closeMenu () {
  navMenu.classList.remove('active')
  navGusL.classList.remove('duckWalkOff')
  navGusL.style.display = 'none'
  navGus.style.display = 'block'
  navGus.classList.add('duckWalkOn')
}

navGus.addEventListener('click', openMenu)
navCloser.addEventListener('click', closeMenu)
window.addEventListener('click', function (e) {
  var node = e.target
  var inside = false
  while (node) {
    if (
      node.classList.contains('navMenu') ||
      node.classList.contains('navGus')
    ) {
      inside = true
      break
    }
    node = node.parentElement
  }
  if (!inside) {
    closeMenu()
  }
})

// touch
document.addEventListener('touchstart', handleTouchStart, false)
document.addEventListener('touchmove', handleTouchMove, false)

var xDown = null
var yDown = null

function getTouches (evt) {
  return (
    evt.touches || evt.originalEvent.touches // browser API
  ) // jQuery
}

function handleTouchStart (evt) {
  const firstTouch = getTouches(evt)[0]
  xDown = firstTouch.clientX
  yDown = firstTouch.clientY
}

function handleTouchMove (evt) {
  if (!xDown || !yDown) {
    return
  }

  var xUp = evt.touches[0].clientX
  var yUp = evt.touches[0].clientY

  var xDiff = xDown - xUp
  var yDiff = yDown - yUp

  if (Math.abs(xDiff) > Math.abs(yDiff)) {
    /* swipe right */
    if (xDiff < 0) {
      openMenu()
    }
  } else {
    if (yDiff > 0) {
      /* down swipe */
    } else {
      /* up swipe */
    }
  }
  /* reset values */
  xDown = null
  yDown = null
}

// dark mode
document.getElementById('darkModeToggle').addEventListener('click', () => {
  if (document.body.className.includes('dark')) {
    document.body.classList.remove('dark')
    localStorage.setItem('pref-theme', 'light')
  } else {
    document.body.classList.add('dark')
    localStorage.setItem('pref-theme', 'dark')
  }
})

// scroller
window.addEventListener('load', function () {
  if (localStorage.getItem('menu-scroll-position')) {
    var menuEl = document.getElementById('menu')
    if (menuEl) {
      menuEl.scrollLeft = localStorage.getItem('menu-scroll-position')
    }
  }
})
var mybutton = document.getElementById('top-link')
window.onscroll = function () {
  if (
    document.body.scrollTop > 800 ||
    document.documentElement.scrollTop > 800
  ) {
    mybutton.style.visibility = 'visible'
    mybutton.style.opacity = '1'
  } else {
    mybutton.style.visibility = 'hidden'
    mybutton.style.opacity = '0'
  }
}
mybutton.onclick = function () {
  document.body.scrollTop = 0
  document.documentElement.scrollTop = 0
  window.location.hash = ''
}

function menu_on_scroll () {
  localStorage.setItem(
    'menu-scroll-position',
    document.getElementById('menu').scrollLeft
  )
}

// ingredients
const metricUnits = ['g', 'kg', 'ml', 'l']
var defaultServe
var ingredients
window.addEventListener('load', function () {
  defaultServe = document.getElementById('serve_size')
  ingredients = Array.from(document.querySelectorAll('.ingredient'))
  var inc = document.querySelector('.spinner.increment')
  var dec = document.querySelector('.spinner.decrement')
  if (inc) inc.addEventListener('click', increment)
  if (dec) dec.addEventListener('click', decrement)
})

function scaleIngredients (newServe, oldServe) {
  var ratio = newServe / oldServe
  ingredients.forEach(function (ingredient) {
    var amountEl = ingredient.querySelector('.ingredient__amount')
    var unitsEl = ingredient.querySelector('.ingredient__units')
    if (!amountEl) return

    var raw = (amountEl.innerText || '').trim()
    // parse quantity, support simple fractions like "1 1/2" or "1/2"
    function parseQty (s) {
      if (!s) return NaN
      var trimmed = s.replace(/,/g, '')
      if (trimmed.indexOf('/') !== -1) {
        // e.g. "1 1/2" or "3/4"
        var parts = trimmed.split(' ')
        if (parts.length === 2 && parts[1].indexOf('/') !== -1) {
          var whole = parseFloat(parts[0]) || 0
          var frac = parts[1].split('/')
          return whole + (parseFloat(frac[0]) / parseFloat(frac[1]))
        }
        var frac = trimmed.split('/')
        return parseFloat(frac[0]) / parseFloat(frac[1])
      }
      return parseFloat(trimmed)
    }

    var qty = parseQty(raw)
    if (isNaN(qty)) return
    var newAmount = qty * ratio
    var unitsText = unitsEl ? (unitsEl.innerText || '').trim() : ''
    if (metricUnits.includes(unitsText)) {
      // keep two decimals for metric, but trim trailing zeros
      amountEl.innerText = (+newAmount.toFixed(2)).toString()
    } else {
      amountEl.innerText = (+newAmount.toFixed(1)).toString()
    }
  })
}

const increment = () => {
  const serveInput = document.getElementById('serve_size')
  if (!serveInput) return
  var current = Number(serveInput.value || serveInput.innerText || serveInput.textContent || 1)
  var next = current + 1
  scaleIngredients(next, current)
  if ('value' in serveInput) serveInput.value = next
  else serveInput.textContent = next
  var stats = document.getElementById('serve_size_stats')
  if (stats) stats.textContent = String(next)
}
const decrement = () => {
  const serveInput = document.getElementById('serve_size')
  if (!serveInput) return
  var current = Number(serveInput.value || serveInput.innerText || serveInput.textContent || 1)
  if (current <= 1) return
  var next = current - 1
  scaleIngredients(next, current)
  if ('value' in serveInput) serveInput.value = next
  else serveInput.textContent = next
  var stats = document.getElementById('serve_size_stats')
  if (stats) stats.textContent = String(next)
}

var modalTrigger = document.getElementById('modalImgTrigger')
if (modalTrigger) {
  var modal = document.getElementById('modalImg')
  var modalImg = document.getElementById('modalImgContent')
  var closeBtn = document.getElementsByClassName('close')[0]
  modalTrigger.onclick = function () {
    modal.style.display = 'block'
    modalImg.src = this.src
  }
  if (closeBtn) {
    closeBtn.onclick = function () {
      modal.style.display = 'none'
    }
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const links = Array.from(document.getElementsByClassName('extLink'))
  if (links.length > 0) {
    links.forEach(link => {
      try {
        const isExternal = link.hostname !== window.location.hostname
        if (isExternal) {
          link.setAttribute('target', '_blank')
          link.setAttribute('rel', 'noopener noreferrer')
        }
      } catch (e) {
        // if link is malformed, skip it
      }
    })
  }
})
