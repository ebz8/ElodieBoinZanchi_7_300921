
const util = {
  recupListeIngredients: (fichesRecettes) => {
    const listeIngredients = new Set();

    fichesRecettes.map(recette => {
      recette.ingredients.map((ingredients) => {
        listeIngredients.add(ingredients.ingredient.toLowerCase());
      });
    });

    return listeIngredients;
  },

  recupListeAppareils: (fichesRecettes) => {
    const listeAppareils = new Set();

    fichesRecettes.map(recette => {
      listeAppareils.add(recette.appliance.toLowerCase());
    });

    return listeAppareils;
  },

  recupListeUstensiles: (fichesRecettes) => {
    const listeUstensiles = new Set();

    fichesRecettes.map(recette => {
      recette.ustensils.map((ustensile) => {
        listeUstensiles.add(ustensile.toLowerCase());
      });
    });

    return listeUstensiles;
  },

  // (casse) majuscule pour la première lettre d'une chaîne de caractères
  capitalize: (texte) => {
    return texte.charAt(0).toUpperCase() + texte.slice(1);
  },

  normalize: (texte) => {
    return texte.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
};

// V1 PROGRAMMATION FONCTIONNELLE


const FonctionRecherche = {

  // matcher par id les fiches simplifiées retenues en résultats de recherche et fiches complètes du json
  rechercheRecetteParId: (id) => {
    const recetteIdCorrespondante = ensembleFiches.filter((recette) => id.includes(recette.id));
    return recetteIdCorrespondante;
  },

  // pour chaque fiche, récupérer dans un tableau les champs suivants :
  // [0] : id ; [1] : titre ; [2] : description ;
  // [3] : ingrédietns ; [4] : appareils ; [5] : ustensiles.
preTraitementRecettes: (recettes) => {
  const tableauContenuxPrincipaux = [];
  recettes.forEach((recette) => {
    const contenuPrincipalRecette = [];

    contenuPrincipalRecette.push(recette.id);
    contenuPrincipalRecette.push(util.normalize(recette.name));
    contenuPrincipalRecette.push(util.normalize(recette.description));
    recette.ingredients.map((ingredients) => {
      contenuPrincipalRecette.push(util.normalize(ingredients.ingredient));
    });
    contenuPrincipalRecette.push(util.normalize(recette.appliance));
    recette.ustensils.map((ustensile) => {
      contenuPrincipalRecette.push(util.normalize(ustensile));
    });
    tableauContenuxPrincipaux.push(contenuPrincipalRecette);
  });
  return tableauContenuxPrincipaux;
},

recupEtiquettesActives: () => {
  const tableauEtiquettes = document.querySelectorAll('.etiquettes__liste li');
  const etiquettesActives = [];

  tableauEtiquettes.forEach(etiquette => {
    etiquettesActives.push(util.normalize(etiquette.textContent));
  });
  return etiquettesActives;
},

triParSaisieLibre: (fichesActives, saisie) => {
  // Traitement des données des fiches actives pour faciliter itération
  // (chaque fiche devient un tableau qui est découpée en sous-tableaux)
  const contenusRecettes = FonctionRecherche.preTraitementRecettes(fichesActives);
  const longueurMin = 3;

  if (saisie.length > longueurMin - 1) {
    const fichesCorrespondantes = [];

    contenusRecettes.forEach(recettes => {
      recettes.map(recette => {
      // transformation du contenu de chaque recette en string et vérifier si elle inclue la saisie
        if (recette.toString().includes(saisie)) {
        // récupère l'id de la fiche retenue et push dans tableau des fiches correspondant aux critères
          fichesCorrespondantes.push(recettes[0]);
        }
      });
    });
    // crée un tableau avec les fiches en json récupérées via leur id stockée dans fichesCorrespondantes
    const fichesRetenues = FonctionRecherche.rechercheRecetteParId(fichesCorrespondantes);
    return fichesRetenues;
  }
  // si moins de 3 lettres, retourne le tableau fichesActives reçu en paramètres
  return fichesActives;
},

triParMotCle: (fichesActives) => {
  // récupération du tableau contenant les mots-clés sélectionnés
  const etiquettes = FonctionRecherche.recupEtiquettesActives();
  // si des mots-clés sont sélectionnées, traiter les données des fiches actives pour faciliter itération
  // (chaque fiche devient un tableau qui est découpée en sous-tableaux)
  if (etiquettes.length > 0) {
    const contenusRecettes = FonctionRecherche.preTraitementRecettes(fichesActives);
    const fichesCorrespondantes = [];

    contenusRecettes.forEach(recettes => {
      // pour chaque fiche (recettes), trier celles qui contiennent chacun des mots-clés sélectionnés (etiquettes)
      const tableauContientMots = (tableau, mots) => mots.every(mot => tableau.includes(mot));
      if (tableauContientMots(recettes, etiquettes)) {
        // récupère l'id de la fiche retenue et push dans tableau des fiches correspondant aux critères
        fichesCorrespondantes.push(recettes[0]);
      }
    });
    // crée un tableau avec les fiches en json récupérées via leur id stockée dans fichesCorrespondantes
    const fichesRetenues = FonctionRecherche.rechercheRecetteParId(fichesCorrespondantes);

    return fichesRetenues;
  }
  // si pas de mot-clé sélectionné, renvoie le tableau intact
  return fichesActives;
},

// APPEL DANS templateRecherche :
// - à la création de l'input principal de recherche (l. 98)
// - lors de la création et de la suppression des étiquettes de mots-clés (l. 144 & l. 178)
lancementRecherche: (ensembleFiches) => {
  // tri des fiches par mots-clés : renvoie les fiches dans leur format original (json)
  const triParMotCle = FonctionRecherche.triParMotCle(ensembleFiches);
  // actualiser les résultats affichés et les listes de mots-clés

  // recherche par saisie libre : écoute de la valeur du champ de saisie
  // tri dans les résultats donnés par le premier critère de recherche (par mots-clés)
  const champSaisie = document.querySelector('.recherche__saisie');
  const saisie = util.normalize(champSaisie.value);
  const triParSaisieLibre = FonctionRecherche.triParSaisieLibre(triParMotCle, saisie);

  console.log(triParSaisieLibre);

  // affichage final : actualiser les résultats affichés et les listes de mots-clés
  // (avec les fiches ayant passé le second critère de tri)

  console.log(`critères de recherche = ${saisie} & ${FonctionRecherche.recupEtiquettesActives()}`);
}
};
FonctionRecherche.lancementRecherche();














// VERSION 2 : BOUCLES NATIVES

const FonctionRecherche = {

  // matcher par id les fiches simplifiées retenues en résultats de recherche et fiches complètes du json
  rechercheRecetteParId: (id) => {
    const recetteIdCorrespondante = ensembleFiches.filter((recette) => id.includes(recette.id));
    return recetteIdCorrespondante;
  },

  // pour chaque fiche, récupérer dans un tableau les champs suivants :
  // [0] : id ; [1] : titre ; [2] : description ;
  // [3] : ingrédietns ; [4] : appareils ; [5] : ustensiles.
  preTraitementRecettes: (recettes) => {
    const tableauContenuxPrincipaux = [];
    recettes.forEach((recette) => {
      const contenuPrincipalRecette = [];

      contenuPrincipalRecette.push(recette.id);
      contenuPrincipalRecette.push(util.normalize(recette.name));
      contenuPrincipalRecette.push(util.normalize(recette.description));
      for (let ingredients of recette.ingredients) {
        contenuPrincipalRecette.push(util.normalize(ingredients.ingredient));
      }
      contenuPrincipalRecette.push(util.normalize(recette.appliance));
      for (let ustensile of recette.ustensils) {
        contenuPrincipalRecette.push(util.normalize(ustensile));
      }
      tableauContenuxPrincipaux.push(contenuPrincipalRecette);
    });
    return tableauContenuxPrincipaux;
  },

  recupEtiquettesActives: () => {
    const tableauEtiquettes = document.querySelectorAll('.etiquettes__liste li');
    const etiquettesActives = [];

    for (let etiquette of tableauEtiquettes) {
      etiquettesActives.push(util.normalize(etiquette.textContent));
    }
    return etiquettesActives;
  },

  triParSaisieLibre: (fichesActives, saisie) => {
    // Traitement des données des fiches actives pour faciliter itération
    // (chaque fiche devient un tableau qui est découpée en sous-tableaux)
    const contenusRecettes = FonctionRecherche.preTraitementRecettes(fichesActives);
    const longueurMin = 3;
    const regex = new RegExp(saisie);

    if (saisie.length > longueurMin - 1) {
      const fichesCorrespondantes = [];

      for (let recettes of contenusRecettes) {
        const contenuParRecette = recettes.join(' ');
        if (regex.test(contenuParRecette)) {
          fichesCorrespondantes.push(recettes[0]);
        }
      }
      // crée un tableau avec les fiches en json récupérées via leur id stockée dans fichesCorrespondantes
      const fichesRetenues = FonctionRecherche.rechercheRecetteParId(fichesCorrespondantes);
      return fichesRetenues;
    }
    // si moins de 3 lettres, retourne le tableau fichesActives reçu en paramètres
    return fichesActives;
  },

  triParMotCle: (fichesActives) => {
    // récupération du tableau contenant les mots-clés sélectionnés
    const etiquettes = FonctionRecherche.recupEtiquettesActives();
    // si des mots-clés sont sélectionnées, traiter les données des fiches actives pour faciliter itération
    // (chaque fiche devient un tableau qui est découpée en sous-tableaux)
    if (etiquettes.length > 0) {
      const contenusRecettes = FonctionRecherche.preTraitementRecettes(fichesActives);
      const fichesCorrespondantes = [];

      for (let recettes of contenusRecettes) {
        // pour chaque fiche (recettes), trier celles qui contiennent chacun des mots-clés sélectionnés (etiquettes)
        const tableauContientMots = (tableau, mots) => mots.every(mot => tableau.includes(mot));
        if (tableauContientMots(recettes, etiquettes)) {
          // récupère l'id de la fiche retenue et push dans tableau des fiches correspondant aux critères
          fichesCorrespondantes.push(recettes[0]);
        }
      }
      // crée un tableau avec les fiches en json récupérées via leur id stockée dans fichesCorrespondantes
      const fichesRetenues = FonctionRecherche.rechercheRecetteParId(fichesCorrespondantes);

      return fichesRetenues;
    }
    // si pas de mot-clé sélectionné, renvoie le tableau intact
    return fichesActives;
  },

  // APPEL DANS templateRecherche :
  // - à la création de l'input principal de recherche (l. 98)
  // - lors de la création et de la suppression des étiquettes de mots-clés (l. 144 & l. 178)
  lancementRecherche: (ensembleFiches) => {
    // tri des fiches par mots-clés : renvoie les fiches dans leur format original (json)
    const triParMotCle = FonctionRecherche.triParMotCle(ensembleFiches);
    // actualiser les résultats affichés et les listes de mots-clés
    FonctionRecherche.actualiserAffichageResultats(triParMotCle);

    // recherche par saisie libre : écoute de la valeur du champ de saisie
    // tri dans les résultats donnés par le premier critère de recherche (par mots-clés)
    const champSaisie = document.querySelector('.recherche__saisie');
    const saisie = util.normalize(champSaisie.value);
    const triParSaisieLibre = FonctionRecherche.triParSaisieLibre(triParMotCle, saisie);

    // affichage final : actualiser les résultats affichés et les listes de mots-clés
    // (avec les fiches ayant passé le second critère de tri)
    FonctionRecherche.actualiserAffichageResultats(triParSaisieLibre);

    console.log(`critères de recherche = ${saisie} & ${FonctionRecherche.recupEtiquettesActives()}`);
  }
};
FonctionRecherche.lancementRecherche();


// V3
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
      recette.ingredients.map((ingredients) => {
        contenuPrincipalRecette.push(util.normalize(ingredients.ingredient))
      })
      contenuPrincipalRecette.push(util.normalize(recette.appliance))
      recette.ustensils.map((ustensile) => {
        contenuPrincipalRecette.push(util.normalize(ustensile))
      })
      tableauContenuxPrincipaux.push(contenuPrincipalRecette)
    })
    return tableauContenuxPrincipaux
  },

  recupEtiquettesActives: () => {
    const tableauEtiquettes = document.querySelectorAll('.etiquettes__liste li')
    const etiquettesActives = []

    tableauEtiquettes.forEach(etiquette => {
      etiquettesActives.push(util.normalize(etiquette.textContent))
    })
    return etiquettesActives
  },

  // TODO : reprendre & raccourcir le code
  actualiserListesMotsCle: (fichesActives) => {
    const btnSelectApercu = document.querySelectorAll('.btn-select__apercu')
    const btnSelectListe = document.querySelectorAll('.btn-select__liste')
    const btnSelectInput = document.querySelectorAll('.btn-select__conteneur-saisie input')

    const menuListeIng = util.recupListeIngredients(fichesActives)
    const menuListeApp = util.recupListeAppareils(fichesActives)
    const menuListeUst = util.recupListeUstensiles(fichesActives)

    btnSelectApercu.forEach(btn => {
      if (btn.textContent.includes('Ingrédients')) {
        const btnSelectIng = btnSelectListe[0]
        templateRecherches.listeBtnSelectMotsCles(menuListeIng, btnSelectIng, 'btn-select', btn.textContent, fichesActives)

        // configuration de l'input du bouton
        btnSelectInput[0].addEventListener('input', (e) => {
          const saisie = util.normalize(e.target.value)
          console.log(saisie)
          const menuListeSaisieLibreIng = []
          Array.from(menuListeIng).forEach((menuListeMot) => {
            if (util.normalize(menuListeMot).includes(saisie)) {
              menuListeSaisieLibreIng.push(menuListeMot)
            }
          })
          templateRecherches.listeBtnSelectMotsCles(menuListeSaisieLibreIng, btnSelectIng, 'btn-select', btn.textContent, fichesActives)
        })
      } if (btn.textContent.includes('Appareils')) {
        const btnSelectApp = btnSelectListe[1]
        templateRecherches.listeBtnSelectMotsCles(menuListeApp, btnSelectApp, 'btn-select', btn.textContent, fichesActives)

        // configuration de l'input du bouton
        btnSelectInput[1].addEventListener('input', (e) => {
          const saisie = util.normalize(e.target.value)
          const menuListeSaisieLibreApp = []
          Array.from(menuListeApp).forEach((menuListeMot) => {
            if (util.normalize(menuListeMot).includes(saisie)) {
              menuListeSaisieLibreApp.push(menuListeMot)
            }
          })
          templateRecherches.listeBtnSelectMotsCles(menuListeSaisieLibreApp, btnSelectApp, 'btn-select', btn.textContent, fichesActives)
        })
      } if (btn.textContent.includes('Ustensiles')) {
        const btnSelectUst = btnSelectListe[2]
        templateRecherches.listeBtnSelectMotsCles(menuListeUst, btnSelectUst, 'btn-select', btn.textContent, fichesActives)

        // configuration de l'input du bouton avec les fiches
        btnSelectInput[2].addEventListener('input', (e) => {
          const saisie = util.normalize(e.target.value)
          const menuListeSaisieLibreUst = []
          Array.from(menuListeUst).forEach((menuListeMot) => {
            if (util.normalize(menuListeMot).includes(saisie)) {
              menuListeSaisieLibreUst.push(menuListeMot)
            }
          })
          templateRecherches.listeBtnSelectMotsCles(menuListeSaisieLibreUst, btnSelectUst, 'btn-select', btn.textContent, fichesActives)
        })
      }
    })
  },

  actualiserAffichageResultats: (fichesActives) => {
    // vider la section et créer l'élément pour chaque fiche ayant passé les critères de tri
    const conteneurFicheRecettes = document.querySelector('.resultats-recherche')
    conteneurFicheRecettes.innerHTML = ''
    fichesActives.forEach(fiche => ficheRecette(fiche, conteneurFicheRecettes))

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
    // traitement des données
    const contenusRecettes = FonctionRecherche.preTraitementRecettes(ensembleFiches)

    // récupérer la valeur saisie dans le champ de recherche principal
    const champSaisie = document.querySelector('.recherche__saisie')
    const saisie = util.normalize(champSaisie.value)

    // récupérer l'ensemble des termes de recherche
    const termesDeRecherche = []
    termesDeRecherche.push(saisie, FonctionRecherche.recupEtiquettesActives())
    const mots = termesDeRecherche.flat()

    const fichesCorrespondantes = []
    if (termesDeRecherche.flat().length === 0) {
      FonctionRecherche.actualiserAffichageResultats(ensembleFiches)
    } else {
      contenusRecettes.forEach(recettes => {
        const tableauContientMots = (tableau, mots) => mots.every(mot => tableau.includes(mot))
        const contenuParRecette = recettes.join(' ')
        // pour chaque fiche recette, vérifier qu'elle contient l'ensemble des termes de recherche
        if (tableauContientMots(contenuParRecette, mots)) {
          // récupère l'id de la fiche retenue et push dans tableau des fiches correspondant aux critères
          fichesCorrespondantes.push(recettes[0])
        }
      })

      // crée un tableau avec les fiches en json récupérées via leur id stockée dans fichesCorrespondantes
      const fichesRetenues = FonctionRecherche.rechercheRecetteParId(fichesCorrespondantes)
      console.log(`termes de recherche : ${mots}`)
      console.log(`nombre de résultats : ${fichesRetenues.length}`)

      // affichage final : actualiser les résultats affichés et les listes de mots-clés (avec les fiches ayant passé le second critère de tri)
      FonctionRecherche.actualiserAffichageResultats(fichesRetenues)
    }
  }
}
  
  FonctionRecherche.lancementRecherche(ensembleFiches);