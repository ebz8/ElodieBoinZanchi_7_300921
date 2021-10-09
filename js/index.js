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

//
//     triOrdreAlphabetique: (tableau) => {
//         tableau.sort((a, b) => {
//           const titreA = a.title.toLowerCase()
//           const titreB = b.title.toLowerCase()
//           if (titreA < titreB) {
//             return -1
//           } if (titreA > titreB) {
//             return 1
//           } else {
//             return 0
//           }
//         })
//       }
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
        // element.innerHTML = template
        conteneur.appendChild(element)
        return element
    },

    definirAttributs: (element, attributs) => {
        // eslint-disable-next-line prefer-const
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
        redacDry.definirAttributs(btnLoupe, {
            type: 'button',
            'aria-label': 'Lancer la recherche'})
        btnLoupe.append(btnIcone)

        formulaireRecherche.append(saisieFormulaireRecherche, btnLoupe)
        conteneur.appendChild(formulaireRecherche)

        return formulaireRecherche
    },

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

        // créer un li pour chaque étiquette
        templateRecherches.etiquette(listeEtiquettes, 'Coco')

        conteneur.appendChild(conteneurEtiquettes)

        return conteneurEtiquettes
    },

    btnSelectMotsCles: (menuNom, menuListe, conteneur) => {
        const btnSelect = redacDry.nouvelElementDom('button', 'btn-principal')
        btnSelect.textContent = menuNom
        const btnIcone = redacDry.nouvelElementDom('i', 'fas fa-chevron-down')
        btnSelect.append(btnIcone)

        conteneur.appendChild(btnSelect)

        console.log(menuListe)
        return btnSelect
    },

    selectMotsCles: (elementBEM, conteneur) => {
        const conteneurBtnSelect = redacDry.nouvelElementDom('div', elementBEM + '__mots-cles')

        templateRecherches.btnSelectMotsCles('Ingredients', util.recupListeIngredients(recettes), conteneurBtnSelect)
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

sectionRecherche()


const sectionResultatsRecherche = (recettes) => {
    const conteneurFicheRecettes = redacDry.nouvelElementDom('section', 'resultats-recherche')
    const resultatsFichesVisibles = recettes.forEach(recette => ficheRecette(recette, conteneurFicheRecettes))
    corpsContenuPage.appendChild(conteneurFicheRecettes)

    return conteneurFicheRecettes
}
sectionResultatsRecherche(recettes)






//////////////////
// essai algo 1 //
//////////////////

// INITIALISATION ET STRUCTURE DES DONNEES
// dupliquer le tableau des recettes
const ensembleFiches = [...recettes]

// récupérer l'ensemble des fiches affichées dans le DOM
let resultatsFichesVisibles = ensembleFiches
console.log(resultatsFichesVisibles)

// CONSTRUCTION DU MENU

util.recupListeIngredients(resultatsFichesVisibles)
util.recupListeAppareils(resultatsFichesVisibles)
util.recupListeUstensiles(resultatsFichesVisibles)

// BARRE DE RECHERCHE

// écoute de la saisie dans le champs de recherche (onChange)
// nettoyer les caractères spéciaux
// gérer plusieurs mots ou chercher l'ensemble comme une expression ?
// const saisieBarreRecherche = 

// pour chaque fiche récupérer le contenu de titre / ingredient / recette et transformer en string
// TRI FUSION : rechercher si correspondance avec [saisieBarreRecherche]

// en récupérant l'id de chaque fiche (find)
// retirer les fiches qui ne correspondent pas et les push dans [resultatsFichesNonRetenues]
// actualiser affichage [resultatsFichesVisibles]

// ACTUALISER LE MENU

