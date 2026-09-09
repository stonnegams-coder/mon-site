"use strict";

/* =====================================================
   STONNEGAMS — JAVASCRIPT PRINCIPAL
   ===================================================== */


/* =====================================================
   1. BOUTONS "CONTACTEZ-MOI"
   ===================================================== */

const contactButtons = document.querySelectorAll("button");

contactButtons.forEach((button) => {

    if (button.textContent.trim() === "Contactez-moi") {

        button.addEventListener("click", () => {

            window.location.href = "contact.html#formular";

        });

    }

});


/* =====================================================
   2. BOUTONS "DEVIS"
   ===================================================== */

const devisButtons = document.querySelectorAll("button");

devisButtons.forEach((button) => {

    if (button.textContent.trim() === "Devis") {

        button.addEventListener("click", () => {

            const tarifs = document.getElementById("tarifs");

            // Si la section tarifs existe sur la page actuelle
            if (tarifs) {

                tarifs.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

            // Sinon, aller sur la page d'accueil
            else {

                window.location.href = "index.html#tarifs";

            }

        });

    }

});


/* =====================================================
   3. BOUTON RETOUR EN HAUT
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
   4. GESTION DES ANCRES
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


/* =====================================================
   5. MESSAGE APRÈS ENVOI DU FORMULAIRE
   ===================================================== */

const params = new URLSearchParams(window.location.search);

if (params.get("sent") === "true") {

    alert("Merci ! Votre demande a bien été envoyée à Stonnegams.");

}