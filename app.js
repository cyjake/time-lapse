;(function() {

  'use strict';

  // http://www.smashingmagazine.com/2014/01/23/understanding-javascript-function-prototype-bind/
  var unboundForEach = Array.prototype.forEach
  var forEach = Function.prototype.call.bind(unboundForEach)


  function changeClip() {
    var title = location.hash.toLowerCase().replace(/-/g, ' ').replace(/[^ \w]/g, '')
    var clipTitle = document.querySelector('h2[data-title="' + title + '"]')
    var clip

    if (clipTitle) {
      clip = clipTitle.parentNode
      clip.style.zIndex = 100
      var video = clip.querySelector('video')

      if (video.readyState == video.HAVE_NOTHING) {
        video.src = video.dataset.src
        video.addEventListener('canplay', canPlay)
        video.load()
      }
      else {
        play(video)
      }
    }
  }

  function bind() {
    forEach(document.querySelectorAll('.clip'), function(clip) {
      clip.addEventListener('transitionend', hide)
    })

    window.onhashchange = function() {
      changeClip(location.hash)
    }
  }

  function hide(e) {
    var clip = e.target

    if (clip.style.opacity == '0') {
      clip.style.zIndex = 0
    }
  }

  function checkAndSwitch(e) {
    var video = e.target

    if (!video.paused && video.duration - video.currentTime < 2) {
      next(video.parentNode)
      video.removeEventListener('timeupdate', checkAndSwitch)
    }
  }

  function canPlay(e) {
    var video = e.target
    play(video)
    video.removeEventListener('canplay', canPlay)
  }

  function play(video) {
    video.parentNode.style.opacity = 1
    video.play()
    video.addEventListener('timeupdate', checkAndSwitch)
  }

  function next(clip) {
    var nextClip = clip.nextElementSibling

    if (!nextClip.matches('.clip')) {
      nextClip = document.querySelector('.clip')
    }

    clip.style.zIndex = 10
    clip.style.opacity = 0
    location.hash = nextClip.querySelector('h2').dataset.title.replace(/ /g, '-')
  }

  function main() {
    bind()
    if (location.hash) {
      changeClip()
    } else {
      location.hash = document.querySelector('.clip h2').dataset.title.replace(/ /g, '-')
    }
  }

  main()

})();
