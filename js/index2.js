import {recettes} from './data/recipes.js'

// DOM DE BASE
const corpsPage = document.querySelector('.js-page') // body
const corpsContenuPage = document.querySelector('.js-document') // main


// INITIALISATION ET STRUCTURE DES DONNEES
// TODO : dictionnaire avec duplication du tableau des recettes
const ensembleFiches = [...recettes]

// TODO : récupérer l'ensemble des fiches affichées dans le DOM
let resultatsFichesVisibles = ensembleFiches

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
    recupContenuPrincipalRecette: (recettes) => {
        const tableauContenuxPrincipaux = []

        recettes.forEach((recette) => {
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

    recupChampsMotsCleRecette: (recettes) => {
        // console.log(recettes)
        // const fichesRecette = Array.from(recettes)
        const tableauContenusMotsCles = []

        recettes.forEach((recette) => {
            const contenuMotsClesRecette = []

            contenuMotsClesRecette.push(recette.id)

            contenuMotsClesRecette.push(recette.appliance.toLowerCase())

            recette.ustensils.map((ustensile) => {
                contenuMotsClesRecette.push(ustensile.toLowerCase())
            })
            
            recette.ingredients.map((ingredients) => {
                contenuMotsClesRecette.push(ingredients.ingredient.toLowerCase())
            })
            tableauContenusMotsCles.push(contenuMotsClesRecette)
        })
        return tableauContenusMotsCles
    },

    // (casse) majuscule pour la première lettre d'une chaîne de caractères
    capitalize: (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    },

    // matcher par id les fiches simplifiées retenues en résultats de recherche et fiches complètes du json
    rechercheRecetteParId: (id) => {
        const recetteIdCorrespondante = recettes.filter((recette) => id.includes(recette.id))
        return recetteIdCorrespondante
    },

    recupEtiquettesActives: () => {
        let etiquettesActives = []
        const tableauEtiquettes = document.querySelectorAll('.etiquettes__liste li')
        tableauEtiquettes.forEach(etiquette => {
            etiquettesActives.push(etiquette.textContent)
        })
        // console.log(etiquettesActives)

        return etiquettesActives
    },

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

    listeBtnSelectMotsCles: (menuListe, btnSelectListe, elementBEM, menuNom, fichesActives) => {
        // console.log(fichesActives)
        btnSelectListe.innerHTML = ''

        menuListe.forEach(motCle => {
            const itemListe = redacDry.nouvelElementDom('li', elementBEM + '__item')
            itemListe.textContent = util.capitalize(motCle)
            btnSelectListe.appendChild(itemListe)

            // gestion des étiquettes
        itemListe.addEventListener('click', (e) => {
            const motCleCible = e.target.textContent
            templateRecherches.etiquette(motCleCible, menuNom, fichesActives)
        })
        })
    },

    actualisationListeBtnSelectMotsCles: (actualisationFichesVisibles) => {
        console.log('actualisation liste btn')
        // console.log(actualisationFichesVisibles)
        let menuListe = ''
        const btnSelectApercu = document.querySelectorAll('.btn-select__apercu')
        const btnSelectListe = document.querySelectorAll('.btn-select__liste')
        
        btnSelectApercu.forEach(btn => {
            if (btn.textContent.includes('Ingrédients')) {
                const btnSelectIng = btnSelectListe[0]
                menuListe = util.recupListeIngredients(actualisationFichesVisibles)
                templateRecherches.listeBtnSelectMotsCles(
                    menuListe,
                    btnSelectIng,
                    'btn-select',
                    btn.textContent,
                    actualisationFichesVisibles)
            } if (btn.textContent.includes('Appareils')) {
                const btnSelectApp = btnSelectListe[1]
                menuListe = util.recupListeAppareils(actualisationFichesVisibles)
                templateRecherches.listeBtnSelectMotsCles(
                    menuListe,
                    btnSelectApp,
                    'btn-select',
                    btn.textContent,
                    actualisationFichesVisibles)
            } if (btn.textContent.includes('Ustensiles')) {
                const btnSelectUst = btnSelectListe[2]
                menuListe = util.recupListeUstensiles(actualisationFichesVisibles)
                templateRecherches.listeBtnSelectMotsCles(
                    menuListe,
                    btnSelectUst,
                    'btn-select',
                    btn.textContent,
                    actualisationFichesVisibles)
            }
        })
    },

    
    // selectionMotCle: (conteneurEtiquettes, e, menuNom) => {
    //     const motCle = e.target.textContent
    //     templateRecherches.etiquette(conteneurEtiquettes, motCle, menuNom)

    //     // conteneurListe.addEventListener('click', (e) => {
    //     //     const motCle = e.target.textContent
    //     //     templateRecherches.etiquette(conteneurEtiquettes, motCle, menuNom)
    //     // // TODO : régler le pb des boutons qui se créent deux/trois/quatre fois            
    //     // })
    //     },
        
    affichageBtnSelect: (conteneur) => {
        conteneur.setAttribute('open', '')
    },

    fermetureBtnSelect: (conteneur) => {
        conteneur.removeAttribute('open', '')
    },

    btnSelectGestionEtats: (conteneur, input) => {
        // déploiement du menu select
        conteneur.addEventListener('click', (e) => {
            templateRecherches.affichageBtnSelect(conteneur)
        }) 

        // fermeture du menu au clic à l'extérieur du bouton
        document.addEventListener('click', (e) => {
            const elementClic = e.target
            if (conteneur !== elementClic &&
                input !== elementClic) {
                templateRecherches.fermetureBtnSelect(conteneur)
            }
        })
    },

    etiquettes: (elementBEM, conteneur) => {
        const conteneurBEM = 'etiquettes'
        const conteneurEtiquettes = redacDry.nouvelElementDom('div', elementBEM + `__${conteneurBEM}`)
        const listeEtiquettes = redacDry.nouvelElementDom('ul', conteneurBEM + '__liste')
        
        conteneurEtiquettes.append(listeEtiquettes)
        conteneur.appendChild(conteneurEtiquettes)

        return conteneurEtiquettes
    },

    etiquette: (motCleCible, menuNom, fichesActives) => {
        const conteneur = document.querySelector('.etiquettes__liste')
        const nomMenuRaccourci = menuNom.substr(0,3).toLowerCase()

        // étiquette avec couleur héritée du menu via menuNom
        const etiquette = redacDry.nouvelElementDom('li', 'btn-principal')
        etiquette.classList.add(nomMenuRaccourci)
        const nomMotCle = redacDry.nouvelElementDom('p', '')
        nomMotCle.textContent = motCleCible

        const btnFermeture = redacDry.nouvelElementDom('button', '')
        const btnIcone = redacDry.nouvelElementDom('i', 'far fa-times-circle')
        btnFermeture.append(btnIcone)

        etiquette.append(nomMotCle, btnFermeture)
        conteneur.appendChild(etiquette)

        // fermeture au clic sur le btn de fermeture
        btnFermeture.addEventListener('click', (e) => {
            etiquette.remove()
            // TODO: actualisation de la recherche
            rechercheParMotCle(fichesActives)
        })

        // TODO: actualiser les fiches visibles à chaque nouvelle étiquette
        rechercheParMotCle(fichesActives)

        return etiquette
    },


    btnSelectMotsCles: (menuNom, menuListe, conteneur, bloc) => {
        const elementBEM = 'btn-select'
        const conteneurbtnSelect = redacDry.nouvelElementDom('details', 'btn-principal')

        const btnSelectApercu = redacDry.nouvelElementDom('summary', elementBEM + '__apercu')
        btnSelectApercu.textContent = menuNom
        const btnIconeA = redacDry.nouvelElementDom('i', 'fas fa-chevron-down')
        btnSelectApercu.append(btnIconeA)

        // éléments du bouton déployé
        const conteneurInput = redacDry.nouvelElementDom('div', elementBEM + '__conteneur-saisie')
        const btnSelectInput = redacDry.nouvelElementDom('input', elementBEM + '__saisie')
        const btnIconeB = redacDry.nouvelElementDom('i', 'fas fa-chevron-up')
        btnSelectInput.setAttribute('placeholder', `Rechercher des ${menuNom.toLowerCase()}`)
        conteneurInput.append(btnSelectInput, btnIconeB)

        // création de la liste des mots-clés
        const btnSelectListe = redacDry.nouvelElementDom('ul', elementBEM + `__liste`)
        templateRecherches.listeBtnSelectMotsCles(menuListe, btnSelectListe, elementBEM, menuNom)
        conteneurbtnSelect.append(btnSelectApercu, conteneurInput, btnSelectListe)
        conteneur.appendChild(conteneurbtnSelect)

        // gestion des états du bouton
        templateRecherches.btnSelectGestionEtats(conteneurbtnSelect, btnSelectInput)

        return conteneurbtnSelect
    },

    selectMotsCles: (elementBEM, conteneur) => {
        // création du bloc étiquette
        templateRecherches.etiquettes(elementBEM, conteneur)
        
        // menus select
        const conteneurBtnSelect = redacDry.nouvelElementDom('div', elementBEM + '__mots-cles')
        templateRecherches.btnSelectMotsCles('Ingrédients',util.recupListeIngredients(recettes), conteneurBtnSelect, conteneur)
        templateRecherches.btnSelectMotsCles('Appareils', util.recupListeAppareils(recettes), conteneurBtnSelect, conteneur)
        templateRecherches.btnSelectMotsCles('Ustensiles', util.recupListeUstensiles(recettes), conteneurBtnSelect, conteneur)

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
    templateRecherches.selectMotsCles(elementBEM, conteneurSection)

    corpsContenuPage.appendChild(conteneurSection)

    rechercheParSaisieLibre(resultatsFichesVisibles)
}

const sectionResultatsRecherche = (recettes) => {
    const conteneurFicheRecettes = redacDry.nouvelElementDom('section', 'resultats-recherche')
    const resultatsFichesVisibles = recettes.forEach(recette => ficheRecette(recette, conteneurFicheRecettes))
    corpsContenuPage.appendChild(conteneurFicheRecettes)

    return conteneurFicheRecettes
}

const messageResultatsVides = () => {
    const conteneurFicheRecettes = document.querySelector('.resultats-recherche')
    const messageAucuneRecette = `<p class="msg-resultats">Aucune recette ne correspond à votre critère... Vous pouvez rechercher « tarte aux pommes », « poisson », etc.</p>`
    conteneurFicheRecettes.innerHTML = messageAucuneRecette

    // Réinitialisation des menus
    templateRecherches.actualisationListeBtnSelectMotsCles(ensembleFiches)
}

const actualiserResultatsRecherche = (actualisationResultatsFichesVisibles) => {
    console.log(actualisationResultatsFichesVisibles)
    const conteneurFicheRecettes = document.querySelector('.resultats-recherche')
    conteneurFicheRecettes.innerHTML = ''
    const fichesVisibles = actualisationResultatsFichesVisibles.forEach(recette => ficheRecette(recette, conteneurFicheRecettes))

    // Actualiser les menus select 
    templateRecherches.actualisationListeBtnSelectMotsCles(actualisationResultatsFichesVisibles)

    // // Si aucun résultat correspondant, afficher message adéquat
    if (actualisationResultatsFichesVisibles.length === 0) {
        messageResultatsVides()
    }
}

sectionRecherche()
sectionResultatsRecherche(recettes)

//////////////////
// essai algo 1 //
//////////////////

// BARRE DE RECHERCHE
function rechercheParSaisieLibre (ensembleFiches) {
    const longueurMin = 3
    const champSaisie = document.querySelector('.recherche__saisie')
    
    champSaisie.addEventListener('input', e => {
        const saisie = e.target.value.toLowerCase()
        // pour chaque fiche récupérer le contenu de titre / ingredient / recette et transformer en string
        const contenusRecettes = util.recupContenuPrincipalRecette(ensembleFiches)

        // TODO : réinitialisation de l'affichage si champ vidé
        if (saisie.length === 0) {
            actualiserResultatsRecherche(ensembleFiches)
        }

        if (saisie.length > longueurMin - 1) {
            console.log(`mot saisi : ${saisie}`)
            let fichesCorrespondantes = []
            // let resultatsFichesNonRetenues = []

            contenusRecettes.forEach(recettes => {
            // TODO ? : mettre en place tri fusion
                recettes.map(recette => {
                    if (recette.toString().includes(saisie)) { 
                        // récupère l'id de la fiche retenue
                        fichesCorrespondantes.push(recettes[0])
                    }
                })
            })

            // TODO : gérer cas avec recherche étiquette avant saisie ?
            let resultatsRechercheSaisie = util.rechercheRecetteParId(fichesCorrespondantes)
            actualiserResultatsRecherche(resultatsRechercheSaisie)

            return resultatsRechercheSaisie
        }
    })}


// RECHERCHE PAR MOT-CLE
function rechercheParMotCle (fichesActives) {    
    const etiquettesActives = util.recupEtiquettesActives()
    console.log('rechercher')
    console.log(etiquettesActives)
    let fichesRetenues = []

    // si fichesActives contient quelque chose ( = une actualisation des résultats a déjà eu lieu)
    // TODO : alors rechercher les termes contenus dans le tableau des étiquettes dans les fiches actives (seulement ingrédients, ustensiles et appareils)
    if (fichesActives !== undefined) {
        // récupérer les champs ingrédients, appareils et ustensiles pour les fichesActives

        console.log('dans')
        console.log(fichesActives)

        const contenuFichesActives = util.recupChampsMotsCleRecette(fichesActives)
        console.log(contenuFichesActives)

        // etiquettesActives.forEach((etiquette => {
        //     fichesActives.map((fiche) => {
        //         if (contenuFichesActives.toString().includes(etiquette)) {
        //             fichesRetenues.push(fiche[0])
        //         }
        //     })
        // }))

        let resultatsFichesMotsCles = util.rechercheRecetteParId(fichesRetenues)
        actualiserResultatsRecherche(resultatsFichesMotsCles)

    // TODO : si les résultats n'ont pas connu d'acualisation, rechercher sur le json de base (ensembleFiches) les termes contenus dans étiquettes
    } else {
        const contenuFichesActives = util.recupChampsMotsCleRecette(ensembleFiches)
        console.log('recherche dans toutes les fiches')
        // ensembleFiches.filter(fiche => {
        // })
    }

    // TODO : actualiser l'affichage (qui dont réinitialise fichesActives et la liste des mots clés contenus dans chaque btn select)
    // actualiserResultatsRecherche(fichesRetenues)
}






// TODO : récuperer les fiches recettes affichées, et obtenir un tableau des mêmes recettes mais à partir des données json
// function recupFichesActives () {
//     let resultatsFichesActives = new Set()

//     // const resultatsParSaisie = util.rechercheRecetteParId(rechercheParSaisieLibre())
//     const resultatsParSaisie = rechercheParSaisieLibre(ensembleFiches)
//     console.log(resultatsParSaisie)

//     // const resultatsParMotCle = rechercheParMotCle()

//     resultatsFichesActives.add(resultatsParSaisie)
//     // resultatsFichesActives.add(resultatsParMotCle)

//     console.log(resultatsFichesActives)

// }
// recupFichesActives()


// const rechercheParEtiquette = (etiquettes) => {
//     const conteneurFicheRecettes = redacDry.nouvelElementDom('section', 'resultats-recherche')
//     const resultatsFichesVisibles = document.querySelectorAll('.recette')
//     resultatsFichesVisibles.forEach(recette => ficheRecette(recette, conteneurFicheRecettes))
//     corpsContenuPage.appendChild(conteneurFicheRecettes)

//     return conteneurFicheRecettes
// }

