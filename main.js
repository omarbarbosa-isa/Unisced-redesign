
// UNISCED - Funcionalidades gerais

document.addEventListener("DOMContentLoaded", () => {

    // Actualizar automaticamente o ano do rodapé
    const yearElement = document.getElementById("current-year");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

});
