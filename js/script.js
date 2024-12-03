document.addEventListener("DOMContentLoaded", function () {
    // Remove loader and reveal header after animation ends
    const loader = document.querySelector(".loader");
  
    loader.addEventListener("animationend", function () {
      loader.style.display = "none"; // Hide the loader completely
      document.body.classList.remove("loader-active");
    });
  
    // Add 'loader-active' class initially
    document.body.classList.add("loader-active");
  });

