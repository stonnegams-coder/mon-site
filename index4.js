/* ============================================================
   Collège Horizon – script.js
   1. Lien de la page active
   2. Menu burger (mobile)
   3. Galerie : visionneuse d'images en plein écran
   4. Page de paiement : montant, mode de paiement, mise en forme des champs
   5. Page calendrier : passé / prochain événement selon la date du jour
   6. Page événements : « À la une » (5,9 s), filtres et délais
   7. Apparition douce des blocs au défilement
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
    marquerPageActive();
    initialiserBurger();
    initialiserGalerie();
    initialiserPaiement();
    initialiserCalendrier();
    initialiserEvenements();
    initialiserApparitions();
});

/* ---------- 1. Lien de la page active ---------- */
function marquerPageActive() {
    // Nom du fichier courant ("index.html" si l'adresse se termine par "/")
    let page = window.location.pathname.split("/").pop();
    if (page === "") page = "index.html";

    const liens = document.querySelectorAll(".nav-menu a, .foot-links a");
    liens.forEach((lien) => {
        const cible = lien.getAttribute("href").split("#")[0];
        const estActif = cible === page;
        lien.classList.toggle("active", estActif);
        if (estActif) {
            lien.setAttribute("aria-current", "page");
        } else {
            lien.removeAttribute("aria-current");
        }
    });
}

/* ---------- 2. Menu burger ---------- */
function initialiserBurger() {
    const barre = document.querySelector(".navbar");
    const menu = document.querySelector(".nav-menu");
    if (!barre || !menu) return;

    // Le bouton est créé ici : pas besoin de modifier le HTML
    const bouton = document.createElement("button");
    bouton.type = "button";
    bouton.className = "burger";
    bouton.setAttribute("aria-label", "Ouvrir le menu");
    bouton.setAttribute("aria-expanded", "false");
    bouton.innerHTML = "<span></span><span></span><span></span>";

    menu.id = menu.id || "menu-principal";
    bouton.setAttribute("aria-controls", menu.id);

    barre.insertBefore(bouton, menu);
    barre.classList.add("has-burger"); // le CSS ne cache le menu que si le JS est actif

    const ouvrir = (etat) => {
        barre.classList.toggle("open", etat);
        bouton.setAttribute("aria-expanded", String(etat));
        bouton.setAttribute("aria-label", etat ? "Fermer le menu" : "Ouvrir le menu");
    };

    bouton.addEventListener("click", () => ouvrir(!barre.classList.contains("open")));

    // Fermer en cliquant sur un lien
    menu.querySelectorAll("a").forEach((lien) =>
        lien.addEventListener("click", () => ouvrir(false))
    );

    // Fermer avec la touche Échap
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && barre.classList.contains("open")) {
            ouvrir(false);
            bouton.focus();
        }
    });

    // Fermer en cliquant en dehors de la barre
    document.addEventListener("click", (e) => {
        if (barre.classList.contains("open") && !barre.contains(e.target)) ouvrir(false);
    });

    // Réinitialiser si on repasse en affichage large
    window.matchMedia("(min-width: 721px)").addEventListener("change", (e) => {
        if (e.matches) ouvrir(false);
    });
}

