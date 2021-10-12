import {recettes} from './data/recipes.js'

// DOM DE BASE
const corpsPage = document.querySelector('.js-page') // body
const corpsContenuPage = document.querySelector('.js-document') // main

////////////////////////
//////// OUTILS ////////
////////////////////////

const util = {
    recupListeIngredients: (fichesRecettes) => {
        let listeIngredients = new Set()

        fichesRecettes.map(recette => {
            recette.ingredients.map((ingredients) => {
                listeIngredients.add(ingredients.ingredient.toLowerCase())
            })
        })

        return listeIngredients
    },

    recupListeAppareils: (fichesRecettes) => {
        let listeAppareils = new Set()
    
        fichesRecettes.map(recette => {
            listeAppareils.add(recette.appliance.toLowerCase())
        })
    
        return listeAppareils
    },
    
    recupListeUstensiles: (fichesRecettes) => {
        let listeUstensiles = new Set()
    
        fichesRecettes.map(recette => {
            recette.ustensils.map((ustensile) => {
                listeUstensiles.add(ustensile.toLowerCase())
            })
        })
    
        return listeUstensiles
    },

    // retourne pour chaque recette, réuni en une chaîne de caractères : id, titre, description, ingrédients
    recupContenuPrincipalRecette: (fichesRecettes) => {
        const tableauContenuxPrincipaux = []

        fichesRecettes.forEach((recette) => {
            const contenuPrincipalRecette = []

            contenuPrincipalRecette.push(recette.id)
            contenuPrincipalRecette.push(recette.name.toLowerCase())
            contenuPrincipalRecette.push(recette.description.toLowerCase())
            recette.ingredients.map((ingredients) => {
                contenuPrincipalRecette.push(ingredients.ingredient.toLowerCase())
            })
            tableauContenuxPrincipaux.push(contenuPrincipalRecette)
        })
        return tableauContenuxPrincipaux
    },

    // (casse) majuscule pour la première lettre d'une chaîne de caractères
    capitalize: (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    },

    // matcher par id les fiches simplifiées retenues en résultats de recherche et fiches complètes du json
    rechercheRecetteParId: (id) => {
        const recetteIdCorrespondante = recettes.filter((recette) => id.includes(recette.id))
        return recetteIdCorrespondante
    }
}

const redacDry = {
    nouvelElementDom: (balise, classe) => {
        const element = document.createElement(balise)
        element.className = classe
        return element
    },

    appendElementDom: (balise, classe, conteneur) => {
        const element = document.createElement(balise)
        element.className = classe
        conteneur.appendChild(element)
        return element
    },

    definirAttributs: (element, attributs) => {
        for (let cle in attributs) {
          element.setAttribute(cle, attributs[cle])
        }
      },
}

//////////////////////////////////
// FABRIQUE DES ÉLEMENTS DU DOM //
//////////////////////////////////

