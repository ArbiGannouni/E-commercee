/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product } from '../types';

export const CATEGORY_TRANSLATIONS: Record<string, { en: string; fr: string }> = {
  'Desk & Office': { en: 'Desk & Office', fr: 'Bureau & Espace de travail' },
  'Lighting': { en: 'Lighting', fr: 'Luminaire' },
  'Stationery': { en: 'Stationery', fr: 'Papeterie' },
  'Accessories': { en: 'Accessories', fr: 'Accessoires' },
  'Home Modern': { en: 'Home Modern', fr: 'Maison Moderne' },
  'Kitchenware': { en: 'Kitchenware', fr: 'Cuisine & Art de la table' },
  'Stationery Sets': { en: 'Stationery Sets', fr: 'Ensembles de Papeterie' },
  'All': { en: 'All', fr: 'Tout' }
};

export const TAG_TRANSLATIONS: Record<string, string> = {
  'wood': 'bois',
  'office': 'bureau',
  'ergonomics': 'ergonomie',
  'organizer': 'organisateur',
  'lighting': 'éclairage',
  'brass': 'laiton',
  'ambient': 'ambiance',
  'luxe': 'luxe',
  'leather': 'cuir',
  'stationery': 'papeterie',
  'craft': 'artisanat',
  'gift': 'cadeau',
  'edc': 'quotidien',
  'utility': 'utilitaire',
  'metal': 'métal',
  'compact': 'compact',
  'ceramic': 'céramique',
  'decor': 'décoration',
  'minimalist': 'minimaliste',
  'artisan': 'artisan',
  'insulated': 'isotherme',
  'kitchen': 'cuisine',
  'coffee': 'café',
  'wool': 'laine',
  'sleeve': 'housse',
  'laptop': 'ordinateur',
  'fashion': 'mode',
  'plant': 'plante',
  'home': 'maison',
  'structure': 'structure',
  'travel': 'voyage',
  'scrapbook': 'journal',
  'journal': 'journal',
  'purple': 'violet',
  'moon': 'lune',
  'stars': 'étoiles',
  'celestial': 'céleste',
  'pink': 'rose',
  'floral': 'floral',
  'garden': 'jardin',
  'cute': 'mignon',
  'green': 'vert',
  'botanical': 'botanique',
  'forest': 'forêt',
  'aesthetic': 'esthétique'
};

