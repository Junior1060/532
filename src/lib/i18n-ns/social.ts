import type { Dictionary, LanguageCode } from "@/lib/i18n";

/** Fan Hubs + Community UI translations. Merged into the main dictionary. */
export const socialDict: Record<LanguageCode, Dictionary> = {
  en: {
    // Fan Hubs list page
    "social.fanHubs.eyebrow": "Community",
    "social.fanHubs.title": "Find your people.",
    "social.fanHubs.description":
      "Country-based fan communities in every host city. Join watch parties, meet fellow supporters, and get tips from people who fly your flag.",
    "social.fanHubs.fansIn": "{country} fans in {city}",
    "social.fanHubs.next": "Next: {venue}",

    // Fan Hub detail page
    "social.fanHub.notFound": "Fan hub not found",
    "social.fanHub.backToAll": "← All fan hubs",
    "social.fanHub.members": "{count} members",
    "social.fanHub.joinHub": "Join the hub",
    "social.fanHub.cityGuide": "{city} city guide",
    "social.fanHub.nextWatchParty": "Next watch party",
    "social.fanHub.meetupSpot": "Meetup spot",
    "social.fanHub.groupChat": "Group chat",
    "social.fanHub.localTips": "Local tips",
    "social.fanHub.joinCountryFans": "Join {country} fans",
    "social.fanHub.joinBlurb":
      "Get watch-party alerts, meetup spots, and tips from fellow supporters in {city}.",
    "social.fanHub.yourName": "Your name",
    "social.fanHub.email": "Email",
    "social.fanHub.joinButton": "Join hub",
    "social.fanHub.recommendedSpots": "Recommended spots in {city}",

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
    "social.fanHubs.eyebrow": "المجتمع",
    "social.fanHubs.title": "اعثر على رفاقك.",
    "social.fanHubs.description":
      "مجتمعات مشجعين حسب الدولة في كل مدينة مضيفة. انضم إلى حفلات المشاهدة، وقابل المشجعين الآخرين، واحصل على نصائح ممن يرفعون علمك.",
    "social.fanHubs.fansIn": "مشجعو {country} في {city}",
    "social.fanHubs.next": "التالي: {venue}",

    "social.fanHub.notFound": "لم يتم العثور على مركز المشجعين",
    "social.fanHub.backToAll": "← كل مراكز المشجعين",
    "social.fanHub.members": "{count} عضو",
    "social.fanHub.joinHub": "انضم إلى المركز",
    "social.fanHub.cityGuide": "دليل مدينة {city}",
    "social.fanHub.nextWatchParty": "حفلة المشاهدة القادمة",
    "social.fanHub.meetupSpot": "مكان اللقاء",
    "social.fanHub.groupChat": "محادثة جماعية",
    "social.fanHub.localTips": "نصائح محلية",
    "social.fanHub.joinCountryFans": "انضم إلى مشجعي {country}",
    "social.fanHub.joinBlurb":
      "احصل على تنبيهات حفلات المشاهدة وأماكن اللقاء ونصائح من المشجعين الآخرين في {city}.",
    "social.fanHub.yourName": "اسمك",
    "social.fanHub.email": "البريد الإلكتروني",
    "social.fanHub.joinButton": "انضم إلى المركز",
    "social.fanHub.recommendedSpots": "أماكن موصى بها في {city}",

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
    "social.fanHubs.eyebrow": "Communauté",
    "social.fanHubs.title": "Trouvez vos semblables.",
    "social.fanHubs.description":
      "Des communautés de supporters par pays dans chaque ville hôte. Participez aux soirées de visionnage, rencontrez d'autres supporters et obtenez des conseils de ceux qui arborent votre drapeau.",
    "social.fanHubs.fansIn": "Supporters {country} à {city}",
    "social.fanHubs.next": "Prochain : {venue}",

    "social.fanHub.notFound": "Club de supporters introuvable",
    "social.fanHub.backToAll": "← Tous les clubs de supporters",
    "social.fanHub.members": "{count} membres",
    "social.fanHub.joinHub": "Rejoindre le club",
    "social.fanHub.cityGuide": "Guide de la ville de {city}",
    "social.fanHub.nextWatchParty": "Prochaine soirée de visionnage",
    "social.fanHub.meetupSpot": "Point de rencontre",
    "social.fanHub.groupChat": "Discussion de groupe",
    "social.fanHub.localTips": "Conseils locaux",
    "social.fanHub.joinCountryFans": "Rejoindre les supporters {country}",
    "social.fanHub.joinBlurb":
      "Recevez des alertes de soirées de visionnage, des points de rencontre et des conseils d'autres supporters à {city}.",
    "social.fanHub.yourName": "Votre nom",
    "social.fanHub.email": "E-mail",
    "social.fanHub.joinButton": "Rejoindre le club",
    "social.fanHub.recommendedSpots": "Lieux recommandés à {city}",

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
    "social.fanHubs.eyebrow": "Comunidad",
    "social.fanHubs.title": "Encuentra a los tuyos.",
    "social.fanHubs.description":
      "Comunidades de aficionados por país en cada ciudad anfitriona. Únete a las fiestas de visionado, conoce a otros aficionados y recibe consejos de quienes ondean tu bandera.",
    "social.fanHubs.fansIn": "Aficionados de {country} en {city}",
    "social.fanHubs.next": "Próximo: {venue}",

    "social.fanHub.notFound": "Club de aficionados no encontrado",
    "social.fanHub.backToAll": "← Todos los clubes de aficionados",
    "social.fanHub.members": "{count} miembros",
    "social.fanHub.joinHub": "Unirse al club",
    "social.fanHub.cityGuide": "Guía de la ciudad de {city}",
    "social.fanHub.nextWatchParty": "Próxima fiesta de visionado",
    "social.fanHub.meetupSpot": "Punto de encuentro",
    "social.fanHub.groupChat": "Chat grupal",
    "social.fanHub.localTips": "Consejos locales",
    "social.fanHub.joinCountryFans": "Únete a los aficionados de {country}",
    "social.fanHub.joinBlurb":
      "Recibe avisos de fiestas de visionado, puntos de encuentro y consejos de otros aficionados en {city}.",
    "social.fanHub.yourName": "Tu nombre",
    "social.fanHub.email": "Correo electrónico",
    "social.fanHub.joinButton": "Unirse al club",
    "social.fanHub.recommendedSpots": "Lugares recomendados en {city}",

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
    "social.fanHubs.eyebrow": "Community",
    "social.fanHubs.title": "Finde deine Leute.",
    "social.fanHubs.description":
      "Länderbasierte Fan-Communitys in jeder Gastgeberstadt. Nimm an Public Viewings teil, triff andere Fans und erhalte Tipps von Menschen, die deine Flagge tragen.",
    "social.fanHubs.fansIn": "{country}-Fans in {city}",
    "social.fanHubs.next": "Als Nächstes: {venue}",

    "social.fanHub.notFound": "Fan-Hub nicht gefunden",
    "social.fanHub.backToAll": "← Alle Fan-Hubs",
    "social.fanHub.members": "{count} Mitglieder",
    "social.fanHub.joinHub": "Dem Hub beitreten",
    "social.fanHub.cityGuide": "Stadtführer für {city}",
    "social.fanHub.nextWatchParty": "Nächstes Public Viewing",
    "social.fanHub.meetupSpot": "Treffpunkt",
    "social.fanHub.groupChat": "Gruppenchat",
    "social.fanHub.localTips": "Lokale Tipps",
    "social.fanHub.joinCountryFans": "Tritt den {country}-Fans bei",
    "social.fanHub.joinBlurb":
      "Erhalte Hinweise zu Public Viewings, Treffpunkte und Tipps von anderen Fans in {city}.",
    "social.fanHub.yourName": "Dein Name",
    "social.fanHub.email": "E-Mail",
    "social.fanHub.joinButton": "Dem Hub beitreten",
    "social.fanHub.recommendedSpots": "Empfohlene Orte in {city}",

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
