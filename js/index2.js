/* eslint-disable spaced-comment */
import { recettes } from './data/recipes.js'

// DOM DE BASE
// const corpsPage = document.querySelector('.js-page') // body
const corpsContenuPage = document.querySelector('.js-document') // main

// INITIALISATION ET STRUCTURE DES DONNEES
// TODO : dictionnaire avec duplication du tableau des recettes
const ensembleFiches = [...recettes]

////////////////////////
//////// OUTILS ////////
////////////////////////

const util = {
  recupListeIngredients: (fichesRecettes) => {
    const listeIngredients = new Set()

    for (let recette of fichesRecettes) {
      for (let ingredients of recette.ingredients) {
        listeIngredients.add(ingredients.ingredient.toLowerCase())
      }
    }

    return listeIngredients
  },

  recupListeAppareils: (fichesRecettes) => {
    const listeAppareils = new Set()

    for (let recette of fichesRecettes) {
      listeAppareils.add(recette.appliance.toLowerCase())
    }

    return listeAppareils
  },

  recupListeUstensiles: (fichesRecettes) => {
    const listeUstensiles = new Set()

    for (let recette of fichesRecettes) {
      for (let ustensile of recette.ustensils) {
        listeUstensiles.add(ustensile.toLowerCase())
      }
    }

    return listeUstensiles
  },

  // (casse) majuscule pour la première lettre d'une chaîne de caractères
  capitalize: (texte) => {
    return texte.charAt(0).toUpperCase() + texte.slice(1)
  },

  normalize: (texte) => {
    return texte.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
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
    for (const cle in attributs) {
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
      placeholder: 'Rechercher un ingrédient, appareil, ustensile ou une recette'
    })
    const btnLoupe = redacDry.nouvelElementDom('button', elementBEM + '__btn')
    const btnIcone = redacDry.nouvelElementDom('i', 'fas fa-search')
    redacDry.definirAttributs(btnLoupe, { type: 'button', 'aria-label': 'Lancer la recherche' })
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
    const nomMenuRaccourci = menuNom.substr(0, 3).toLowerCase()

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
    const btnSelectListe = redacDry.nouvelElementDom('ul', elementBEM + '__liste')
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
    templateRecherches.btnSelectMotsCles('Ingrédients', util.recupListeIngredients(recettes), conteneurBtnSelect, conteneur)
    templateRecherches.btnSelectMotsCles('Appareils', util.recupListeAppareils(recettes), conteneurBtnSelect, conteneur)
    templateRecherches.btnSelectMotsCles('Ustensiles', util.recupListeUstensiles(recettes), conteneurBtnSelect, conteneur)

    conteneur.appendChild(conteneurBtnSelect)
    return conteneurBtnSelect
  },

  messageResultatsVides: () => {
    const conteneurFicheRecettes = document.querySelector('.resultats-recherche')
    const messageAucuneRecette = '<p class="msg-resultats">Aucune recette ne correspond à votre critère... Vous pouvez rechercher « tarte aux pommes », « poisson », etc.</p>'
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
    if (ingredientEnCours.quantity === undefined &
                ingredientEnCours.unit === undefined) {
      nomIngredient.textContent = ingredientEnCours.ingredient
      itemIngredient.append(nomIngredient)

      // s'il y a seulement une quantité :
    } else if (ingredientEnCours.quantity !== undefined &
                ingredientEnCours.unit === undefined) {
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
  for (let recette of ensembleFiches) {
    ficheRecette(recette, conteneurFicheRecettes)
  }
  corpsContenuPage.appendChild(conteneurFicheRecettes)

  return conteneurFicheRecettes
}

/////////////////////////////
/// FONCTION DE RECHERCHE ///
/////////////////////////////

const FonctionRecherche = {

  // matcher par id les fiches simplifiées retenues en résultats de recherche et fiches complètes du json
  rechercheRecetteParId: (id) => {
    const recetteIdCorrespondante = ensembleFiches.filter((recette) => id.includes(recette.id))
    return recetteIdCorrespondante
  },

  // pour chaque fiche, récupérer dans un tableau les champs suivants :
  // [0] : id ; [1] : titre ; [2] : description ;
  // [3] : ingrédietns ; [4] : appareils ; [5] : ustensiles.
  preTraitementRecettes: (recettes) => {
    const tableauContenuxPrincipaux = []
    recettes.forEach((recette) => {
      const contenuPrincipalRecette = []

      contenuPrincipalRecette.push(recette.id)
      contenuPrincipalRecette.push(util.normalize(recette.name))
      contenuPrincipalRecette.push(util.normalize(recette.description))
      for (let ingredients of recette.ingredients) {
        contenuPrincipalRecette.push(util.normalize(ingredients.ingredient))
      }
      contenuPrincipalRecette.push(util.normalize(recette.appliance))
      for (let ustensile of recette.ustensils) {
        contenuPrincipalRecette.push(util.normalize(ustensile))
      }
      tableauContenuxPrincipaux.push(contenuPrincipalRecette)
    })
    return tableauContenuxPrincipaux
  },

  recupEtiquettesActives: () => {
    const tableauEtiquettes = document.querySelectorAll('.etiquettes__liste li')
    const etiquettesActives = []

    for (let etiquette of tableauEtiquettes) {
      etiquettesActives.push(util.normalize(etiquette.textContent))
    }
    return etiquettesActives
  },

  contient: (recette, saisie) => {
    for (let i = 0; i < recette.length; i++) {
      if (recette[i] === saisie) {
        return true
      }
    }
    return false
  },

  triParSaisieLibre: (fichesActives) => {
    const champSaisie = document.querySelector('.recherche__saisie')
    const saisie = util.normalize(champSaisie.value)
    // Traitement des données des fiches actives pour faciliter itération
    // (chaque fiche devient un tableau qui est découpée en sous-tableaux)
    const contenusRecettes = FonctionRecherche.preTraitementRecettes(fichesActives)
    const longueurMin = 3
    const regex = new RegExp(saisie)

    if (saisie.length > longueurMin - 1) {
      const fichesCorrespondantes = []

      for (let recettes of contenusRecettes) {
        // tester le contenu de la recette transformé en string
        const contenuParRecette = recettes.join(' ')
        // conserver seulement celles dont le contenu contient la saisie (stockée en regex)
        if (regex.test(contenuParRecette)) {
          fichesCorrespondantes.push(recettes[0])
        }
      }
      // crée un tableau avec les fiches en json récupérées via leur id stockée dans fichesCorrespondantes
      const fichesRetenues = FonctionRecherche.rechercheRecetteParId(fichesCorrespondantes)
      return fichesRetenues
    }
    // si moins de 3 lettres, retourne le tableau fichesActives reçu en paramètres
    return fichesActives
  },

  triParMotCle: (fichesActives) => {
    // récupération du tableau contenant les mots-clés sélectionnés
    const etiquettes = FonctionRecherche.recupEtiquettesActives()
    // si des mots-clés sont sélectionnées, traiter les données des fiches actives pour faciliter itération
    // (chaque fiche devient un tableau qui est découpée en sous-tableaux)
    if (etiquettes.length > 0) {
      const contenusRecettes = FonctionRecherche.preTraitementRecettes(fichesActives)
      const fichesCorrespondantes = []

      for (let recettes of contenusRecettes) {
        // pour chaque fiche (recettes), trier celles qui contiennent chacun des mots-clés sélectionnés (etiquettes)
        const tableauContientMots = (tableau, mots) => mots.every(mot => tableau.includes(mot))
        if (tableauContientMots(recettes, etiquettes)) {
          // récupère l'id de la fiche retenue et push dans tableau des fiches correspondant aux critères
          fichesCorrespondantes.push(recettes[0])
        }
      }
      // crée un tableau avec les fiches en json récupérées via leur id stockée dans fichesCorrespondantes
      const fichesRetenues = FonctionRecherche.rechercheRecetteParId(fichesCorrespondantes)

      return fichesRetenues
    }
    // si pas de mot-clé sélectionné, renvoie le tableau intact
    return fichesActives
  },

  inputListeMotsCle: (menuListe, e) => {
    const saisie = util.normalize(e.target.value)
    const menuListeSaisieLibre = []

    for (let menuListeMot of Array.from(menuListe)) {
      if (util.normalize(menuListeMot).includes(saisie)) {
        menuListeSaisieLibre.push(menuListeMot)
      }
    }
    return menuListeSaisieLibre
  },

  // TODO : reprendre & raccourcir le code
  actualiserListesMotsCle: (fichesActives) => {
    const btnSelectApercu = document.querySelectorAll('.btn-select__apercu')
    const btnSelectListe = document.querySelectorAll('.btn-select__liste')
    const btnSelectInput = document.querySelectorAll('.btn-select__conteneur-saisie input')

    const menuListeIng = util.recupListeIngredients(fichesActives)
    const menuListeApp = util.recupListeAppareils(fichesActives)
    const menuListeUst = util.recupListeUstensiles(fichesActives)

    for (let btn of btnSelectApercu) {
      if (btn.textContent.includes('Ingrédients')) {
        templateRecherches.listeBtnSelectMotsCles(menuListeIng, btnSelectListe[0], 'btn-select', btn.textContent, fichesActives)
        // configuration de l'input interne de la liste
        btnSelectInput[0].addEventListener('input', (e) => {
          const menuListeSaisie = FonctionRecherche.inputListeMotsCle(menuListeIng, e)
          templateRecherches.listeBtnSelectMotsCles(menuListeSaisie, btnSelectListe[0], 'btn-select', btn.textContent, fichesActives)
        })
      } if (btn.textContent.includes('Appareils')) {
        // actualisation de la liste selon les fiches actives
        templateRecherches.listeBtnSelectMotsCles(menuListeApp, btnSelectListe[1], 'btn-select', btn.textContent, fichesActives)
        // configuration de l'input interne de la liste
        btnSelectInput[1].addEventListener('input', (e) => {
          const menuListeSaisie = FonctionRecherche.inputListeMotsCle(menuListeApp, e)
          templateRecherches.listeBtnSelectMotsCles(menuListeSaisie, btnSelectListe[1], 'btn-select', btn.textContent, fichesActives)
        })
      } if (btn.textContent.includes('Ustensiles')) {
        // actualisation de la liste selon les fiches actives
        templateRecherches.listeBtnSelectMotsCles(menuListeUst, btnSelectListe[2], 'btn-select', btn.textContent, fichesActives)
        // configuration de l'input interne de la liste
        btnSelectInput[2].addEventListener('input', (e) => {
          const menuListeSaisie = FonctionRecherche.inputListeMotsCle(menuListeUst, e)
          templateRecherches.listeBtnSelectMotsCles(menuListeSaisie, btnSelectListe[2], 'btn-select', btn.textContent, fichesActives)
        })
      }
    }
  },

  actualiserAffichageResultats: (fichesActives) => {
    // vider la section et créer l'élément pour chaque fiche ayant passé les critères de tri
    const conteneurFicheRecettes = document.querySelector('.resultats-recherche')
    conteneurFicheRecettes.innerHTML = ''

    for (let fiche of fichesActives) {
      ficheRecette(fiche, conteneurFicheRecettes)
    }

    // Actualiser les menus select
    FonctionRecherche.actualiserListesMotsCle(fichesActives)

    // Si aucun résultat correspondant (fichesActives vide), afficher message adéquat
    if (fichesActives.length === 0) {
      templateRecherches.messageResultatsVides()
    }
  },

  // APPEL DE LA FONCTION CI-DESSOUS DANS templateRecherche :
  // - à la création de l'input principal de recherche (l. 98)
  // - lors de la création et de la suppression des étiquettes de mots-clés (l. 144 & l. 178)
  lancementRecherche: (ensembleFiches) => {
    // recherche par saisie libre : écoute de la valeur du champ de saisie (renvoie les fiches dans leur format d'origine)
    const triParSaisieLibre = FonctionRecherche.triParSaisieLibre(ensembleFiches)
    // recherche par mots-clés : renvoie les fiches dans leur format original (json)
    const triParMotCle = FonctionRecherche.triParMotCle(triParSaisieLibre)
    // affichage final : actualiser les résultats affichés et les listes de mots-clés (avec les fiches ayant passé les 2 critères de tri)
    FonctionRecherche.actualiserAffichageResultats(triParMotCle)

    console.log(`critères de recherche = ${document.querySelector('.recherche__saisie').value} & ${FonctionRecherche.recupEtiquettesActives()}.`)
    console.log(`nombre de résultats : ${triParMotCle.length}`)
  }
}

/////////////////////////////
/// GENERATION DE LA PAGE ///
/////////////////////////////

const creationPage = () => {
  sectionRecherche()
  sectionResultatsRecherche(ensembleFiches)
}
creationPage()
