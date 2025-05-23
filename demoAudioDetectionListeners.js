/* eslint-env browser */

const dB = (signal) => -Math.round(20 * Math.log10(1 / signal));

/**
 * speechDetectionListeners
 *
 */

function hystogramLine(value) {
  const maxCharsperLine = 200;
  const valueInChars = maxCharsperLine * value;
  const char = "█";

  return char.repeat(valueInChars);
}

function showConfiguration() {
  // document.querySelector('#SAMPLE_POLLING_MSECS').textContent = SAMPLE_POLLING_MSECS
  // document.querySelector('#MAX_INTERSPEECH_SILENCE_MSECS').textContent = MAX_INTERSPEECH_SILENCE_MSECS
  // document.querySelector('#MIN_SIGNAL_DURATION').textContent = MIN_SIGNAL_DURATION
  // document.querySelector('#VOLUME_SIGNAL').textContent = VOLUME_SIGNAL
  // document.querySelector('#VOLUME_SILENCE').textContent = VOLUME_SILENCE
  // document.querySelector('#VOLUME_MUTE').textContent = VOLUME_MUTE
  // document.querySelector('#MIN_AVERAGE_SIGNAL_VOLUME').textContent = MIN_AVERAGE_SIGNAL_VOLUME
}

// Son üç dB değerini saklayan değişken
let lastThreeDBValues = [];

// Basit ses seviyesi kontrolü
let isBlowing = false;
let volumeHistory = [];

// Ses seviyesi kontrolü için interval
setInterval(() => {
  if (!window.meter) return;

  const volume = window.meter.volume;

  // Ses seviyesi geçmişini tut
  volumeHistory.push(volume);
  if (volumeHistory.length > 5) {
    volumeHistory.shift();
  }

  // Ortalama ses seviyesini hesapla
  const avgVolume =
    volumeHistory.reduce((a, b) => a + b, 0) / volumeHistory.length;

  // Üfleme algılama
  if (volume > 0.1 && avgVolume > 0.08 && !isBlowing) {
    isBlowing = true;

    // Mumu söndür
    const flame = document.getElementById("flame");
    if (flame) {
      flame.classList.add("blown");
    }

    // Confetti efekti
    if (typeof confetti !== "undefined") {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }

    // Mesajı göster
    const cakeMessage = document.querySelector(".cake-message");
    if (cakeMessage) {
      cakeMessage.style.opacity = "1";
    }
  } else if (volume < 0.05 && avgVolume < 0.05) {
    isBlowing = false;
  }
}, 100);

//
// signal handler
//
document.addEventListener("signal", (event) => {
  const volume = event.detail.volume.toFixed(9);
  const timestamp = event.detail.timestamp;
  const items = event.detail.items.toString().padEnd(3);
  const dBV = dB(event.detail.volume);

  // Son üç dB değerini takip et
  lastThreeDBValues.push(dBV);
  if (lastThreeDBValues.length > 3) {
    lastThreeDBValues.shift(); // En eski değeri çıkar
  }

  const line = hystogramLine(volume);

  // Tek bir yüksek değer veya son üç değerin ortalaması belli bir eşiği geçerse
  const averageDBV =
    lastThreeDBValues.reduce((sum, val) => sum + val, 0) /
    lastThreeDBValues.length;

  // Hem anlık hem de ortalama değerleri kontrol et
  if (dBV >= 0 || averageDBV >= -23) {
    showCake();

    // Confetti efekti
    const duration = 2 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = {
      startVelocity: 15,
      spread: 360,
      ticks: 60,
      zIndex: 0,
      gravity: 0.5,
    };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 20 * (timeLeft / duration);

      // Confetti from left
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });

      // Confetti from right
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 400);
  }
});

//
// silence handler
//
document.addEventListener("silence", (event) => {
  const volume = event.detail.volume.toFixed(9);
  const timestamp = event.detail.timestamp;
  const items = event.detail.items.toString().padEnd(3);
  const dBV = dB(event.detail.volume);
});

//
// mute handler
//
document.addEventListener("mute", (event) => {
  const volume = event.detail.volume.toFixed(9);
  const timestamp = event.detail.timestamp;
  const dBV = dB(event.detail.volume);
});

//
// prespeechstart handler
//
document.addEventListener("prespeechstart", (event) => {
  const timestamp = event.detail.timestamp;
  restartRecording();
});

//
// speechstart handler
//
document.addEventListener("speechstart", (event) => {
  //startRecording()
});

//
// speechstop handler
//
document.addEventListener("speechstop", (event) => {
  const duration = event.detail.duration;
  stopRecording();
});

//
// speechabort handler
//
document.addEventListener("speechabort", (event) => {
  const abort = event.detail.abort;
  const duration = event.detail.duration;
  abortRecording();
});

//
// mutedmic handler
//
document.addEventListener("mutedmic", (event) => {});

//
// unmutedmic handler
//
document.addEventListener("unmutedmic", (event) => {
  document.getElementById("cake-container").style.opacity = 1;
});

// showConfiguration()

// Signal level listener
audioDetection.onSignalLevelChange = function (
  timestamp,
  items,
  volume,
  dBV,
  line
) {
  // Signal level changed
};

// Silence listener
audioDetection.onSilence = function (timestamp, items, volume, dBV) {
  if (debuglog) {
    // Silence detected
  }
};

// Mute listener
audioDetection.onMute = function (timestamp, volume, dBV) {
  if (debuglog) {
    // Microphone muted
  }
};

// Pre speech start listener
audioDetection.onPreSpeechStart = function (timestamp, volume, dBV) {
  // Pre speech start detected
};

// Speech start listener
audioDetection.onSpeechStart = function (timestamp, volume, dBV) {
  // Speech start detected
};

// Speech stop listener
audioDetection.onSpeechStop = function (
  timestamp,
  duration,
  averageSignalLevel
) {
  // Speech stop detected
};

// Speech abort listener
audioDetection.onSpeechAbort = function (
  timestamp,
  duration,
  averageSignalLevel,
  abort
) {
  // Speech abort detected
};

// Microphone mute listener
audioDetection.onMicrophoneMuted = function () {
  // Microphone muted
};

// Microphone unmute listener
audioDetection.onMicrophoneUnmuted = function () {
  // Microphone unmuted
};
