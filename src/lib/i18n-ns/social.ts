import type { Dictionary, LanguageCode } from "@/lib/i18n";

/** Fan Hubs + Community UI translations. Merged into the main dictionary. */
export const socialDict: Record<LanguageCode, Dictionary> = {
  en: {
    // Fan Festivals list page
    "social.fanHubs.eyebrow": "Official fan zones",
    "social.fanHubs.title": "Every official Fan Festival.",
    "social.fanHubs.description":
      "The official FIFA Fan Festivals and host-city fan zones for all 16 host cities — venues, dates, and a link to each city's official source.",
    "social.fanHubs.in": "{city}",
    "social.fanHubs.dates": "{schedule}",

    // Fan Festival detail page
    "social.fanHub.notFound": "Fan festival not found",
    "social.fanHub.backToAll": "← All fan festivals",
    "social.fanHub.cityGuide": "{city} city guide",
    "social.fanHub.location": "Location",
    "social.fanHub.venue": "Venue",
    "social.fanHub.area": "Area",
    "social.fanHub.dates": "Dates",
    "social.fanHub.officialSite": "Official site",
    "social.fanHub.officialBlurb":
      "Details are sourced from the official host-city site. Check it for the latest hours, programming, and any ticketing.",
    "social.fanHub.recommendedSpots": "Food & drink near {city}",

    // Community page
    "social.community.eyebrow": "By fans, for fans",
    "social.community.title": "Real tips from real fans.",
    "social.community.description":
      "Share recommendations, report issues, and learn from supporters on the ground. Every post is moderated before it goes public.",

    // Community feed / composer
    "social.community.shareWithFans": "Share with fans",
    "social.community.composerBlurb":
      "Post a tip, recommendation, or warning. All posts are moderated before going public.",
    "social.community.titlePlaceholder": "Title",
    "social.community.detailsPlaceholder": "Share the details…",
    "social.community.post": "Post",
    "social.community.moderated": "Moderated for safety & accuracy",
    "social.community.pendingReview": "Pending review",
    "social.community.filterAll": "All",

    // Post types
    "social.type.Tip": "Tip",
    "social.type.Recommendation": "Recommendation",
    "social.type.Warning": "Warning",
    "social.type.Question": "Question",
  },
  ar: {
    "social.fanHubs.eyebrow": "مناطق المشجعين الرسمية",
    "social.fanHubs.title": "كل مهرجان مشجعين رسمي.",
    "social.fanHubs.description":
      "مهرجانات FIFA الرسمية للمشجعين ومناطق المشجعين في جميع المدن المضيفة الست عشرة — المواقع والتواريخ ورابط للمصدر الرسمي لكل مدينة.",
    "social.fanHubs.in": "{city}",
    "social.fanHubs.dates": "{schedule}",

    "social.fanHub.notFound": "لم يتم العثور على مهرجان المشجعين",
    "social.fanHub.backToAll": "← كل مهرجانات المشجعين",
    "social.fanHub.cityGuide": "دليل مدينة {city}",
    "social.fanHub.location": "الموقع",
    "social.fanHub.venue": "المكان",
    "social.fanHub.area": "المنطقة",
    "social.fanHub.dates": "التواريخ",
    "social.fanHub.officialSite": "الموقع الرسمي",
    "social.fanHub.officialBlurb":
      "التفاصيل مأخوذة من الموقع الرسمي للمدينة المضيفة. راجعه لمعرفة أحدث المواعيد والبرامج وأي تذاكر.",
    "social.fanHub.recommendedSpots": "مطاعم ومشارب قرب {city}",

    "social.community.eyebrow": "من المشجعين، للمشجعين",
    "social.community.title": "نصائح حقيقية من مشجعين حقيقيين.",
    "social.community.description":
      "شارك التوصيات، وأبلغ عن المشكلات، وتعلّم من المشجعين على أرض الواقع. تتم مراجعة كل منشور قبل نشره علنًا.",

    "social.community.shareWithFans": "شارك مع المشجعين",
    "social.community.composerBlurb":
      "انشر نصيحة أو توصية أو تحذيرًا. تتم مراجعة جميع المنشورات قبل نشرها علنًا.",
    "social.community.titlePlaceholder": "العنوان",
    "social.community.detailsPlaceholder": "شارك التفاصيل…",
    "social.community.post": "نشر",
    "social.community.moderated": "خاضع للمراجعة لضمان الأمان والدقة",
    "social.community.pendingReview": "قيد المراجعة",
    "social.community.filterAll": "الكل",

    "social.type.Tip": "نصيحة",
    "social.type.Recommendation": "توصية",
    "social.type.Warning": "تحذير",
    "social.type.Question": "سؤال",
  },
  fr: {
    "social.fanHubs.eyebrow": "Zones de supporters officielles",
    "social.fanHubs.title": "Toutes les Fan Festivals officielles.",
    "social.fanHubs.description":
      "Les FIFA Fan Festivals officielles et les zones de supporters des 16 villes hôtes — lieux, dates et un lien vers la source officielle de chaque ville.",
    "social.fanHubs.in": "{city}",
    "social.fanHubs.dates": "{schedule}",

    "social.fanHub.notFound": "Fan Festival introuvable",
    "social.fanHub.backToAll": "← Toutes les Fan Festivals",
    "social.fanHub.cityGuide": "Guide de la ville de {city}",
    "social.fanHub.location": "Lieu",
    "social.fanHub.venue": "Site",
    "social.fanHub.area": "Quartier",
    "social.fanHub.dates": "Dates",
    "social.fanHub.officialSite": "Site officiel",
    "social.fanHub.officialBlurb":
      "Les informations proviennent du site officiel de la ville hôte. Consultez-le pour les horaires, la programmation et la billetterie les plus récents.",
    "social.fanHub.recommendedSpots": "Restaurants et bars près de {city}",

    "social.community.eyebrow": "Par les fans, pour les fans",
    "social.community.title": "De vrais conseils de vrais fans.",
    "social.community.description":
      "Partagez des recommandations, signalez des problèmes et apprenez des supporters sur le terrain. Chaque publication est modérée avant d'être rendue publique.",

    "social.community.shareWithFans": "Partager avec les fans",
    "social.community.composerBlurb":
      "Publiez un conseil, une recommandation ou un avertissement. Toutes les publications sont modérées avant d'être rendues publiques.",
    "social.community.titlePlaceholder": "Titre",
    "social.community.detailsPlaceholder": "Partagez les détails…",
    "social.community.post": "Publier",
    "social.community.moderated": "Modéré pour la sécurité et l'exactitude",
    "social.community.pendingReview": "En attente de validation",
    "social.community.filterAll": "Tous",

    "social.type.Tip": "Astuce",
    "social.type.Recommendation": "Recommandation",
    "social.type.Warning": "Avertissement",
    "social.type.Question": "Question",
  },
  es: {
    "social.fanHubs.eyebrow": "Zonas de aficionados oficiales",
    "social.fanHubs.title": "Cada Fan Festival oficial.",
    "social.fanHubs.description":
      "Los FIFA Fan Festivals oficiales y las zonas de aficionados de las 16 ciudades anfitrionas: sedes, fechas y un enlace a la fuente oficial de cada ciudad.",
    "social.fanHubs.in": "{city}",
    "social.fanHubs.dates": "{schedule}",

    "social.fanHub.notFound": "Fan Festival no encontrado",
    "social.fanHub.backToAll": "← Todos los Fan Festivals",
    "social.fanHub.cityGuide": "Guía de la ciudad de {city}",
    "social.fanHub.location": "Ubicación",
    "social.fanHub.venue": "Sede",
    "social.fanHub.area": "Zona",
    "social.fanHub.dates": "Fechas",
    "social.fanHub.officialSite": "Sitio oficial",
    "social.fanHub.officialBlurb":
      "La información procede del sitio oficial de la ciudad anfitriona. Consúltalo para conocer los horarios, la programación y las entradas más recientes.",
    "social.fanHub.recommendedSpots": "Comida y bebida cerca de {city}",

    "social.community.eyebrow": "De los aficionados, para los aficionados",
    "social.community.title": "Consejos reales de aficionados reales.",
    "social.community.description":
      "Comparte recomendaciones, informa de problemas y aprende de los aficionados sobre el terreno. Cada publicación se modera antes de hacerse pública.",

    "social.community.shareWithFans": "Comparte con los aficionados",
    "social.community.composerBlurb":
      "Publica un consejo, una recomendación o una advertencia. Todas las publicaciones se moderan antes de hacerse públicas.",
    "social.community.titlePlaceholder": "Título",
    "social.community.detailsPlaceholder": "Comparte los detalles…",
    "social.community.post": "Publicar",
    "social.community.moderated": "Moderado por seguridad y precisión",
    "social.community.pendingReview": "Pendiente de revisión",
    "social.community.filterAll": "Todos",

    "social.type.Tip": "Consejo",
    "social.type.Recommendation": "Recomendación",
    "social.type.Warning": "Advertencia",
    "social.type.Question": "Pregunta",
  },
  de: {
    "social.fanHubs.eyebrow": "Offizielle Fanzonen",
    "social.fanHubs.title": "Jedes offizielle Fan Festival.",
    "social.fanHubs.description":
      "Die offiziellen FIFA Fan Festivals und Fanzonen aller 16 Gastgeberstädte — Veranstaltungsorte, Termine und ein Link zur offiziellen Quelle jeder Stadt.",
    "social.fanHubs.in": "{city}",
    "social.fanHubs.dates": "{schedule}",

    "social.fanHub.notFound": "Fan Festival nicht gefunden",
    "social.fanHub.backToAll": "← Alle Fan Festivals",
    "social.fanHub.cityGuide": "Stadtführer für {city}",
    "social.fanHub.location": "Ort",
    "social.fanHub.venue": "Veranstaltungsort",
    "social.fanHub.area": "Gegend",
    "social.fanHub.dates": "Termine",
    "social.fanHub.officialSite": "Offizielle Website",
    "social.fanHub.officialBlurb":
      "Die Angaben stammen von der offiziellen Website der Gastgeberstadt. Dort findest du die aktuellen Öffnungszeiten, das Programm und etwaige Tickets.",
    "social.fanHub.recommendedSpots": "Essen & Trinken in der Nähe von {city}",

    "social.community.eyebrow": "Von Fans, für Fans",
    "social.community.title": "Echte Tipps von echten Fans.",
    "social.community.description":
      "Teile Empfehlungen, melde Probleme und lerne von Fans vor Ort. Jeder Beitrag wird vor der Veröffentlichung moderiert.",

    "social.community.shareWithFans": "Mit Fans teilen",
    "social.community.composerBlurb":
      "Poste einen Tipp, eine Empfehlung oder eine Warnung. Alle Beiträge werden vor der Veröffentlichung moderiert.",
    "social.community.titlePlaceholder": "Titel",
    "social.community.detailsPlaceholder": "Teile die Details…",
    "social.community.post": "Posten",
    "social.community.moderated": "Moderiert für Sicherheit und Genauigkeit",
    "social.community.pendingReview": "Wird geprüft",
    "social.community.filterAll": "Alle",

    "social.type.Tip": "Tipp",
    "social.type.Recommendation": "Empfehlung",
    "social.type.Warning": "Warnung",
    "social.type.Question": "Frage",
  },
};
