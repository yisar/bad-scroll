'use strict'

function BScroll(ctx) {
  var el = ctx
  var OFFSET = 50
  var vy = 0
  var F = 150
  var isDown = false
  var isTransform = false
  var cur = 0


  ctx.addEventListener('touchstart', function (e) {
    if (isTransform) return
    clearTimeout(this._timer)
    vy = 0

    this._oy = e.changedTouches[0].clientY - cur
    this._cy = e.changedTouches[0].clientY
    this._oh = this.scrollHeight
    this._ch = this.clientHeight
    this._startTime = e.timeStamp
    isDown = true

  })

  ctx.addEventListener('touchmove', function (e) {
    if (isDown) {
      if (e.timeStamp - this._startTime > 50) {
        this._startTime = e.timeStamp
        cur = e.changedTouches[0].clientY - this._oy
        console.log(e.changedTouches[0].clientY, this._oy)
        if (cur > 0) {
          cur *= F / (F + cur)
        } else if (cur < this._ch - this._oh) {
          cur += this._oh - this._ch
          cur = (cur * F) / (F - cur) - this._oh + this._ch
        }

        transform(cur)
      }
      vy = e.changedTouches[0].clientY - this._cy
      this._cy = e.changedTouches[0].clientY
    }

  }, false)

  ctx.addEventListener('touchend', function () {
    if (isDown) {
      isDown = false
      var f = ((vy >> 31) * 2 + 1) * 0.5
      var oh = this.scrollHeight - this.clientHeight
      var bounce = function () {
        vy -= f
        cur += vy

        transform(cur)

        var requestId = window.requestAnimationFrame(bounce)
        if (-cur - oh > OFFSET) {
          ctx.target = -oh
          window.cancelAnimationFrame(requestId)
          ease()
          return
        }

        if (cur > OFFSET) {
          ctx.target = 0
          window.cancelAnimationFrame(requestId)
          ease()
          return
        }

        if (Math.abs(vy) < 1) {

          if (cur > 0) {
            ctx.target = -oh
            window.cancelAnimationFrame(requestId)
            ease()
            return
          }
          if (-cur > oh) {
            ctx.target = -oh
            window.cancelAnimationFrame(requestId)
            ease()
          }
        }
      }
      bounce()
    }
  })

  function ease() {
    isTransform = true

    cur -= (cur - ctx.target) * 0.2

    var requestId = window.requestAnimationFrame(ease)
    if (Math.abs(cur - ctx.target) < 1) {
      cur = ctx.target
      window.cancelAnimationFrame(requestId)
      isTransform = false
    }

    transform(cur)
  }

  function transform(y) {
    el.style.transform = 'translate3d(0,' + y + 'px,0)'
  }
}

