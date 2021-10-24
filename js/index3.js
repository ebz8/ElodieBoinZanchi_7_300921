import {recettes} from './data/recipes.js'

// DOM DE BASE
const corpsPage = document.querySelector('.js-page') // body
const corpsContenuPage = document.querySelector('.js-document') // main


// INITIALISATION ET STRUCTURE DES DONNEES
// TODO : dictionnaire avec duplication du tableau des recettes
const ensembleFiches = [...recettes]

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

    // (casse) majuscule pour la première lettre d'une chaîne de caractères
    capitalize: (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
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

        // RECHERCHE : écoute du champ de saisie
        saisieFormulaireRecherche.addEventListener('input', e => {
            FonctionRecherche.lancementRecherche(ensembleFiches) 
        })

        return formulaireRecherche
    },

    listeBtnSelectMotsCles: (menuListe, btnSelectListe, elementBEM, menuNom, fichesActives) => {
        btnSelectListe.innerHTML = ''

        menuListe.forEach(motCle => {
            const itemListe = redacDry.nouvelElementDom('li', elementBEM + '__item')
            itemListe.textContent = util.capitalize(motCle)
            btnSelectListe.appendChild(itemListe)

            // RECHERCHE : gestion des étiquettes
            itemListe.addEventListener('click', (e) => {
                const motCleCible = e.target.textContent
                templateRecherches.etiquette(motCleCible, menuNom, fichesActives)
                FonctionRecherche.lancementRecherche(ensembleFiches)

                // vider les champs de recherche des boutons
                const btnSelectInput = document.querySelectorAll('.btn-select__conteneur-saisie input')
                btnSelectInput.forEach(btn => btn.value = '')
                
            })
        })
        
    },
        
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

    etiquette: (motCleCible, menuNom) => {
        const conteneur = document.querySelector('.etiquettes__liste')
        const nomMenuRaccourci = menuNom.substr(0,3).toLowerCase()

        // étiquette avec couleur héritée du menu via menuNom
        const etiquette = redacDry.nouvelElementDom('li', 'btn-principal')
        etiquette.classList.add(nomMenuRaccourci)
        const nomMotCle = redacDry.nouvelElementDom('p', 'etiquette__mot-cle')
        nomMotCle.textContent = motCleCible

        const btnFermeture = redacDry.nouvelElementDom('button', 'etiquette__supprimer')
        const btnIcone = redacDry.nouvelElementDom('i', 'far fa-times-circle')
        btnFermeture.append(btnIcone)

        etiquette.append(nomMotCle, btnFermeture)
        conteneur.appendChild(etiquette)

        // fermeture au clic sur le btn de fermeture
        btnFermeture.addEventListener('click', (e) => {
            etiquette.remove()
            // RECHERCHE : actualiser la recherche
            FonctionRecherche.lancementRecherche(ensembleFiches)
        })
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
    },

    messageResultatsVides: () => {
        const conteneurFicheRecettes = document.querySelector('.resultats-recherche')
        const messageAucuneRecette = `<p class="msg-resultats">Aucune recette ne correspond à votre critère... Vous pouvez rechercher « tarte aux pommes », « poisson », etc.</p>`
        conteneurFicheRecettes.innerHTML = messageAucuneRecette
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
}

const sectionResultatsRecherche = (ensembleFiches) => {
    const conteneurFicheRecettes = redacDry.nouvelElementDom('section', 'resultats-recherche')
    ensembleFiches.forEach(recette => ficheRecette(recette, conteneurFicheRecettes))
    corpsContenuPage.appendChild(conteneurFicheRecettes)

    return conteneurFicheRecettes
}


/////////////////////////////
/// FONCTION DE RECHERCHE ///
/////////////////////////////

