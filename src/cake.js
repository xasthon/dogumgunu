export class Cake {
  constructor(container) {
    this.container = container;
    this.cakeElement = null;
    this.isBlown = false;
  }

  init() {
    this.cakeElement = document.createElement("div");
    this.cakeElement.className = "cake";
    this.createCakeLayers();
    this.createCandle();
    this.container.appendChild(this.cakeElement);
  }

  createCakeLayers() {
    const layers = ["top", "middle", "bottom"];
    layers.forEach((layer) => {
      const layerElement = document.createElement("div");
      layerElement.className = `layer layer-${layer}`;
      this.cakeElement.appendChild(layerElement);
    });

    const icing = document.createElement("div");
    icing.className = "icing";
    this.cakeElement.appendChild(icing);

    // Add decorations
    for (let i = 1; i <= 7; i++) {
      const decoration = document.createElement("div");
      decoration.className = `decoration decoration${i}`;
      this.cakeElement.appendChild(decoration);
    }
  }

  createCandle() {
    const candle = document.createElement("div");
    candle.className = "candle";
    this.cakeElement.appendChild(candle);

    const flame = document.createElement("div");
    flame.id = "flame";
    flame.className = "flame";
    candle.appendChild(flame);

    const smoke = document.createElement("div");
    smoke.className = "smoke";
    candle.appendChild(smoke);
  }

  blowOut() {
    if (this.isBlown) return;

    this.isBlown = true;
    const flame = document.getElementById("flame");
    if (flame) {
      flame.classList.add("blown");
    }

    // Trigger confetti
    if (typeof confetti !== "undefined") {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }

    // Show cake message
    const cakeMessage = document.querySelector(".cake-message");
    if (cakeMessage) {
      cakeMessage.style.opacity = "1";
    }
  }

  reset() {
    this.isBlown = false;
    const flame = document.getElementById("flame");
    if (flame) {
      flame.classList.remove("blown");
    }

    // Hide cake message
    const cakeMessage = document.querySelector(".cake-message");
    if (cakeMessage) {
      cakeMessage.style.opacity = "0";
    }
  }
}
