import { AudioDetection } from "./audioDetection.js";
import { Cake } from "./cake.js";

export class BirthdayApp {
  constructor() {
    this.audioDetection = new AudioDetection();
    this.cake = null;
  }

  async init() {
    const container = document.getElementById("cake-container");
    if (!container) {
      console.error("Cake container not found");
      return;
    }

    this.cake = new Cake(container);
    this.cake.init();

    try {
      const meter = await this.audioDetection.init();
      // Meter'ı global scope'a ekle
      window.meter = meter;
    } catch (error) {
      console.error("Mikrofon başlatılamadı:", error);
      alert("Mikrofon başlatılamadı. Lütfen mikrofon izinlerini kontrol edin.");
    }
  }

  reset() {
    if (this.cake) {
      this.cake.reset();
    }
  }
}