const templateRecherches = {
    barreDeRecherche: (elementBEM, conteneur) => {
        const formulaireRecherche = redacDry.nouvelElementDom('form', elementBEM + '__barre')
        const saisieFormulaireRecherche = redacDry.nouvelElementDom('input', elementBEM + '__saisie')
        redacDry.definirAttributs(saisieFormulaireRecherche, {
            type: 'search',
            placeholder: 'Rechercher un ingrédient, appareil, ustensile ou une recette'})
        const btnLoupe = redacDry.nouvelElementDom('button', elementBEM + '__btn')
        const btnIcone = redacDry.nouvelElementDom('i', 'fas fa-search')
        redacDry.definirAttributs(btnLoupe, {type: 'button', 'aria-label': 'Lancer la recherche'})
        btnLoupe.append(btnIcone)

        formulaireRecherche.append(saisieFormulaireRecherche, btnLoupe)
        conteneur.appendChild(formulaireRecherche)

        return formulaireRecherche
    },

    // TODO: gérer la couleur des étiquettes
    etiquette: (conteneur, ingredientNom) => {
        const etiquette = redacDry.nouvelElementDom('li', 'btn-principal')
        const nomMotCle = redacDry.nouvelElementDom('p', null)
        nomMotCle.textContent = ingredientNom

        const btnFermeture = redacDry.nouvelElementDom('button', null)
        const btnIcone = redacDry.nouvelElementDom('i', 'far fa-times-circle')
        btnFermeture.append(btnIcone)

        etiquette.append(nomMotCle, btnFermeture)
        conteneur.appendChild(etiquette)

        return etiquette
    },

    etiquettes: (elementBEM, conteneur) => {
        const conteneurBEM = 'etiquettes'
        const conteneurEtiquettes = redacDry.nouvelElementDom('div', elementBEM + `__${conteneurBEM}`)
        const listeEtiquettes = redacDry.nouvelElementDom('ul', conteneurBEM + '__liste')
        conteneurEtiquettes.append(listeEtiquettes)

        // TODO: créer un li pour chaque étiquette
        templateRecherches.etiquette(listeEtiquettes, 'Coco')
        conteneur.appendChild(conteneurEtiquettes)

        return conteneurEtiquettes
    },

    listeBtnSelectMotsCles: (menuListe, btnSelectListe, elementBEM) => {
        console.log(menuListe)
        btnSelectListe.innerHTML = ''

        menuListe.forEach(motCle => {
            const itemListe = redacDry.nouvelElementDom('li', elementBEM + '__item')
            itemListe.textContent = util.capitalize(motCle)
            btnSelectListe.appendChild(itemListe)
        })
    },

    actualisationListeBtnSelectMotsCles: (tableauMenuListe) => {
        let menuListe = ''
        const btnSelectApercu = document.querySelectorAll('.btn-select__apercu')
        const btnSelectListe = document.querySelectorAll('.btn-select__liste')
        
        btnSelectApercu.forEach(btn => {
            if (btn.textContent.includes('Ingrédients')) {
                const btnSelectIng = btnSelectListe[0]
                menuListe = util.recupListeIngredients(tableauMenuListe)
                console.log('liste ingrédients')
                templateRecherches.listeBtnSelectMotsCles(menuListe, btnSelectIng, 'btn-select')
            } if (btn.textContent.includes('Appareils')) {
                const btnSelectApp = btnSelectListe[1]
                menuListe = util.recupListeAppareils(tableauMenuListe)
                console.log('liste appareils')
                templateRecherches.listeBtnSelectMotsCles(menuListe, btnSelectApp, 'btn-select')
            } if (btn.textContent.includes('Ustensiles')) {
                const btnSelectUst = btnSelectListe[2]
                menuListe = util.recupListeUstensiles(tableauMenuListe)
                console.log('liste ustensiles')
                templateRecherches.listeBtnSelectMotsCles(menuListe, btnSelectUst, 'btn-select')
            }

            
            // switch (btn.textContent) {
            //             case 'Ingrédients':
            //                 menuListe = util.recupListeIngredients(tableauMenuListe)
            //                 templateRecherches.listeBtnSelectMotsCles(menuListe, btn, 'btn-select')
            //                 console.log(btn.textContent)
            //                 console.log(menuListe)
            //                 break
            //                 case 'Appareils':
            //                 menuListe = util.recupListeAppareils(tableauMenuListe)
            //                 console.log(menuListe)
            //                 templateRecherches.listeBtnSelectMotsCles(menuListe, btn, 'btn-select')
            //                 break
            //                 case 'Ustensiles':
            //                 menuListe = util.recupListeUstensiles(tableauMenuListe)
            //                 console.log(menuListe)
            //                 templateRecherches.listeBtnSelectMotsCles(menuListe, btn, 'btn-select')
            //                 break
            //         }
        })
    },

    btnSelectMotsCles: (menuNom, menuListe, conteneur) => {
        const elementBEM = 'btn-select'
        const conteneurbtnSelect = redacDry.nouvelElementDom('details', 'btn-principal')

        const btnSelectApercu = redacDry.nouvelElementDom('summary', elementBEM + '__apercu')
        btnSelectApercu.textContent = menuNom
        const btnIcone = redacDry.nouvelElementDom('i', 'fas fa-chevron-down')

        btnSelectApercu.append(btnIcone)
        conteneurbtnSelect.append(btnSelectApercu)

        // génération contenu pour bouton déployé mais dissumulé :
        const btnSelectInput = redacDry.nouvelElementDom('input', elementBEM + '__saisie inactif')
        // TODO : conteneurbtnSelect.append(btnIcone)
        const btnSelectListe = redacDry.nouvelElementDom('ul', elementBEM + `__liste inactif`)

        // génération des items de la liste (liste de mots clés)
        templateRecherches.listeBtnSelectMotsCles(menuListe, btnSelectListe, elementBEM)

        // TODO : gestion des états du menu déployé (à écrire à part)
        conteneurbtnSelect.addEventListener('click', () => {
            conteneurbtnSelect.setAttribute('open', '')
            conteneurbtnSelect.classList.remove('inactif')
            btnSelectApercu.classList.add('inactif')
            btnSelectInput.classList.remove('inactif')
            btnSelectListe.classList.remove('inactif')  
        })      
        
        conteneurbtnSelect.append(btnSelectInput, btnSelectListe)
        conteneur.appendChild(conteneurbtnSelect)

        return conteneurbtnSelect
    },

    selectMotsCles: (elementBEM, conteneur) => {
        const conteneurBtnSelect = redacDry.nouvelElementDom('div', elementBEM + '__mots-cles')

        templateRecherches.btnSelectMotsCles('Ingrédients',util.recupListeIngredients(recettes), conteneurBtnSelect)
        templateRecherches.btnSelectMotsCles('Appareils', util.recupListeAppareils(recettes), conteneurBtnSelect)
        templateRecherches.btnSelectMotsCles('Ustensiles', util.recupListeUstensiles(recettes), conteneurBtnSelect)

        conteneur.appendChild(conteneurBtnSelect)
        return conteneurBtnSelect
    }
}