const FonctionRecherche = {
    // pour chaque fiche, récupérer dans un tableau les champs suivants :
    // [0] : id ; [1] : titre ; [2] : description ;
    // [3] : ingrédietns ; [4] : appareils ; [5] : ustensiles.

// matcher par id les fiches simplifiées retenues en résultats de recherche et fiches complètes du json
    rechercheRecetteParId : (id) => {
        const recetteIdCorrespondante = ensembleFiches.filter((recette) => id.includes(recette.id))
        return recetteIdCorrespondante
    },

    preTraitementRecettes : (recettes) => {
        const tableauContenuxPrincipaux = []
        recettes.forEach((recette) => {
            const contenuPrincipalRecette = []

            contenuPrincipalRecette.push(recette.id)
            contenuPrincipalRecette.push(recette.name.toLowerCase())
            contenuPrincipalRecette.push(recette.description.toLowerCase())
            recette.ingredients.map((ingredients) => {
                contenuPrincipalRecette.push(ingredients.ingredient.toLowerCase())
            })
            contenuPrincipalRecette.push(recette.appliance.toLowerCase())
            recette.ustensils.map((ustensile) => {
                contenuPrincipalRecette.push(ustensile.toLowerCase())
            })
            tableauContenuxPrincipaux.push(contenuPrincipalRecette)
        })
        return tableauContenuxPrincipaux
    },

    recupEtiquettesActives : () => {
        const tableauEtiquettes = document.querySelectorAll('.etiquettes__liste li')
        const etiquettesActives = []

        tableauEtiquettes.forEach(etiquette => {
            etiquettesActives.push(etiquette.textContent.toLowerCase())
        })
        return etiquettesActives
    },


    triParSaisieLibre : (fichesActives, saisie) => {
        const contenusRecettes = FonctionRecherche.preTraitementRecettes(fichesActives)
        const longueurMin = 3

            if (saisie.length > longueurMin - 1) {
                let fichesCorrespondantes = []

                contenusRecettes.forEach(recettes => { recettes.map(recette => {
                    if (recette.toString().includes(saisie)) { 
                        // récupère l'id de la fiche retenue
                        fichesCorrespondantes.push(recettes[0])
                    }
                })})

                let fichesRetenues = FonctionRecherche.rechercheRecetteParId(fichesCorrespondantes)
                return fichesRetenues
            }
        return fichesActives
    },

    triParMotCle : (fichesActives) => {
        const etiquettes = FonctionRecherche.recupEtiquettesActives()

        if (etiquettes.length > 0) {
            const contenusRecettes = FonctionRecherche.preTraitementRecettes(fichesActives)
            let fichesCorrespondantes = []

            contenusRecettes.forEach(recettes => { 
                let tableauContientMots = (tableau, mots) => mots.every(mot => tableau.includes(mot))

                if (tableauContientMots(recettes, etiquettes)) { 
                    // récupère l'id de la fiche retenue
                    fichesCorrespondantes.push(recettes[0])
                }
            })

        let fichesRetenues = FonctionRecherche.rechercheRecetteParId(fichesCorrespondantes)
        
        return fichesRetenues
    }
    return fichesActives
    },

    // triInputMotsCle : () => {

    // },

    actualiserListesMotsCle : (fichesActives) => {
        const btnSelectApercu = document.querySelectorAll('.btn-select__apercu')
        const btnSelectListe = document.querySelectorAll('.btn-select__liste')
        const btnSelectInput = document.querySelectorAll('.btn-select__conteneur-saisie input')

        const menuListeIng = util.recupListeIngredients(fichesActives)
        const menuListeApp = util.recupListeAppareils(fichesActives)
        const menuListeUst = util.recupListeUstensiles(fichesActives)
        
        btnSelectApercu.forEach(btn => {
            if (btn.textContent.includes('Ingrédients')) {
                const btnSelectIng = btnSelectListe[0]

                templateRecherches.listeBtnSelectMotsCles(
                    menuListeIng,
                    btnSelectIng,
                    'btn-select',
                    btn.textContent,
                    fichesActives)

                // configuration de l'input du bouton
                btnSelectInput[0].addEventListener('input', (e) => {
                    const saisie = e.target.value.toLowerCase()
                    let menuListeSaisieLibreIng = []
                    Array.from(menuListeIng).forEach((menuListeMot) => {
                        if (menuListeMot.includes(saisie)) {
                            menuListeSaisieLibreIng.push(menuListeMot)
                        }
                    })

                    templateRecherches.listeBtnSelectMotsCles(
                        menuListeSaisieLibreIng,
                        btnSelectIng,
                        'btn-select',
                        btn.textContent,
                        fichesActives)
                })

            } if (btn.textContent.includes('Appareils')) {
                const btnSelectApp = btnSelectListe[1]
                templateRecherches.listeBtnSelectMotsCles(
                    menuListeApp,
                    btnSelectApp,
                    'btn-select',
                    btn.textContent,
                    fichesActives)

                    // configuration de l'input du bouton
                btnSelectInput[1].addEventListener('input', (e) => {
                    const saisie = e.target.value.toLowerCase()
                    let menuListeSaisieLibreApp = []
                    Array.from(menuListeApp).forEach((menuListeMot) => {
                        if (menuListeMot.includes(saisie)) {
                            menuListeSaisieLibreApp.push(menuListeMot)
                        }
                    })

                    templateRecherches.listeBtnSelectMotsCles(
                        menuListeSaisieLibreApp,
                        btnSelectApp,
                        'btn-select',
                        btn.textContent,
                        fichesActives)
                })

            } if (btn.textContent.includes('Ustensiles')) {
                const btnSelectUst = btnSelectListe[2]
                templateRecherches.listeBtnSelectMotsCles(
                    menuListeUst,
                    btnSelectUst,
                    'btn-select',
                    btn.textContent,
                    fichesActives)

                    // configuration de l'input du bouton
                btnSelectInput[2].addEventListener('input', (e) => {
                    const saisie = e.target.value.toLowerCase()
                    let menuListeSaisieLibreUst = []
                    Array.from(menuListeUst).forEach((menuListeMot) => {
                        if (menuListeMot.includes(saisie)) {
                            menuListeSaisieLibreUst.push(menuListeMot)
                        }
                    })

                    templateRecherches.listeBtnSelectMotsCles(
                        menuListeSaisieLibreUst,
                        btnSelectUst,
                        'btn-select',
                        btn.textContent,
                        fichesActives)
                })
            }
        })
    },

    actualiserAffichageResultats : (fichesActives) => {
        const conteneurFicheRecettes = document.querySelector('.resultats-recherche')
        conteneurFicheRecettes.innerHTML = ''
        fichesActives.forEach(fiche => ficheRecette(fiche, conteneurFicheRecettes))
    
        // Actualiser les menus select 
        FonctionRecherche.actualiserListesMotsCle(fichesActives)
    
        // Si aucun résultat correspondant, afficher message adéquat
        if (fichesActives.length === 0) {
            templateRecherches.messageResultatsVides()
        }
    },

    lancementRecherche : (ensembleFiches) => {

        // recherche par mot clé
        let etapeTri0 = []
        const triParMotCle = FonctionRecherche.triParMotCle(ensembleFiches)
        etapeTri0.push(triParMotCle)
        let etapeTri1 = etapeTri0.flat()
        FonctionRecherche.actualiserAffichageResultats(etapeTri1)

        // recherche par saisie libre
        const champSaisie = document.querySelector('.recherche__saisie')
        const saisie = champSaisie.value.toLowerCase()

        let etapeTri2 = []
        const triParSaisieLibre = FonctionRecherche.triParSaisieLibre(etapeTri1, saisie)
        etapeTri2.push(triParSaisieLibre)

        let etapeTri3 = etapeTri2.flat()
        FonctionRecherche.actualiserAffichageResultats(etapeTri3)

        console.log(`critères de recherche = ${saisie} & ${FonctionRecherche.recupEtiquettesActives()}`)
    }
}

/////////////////////////////
/// GENERATION DE LA PAGE ///
/////////////////////////////

const creationPage = () => {
    sectionRecherche()
    sectionResultatsRecherche(ensembleFiches)
    FonctionRecherche.lancementRecherche(ensembleFiches)
}
creationPage()