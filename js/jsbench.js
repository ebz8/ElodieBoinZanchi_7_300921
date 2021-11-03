const saisie = 'citrons';
const ensembleFiches = [...recipes];


// V1 PROGRAMMATION FONCTIONNELLE
const FonctionRecherche = {

  // matcher par id les fiches simplifiées retenues en résultats de recherche et fiches complètes du json
  rechercheRecetteParId: (id) => {
    const recetteIdCorrespondante = ensembleFiches.filter((recette) => id.includes(recette.id));
    return recetteIdCorrespondante;
  },

  preTraitementSaisie: (recettes) => {
    const tableauContenuxPrincipaux = [];
    recettes.forEach((recette) => {
      const contenuPrincipalRecette = [];

      contenuPrincipalRecette.push(recette.id);
      contenuPrincipalRecette.push(util.normalize(recette.name));
      contenuPrincipalRecette.push(util.normalize(recette.description));
      recette.ingredients.map((ingredients) => {
        contenuPrincipalRecette.push(util.normalize(ingredients.ingredient));
      });
      tableauContenuxPrincipaux.push(contenuPrincipalRecette);
    });
    return tableauContenuxPrincipaux;
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
};
FonctionRecherche.triParSaisieLibre(ensembleFiches);



// VERSION 2 : BOUCLES NATIVES

const FonctionRecherche = {

  // matcher par id les fiches simplifiées retenues en résultats de recherche et fiches complètes du json
  rechercheRecetteParId: (id) => {
    const recetteIdCorrespondante = ensembleFiches.filter((recette) => id.includes(recette.id));
    return recetteIdCorrespondante;
  },

  preTraitementSaisie: (recettes) => {
    const tableauContenuxPrincipaux = [];
    recettes.forEach((recette) => {
      const contenuPrincipalRecette = [];

      contenuPrincipalRecette.push(recette.id);
      contenuPrincipalRecette.push(util.normalize(recette.name));
      contenuPrincipalRecette.push(util.normalize(recette.description));
      recette.ingredients.map((ingredients) => {
        contenuPrincipalRecette.push(util.normalize(ingredients.ingredient));
      });
      tableauContenuxPrincipaux.push(contenuPrincipalRecette);
    });
    return tableauContenuxPrincipaux;
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
};
FonctionRecherche.triParSaisieLibre(ensembleFiches);


// V3

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

  // APPEL DE LA FONCTION CI-DESSOUS DANS templateRecherche :
  // - à la création de l'input principal de recherche (l. 98)
  // - lors de la création et de la suppression des étiquettes de mots-clés (l. 144 & l. 178)
  lancementRecherche: (ensembleFiches) => {
    // traitement des données
    const contenusRecettes = FonctionRecherche.preTraitementRecettes(ensembleFiches);

    // récupérer la valeur saisie dans le champ de recherche principal
    const champSaisie = document.querySelector('.recherche__saisie');
    const saisie = util.normalize(champSaisie.value);

    // récupérer l'ensemble des termes de recherche
    const termesDeRecherche = [];
    termesDeRecherche.push(saisie, FonctionRecherche.recupEtiquettesActives());
    const mots = termesDeRecherche.flat();

    const fichesCorrespondantes = [];
    if (termesDeRecherche.flat().length === 0) {
      FonctionRecherche.actualiserAffichageResultats(ensembleFiches);
    } else {
      contenusRecettes.forEach(recettes => {
        const tableauContientMots = (tableau, mots) => mots.every(mot => tableau.includes(mot));
        const contenuParRecette = recettes.join(' ');
        // pour chaque fiche recette, vérifier qu'elle contient l'ensemble des termes de recherche
        if (tableauContientMots(contenuParRecette, mots)) {
          // récupère l'id de la fiche retenue et push dans tableau des fiches correspondant aux critères
          fichesCorrespondantes.push(recettes[0]);
        }
      });

      // crée un tableau avec les fiches en json récupérées via leur id stockée dans fichesCorrespondantes
      const fichesRetenues = FonctionRecherche.rechercheRecetteParId(fichesCorrespondantes);
      console.log(`termes de recherche : ${mots}`);
      console.log(`nombre de résultats : ${fichesRetenues.length}`);

      // affichage final : actualiser les résultats affichés et les listes de mots-clés (avec les fiches ayant passé le second critère de tri)
      FonctionRecherche.actualiserAffichageResultats(fichesRetenues);
    }
  }
};
FonctionRecherche.lancementRecherche(ensembleFiches);