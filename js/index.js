import {recettes} from './data/recipes.js'

// DOM de base
const corpsPage = document.querySelector('.js-page') // body
const corpsContenuPage = document.querySelector('.js-document') // main

// outils

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
    }
}


// fabrique du DOM

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
            console.log(ingredientEnCours)
            const itemIngredient = redacDry.nouvelElementDom('li', 'ingredient')
            const nomIngredient = redacDry.nouvelElementDom('p', 'ingredient__nom')
            nomIngredient.textContent = `${ingredientEnCours.ingredient} :`
            const ingredientQuantite = redacDry.nouvelElementDom('span', 'ingredient__quantite')
            ingredientQuantite.textContent = `${ingredientEnCours.quantity} ${ingredientEnCours.unit}`
            itemIngredient.append(nomIngredient, ingredientQuantite)
            
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

    
    templateRecette.apercuImage(elementBEM, ficheRecette)
    templateRecette.enTete(recette, elementBEM, ficheRecette)
    templateRecette.corps(recette, elementBEM, ficheRecette)

    conteneur.appendChild(ficheRecette)
    return ficheRecette
}

const resultatsRecherche = (recettes) => {
    const conteneurFicheRecettes = redacDry.nouvelElementDom('section', 'resultats-recherche')
    const fichesRecettes = recettes.map(recette => ficheRecette(recette, conteneurFicheRecettes)).join('')

    corpsContenuPage.appendChild(conteneurFicheRecettes)
}


resultatsRecherche(recettes)






// const ficheRecette (recette, conteneur) => {
//     // template de la fiche recette
//     const elementBEM = 'recette'
//     const ficheRecette = redacDry.nouvelElementDom('article', elementBEM)
//     const recetteImage = redacDry.appendElementDom('div', elementBEM + '__image', ficheRecette)

//     // en-tête
//     templateEnTete () {
//         const titre = redacDry.nouvelElementDom('h2', recette.name)

//     }
//     const recetteEnTete = redacDry.appendElementDom('div', elementBEM + '__entete', ficheRecette)
//     // corps
//     const recetteCorps = redacDry.appendElementDom('div', elementBEM + '__corps', ficheRecette)


//     conteneur.appendChild(ficheRecette)
//     return ficheRecette
// }

// const resultatsRecherche = (recettes) => {
//     const conteneurFicheRecettes = redacDry.nouvelElementDom('section', 'resultats-recherche')
//     const fichesRecettes = recettes.map(recette => ficheRecette(recette, conteneurFicheRecettes)).join('')

//     corpsContenuPage.appendChild(conteneurFicheRecettes)
// }


// resultatsRecherche(recettes)