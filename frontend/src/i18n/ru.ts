/**
 * Русский словарь — язык по умолчанию (source of truth для структуры ключей).
 * Типы en.ts/uz.ts выводятся из этого файла (`Translations = typeof ru`),
 * поэтому расхождение набора ключей — ошибка компиляции TypeScript,
 * а `scripts/check-i18n.ts` даёт человекочитаемый отчёт о том же.
 */
export const ru = {
  common: {
    langRu: 'RU',
    langUz: 'UZ',
    langEn: 'EN',
    ariaLangSwitch: 'Переключить язык',
    ariaMenuToggle: 'Открыть меню',
    ariaMenuClose: 'Закрыть меню',
    ariaTelegram: 'Написать в Telegram',
    ariaPrimaryNav: 'Основная навигация',
    ariaClose: 'Закрыть',
    ariaPrev: 'Предыдущий проект',
    ariaNext: 'Следующий проект',
    scrollHint: 'Прокрутите вниз',
    skipToContent: 'Перейти к содержимому',
  },
  nav: {
    about: 'Обо мне',
    work: 'Работы',
    process: 'Процесс',
    contact: 'Заказать',
  },
  hero: {
    badge: 'Открыт к новым проектам',
    roleLine: 'FULL-STACK РАЗРАБОТЧИК.',
    missionLine1: 'Я СОЗДАЮ',
    missionLine2: 'ЦИФРОВЫЕ',
    missionLine3: 'ПРОДУКТЫ.',
    description:
      'Разрабатываю сайты, веб-приложения и Telegram-автоматизацию для бизнеса — от интерфейса и backend до базы данных и деплоя на сервер. Работаю напрямую с заказчиком, без агентств и посредников.',
    ctaWork: 'Смотреть работы',
    ctaOrder: 'Обсудить проект',
    specLocation: 'Локация',
    specStack: 'Основной стек',
    specProjects: 'Проектов',
    specLanguages: 'Языки сайта',
  },
  about: {
    label: 'Обо мне',
    statementLine1: 'Я СОЗДАЮ ПРОДУКТ',
    statementLine2: 'ОТ ИНТЕРФЕЙСА',
    statementLine3: 'ДО СЕРВЕРА.',
    paragraph:
      'Я full-stack разработчик из Ташкента. Работаю с малым и средним бизнесом — учебными центрами, музыкальными школами, кафе, интернет-магазинами и локальными сообществами — и веду проект от идеи до продакшена самостоятельно, без агентства и субподрядчиков.',
    capabilitiesLabel: 'Что я закрываю в проекте',
    capabilityFrontend: 'Frontend',
    capabilityBackend: 'Backend',
    capabilityDatabase: 'База данных',
    capabilityAutomation: 'Автоматизация',
    capabilityDeployment: 'Деплой',
    cta: 'Написать в Telegram',
  },
  services: {
    label: 'Чем я занимаюсь',
    title: 'ЧТО Я СОЗДАЮ',
    websitesTitle: 'Бизнес-сайты',
    websitesDesc: 'Лендинги и сайты-визитки, которые продают и генерируют заявки.',
    webappsTitle: 'Веб-приложения',
    webappsDesc: 'Личные кабинеты, каталоги, внутренние системы для бизнес-процессов.',
    botsTitle: 'Telegram-боты',
    botsDesc: 'Автоматизация заявок, расписаний, заказов и рассылок в Telegram.',
    backendTitle: 'Backend и API',
    backendDesc: 'Серверная логика, интеграции и API на Django и FastAPI.',
    automationTitle: 'Автоматизация',
    automationDesc: 'Скрипты и интеграции, которые убирают рутину из ваших процессов.',
  },
  projects: {
    label: 'Портфолио',
    title: 'ВСЕ РАБОТЫ',
    intro:
      'Реальные проекты для бизнеса — от сайтов-визиток и лендингов до интернет-магазинов и Telegram-ботов. Откройте любой кейс: все экраны, стек и ссылка на рабочий сайт.',
    viewCase: 'Смотреть кейс',
    openSite: 'Открыть сайт',
    noLiveLink: 'Демо недоступно',
    mediaLabel: 'Материалы проекта',
    prevCase: 'Предыдущий',
    nextCase: 'Следующий',
    metaType: 'Тип',
    metaRole: 'Роль',
    metaStack: 'Стек',
    metaFeatures: 'Функции',
    metaStatus: 'Статус',
    roleSolo: 'Full-stack разработка в одиночку',
    categoryWebsite: 'Сайт',
    categoryWebapp: 'Веб-приложение',
    categoryBot: 'Telegram-бот',
    categoryOther: 'Проект',
    statusLive: 'Работает',
    statusCompleted: 'Завершён',
    statusPrototype: 'Прототип',

    cashflowTitle: 'Cashflow Tashkent',
    cashflowSubtitle: 'Комьюнити-платформа для развития бизнес-навыков',
    cashflowDescription:
      'Лендинг для делового сообщества в Ташкенте: полноценный дизайн и стилизация, автозаполнение контента через админ-панель и система парсинга мероприятий из Google Таблиц.',
    cashflowFeature1: 'Админ-панель с автозаполнением контента',
    cashflowFeature2: 'Парсинг мероприятий из Google Таблиц',
    cashflowFeature3: 'Полностью авторская стилизация',

    sonataSchoolTitle: 'Sonata School',
    sonataSchoolSubtitle: 'Многоязычный сайт музыкальной школы',
    sonataSchoolDescription:
      'Многоязычный сайт для музыкальной школы Sonata с видео преподавателей, продуманной SEO-структурой и полностью авторской стилизацией.',
    sonataSchoolFeature1: 'Видео преподавателей',
    sonataSchoolFeature2: 'Мультиязычность интерфейса',
    sonataSchoolFeature3: 'Продуманная SEO-структура',

    flexcampTitle: 'FlexCamp',
    flexcampSubtitle: 'Сайт-визитка летнего лагеря',
    flexcampDescription:
      'Сайт-визитка для летнего лагеря: авторская стилизация, удобная админ-панель и возможность оставлять комментарии — родители видят актуальную информацию и отзывы других участников.',
    flexcampFeature1: 'Админ-панель для контента',
    flexcampFeature2: 'Комментарии посетителей',
    flexcampFeature3: 'Полная адаптивность',

    aysdrumsTitle: 'AysDrums',
    aysdrumsSubtitle: 'Продающий сайт музыкальной студии',
    aysdrumsDescription:
      'Продающий сайт для музыкальной студии AysDrums: форма заявки, аккуратные анимации, SEO-оптимизация и адаптация под все устройства — от смартфона до широкого монитора.',
    aysdrumsFeature1: 'Форма заявки с валидацией',
    aysdrumsFeature2: 'Анимации интерфейса',
    aysdrumsFeature3: 'SEO-оптимизация',

    sonataBotTitle: 'Sonata Bot',
    sonataBotSubtitle: 'Расписание и автоматическая рассылка',
    sonataBotDescription:
      'Telegram-бот с расписанием занятий для преподавателей и учеников, автоматической рассылкой напоминаний, интеграцией с Google Таблицами и удобной админ-панелью.',
    sonataBotFeature1: 'Автоматическая рассылка напоминаний',
    sonataBotFeature2: 'Интеграция с Google Таблицами',
    sonataBotFeature3: 'Обновление расписания без программиста',

    learningCenterTitle: 'Learning Center',
    learningCenterSubtitle: 'Каталог курсов учебного центра',
    learningCenterDescription:
      'Многостраничный сайт для учебного центра с тестом на определение уровня, каталогом курсов и формой записи.',
    learningCenterFeature1: 'Тест на определение уровня',
    learningCenterFeature2: 'Каталог курсов',
    learningCenterFeature3: 'Форма записи на курс',

    techProjectTitle: 'Tech Project',
    techProjectSubtitle: 'Комплексный проект с базой данных',
    techProjectDescription:
      'Полноценный проект с базой данных, продуманным интерфейсом и деплоем на сервер — пример комплексной разработки под конкретную бизнес-задачу.',
    techProjectFeature1: 'Проектирование базы данных',
    techProjectFeature2: 'Серверная логика',
    techProjectFeature3: 'Деплой на сервер',

    onlineShopTitle: 'Online Shop',
    onlineShopSubtitle: 'Интернет-магазин с корзиной',
    onlineShopDescription:
      'Каталог товаров, корзина, регистрация пользователей и полноценная админ-панель — готовое решение для интернет-магазина, которое можно запустить и сразу принимать заказы.',
    onlineShopFeature1: 'Корзина и оформление заказа',
    onlineShopFeature2: 'Регистрация пользователей',
    onlineShopFeature3: 'Админ-панель товаров',

    fastfoodBotTitle: 'Fast-food Bot',
    fastfoodBotSubtitle: 'Бот для фаст-фуд кафе',
    fastfoodBotDescription:
      'Telegram-бот для фаст-фуд кафе: меню, корзина, оформление заказа с указанием локации и номера телефона — уведомления о новых заказах приходят сразу в рабочую группу.',
    fastfoodBotFeature1: 'Меню и корзина в боте',
    fastfoodBotFeature2: 'Геолокация в заказе',
    fastfoodBotFeature3: 'Уведомления в рабочую группу',

    messengerTitle: 'Messenger',
    messengerSubtitle: 'Чаты и обмен фото',
    messengerDescription:
      'Мессенджер с обменом сообщениями, поиском пользователей по никнейму, обменом фотографиями и возможностью удалять чаты и сообщения.',
    messengerFeature1: 'Поиск по никнейму',
    messengerFeature2: 'Обмен фотографиями',
    messengerFeature3: 'Удаление чатов и сообщений',

    newsPortalTitle: 'News Portal',
    newsPortalSubtitle: 'Новостной портал с модерацией',
    newsPortalDescription:
      'Новостной портал с каталогом по категориям, поиском публикаций, возможностью для пользователей добавлять свои материалы и удобной админ-панелью для модерации.',
    newsPortalFeature1: 'Поиск публикаций',
    newsPortalFeature2: 'Материалы от пользователей',
    newsPortalFeature3: 'Модерация через админ-панель',

    akkordTitle: 'Akkord',
    akkordSubtitle: 'Макет сайта музыкальной школы',
    akkordDescription:
      'Тестовый макет сайта для музыкальной школы: анимации, форма заявки и проработанный дизайн — пример того, как может выглядеть сайт для бизнеса ещё на этапе прототипа.',
    akkordFeature1: 'Анимации интерфейса',
    akkordFeature2: 'Форма заявки',
    akkordFeature3: 'Дизайн-прототип',
  },
  process: {
    label: 'Как я работаю',
    title: 'Как проходит разработка',
    intro:
      'От первого сообщения до готового сайта в интернете — весь процесс прозрачный, без скрытых доплат и сюрпризов.',
    step1Num: '01',
    step1Title: 'Бриф',
    step1Text:
      'Техническое задание предоставляете вы как заказчик. Если готового ТЗ нет — вы описываете пожелания к проекту, а на основе этого я составляю PRD, чтобы у нас было одинаковое понимание результата.',
    step2Num: '02',
    step2Title: 'План',
    step2Text:
      'Оцениваю объём работ, согласовываем сроки и стоимость, составляю план по этапам. Берётся предоплата — остаток оплачивается после сдачи готового проекта.',
    step3Num: '03',
    step3Title: 'Разработка',
    step3Text:
      'Разрабатываю frontend и backend: вёрстку, дизайн, серверную логику и базу данных — от первой страницы до полноценной рабочей версии.',
    step4Num: '04',
    step4Title: 'Тест',
    step4Text:
      'Проверяю работу сайта или бота на разных устройствах и сценариях, устраняю ошибки. Вношу правки, пока результат не будет полностью соответствовать ТЗ.',
    step5Num: '05',
    step5Title: 'Деплой',
    step5Text:
      'Выкладываю готовый проект на сервер, подключаю домен, показываю итоговый результат. После оплаты проект полностью переходит в вашу собственность.',
  },
  terms: {
    label: 'Условия',
    title: 'Что важно знать до старта',
    intro:
      'Четыре вопроса, которые обычно задают первыми. Отвечаю на них сразу, чтобы не выяснять в процессе.',
    paymentTitle: 'Оплата',
    paymentText: 'Предоплата в начале, остаток — после сдачи готового проекта.',
    ownershipTitle: 'Права на проект',
    ownershipText: 'После оплаты проект полностью переходит в вашу собственность.',
    hostingTitle: 'Домен и сервер',
    hostingText:
      'Покупает заказчик — это отдельные расходы. Для Telegram-бота достаточно сервера.',
    revisionsTitle: 'Правки',
    revisionsText: 'Изменения, озвученные после согласования ТЗ, оплачиваются отдельно.',
  },
  contact: {
    label: 'Контакт',
    titleLine1: 'ЕСТЬ ИДЕЯ',
    titleLine2: 'ПРОЕКТА?',
    subtitle: 'Расскажите, что хотите создать — помогу превратить идею в готовый продукт.',
    telegramTitle: 'Написать в Telegram',
    telegramHandle: '@akm0028 — отвечаю быстро',
    finalLine1: 'FROM IDEA',
    finalLine2: 'TO PRODUCTION.',
  },
  form: {
    title: 'Оставить заявку',
    nameLabel: 'Ваше имя',
    namePlaceholder: 'Например: Бехруз',
    phoneLabel: 'Номер телефона',
    phonePlaceholder: '+998 90 123 45 67',
    phoneError: 'Введите номер полностью: +998 и 9 цифр',
    submit: 'Отправить заявку',
    note: 'Отправляются только имя и номер телефона — ничего больше.',
    submitting: 'Отправляю…',
    successTitle: 'Заявка отправлена!',
    successText: 'Спасибо! Я свяжусь с вами в ближайшее время.',
    successClose: 'Хорошо',
    errorTitle: 'Что-то пошло не так',
    errorText: 'Не получилось отправить заявку. Попробуйте ещё раз или напишите в Telegram.',
    errorClose: 'Понятно',
  },
  footer: {
    tagline: 'Full-stack разработка сайтов и Telegram-ботов для бизнеса',
    toTop: 'Наверх',
    location: 'Ташкент, Узбекистан',
    telegram: 'Telegram',
  },
  metadata: {
    title: 'Создание сайтов и Telegram-ботов под ключ — Full-Stack разработчик Акмаль',
    description:
      'Создание сайта под ключ для бизнеса: от идеи до запуска. Сайты, веб-приложения и Telegram-боты. Прямая работа с клиентом, без посредников.',
    ogTitle: 'Создание сайтов и Telegram-ботов под ключ — akmal.dev',
    ogDescription:
      'Full-stack разработчик: сайты, веб-приложения, Telegram-боты и backend для бизнеса. Работа напрямую с клиентом.',
  },
};

export type Translations = {
  [Section in keyof typeof ru]: { [Key in keyof (typeof ru)[Section]]: string };
};
