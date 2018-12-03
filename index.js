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

  ctx.addEventListener('touchend', function (e) {
    if (isDown) {
      isDown = false

      var that = this
      var FRIC = ((vy >> 31) * 2 + 1) * 0.5
      var oh = this.scrollHeight - this.clientHeight
      this._timer = setInterval(function () {
        vy -= FRIC
        cur += vy
        transform(cur)

        if (-cur - oh > OFFSET) {
          clearTimeout(that._timer)
          ease(-oh)
          return
        }

        if (cur > OFFSET) {
          clearTimeout(that._timer)
          ease(0)
          return
        }

        if (Math.abs(vy) < 1) {
          clearTimeout(that._timer)
          if (cur > 0) {
            ease(0)
            return
          }
          if (-cur > oh) {
            ease(-oh)
            return
          }
        }
      }, 20)

    }
  })

  function ease(target) {
    isTransform = true
    ctx._timer = setInterval(function () {
      cur -= (cur - target) * 0.2
      if (Math.abs(cur - target) < 1) {
        cur = target
        clearInterval(ctx._timer)
        isTransform = false
      }

      transform(cur)
    }, 20)
  }

  function transform(y) {
    el.style.transform = 'translate3d(0,' + y + 'px,0)'
  }

}


module.exports = BScroll