export const PRODUCT_TRANSLATIONS_FR: Record<string, Partial<Product>> = {
  'prod-1': {
    name: 'Rehausseur de Bureau en Noyer Aether',
    description: 'Fabriqué à la main à partir de bois de noyer noir d’Amérique du Nord séché au séchoir. Angle de vue ergonomique surélevé avec espace de rangement intégré pour ordinateurs portables et accessoires. Finition bois-cire satinée naturelle.',
    category: 'Bureau & Espace de travail',
    highlights: [
      'Véritable noyer américain séché au séchoir',
      'Élévation ergonomique au niveau des yeux de 4,5 pouces',
      'Finition satinée poncée à la main',
      'Structure de support solide en acier robuste'
    ]
  },
  'prod-2': {
    name: 'Lampe de Table en Laiton Boréal',
    description: 'Une lampe de table sculpturale en laiton massif repoussé avec une finition brossée tactile. Émet une lueur optique chaleureuse, diffuse et sans éblouissement. Dispose d’un variateur rotatif mécanique en laiton moleté.',
    category: 'Luminaire',
    highlights: [
      'Composants en laiton massif usiné',
      'Diffuseur sphérique en verre sablé personnalisé',
      'Variateur rotatif continu de 1% à 100%',
      'Cordon en tissu tressé de protection (2m)'
    ]
  },
  'prod-3': {
    name: 'Journal Rechargeable en Cuir Scribe',
    description: 'Fabriqué à partir de cuir italien tanné au végétal huileux. Contient 160 pages de papier crème exceptionnellement lourd de 120 g/m², idéal pour les croquis, les stylos standards ou les encres de stylo plume. Comprend une goupille de fermeture en laiton.',
    category: 'Papeterie',
    highlights: [
      'Couverture en cuir italien pleine fleur tannage végétal',
      'Pages d’écriture compatibles stylos-plumes de 120 g/m²',
      'Vis de reliure rechargeables en laiton',
      'Développe une patine antique personnelle et riche au fil du temps'
    ]
  },
  'prod-4': {
    name: 'Étui Organisateur de Clés Apex',
    description: 'Rangement de poche profilé avec charnières à friction à verrouillage silencieux. Réduit l’encombrement, empêche les rayures dans les poches et dissimule jusqu’à 8 clés de maison ou de bureau dans une belle finition mate sablée.',
    category: 'Accessoires',
    highlights: [
      'Corps en alliage de zinc/aluminium de qualité aérospatiale',
      'Toucher mat sablé résistant aux rayures',
      'Rondelles de verrouillage à friction pour éliminer tout cliquetis',
      'Boucle robuste intégrée pour clés de voiture'
    ]
  },
  'prod-5': {
    name: 'Ensemble de Vases en Céramique Terrace',
    description: 'Vase en grès cylindrique organique présentant une texture volcanique cuite à haute température. Double trempage à l’intérieur pour contenir l’eau des plantes fraîches, laissant l’extérieur brut magnifiquement mat.',
    category: 'Maison Moderne',
    highlights: [
      'Grès cuit à haute température modelé individuellement',
      'Extérieur brut en basalte texturé riche en minéraux',
      'Doublure interne en verre noir satiné',
      'Comprend des patins de protection sous le dessous'
    ]
  },
  'prod-6': {
    name: 'Carafe d’Infusion sous Vide Vessel',
    description: 'L’isolation en acier inoxydable double paroi doublée de cuivre maintient la température idéale de vos boissons jusqu’à 18 heures. Conçu avec une poignée en noyer naturel tourné à la main, un mécanisme de couvercle à bouton-poussoir et un large bec anti-goutte.',
    category: 'Cuisine & Art de la table',
    highlights: [
      'Garde le café chaud pendant 12h, froid pendant 24h',
      'Intérieur en acier inoxydable 18/8 de qualité médicale',
      'Poignée ergonomique en noyer d’Amérique massif',
      'Couvercle à valve d’étanchéité étanche'
    ]
  },
  'prod-7': {
    name: 'Housse pour Ordinateur en Feutre de Mérinos',
    description: 'La construction en feutre de laine mérinos bavaroise 100% naturelle de forte densité offre une résistance à l’eau structurelle et une absorption naturelle des chocs. Comprend une poche frontale en cuir pleine fleur et un fermoir magnétique simple.',
    category: 'Accessoires',
    highlights: [
      'Feutre de laine de qualité supérieure 100% biodégradable (4mm)',
      'Pochette porte-cartes en cuir à tannage végétal robuste',
      'Boutons pressions magnétiques dissimulés et sécurisés',
      'Convient aux ordinateurs et tablettes jusqu’à 14,1 inches'
    ]
  },
  'prod-8': {
    name: 'Jardinière en Métal Repoussé Aura',
    description: 'Une jardinière en aluminium massif repoussé et thermolaqué, équilibrée sur un élégant support métallique minimaliste. Finition satinée élégante avec trou de drainage et bouchon en silicone pour un arrosage facile.',
    category: 'Maison Moderne',
    highlights: [
      'Bassin amovible en aluminium repoussé sans couture',
      'Support métallique robuste thermolaqué mat',
      'Équipé d’un bouchon de drainage en caoutchouc',
      'Léger et entièrement résistant à la rouille'
    ]
  },
  'prod-9': {
    name: 'GLOBAL TRAVEL',
    description: 'Un carnet de voyage et de scrapbooking immersif contenant des cartes du monde vintage, de vieux timbres postaux, des étiquettes rétro et des cartes de voyage rustiques. Parfait pour consigner vos souvenirs avec de magnifiques détails chaleureux.',
    category: 'Ensembles de Papeterie',
    highlights: [
      'Coffret cadeau esthétique en papier kraft complet',
      'Journal de voyage de luxe de 180 pages coordonnées',
      'Plus de 120 timbres et autocollants vintage inclus',
      'Choix de cadeau idéal de qualité supérieure pour amateurs d’écriture'
    ]
  },
  'prod-10': {
    name: 'PURPLE MOON IN GLASS',
    description: 'Un ensemble de papeterie céleste et onirique aux tons violet riche, indigo étoilé et améthyste profonde. Construit avec des calendriers astronomiques, des modèles de phases lunaires, des papiers de cristal étoilé et des cartes attrape-rêves romantiques.',
    category: 'Ensembles de Papeterie',
    highlights: [
      'Fermeture de boîte magnétique avec ruban de velours',
      'Registres étoilés cosmiques de haute fidélité 120 g/m²',
      'Cartes accentuées de dorure à l’or et packs d’autocollants lunaires',
      'Comprend un kit de sceau de cire en verre et de l’encre violette assortie'
    ]
  },
  'prod-11': {
    name: 'PINK ANNE IN THE FLOWERS',
    description: 'Une suite de papeterie romantique et élégante rose pastel inspirée des jardins fleuris classiques et d’illustrations de livres d’images fantaisistes. Parfait pour de magnifiques mémoires manuscrites et la création de lettres élégantes.',
    category: 'Ensembles de Papeterie',
    highlights: [
      'Boîtier de rangement couleur rose poudré délicat',
      'Papiers décoratifs de fleurs pressées (80 feuilles)',
      'Autocollants et rubans adhésifs washi lapin et fleurs inclus',
      'Stylo gel mécanique rose poudré de qualité supérieure'
    ]
  },
  'prod-12': {
    name: 'PETER’S FOREST',
    description: 'Un coffre aux trésors de journal de bord woodland sur le thème de la botanique, contenant un cahier lourd à boucle magnétique, des guides secrets de la forêt, des rubans washi de plantes de forêt et des marque-pages de plantes vertes.',
    category: 'Ensembles de Papeterie',
    highlights: [
      'Couverture magnétique en cuir PU vert sauge de qualité supérieure',
      'Papier quadrillé sans bois haute densité idéal pour les mises en page',
      'Décalcomanies de flore et faune exotiques pressées',
      'Comprend une règle structurelle et un clip en acier polyvalent'
    ]
  }
};

