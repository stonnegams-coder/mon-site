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

    if (button.textContent.trim() === "Demander un devis") {

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

/* =========================================================
   STONNEGAMS — TEXTES DYNAMIQUES
   Changement automatique toutes les 5 secondes
   ========================================================= */


/* =========================================================
   1. ANIMATION DU HERO
   ========================================================= */

const heroTitle = document.querySelector(".titles .title");
const heroDescription = document.querySelector(".titles .paragraph");

const heroContents = [
    {
        title: "Donnez à votre entreprise la présence en ligne qu'elle mérite.",
        description:
            "Stonnegams conçoit des sites web modernes, rapides et professionnels pour présenter votre activité et attirer de nouveaux clients."
    },

    {
        title: "Transformez votre idée en une expérience web professionnelle.",
        description:
            "De la conception au développement, chaque projet est pensé pour offrir une présence digitale claire, moderne et adaptée à votre activité."
    },

    {
        title: "Votre activité mérite un site web à votre image.",
        description:
            "Nous créons des interfaces élégantes, responsives et conçues pour mettre vos services en valeur sur ordinateur, tablette et mobile."
    },

    {
        title: "Construisez une présence digitale qui inspire confiance.",
        description:
            "Un site professionnel vous permet de présenter votre savoir-faire, renforcer votre crédibilité et faciliter le contact avec vos futurs clients."
    }
];


let heroIndex = 0;


/* Fonction qui change le contenu du Hero */

function changeHeroContent() {

    if (!heroTitle || !heroDescription) {
        return;
    }


    /* Faire disparaître l'ancien contenu */

    heroTitle.classList.add("text-slide-out");
    heroDescription.classList.add("text-slide-out");


    setTimeout(() => {

        /* Passer au contenu suivant */

        heroIndex++;

        if (heroIndex >= heroContents.length) {
            heroIndex = 0;
        }


        const newContent = heroContents[heroIndex];


        /* Nouveau contenu */

        heroTitle.innerHTML = newContent.title;

        heroDescription.textContent = newContent.description;


        /* Préparer l'arrivée depuis la droite */

        heroTitle.classList.remove("text-slide-out");
        heroDescription.classList.remove("text-slide-out");

        heroTitle.classList.add("text-slide-in");
        heroDescription.classList.add("text-slide-in");


        /* Lancer l'entrée */

        requestAnimationFrame(() => {

            heroTitle.classList.remove("text-slide-in");
            heroDescription.classList.remove("text-slide-in");

            heroTitle.classList.add("text-visible");
            heroDescription.classList.add("text-visible");

        });

    }, 600);
}


/* Changement toutes les 5 secondes */

if (heroTitle && heroDescription) {

    heroTitle.classList.add("text-visible");
    heroDescription.classList.add("text-visible");

    setInterval(changeHeroContent, 5000);
}



/* =========================================================
   2. ANIMATION DE LA SECTION ABOUT
   ========================================================= */

const aboutTitle = document.querySelector(".about-title");
const aboutDescription = document.querySelector(".about-description");


const aboutContents = [

    {
        title: "Pourquoi choisir <strong>Stonnegams</strong> ?",

        description:
            "Stonnegams accompagne les entrepreneurs, indépendants et entreprises dans la création d'une présence web moderne et professionnelle. Chaque projet est pensé pour valoriser votre activité et faciliter la connexion avec vos futurs clients."
    },

    {
        title: "Un site pensé pour votre <strong>activité</strong>.",

        description:
            "Votre site ne doit pas seulement être esthétique. Il doit présenter clairement vos services, transmettre votre identité et permettre à vos visiteurs de comprendre rapidement ce que vous proposez."
    },

    {
        title: "Une expérience adaptée à tous les <strong>écrans</strong>.",

        description:
            "Ordinateur, tablette ou smartphone : votre site doit rester agréable à consulter partout. Stonnegams privilégie une conception responsive pour offrir une expérience fluide à chaque visiteur."
    },

    {
        title: "Votre image mérite une présence <strong>professionnelle</strong>.",

        description:
            "Un site web bien conçu peut renforcer la crédibilité de votre entreprise et donner à vos visiteurs une première impression claire, moderne et rassurante."
    },

    {
        title: "Un accompagnement centré sur votre <strong>projet</strong>.",

        description:
            "Chaque activité possède ses propres besoins. C'est pourquoi la conception du site est adaptée à vos objectifs, à votre identité et aux services que vous souhaitez mettre en avant."
    }

];


let aboutIndex = 0;


/* Fonction de changement */

function changeAboutContent() {

    if (!aboutTitle || !aboutDescription) {
        return;
    }


    /* Sortie de l'ancien texte */

    aboutTitle.classList.add("text-slide-out");
    aboutDescription.classList.add("text-slide-out");


    setTimeout(() => {

        /* Passer au texte suivant */

        aboutIndex++;

        if (aboutIndex >= aboutContents.length) {
            aboutIndex = 0;
        }


        const newContent = aboutContents[aboutIndex];


        /* Remplacer le contenu */

        aboutTitle.innerHTML = newContent.title;

        aboutDescription.innerHTML =
            "<mark>" + newContent.description + "</mark>";


        /* Préparer l'arrivée */

        aboutTitle.classList.remove("text-slide-out");
        aboutDescription.classList.remove("text-slide-out");

        aboutTitle.classList.add("text-slide-in");
        aboutDescription.classList.add("text-slide-in");


        /* Faire entrer le nouveau texte */

        requestAnimationFrame(() => {

            aboutTitle.classList.remove("text-slide-in");
            aboutDescription.classList.remove("text-slide-in");

            aboutTitle.classList.add("text-visible");
            aboutDescription.classList.add("text-visible");

        });

    }, 600);
}


/* Changement toutes les 5 secondes */

if (aboutTitle && aboutDescription) {

    aboutTitle.classList.add("text-visible");
    aboutDescription.classList.add("text-visible");

    setInterval(changeAboutContent, 5000);
}