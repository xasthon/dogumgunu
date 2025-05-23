const showCake = () => {
  // Cake-container elementine done sınıfını ekleme
  const cakeContainer = document.querySelector("#cake-container");

  // Alevin kendisini doğrudan hedefle
  const flame = document.querySelector(".flame");

  // Eğer zaten "done" sınıfı varsa işlem yapma (birden fazla tetiklemeyi önler)
  if (!cakeContainer.classList.contains("done")) {
    cakeContainer.classList.add("done");

    // Alevin görünürlüğünü doğrudan ayarla
    if (flame) {
      flame.style.opacity = "0";
      flame.style.transform = "translateY(-10px) scale(0.5)";
    }
  }
};