/* ---------- 3. Apparitions discrètes au défilement ---------- */
function initialiserApparitions() {
    const sansAnimation =
        window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        !("IntersectionObserver" in window);
    if (sansAnimation) return;

    const selecteurs = [
        ".from-content figure",
        ".home-2-grid img",
        ".icon-piliers",
        ".big-block",
        ".fig-2-content figure",
        ".fig-3-content figure",
        ".testmony-content blockquote",
        ".table-content",
        ".images",
        ".formular-form",
        ".coo-form",
        ".num-carte",
        ".school-img",
        ".carte-plan-maps",
        ".carte-image-batiment",
        ".reg-block-number",
        ".insc-bloc",
        ".cal-trimestre",
        ".cal-evenement",
        ".cal-vacance",
        ".cal-feries",
        ".evt-carte"
    ].join(",");

    const elements = document.querySelectorAll(selecteurs);

    // Léger décalage entre les éléments d'un même groupe (3 maximum)
    const compteurs = new Map();
    elements.forEach((el) => {
        const index = compteurs.get(el.parentElement) || 0;
        compteurs.set(el.parentElement, index + 1);
        el.style.transitionDelay = Math.min(index, 3) * 90 + "ms";
        el.classList.add("reveal");
    });

    const observateur = new IntersectionObserver(
        (entrees) => {
            entrees.forEach((entree) => {
                if (!entree.isIntersecting) return;
                const el = entree.target;
                el.classList.add("visible");
                observateur.unobserve(el);

                // Nettoyage : on rend la main au CSS d'origine (survols, etc.)
                setTimeout(() => {
                    el.classList.remove("reveal", "visible");
                    el.style.transitionDelay = "";
                }, 900);
            });
        },
        { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    elements.forEach((el) => observateur.observe(el));
}

/* ---------- 4. Galerie : visionneuse plein écran ---------- */
function initialiserGalerie() {
    const vignettes = Array.from(document.querySelectorAll(".galery-school img, .gallery-item"));
    if (!vignettes.length) return;

    // Construction de la visionneuse (aucun HTML à ajouter)
    const boite = document.createElement("div");
    boite.className = "lightbox";
    boite.hidden = true;
    boite.setAttribute("role", "dialog");
    boite.setAttribute("aria-modal", "true");
    boite.setAttribute("aria-label", "Visionneuse d'images");
    boite.innerHTML =
        '<button type="button" class="lightbox-close" aria-label="Fermer la visionneuse">&times;</button>' +
        '<button type="button" class="lightbox-nav prev" aria-label="Image précédente">&#8249;</button>' +
        '<figure class="lightbox-figure">' +
        '<img class="lightbox-img" alt="">' +
        '<figcaption class="lightbox-legende"></figcaption>' +
        "</figure>" +
        '<button type="button" class="lightbox-nav next" aria-label="Image suivante">&#8250;</button>';
    document.body.appendChild(boite);

    const image = boite.querySelector(".lightbox-img");
    const legende = boite.querySelector(".lightbox-legende");
    const boutons = boite.querySelectorAll("button");
    const fermer = boite.querySelector(".lightbox-close");
    let courant = 0;
    let declencheur = null;

    function afficher(index) {
        courant = (index + vignettes.length) % vignettes.length; // boucle sans fin
        const vignette = vignettes[courant];
        const source = vignette.tagName === "IMG" ? vignette : vignette.querySelector("img");
        const lien = source.getAttribute("src");

        if (lien) {
            image.setAttribute("src", lien);
        } else {
            image.removeAttribute("src");
        }
        image.alt = source.alt;
        legende.innerHTML = "";
        legende.append(source.alt);
        const compteur = document.createElement("span");
        compteur.className = "lightbox-compteur";
        compteur.textContent = courant + 1 + " / " + vignettes.length;
        legende.append(compteur);
    }

    function ouvrir(index) {
        declencheur = document.activeElement;
        afficher(index);
        boite.hidden = false;
        document.body.classList.add("lightbox-open");
        requestAnimationFrame(() => boite.classList.add("open"));
        fermer.focus();
    }

    function quitter() {
        boite.classList.remove("open");
        boite.hidden = true;
        document.body.classList.remove("lightbox-open");
        if (declencheur) declencheur.focus();
    }

    vignettes.forEach((v, i) => {
        // Les images ne sont pas des boutons : on les rend accessibles au clavier
        if (v.tagName === "IMG") {
            v.tabIndex = 0;
            v.setAttribute("role", "button");
            v.setAttribute("aria-label", "Agrandir la photo : " + v.alt);
            v.addEventListener("keydown", (e) => {
                if (e.key === "Enter") {
                    e.preventDefault(); // évite que la touche active aussitôt le bouton de fermeture
                    ouvrir(i);
                }
            });
        }
        v.addEventListener("click", () => ouvrir(i));
    });
    boite.querySelector(".prev").addEventListener("click", () => afficher(courant - 1));
    boite.querySelector(".next").addEventListener("click", () => afficher(courant + 1));
    fermer.addEventListener("click", quitter);

    // Clic sur le fond sombre = fermer
    boite.addEventListener("click", (e) => {
        if (e.target === boite) quitter();
    });

    // Clavier : Échap, flèches, et Tab qui reste dans la visionneuse
    document.addEventListener("keydown", (e) => {
        if (boite.hidden) return;
        if (e.key === "Escape") quitter();
        if (e.key === "ArrowLeft") afficher(courant - 1);
        if (e.key === "ArrowRight") afficher(courant + 1);
        if (e.key === "Tab") {
            const premier = boutons[0];
            const dernier = boutons[boutons.length - 1];
            if (e.shiftKey && document.activeElement === premier) {
                e.preventDefault();
                dernier.focus();
            } else if (!e.shiftKey && document.activeElement === dernier) {
                e.preventDefault();
                premier.focus();
            }
        }
    });

    // Balayage du doigt sur mobile
    let departX = null;
    boite.addEventListener("touchstart", (e) => (departX = e.touches[0].clientX), { passive: true });
    boite.addEventListener("touchend", (e) => {
        if (departX === null) return;
        const ecart = e.changedTouches[0].clientX - departX;
        if (Math.abs(ecart) > 50) afficher(courant + (ecart < 0 ? 1 : -1));
        departX = null;
    });
}

/* ---------- 5. Page de paiement ---------- */
function initialiserPaiement() {
    const formulaire = document.querySelector(".form-paiement");
    if (!formulaire) return;

    const montant = formulaire.querySelector("#montant");
    const puces = formulaire.querySelectorAll(".pay-chip");
    const minimum = Number(montant.min) || 150;

    // Montant affiché dans le bouton et dans le récapitulatif
    function majMontant() {
        const valeur = Number(montant.value);
        const affiche = valeur >= minimum ? valeur : minimum;
        document.querySelectorAll("[data-total]").forEach((el) => {
            el.textContent = new Intl.NumberFormat("fr-FR").format(affiche);
        });
        puces.forEach((p) => p.classList.toggle("actif", Number(p.dataset.montant) === valeur));
    }

    montant.addEventListener("input", majMontant);
    puces.forEach((p) =>
        p.addEventListener("click", () => {
            montant.value = p.dataset.montant;
            majMontant();
        })
    );

    // Affichage du bon formulaire (carte ou mobile money)
    // Le panneau masqué est désactivé : ses champs ne bloquent pas l'envoi
    const noms = { carte: "Carte bancaire", mobile: "Mobile money" };
    function majMethode() {
        const choix = formulaire.querySelector('input[name="methode"]:checked').value;
        formulaire.querySelectorAll(".pay-panel").forEach((panneau) => {
            const actif = panneau.dataset.methode === choix;
            panneau.hidden = !actif;
            panneau.disabled = !actif;
        });
        document.querySelectorAll("[data-methode-nom]").forEach((el) => (el.textContent = noms[choix]));
    }

    formulaire.querySelectorAll('input[name="methode"]').forEach((r) => r.addEventListener("change", majMethode));

    // Mise en forme : numéro de carte par groupes de 4, date au format MM/AA
    const numero = formulaire.querySelector("#carte-numero");
    numero.addEventListener("input", () => {
        const chiffres = numero.value.replace(/\D/g, "").slice(0, 19);
        numero.value = chiffres.replace(/(.{4})/g, "$1 ").trim();
    });

    const expiration = formulaire.querySelector("#carte-expiration");
    expiration.addEventListener("input", () => {
        const chiffres = expiration.value.replace(/\D/g, "").slice(0, 4);
        expiration.value = chiffres.length > 2 ? chiffres.slice(0, 2) + "/" + chiffres.slice(2) : chiffres;
    });

    majMontant();
    majMethode();
}

/* ---------- 5. Page calendrier ---------- */
function initialiserCalendrier() {
    const evenements = Array.from(document.querySelectorAll(".cal-evenement[data-date]"));
    if (!evenements.length) return;

    const aujourdhui = new Date();
    aujourdhui.setHours(0, 0, 0, 0);
    const lireDate = (iso) => new Date(iso + "T00:00:00");
    let prochain = null;

    evenements.forEach((el) => {
        const debut = lireDate(el.dataset.date);
        const fin = el.dataset.fin ? lireDate(el.dataset.fin) : debut;

        if (fin < aujourdhui) {
            el.classList.add("passe"); // événement terminé
        } else if (!prochain) {
            prochain = el; // premier événement à venir ou en cours
            el.classList.add("prochain");
        }
    });

    // Encadré « Prochain rendez-vous »
    const encadre = document.querySelector(".cal-prochain");
    if (!prochain || !encadre) return;

    const debut = lireDate(prochain.dataset.date);
    const jours = Math.round((debut - aujourdhui) / 86400000);
    let delai = "";
    if (jours > 1) delai = " · Dans " + jours + " jours";
    else if (jours === 1) delai = " · Demain";
    else if (jours === 0) delai = " · Aujourd'hui";
    else delai = " · En cours";

    encadre.querySelector(".cal-prochain-titre").textContent = prochain.querySelector("h3").textContent;
    encadre.querySelector(".cal-prochain-date").textContent =
        prochain.querySelector(".cal-date-texte").textContent + delai;
    encadre.hidden = false;
}

/* ---------- 6. Page événements ---------- */
function initialiserEvenements() {
    initialiserALaUne();
    initialiserFiltresEvenements();
    initialiserDelaisEvenements();
}

/* « À la une » : image, titre et paragraphe changent toutes les 5,9 secondes.
   La barre de progression (animation CSS de 5,9 s) déclenche le changement
   à la fin de son animation ; quand elle est en pause, le temps est suspendu. */
function initialiserALaUne() {
    const carrousel = document.querySelector(".une-carrousel");
    if (!carrousel) return;

    const diapos = Array.from(carrousel.querySelectorAll(".une-slide"));
    const points = Array.from(carrousel.querySelectorAll(".une-point"));
    const barre = carrousel.querySelector(".une-progression span");
    const piste = carrousel.querySelector(".une-piste");
    const boutonPause = carrousel.querySelector(".une-pause");
    const reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let courant = 0;

    function relancerBarre() {
        barre.classList.remove("en-cours");
        void barre.offsetWidth; // redémarre l'animation
        barre.classList.add("en-cours");
    }

    function aller(index) {
        diapos[courant].classList.remove("actif");
        diapos[courant].setAttribute("aria-hidden", "true");
        points[courant].removeAttribute("aria-current");

        courant = (index + diapos.length) % diapos.length;

        diapos[courant].classList.add("actif");
        diapos[courant].removeAttribute("aria-hidden");
        points[courant].setAttribute("aria-current", "true");
        relancerBarre();
    }

    function definirPause(etat) {
        carrousel.classList.toggle("pause", etat);
        boutonPause.setAttribute("aria-pressed", String(etat));
        boutonPause.innerHTML = etat ? "&#9654;" : "&#10074;&#10074;";
        boutonPause.setAttribute("aria-label", etat ? "Reprendre le défilement" : "Mettre en pause le défilement");
        piste.setAttribute("aria-live", etat ? "polite" : "off");
    }

    diapos.forEach((d, i) => i !== 0 && d.setAttribute("aria-hidden", "true"));

    barre.addEventListener("animationend", () => aller(courant + 1)); // 5,9 s écoulées
    carrousel.querySelector(".une-prec").addEventListener("click", () => aller(courant - 1));
    carrousel.querySelector(".une-suiv").addEventListener("click", () => aller(courant + 1));
    points.forEach((p, i) => p.addEventListener("click", () => aller(i)));
    boutonPause.addEventListener("click", () => definirPause(!carrousel.classList.contains("pause")));

    // Animations réduites : pas de défilement automatique
    if (reduit) definirPause(true);
    relancerBarre();
}

/* Filtres par catégorie */
function initialiserFiltresEvenements() {
    const boutons = document.querySelectorAll(".evt-filtre");
    const cartes = document.querySelectorAll(".evt-carte");
    if (!boutons.length) return;

    boutons.forEach((bouton) =>
        bouton.addEventListener("click", () => {
            const filtre = bouton.dataset.filtre;
            boutons.forEach((b) => {
                const actif = b === bouton;
                b.classList.toggle("actif", actif);
                b.setAttribute("aria-pressed", String(actif));
            });
            cartes.forEach((c) => {
                c.hidden = filtre !== "tous" && c.dataset.categorie !== filtre;
            });
        })
    );
}

/* Délai avant chaque événement (« Dans 24 jours », « Demain »...) */
function initialiserDelaisEvenements() {
    const cartes = document.querySelectorAll(".evt-carte[data-date]");
    if (!cartes.length) return;

    const aujourdhui = new Date();
    aujourdhui.setHours(0, 0, 0, 0);
    const lire = (iso) => new Date(iso + "T00:00:00");

    cartes.forEach((carte) => {
        const debut = lire(carte.dataset.date);
        const fin = carte.dataset.fin ? lire(carte.dataset.fin) : debut;
        const jours = Math.round((debut - aujourdhui) / 86400000);
        let texte = "";

        if (fin < aujourdhui) {
            texte = "Terminé";
            carte.classList.add("passe");
        } else if (debut <= aujourdhui) {
            texte = jours === 0 && !carte.dataset.fin ? "Aujourd'hui" : "En cours";
        } else if (jours === 1) {
            texte = "Demain";
        } else if (jours <= 60) {
            texte = "Dans " + jours + " jours";
        }
        carte.querySelector(".evt-delai").textContent = texte;
    });
}