const templateRecette = {
    apercuImage: (elementBEM, conteneur) => {
        const recetteImage = redacDry.appendElementDom('div', elementBEM + '__image', conteneur)
        return recetteImage
    },

    enTete: (recette, elementBEM, conteneur) => {
        const recetteEnTete = redacDry.nouvelElementDom('div', elementBEM + '__entete')
        const titre = redacDry.nouvelElementDom('h2', elementBEM + '__titre')
        titre.textContent = recette.name

        const duree = redacDry.nouvelElementDom('div', elementBEM + '__duree')
        const icone = redacDry.nouvelElementDom('i', 'far fa-clock')
        const minutes = redacDry.nouvelElementDom('p', 'minutes')
        minutes.textContent = `${recette.time} min`
        duree.append(icone, minutes)

        recetteEnTete.append(titre, duree)
        conteneur.appendChild(recetteEnTete)
        return recetteEnTete
    },

    itemIngredients: (ingredientEnCours, conteneur) => {
            const itemIngredient = redacDry.nouvelElementDom('li', 'ingredient')
            const nomIngredient = redacDry.nouvelElementDom('p', 'ingredient__nom')
            
            // s'il y a ni quantité ni unité de mesure :
            if (ingredientEnCours.quantity === undefined
                & ingredientEnCours.unit === undefined) {
                nomIngredient.textContent = ingredientEnCours.ingredient
                itemIngredient.append(nomIngredient)

            // s'il y a seulement une quantité :
            } else if (ingredientEnCours.quantity !== undefined
                & ingredientEnCours.unit === undefined) {
                nomIngredient.textContent = `${ingredientEnCours.ingredient} :`
                const ingredientQuantite = redacDry.nouvelElementDom('span', 'ingredient__quantite')
                ingredientQuantite.textContent = ingredientEnCours.quantity
                itemIngredient.append(nomIngredient, ingredientQuantite)

            // dans tous les autres cas :
            } else {
                nomIngredient.textContent = `${ingredientEnCours.ingredient} :`
                const ingredientQuantite = redacDry.nouvelElementDom('span', 'ingredient__quantite')
                ingredientQuantite.textContent = `${ingredientEnCours.quantity} ${ingredientEnCours.unit}`
                itemIngredient.append(nomIngredient, ingredientQuantite)
            }
            
            conteneur.append(itemIngredient)
            return itemIngredient
    },

    corps: (recette, elementBEM, conteneur) => {
        const recetteCorps = redacDry.nouvelElementDom('div', elementBEM + '__corps')

        const recetteIngredients = redacDry.appendElementDom('ul', 'corps__ingredients', recetteCorps)
        recette.ingredients.forEach((ingredientEnCours) => {
            templateRecette.itemIngredients(ingredientEnCours, recetteIngredients)
        })
        const recetteInstructions = redacDry.nouvelElementDom('p', 'corps__instructions')
        recetteInstructions.textContent = recette.description

        recetteCorps.append(recetteIngredients, recetteInstructions)
        conteneur.appendChild(recetteCorps)
        return recetteCorps
    }
}

const ficheRecette = (recette, conteneur) => {
    const elementBEM = 'recette'
    const ficheRecette = redacDry.nouvelElementDom('article', elementBEM)

    // ficheRecette.setAttribute('id', `${recette.id}`)
    templateRecette.apercuImage(elementBEM, ficheRecette)
    templateRecette.enTete(recette, elementBEM, ficheRecette)
    templateRecette.corps(recette, elementBEM, ficheRecette)

    conteneur.appendChild(ficheRecette)
    return ficheRecette
}

