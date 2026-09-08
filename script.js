// =====================================================
// STONNEGAMS — NAVIGATION
// =====================================================

// Tous les boutons "Contactez-moi"
const contactButtons = document.querySelectorAll("button");

contactButtons.forEach((button) => {
    if (button.textContent.trim() === "Contactez-moi") {
        button.addEventListener("click", () => {
            window.location.href = "contact.html#formular";
        });
    }
});

// =====================================================
// BOUTONS DEVIS
// =====================================================

const allButtons = document.querySelectorAll("button");

allButtons.forEach((button) => {
    if (button.textContent.trim() === "Devis") {
        button.addEventListener("click", () => {

            // Si nous sommes déjà sur index.html
            if (
                window.location.pathname.endsWith("index.html") ||
                window.location.pathname === "/" ||
                window.location.pathname === ""
            ) {
                const tarifs = document.getElementById("tarifs");

                if (tarifs) {
                    tarifs.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                }
            } 
            
            // Si le bouton se trouve sur une autre page
            else {
                window.location.href = "index.html#tarifs";
            }
        });
    }
});


"use strict";

/* =====================================================
   STONNEGAMS
   JavaScript principal
   ===================================================== */


/* =====================================================
   1. BOUTONS "CONTACTEZ-MOI"
   ===================================================== */

const buttons = document.querySelectorAll("button");

buttons.forEach((button) => {

    const text = button.textContent.trim();

    if (text === "Contactez-moi") {

        button.addEventListener("click", () => {

            window.location.href = "contact.html#formular";

        });

    }

});


/* =====================================================
   2. BOUTONS "DEVIS"
   ===================================================== */

buttons.forEach((button) => {

    const text = button.textContent.trim();

    if (text === "Devis") {

        button.addEventListener("click", () => {

            const tarifs = document.getElementById("tarifs");

            /*
             * Si la section tarifs existe sur la page actuelle,
             * on effectue un défilement fluide.
             */

            if (tarifs) {

                tarifs.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

            /*
             * Si la section tarifs n'existe pas,
             * on retourne sur la page d'accueil.
             */

            else {

                window.location.href = "index.html#tarifs";

            }

        });

    }

});


/* =====================================================
   3. RETOUR EN HAUT
   ===================================================== */

const backToTop = document.getElementById("backToTop");

if (backToTop) {

    window.addEventListener("scroll", () => {

        if (window.scrollY > 400) {

            backToTop.classList.add("show");

        } else {

            backToTop.classList.remove("show");

        }

    });


    backToTop.addEventListener("click", () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

}


/* =====================================================
   4. GESTION DES ANCRES AU CHARGEMENT
   ===================================================== */

window.addEventListener("load", () => {

    const hash = window.location.hash;

    if (hash) {

        const target = document.querySelector(hash);

        if (target) {

            setTimeout(() => {

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }, 100);

        }

    }

});