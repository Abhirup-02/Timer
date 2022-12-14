const minEle = document.querySelector('#minutes'),
    secEle = document.querySelector('#seconds'),
    setting = document.querySelector('#setting'),
    startstop = document.querySelector('#start_stop'),
    timer = document.querySelector('.timer'),
    progressBar = document.querySelector('.outer_ring'),
    error_msg = document.querySelector('p')

// let minutes = minEle.innerHTML,
//     seconds = secEle.innerHTML,
let progress = null,
    progressStart = 0,
    progressEnd = parseInt(minEle.textContent.replace(/\&nbsp;/,"")) * 60 + parseInt(minEle.textContent.replace(/\&nbsp;/,"")),
    speed = 1000, // Implies 1sec 
    degTravel = 360 / progressEnd,
    toggleSettings = false,
    secRem = 0,
    minRem = 0

const audio = new Audio('./assets/audio/timer-bg-audio.mp3')
const timeEnd = new Audio('./assets/audio/time-end.mp3')

function progressTrack() {
    progressStart++

    secRem = Math.floor((progressEnd - progressStart) % 60)
    minRem = Math.floor((progressEnd - progressStart) / 60)

    secEle.innerHTML = secRem.toString().length == 2 ? secRem : `0${secRem}`
    minEle.innerHTML = minRem.toString().length == 2 ? minRem : `0${minRem}`

    progressBar.style.background = `conic-gradient(
        #9d0000 ${progressStart * degTravel}deg,
        #17171a ${progressStart * degTravel}deg
        )`

    audio.loop = true
    audio.play()
    // console.log(audio.currentTime)


    if (progressStart == progressEnd) {
        progressBar.style.background = `conic-gradient(
            #00aa51 360deg,
            #00aa51 360deg`
        clearInterval(progress)
        
        audio.pause()
        audio.currentTime = 0
        
        startstop.disabled = true
        startstop.innerHTML = "START"
        setTimeout(() => startstop.disabled = false, 8500)

        timeEnd.play()
        timeEnd.loop = true
        setTimeout(() => timeEnd.pause(), 8000)
        timeEnd.currentTime = 0

        setTimeout(resetValues, 8500)
    }
}


function startStopProgress() {
    if (!progress) {
        progress = setInterval(progressTrack, speed)
        console.log(progressEnd)
        setting.disabled = true
    } else {
        clearInterval(progress)
        audio.pause()
        progress = null
        setting.disabled = true
        progressBar.style.background = `conic-gradient(
                #f9966b  ${progressStart * degTravel}deg,
                #17171a  ${progressStart * degTravel}deg
          )`
    }
}

function resetValues() {
    if (progress) {
        clearInterval(progress)
    }
    minutes = minEle.innerHTML
    seconds = secEle.innerHTML
    setting.disabled = false
    toggleSettings = false
    minEle.contentEditable = false
    minEle.style.borderBottom = `none`
    secEle.contentEditable = false
    secEle.style.borderBottom = `none`
    progress = null
    progressStart = 0
    progressEnd = parseInt(minutes) * 60 + parseInt(seconds)
    degTravel = 360 / progressEnd
    progressBar.style.background = null
}

// pattern searches for match exactly two times including whitespace
let pattern = /[0-9\s]{2}/  

startstop.addEventListener('click', () => {
    let minElement = minEle.textContent.toString().length > 1 ? minEle.textContent : `0${minEle.textContent}`
    let secElement = secEle.textContent.toString().length > 1 ? secEle.textContent : `0${secEle.textContent}`
    // console.log(secElement)
    console.log(secEle.innerHTML.replace(/\&nbsp;/,""))
    if (pattern.test(minElement) && pattern.test(secElement))
    {
        // console.log('Pattern Matched')
        error_msg.classList.remove('error-msg-show')
        timer.classList.remove('wrong-input-clr')
        if (startstop.innerHTML == "START") {
            if (!(parseInt(minutes) === 0 && parseInt(seconds) === 0)) {
                startstop.textContent = "STOP"
                startStopProgress()
            } else {
                alert("Please enter a time in Timer!")
            }
        }
        else
        {
            startstop.textContent = "START"
            startStopProgress()
        }
    }
    else
    {
        // console.log('Not Matched')
        error_msg.classList.add('error-msg-show')
        timer.classList.add('wrong-input-clr')
    }
})

setting.onclick = function () {
    if (!toggleSettings) {
        toggleSettings = true
        minEle.contentEditable = true
        minEle.style.borderBottom = `1px dashed #ffffff50`
        secEle.contentEditable = true
        secEle.style.borderBottom = `1px dashed #ffffff50`
    } else {
        resetValues()
    }

}

minEle.onblur = function () {
    resetValues()
}

secEle.onblur = function () {
    resetValues()
}

// Theme change button
document.querySelector('#nav_theme').addEventListener('click', () => {
    document.body.classList.toggle('darkTheme')
})

// Enter key would not register
function noEnter(event) {
    let key = event.keyCode
    if (key === 13) {
        event.preventDefault()
        console.log('Enter key will not take any effect')
        return key !== 13
    }
}