/////////////////////////
/// GENERATION DU DOM ///
/////////////////////////

const sectionRecherche = () => {
    const elementBEM = 'recherche'
    const conteneurSection = redacDry.nouvelElementDom('section', `${elementBEM}`)

    templateRecherches.barreDeRecherche(elementBEM, conteneurSection)
    templateRecherches.etiquettes(elementBEM, conteneurSection)
    templateRecherches.selectMotsCles(elementBEM, conteneurSection)

    corpsContenuPage.appendChild(conteneurSection)
}

const sectionResultatsRecherche = (recettes) => {
    const conteneurFicheRecettes = redacDry.nouvelElementDom('section', 'resultats-recherche')
    const resultatsFichesVisibles = recettes.forEach(recette => ficheRecette(recette, conteneurFicheRecettes))
    corpsContenuPage.appendChild(conteneurFicheRecettes)

    return conteneurFicheRecettes
}

const actualiserResultatsRecherche = (resultatsFichesVisibles) => {
    const conteneurFicheRecettes = document.querySelector('.resultats-recherche')
    conteneurFicheRecettes.innerHTML = ''
    const fichesVisibles = resultatsFichesVisibles.forEach(recette => ficheRecette(recette, conteneurFicheRecettes))
    // TODO : actualiser les menus select 
    templateRecherches.actualisationListeBtnSelectMotsCles(resultatsFichesVisibles)

    // TODO : afficher message d'erreur si conteneur vide
}

const messageResultatsVides = () => {
    const conteneurFicheRecettes = document.querySelector('.resultats-recherche')
    conteneurFicheRecettes.innerHTML = `<p>Aucune recette ne correspond à votre critère... Vous pouvez chercher " tarte aux pommes ", "poisson", etc.</p>`
    
    templateRecherches.actualisationListeBtnSelectMotsCles(recettes)

    // TODO : afficher message d'erreur si conteneur vide
}

sectionRecherche()
sectionResultatsRecherche(recettes)

//////////////////
// essai algo 1 //
//////////////////

// INITIALISATION ET STRUCTURE DES DONNEES
// TODO : dictionnaire avec duplication du tableau des recettes
const ensembleFiches = [...recettes]

// TODO : récupérer l'ensemble des fiches affichées dans le DOM
let resultatsFichesVisibles = ensembleFiches

// BARRE DE RECHERCHE
function rechercheParSaisieLibre (resultatsFichesVisibles, valeurSaisie) {
    const longueurMin = 3
    const champSaisie = document.querySelector('.recherche__saisie')
    // let fichesCorrespondantes = []
    
    champSaisie.addEventListener('input', e => {
        const saisie = e.target.value.toLowerCase()
        // pour chaque fiche récupérer le contenu de titre / ingredient / recette et transformer en string
        const contenusRecettes = util.recupContenuPrincipalRecette(resultatsFichesVisibles)

        if (saisie.length > longueurMin - 1) {
            console.log(saisie)
            let fichesCorrespondantes = []
            let resultatsFichesNonRetenues = []

            // TODO : tri fusion
            contenusRecettes.forEach(recettes => {
                recettes.map(recette => {
                    if (recette.toString().includes(saisie)) { 
                        // récupérer l'id de la fiche retenue
                        fichesCorrespondantes.push(recettes[0])
                        // TODO : actualiser le tableau des fiches à afficher
                        // récupérer les fiches complètes par l'id et actualiser l'affichage
                        actualiserResultatsRecherche(util.rechercheRecetteParId(fichesCorrespondantes))
                    }
                })
            })
            // Si aucun résultat correspondant, afficher message adéquat
            if (fichesCorrespondantes.length === 0) {
                messageResultatsVides()
            }
    }}
    )}

rechercheParSaisieLibre(resultatsFichesVisibles)

// nettoyer les caractères spéciaux
// gérer plusieurs mots ou chercher l'ensemble comme une expression ?
// const saisieBarreRecherche = 

// pour chaque fiche récupérer le contenu de titre / ingredient / recette et transformer en string
// TRI FUSION : rechercher si correspondance avec [saisieBarreRecherche]

// en récupérant l'id de chaque fiche (find)
// retirer les fiches qui ne correspondent pas et les push dans [resultatsFichesNonRetenues]
// actualiser affichage [resultatsFichesVisibles]

// ACTUALISER LE MENU

