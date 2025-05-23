export class AudioDetection {
  constructor() {
    this.audioContext = null;
    this.meter = null;
  }

  async init() {
    try {
      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new AudioContext();

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });

      const source = this.audioContext.createMediaStreamSource(stream);
      this.meter = this.createAudioMeter(this.audioContext);
      source.connect(this.meter);

      return this.meter;
    } catch (e) {
      console.error("Mikrofon başlatma hatası:", e);
      throw e;
    }
  }

  createAudioMeter(audioContext) {
    const processor = audioContext.createScriptProcessor(2048, 1, 1);
    const meter = {
      volume: 0,
      processor: processor,
    };

    processor.onaudioprocess = (e) => {
      const input = e.inputBuffer.getChannelData(0);
      let sum = 0;

      for (let i = 0; i < input.length; i++) {
        sum += input[i] * input[i];
      }

      const rms = Math.sqrt(sum / input.length);
      meter.volume = rms;
    };

    processor.connect(audioContext.destination);
    return meter;
  }
}