/**
 * Returns a translated product based on the current language setting.
 */
export function getLocalizedProduct(product: Product, lang: 'en' | 'fr' | undefined): Product {
  if (!product) return product;
  const isFr = lang === 'fr';
  if (!isFr) {
    // English is default/fallback, but make sure categories match standard too
    return {
      ...product,
      category: getLocalizedCategory(product.category, 'en')
    };
  }

  // Look for static translations
  const trans = PRODUCT_TRANSLATIONS_FR[product.id];
  if (trans) {
    return {
      ...product,
      name: trans.name ?? product.name,
      description: trans.description ?? product.description,
      category: trans.category ?? getLocalizedCategory(product.category, 'fr'),
      highlights: trans.highlights ?? product.highlights,
      tags: product.tags?.map(t => TAG_TRANSLATIONS[t.toLowerCase()] ?? t) ?? []
    };
  }

  // Dynamic translated category & tags even for custom products
  return {
    ...product,
    category: getLocalizedCategory(product.category, 'fr'),
    tags: product.tags?.map(t => TAG_TRANSLATIONS[t.toLowerCase()] ?? t) ?? []
  };
}

/**
 * Normalizes a category translation
 */
export function getLocalizedCategory(category: string, lang: 'en' | 'fr' | undefined): string {
  if (!category) return category;
  const isFr = lang === 'fr';

  // Support direct lookup
  for (const key of Object.keys(CATEGORY_TRANSLATIONS)) {
    if (key.toLowerCase() === category.toLowerCase()) {
      return isFr ? CATEGORY_TRANSLATIONS[key].fr : CATEGORY_TRANSLATIONS[key].en;
    }
    // Also support reverse matching if category was saved in French
    if (CATEGORY_TRANSLATIONS[key].fr.toLowerCase() === category.toLowerCase()) {
      return isFr ? CATEGORY_TRANSLATIONS[key].fr : CATEGORY_TRANSLATIONS[key].en;
    }
  }

  return category;
}
