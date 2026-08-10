"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useState } from "react";

type Locale = "pt-BR" | "en" | "es";

type YouTubeVideo = {
  id: string;
  title: string;
  description?: string;
  publishedAt?: string;
  durationSeconds?: number;
  thumbnail: string;
  url: string;
  embedUrl: string;
};

type CoverageMetric = {
  key: string;
  title: string;
  kind: "playlist" | "video";
  viewCount: number;
  videoCount: number;
};

type FeaturedGame = {
  key: string;
  title: string;
  image: string;
  href: string;
  youtubeId: string;
  kind: "playlist" | "video";
  recent?: boolean;
};

const fallbackYouTubeVideos: YouTubeVideo[] = [
  {
    id: "UU0twAwhWIU",
    title: "BEAST OF REINCARNATION | O IMPRESSIONANTE INÍCIO DA CAMPANHA",
    thumbnail: "https://i.ytimg.com/vi/UU0twAwhWIU/maxresdefault.jpg",
    url: "https://www.youtube.com/watch?v=UU0twAwhWIU",
    embedUrl: "https://www.youtube.com/embed/UU0twAwhWIU",
  },
  {
    id: "7DanlzAM1us",
    title: "HALO CAMPAIGN EVOLVED",
    thumbnail: "https://i.ytimg.com/vi/7DanlzAM1us/maxresdefault.jpg",
    url: "https://www.youtube.com/watch?v=7DanlzAM1us",
    embedUrl: "https://www.youtube.com/embed/7DanlzAM1us",
  },
  {
    id: "WR0bwWchhkc",
    title: "007 FIRST LIGHT",
    thumbnail: "https://i.ytimg.com/vi/WR0bwWchhkc/maxresdefault.jpg",
    url: "https://www.youtube.com/watch?v=WR0bwWchhkc",
    embedUrl: "https://www.youtube.com/embed/WR0bwWchhkc",
  },
  {
    id: "uh5-512YjsA",
    title: "LEGO BATMAN: O LEGADO DO CAVALEIRO DAS TREVAS",
    thumbnail: "https://i.ytimg.com/vi/uh5-512YjsA/maxresdefault.jpg",
    url: "https://www.youtube.com/watch?v=uh5-512YjsA",
    embedUrl: "https://www.youtube.com/embed/uh5-512YjsA",
  },
];

const featuredGames: FeaturedGame[] = [
  {
    key: "indiana-jones-and-the-great-circle",
    title: "Indiana Jones and the Great Circle",
    image:
      "/images/games/highlights/indiana-jones-and-the-great-circle.jpg",
    href: "https://www.youtube.com/playlist?list=PL6ew14P2i0abELxD7MCTd9X81iZ-4-qu2",
    youtubeId: "PL6ew14P2i0abELxD7MCTd9X81iZ-4-qu2",
    kind: "playlist",
  },
  {
    key: "stray",
    title: "Stray",
    image: "/images/games/highlights/stray.jpg",
    href: "https://www.youtube.com/playlist?list=PL6ew14P2i0aaUAXyCLtVYuu4OdDGHrhAN",
    youtubeId: "PL6ew14P2i0aaUAXyCLtVYuu4OdDGHrhAN",
    kind: "playlist",
  },
  {
    key: "star-wars-jedi-survivor",
    title: "Star Wars Jedi: Survivor",
    image: "/images/games/highlights/star-wars-jedi-survivor.jpg",
    href: "https://www.youtube.com/playlist?list=PL6ew14P2i0aYw3nRjhwihzgad7VYgu3GA",
    youtubeId: "PL6ew14P2i0aYw3nRjhwihzgad7VYgu3GA",
    kind: "playlist",
  },
  {
    key: "prince-of-persia-the-lost-crown",
    title: "Prince of Persia: The Lost Crown",
    image: "/images/games/highlights/prince-of-persia-the-lost-crown.jpg",
    href: "https://www.youtube.com/playlist?list=PL6ew14P2i0aYdqOxJRDTWrOeeVyjOOYFk",
    youtubeId: "PL6ew14P2i0aYdqOxJRDTWrOeeVyjOOYFk",
    kind: "playlist",
  },
  {
    key: "lego-batman-legacy-of-the-dark-knight",
    title: "LEGO Batman: Legacy of the Dark Knight",
    image:
      "/images/games/highlights/lego-batman-legacy-of-the-dark-knight.jpg",
    href: "https://www.youtube.com/playlist?list=PL6ew14P2i0aYFuLW0GWrc1aFFm941KjrN",
    youtubeId: "PL6ew14P2i0aYFuLW0GWrc1aFFm941KjrN",
    kind: "playlist",
  },
  {
    key: "pragmata",
    title: "PRAGMATA",
    image: "/images/games/highlights/pragmata.jpg",
    href: "https://www.youtube.com/playlist?list=PL6ew14P2i0aZ9vyFdTGk1Xp0ZmPi8ctvi",
    youtubeId: "PL6ew14P2i0aZ9vyFdTGk1Xp0ZmPi8ctvi",
    kind: "playlist",
  },
  {
    key: "atomic-heart",
    title: "Atomic Heart",
    image: "/images/games/highlights/atomic-heart.jpg",
    href: "https://www.youtube.com/playlist?list=PL6ew14P2i0aZp_9g2XAGQq5sDm3sPW-iJ",
    youtubeId: "PL6ew14P2i0aZp_9g2XAGQq5sDm3sPW-iJ",
    kind: "playlist",
  },
  {
    key: "assassins-creed-shadows",
    title: "Assassin’s Creed Shadows",
    image: "/images/games/highlights/assassins-creed-shadows.jpg",
    href: "https://www.youtube.com/playlist?list=PL6ew14P2i0abj4ZofMBi7JEpJ5Kry6Pqd",
    youtubeId: "PL6ew14P2i0abj4ZofMBi7JEpJ5Kry6Pqd",
    kind: "playlist",
  },
  {
    key: "silent-hill-f",
    title: "Silent Hill f",
    image: "/images/games/highlights/silent-hill-f.jpg",
    href: "https://www.youtube.com/playlist?list=PL6ew14P2i0abhTdbJskPMZb2ARv8PhFJ4",
    youtubeId: "PL6ew14P2i0abhTdbJskPMZb2ARv8PhFJ4",
    kind: "playlist",
  },
  {
    key: "beast-of-reincarnation",
    title: "Beast of Reincarnation",
    image: "/images/games/highlights/beast-of-reincarnation.jpg",
    href: "https://www.youtube.com/playlist?list=PLYNOEBEkrN8I",
    youtubeId: "PLYNOEBEkrN8I",
    kind: "playlist",
    recent: true,
  },
];

const upcomingGames = [
  {
    title: "The Blood of Dawnwalker",
    image: "/images/games/upcoming/the-blood-of-dawnwalker.jpg",
  },
  {
    title: "Resonance: A Plague Tale Legacy",
    image: "/images/games/upcoming/resonance-a-plague-tale-legacy.jpg",
  },
  {
    title: "Grand Theft Auto VI",
    image: "/images/games/upcoming/grand-theft-auto-vi.jpg",
  },
  {
    title: "Gears of War: E-Day",
    image: "/images/games/upcoming/gears-of-war-e-day.jpg",
  },
  {
    title: "Halloween",
    image: "/images/games/upcoming/halloween.jpg",
  },
  {
    title: "Marvel’s Wolverine",
    image: "/images/games/upcoming/marvels-wolverine.jpg",
  },
];

const translations = {
  "pt-BR": {
    seo: {
      title: "KILL LIPE | Canal de Games",
      description:
        "Site oficial do KILL LIPE. Gameplays, guias e cobertura de lançamentos em português.",
    },
    nav: {
      home: "Início",
      about: "Sobre",
      content: "Conteúdo",
      games: "Jogos",
      companies: "Para empresas",
      contact: "Contato",
      youtube: "YOUTUBE",
      openMenu: "Abrir menu",
      closeMenu: "Fechar menu",
    },
    hero: {
      eyebrow: "Canal brasileiro de games",
      title: "KILL LIPE",
      headline: "CONTEÚDO PARA QUEM JOGA.",
      description: "Gameplays, guias e cobertura de lançamentos em português.",
      youtube: "ASSISTIR NO YOUTUBE",
      companies: "PARA EMPRESAS",
      platform: "Xbox Series X|S",
      embargo: "Embargo",
      nda: "NDA",
      visualTag: "Games · Guias · Lançamentos",
    },
    content: {
      eyebrow: "No canal",
      title: "CONTEÚDOS RECENTES",
      description: "Gameplays, guias e conteúdos recentes publicados no KILL LIPE.",
      channel: "VER CANAL",
      latest: "ÚLTIMO VÍDEO",
      type: "Vídeo",
      latestTitle: "BEAST OF REINCARNATION",
      latestDescription: "Último vídeo longo publicado no canal.",
      watchYoutube: "ASSISTIR NO YOUTUBE",
      watch: "ASSISTIR",
    },
    about: {
      eyebrow: "Sobre o canal",
      title: "UM CANAL FEITO POR QUEM GOSTA DE JOGAR.",
      paragraph1Before: "O KILL LIPE é um canal brasileiro de games focado em",
      paragraph1Strong: "gameplays, guias e cobertura de lançamentos",
      paragraph1After:
        ". A proposta é produzir conteúdo útil, direto e em português para quem quer conhecer melhor um jogo, avançar em uma missão ou acompanhar novos lançamentos.",
      paragraph2:
        "Por trás do canal está Fellipe Leite, criador de conteúdo de São Paulo. Sempre que possível, o objetivo é publicar durante o período de lançamento, aproximando o KILL LIPE da comunidade gamer e também de desenvolvedoras, publishers e equipes de PR.",
      location: "São Paulo",
      country: "Brasil",
      language: "Conteúdo em português",
      cards: [
        {
          number: "01",
          title: "GAMEPLAYS",
          description:
            "Experiências completas e primeiros contatos com jogos novos e lançamentos.",
        },
        {
          number: "02",
          title: "GUIAS",
          description:
            "Conteúdos diretos para ajudar jogadores em missões, desafios e objetivos.",
        },
        {
          number: "03",
          title: "LANÇAMENTOS",
          description:
            "Cobertura de novos jogos, sempre buscando publicar durante o período de lançamento.",
        },
      ],
      closing:
        "Conteúdo em português. Paixão por games. Compromisso com cada lançamento.",
      channel: "CONHECER O CANAL",
    },
    stats: {
      eyebrow: "Alcance do canal",
      titleLine1: "NÚMEROS DO",
      titleLine2: "KILL LIPE.",
      description:
        "",
      main: [
        {
          value: "1,24 MIL",
          label: "Inscritos no YouTube",
          detail: "Atualizado automaticamente via YouTube",
        },
        {
          value: "606 MIL+",
          label: "Visualizações acumuladas",
          detail: "Atualizado automaticamente via YouTube",
        },
        {
          value: "3,5 MILHÕES+",
          label: "Impressões",
          detail: "Histórico do canal",
        },
      ],
      recentTitle: "Últimos 28 dias",
      recentDate: "Dados informados em agosto de 2026.",
      recent: [
        { value: "5,8 MIL", label: "Visualizações" },
        { value: "75,2", label: "Horas de exibição" },
      ],
      apiNote:
        "Inscritos e visualizações acumuladas são atualizados automaticamente pela API oficial do YouTube.",
    },
    games: {
      eyebrow: "Coberturas do canal",
      titleLine1: "JOGOS EM",
      titleLine2: "DESTAQUE.",
      description:
        "As 9 coberturas com maior alcance no KILL LIPE, acompanhadas da cobertura mais recente.",
      playlist: "VER PLAYLIST",
      video: "VER VÍDEO",
      coverageViews: "VISUALIZAÇÕES DA COBERTURA",
      recentCoverage: "COBERTURA RECENTE",
      upcomingEyebrow: "Em breve no canal",
      upcomingTitle: "PRÓXIMAS COBERTURAS",
      upcomingDescription:
        "",
      confirmed: "COBERTURA PLANEJADA",
      catalog:
        "O catálogo continuará crescendo conforme novos jogos forem cobertos pelo canal.",
      youtube: "VER KILL LIPE NO YOUTUBE",
    },
    companies: {
      eyebrow: "Para empresas",
      title: "COBERTURA DE GAMES PARA O PÚBLICO BRASILEIRO.",
      paragraph1Before: "O KILL LIPE está aberto a oportunidades com",
      paragraph1Strong:
        "publishers, desenvolvedoras, assessorias de imprensa, agências e empresas do setor de games",
      paragraph1After:
        ", com foco em conteúdo em português para o público brasileiro.",
      paragraph2:
        "O canal trabalha principalmente com gameplays, guias e cobertura de lançamentos, buscando publicar durante o período de lançamento sempre que houver disponibilidade e acesso ao jogo.",
      creator: "Criador de conteúdo",
      country: "Brasil",
      language: "Conteúdo em PT-BR",
      opportunities: [
        {
          number: "01",
          title: "REVIEW & CREATOR KEYS",
          description:
            "Disponível para oportunidades de cobertura e criação de conteúdo relacionado a novos jogos.",
        },
        {
          number: "02",
          title: "ACESSO ANTECIPADO",
          description:
            "Conteúdo pré-lançamento quando houver oportunidade, disponibilidade e autorização.",
        },
        {
          number: "03",
          title: "CAMPANHAS & PARCERIAS",
          description:
            "Aberto a campanhas e ações compatíveis com o perfil e o público do KILL LIPE.",
        },
        {
          number: "04",
          title: "EVENTOS & IMPRENSA",
          description:
            "Disponível para oportunidades, eventos e materiais de imprensa relacionados ao setor de games.",
        },
      ],
      professionalInfoTitle: "Informações profissionais",
      info: [
        { label: "Plataforma principal", value: "Xbox Series X|S" },
        { label: "Outras plataformas", value: "PlayStation 5 · PC · Nintendo Switch" },
        { label: "Embargo", value: "Aceito" },
        { label: "NDA", value: "Aceito" },
        { label: "Localização", value: "São Paulo, Brasil" },
        { label: "Idiomas do site", value: "PT-BR · EN · ES" },
      ],
      ctaEyebrow: "Contato profissional",
      ctaTitle: "VAMOS FALAR SOBRE SEU PRÓXIMO LANÇAMENTO?",
      ctaDescription:
        "Para oportunidades de cobertura, campanhas, creator keys ou outros contatos profissionais relacionados ao KILL LIPE.",
      ctaButton: "CONTATO PROFISSIONAL",
    },
    contact: {
      eyebrow: "Contato",
      title: "QUER FALAR COM O KILL LIPE?",
      description:
        "Para propostas profissionais, oportunidades de cobertura, campanhas ou outros assuntos relacionados ao canal, entre em contato pelo formulário ou diretamente pelo e-mail.",
      emailLabel: "E-mail profissional",
      location: "São Paulo · Brasil",
      name: "Nome *",
      namePlaceholder: "Seu nome",
      company: "Empresa",
      companyPlaceholder: "Empresa / estúdio",
      email: "E-mail *",
      emailPlaceholder: "nome@empresa.com",
      type: "Tipo de contato *",
      select: "Selecione",
      types: [
        "Proposta profissional",
        "Review / Creator Key",
        "Campanha / parceria",
        "Evento / imprensa",
        "Outro",
      ],
      subject: "Assunto *",
      subjectPlaceholder: "Assunto da mensagem",
      message: "Mensagem *",
      messagePlaceholder:
        "Conte um pouco sobre a oportunidade ou assunto do contato.",
      note:
        "Sua mensagem será enviada diretamente para o e-mail profissional do KILL LIPE.",
      submit: "ENVIAR MENSAGEM",
      sending: "ENVIANDO...",
      success: "Mensagem enviada com sucesso. Obrigado pelo contato!",
      error: "Não foi possível enviar a mensagem. Tente novamente em instantes.",
    },
    footer: {
      about: "Sobre",
      content: "Conteúdo",
      games: "Jogos",
      companies: "Para empresas",
      contact: "Contato",
      copyright: "© 2026 KILL LIPE. Todos os direitos reservados.",
      homeAria: "KILL LIPE - Voltar ao início",
    },
  },
  en: {
    seo: {
      title: "KILL LIPE | Gaming Channel",
      description:
        "Official KILL LIPE website. Gameplay, guides and launch coverage for Brazilian audiences.",
    },
    nav: {
      home: "Home",
      about: "About",
      content: "Content",
      games: "Games",
      companies: "For companies",
      contact: "Contact",
      youtube: "YOUTUBE",
      openMenu: "Open menu",
      closeMenu: "Close menu",
    },
    hero: {
      eyebrow: "Brazilian gaming channel",
      title: "KILL LIPE",
      headline: "CONTENT MADE FOR PLAYERS.",
      description: "Gameplay, guides and launch coverage for Brazilian audiences.",
      youtube: "WATCH ON YOUTUBE",
      companies: "FOR COMPANIES",
      platform: "Xbox Series X|S",
      embargo: "Embargo",
      nda: "NDA",
      visualTag: "Games · Guides · Launches",
    },
    content: {
      eyebrow: "On the channel",
      title: "RECENT CONTENT",
      description: "Recent gameplay, guides and videos published on KILL LIPE.",
      channel: "VIEW CHANNEL",
      latest: "LATEST VIDEO",
      type: "Video",
      latestTitle: "BEAST OF REINCARNATION",
      latestDescription: "Latest long-form video published on the channel.",
      watchYoutube: "WATCH ON YOUTUBE",
      watch: "WATCH",
    },
    about: {
      eyebrow: "About the channel",
      title: "A CHANNEL MADE BY SOMEONE WHO LOVES TO PLAY.",
      paragraph1Before: "KILL LIPE is a Brazilian gaming channel focused on",
      paragraph1Strong: "gameplay, guides and launch coverage",
      paragraph1After:
        ". The goal is to create useful, straightforward content in Portuguese for players who want to discover a game, progress through a mission or follow new releases.",
      paragraph2:
        "KILL LIPE is created by Fellipe Leite, a content creator based in São Paulo, Brazil. Whenever possible, the goal is to publish during the launch window, connecting the channel with both the gaming community and developers, publishers and PR teams.",
      location: "São Paulo",
      country: "Brazil",
      language: "Content in Portuguese",
      cards: [
        {
          number: "01",
          title: "GAMEPLAY",
          description:
            "Full experiences and first looks at new games and releases.",
        },
        {
          number: "02",
          title: "GUIDES",
          description:
            "Straightforward content to help players with missions, challenges and objectives.",
        },
        {
          number: "03",
          title: "LAUNCHES",
          description:
            "Coverage of new games, with the goal of publishing during the launch window whenever possible.",
        },
      ],
      closing:
        "Content in Portuguese. A passion for games. Commitment to every launch.",
      channel: "DISCOVER THE CHANNEL",
    },
    stats: {
      eyebrow: "Channel reach",
      titleLine1: "KILL LIPE",
      titleLine2: "BY THE NUMBERS.",
      description:
        "",
      main: [
        {
          value: "1.24K",
          label: "YouTube subscribers",
          detail: "Automatically updated via YouTube",
        },
        {
          value: "606K+",
          label: "Total views",
          detail: "Automatically updated via YouTube",
        },
        {
          value: "3.5M+",
          label: "Impressions",
          detail: "Channel history",
        },
      ],
      recentTitle: "Last 28 days",
      recentDate: "Data provided in August 2026.",
      recent: [
        { value: "5.8K", label: "Views" },
        { value: "75.2", label: "Watch hours" },
      ],
      apiNote:
        "Subscribers and total views are automatically updated through the official YouTube API.",
    },
    games: {
      eyebrow: "Channel coverage",
      titleLine1: "FEATURED",
      titleLine2: "GAMES.",
      description:
        "The 9 highest-reach KILL LIPE game coverages, plus the most recent coverage.",
      playlist: "VIEW PLAYLIST",
      video: "VIEW VIDEO",
      coverageViews: "GAME CONTENT VIEWS",
      recentCoverage: "RECENT COVERAGE",
      upcomingEyebrow: "Coming to the channel",
      upcomingTitle: "UPCOMING COVERAGE",
      upcomingDescription:
        "",
      confirmed: "PLANNED COVERAGE",
      catalog:
        "The catalog will continue to grow as new games are covered on the channel.",
      youtube: "VIEW KILL LIPE ON YOUTUBE",
    },
    companies: {
      eyebrow: "For companies",
      title: "GAME COVERAGE FOR BRAZILIAN AUDIENCES.",
      paragraph1Before: "KILL LIPE is open to opportunities with",
      paragraph1Strong:
        "publishers, developers, PR agencies, communications teams and gaming companies",
      paragraph1After:
        ", with a focus on Portuguese-language content for Brazilian audiences.",
      paragraph2:
        "The channel primarily creates gameplay, guides and launch coverage, aiming to publish during the launch window whenever access and availability allow.",
      creator: "Gaming content creator",
      country: "Brazil",
      language: "Content in PT-BR",
      opportunities: [
        {
          number: "01",
          title: "REVIEW & CREATOR KEYS",
          description:
            "Available for coverage opportunities and content creation related to new games.",
        },
        {
          number: "02",
          title: "EARLY ACCESS",
          description:
            "Pre-release content when access, availability and authorization allow.",
        },
        {
          number: "03",
          title: "CAMPAIGNS & PARTNERSHIPS",
          description:
            "Open to campaigns and activations that fit KILL LIPE's profile and audience.",
        },
        {
          number: "04",
          title: "EVENTS & PRESS",
          description:
            "Available for events, press opportunities and media materials related to the gaming industry.",
        },
      ],
      professionalInfoTitle: "Professional information",
      info: [
        { label: "Primary platform", value: "Xbox Series X|S" },
        { label: "Other platforms", value: "PlayStation 5 · PC · Nintendo Switch" },
        { label: "Embargo", value: "Accepted" },
        { label: "NDA", value: "Accepted" },
        { label: "Location", value: "São Paulo, Brazil" },
        { label: "Site languages", value: "PT-BR · EN · ES" },
      ],
      ctaEyebrow: "Professional contact",
      ctaTitle: "LET'S TALK ABOUT YOUR NEXT LAUNCH.",
      ctaDescription:
        "For coverage opportunities, campaigns, creator keys or other professional inquiries related to KILL LIPE.",
      ctaButton: "PROFESSIONAL CONTACT",
    },
    contact: {
      eyebrow: "Contact",
      title: "WANT TO TALK TO KILL LIPE?",
      description:
        "For professional proposals, coverage opportunities, campaigns or other channel-related inquiries, use the form or contact KILL LIPE directly by email.",
      emailLabel: "Professional email",
      location: "São Paulo · Brazil",
      name: "Name *",
      namePlaceholder: "Your name",
      company: "Company",
      companyPlaceholder: "Company / studio",
      email: "Email *",
      emailPlaceholder: "name@company.com",
      type: "Contact type *",
      select: "Select",
      types: [
        "Professional proposal",
        "Review / Creator Key",
        "Campaign / partnership",
        "Event / press",
        "Other",
      ],
      subject: "Subject *",
      subjectPlaceholder: "Message subject",
      message: "Message *",
      messagePlaceholder: "Tell me a little about the opportunity or inquiry.",
      note:
        "Your message will be sent directly to KILL LIPE's professional email.",
      submit: "SEND MESSAGE",
      sending: "SENDING...",
      success: "Message sent successfully. Thank you for reaching out!",
      error: "The message could not be sent. Please try again in a moment.",
    },
    footer: {
      about: "About",
      content: "Content",
      games: "Games",
      companies: "For companies",
      contact: "Contact",
      copyright: "© 2026 KILL LIPE. All rights reserved.",
      homeAria: "KILL LIPE - Back to top",
    },
  },
  es: {
    seo: {
      title: "KILL LIPE | Canal de Videojuegos",
      description:
        "Sitio oficial de KILL LIPE. Gameplays, guías y cobertura de lanzamientos para el público brasileño.",
    },
    nav: {
      home: "Inicio",
      about: "Sobre",
      content: "Contenido",
      games: "Juegos",
      companies: "Para empresas",
      contact: "Contacto",
      youtube: "YOUTUBE",
      openMenu: "Abrir menú",
      closeMenu: "Cerrar menú",
    },
    hero: {
      eyebrow: "Canal brasileño de videojuegos",
      title: "KILL LIPE",
      headline: "CONTENIDO PARA QUIEN JUEGA.",
      description:
        "Gameplays, guías y cobertura de lanzamientos para el público brasileño.",
      youtube: "VER EN YOUTUBE",
      companies: "PARA EMPRESAS",
      platform: "Xbox Series X|S",
      embargo: "Embargo",
      nda: "NDA",
      visualTag: "Juegos · Guías · Lanzamientos",
    },
    content: {
      eyebrow: "En el canal",
      title: "CONTENIDOS RECIENTES",
      description:
        "Gameplays, guías y contenidos recientes publicados en KILL LIPE.",
      channel: "VER CANAL",
      latest: "ÚLTIMO VIDEO",
      type: "Video",
      latestTitle: "BEAST OF REINCARNATION",
      latestDescription: "Último video de formato largo publicado en el canal.",
      watchYoutube: "VER EN YOUTUBE",
      watch: "VER",
    },
    about: {
      eyebrow: "Sobre el canal",
      title: "UN CANAL HECHO POR ALGUIEN A QUIEN LE GUSTA JUGAR.",
      paragraph1Before: "KILL LIPE es un canal brasileño de videojuegos centrado en",
      paragraph1Strong: "gameplays, guías y cobertura de lanzamientos",
      paragraph1After:
        ". La propuesta es crear contenido útil, directo y en portugués para quienes quieren conocer mejor un juego, avanzar en una misión o seguir nuevos lanzamientos.",
      paragraph2:
        "Detrás del canal está Fellipe Leite, creador de contenido de São Paulo, Brasil. Siempre que es posible, el objetivo es publicar durante el período de lanzamiento, acercando KILL LIPE tanto a la comunidad gamer como a desarrolladoras, editoras y equipos de relaciones públicas.",
      location: "São Paulo",
      country: "Brasil",
      language: "Contenido en portugués",
      cards: [
        {
          number: "01",
          title: "GAMEPLAYS",
          description:
            "Experiencias completas y primeros contactos con nuevos juegos y lanzamientos.",
        },
        {
          number: "02",
          title: "GUÍAS",
          description:
            "Contenido directo para ayudar a los jugadores con misiones, desafíos y objetivos.",
        },
        {
          number: "03",
          title: "LANZAMIENTOS",
          description:
            "Cobertura de nuevos juegos, buscando publicar durante el período de lanzamiento siempre que sea posible.",
        },
      ],
      closing:
        "Contenido en portugués. Pasión por los videojuegos. Compromiso con cada lanzamiento.",
      channel: "CONOCER EL CANAL",
    },
    stats: {
      eyebrow: "Alcance del canal",
      titleLine1: "KILL LIPE",
      titleLine2: "EN NÚMEROS.",
      description:
        "",
      main: [
        {
          value: "1,24 MIL",
          label: "Suscriptores en YouTube",
          detail: "Actualizado automáticamente vía YouTube",
        },
        {
          value: "606 MIL+",
          label: "Visualizaciones acumuladas",
          detail: "Actualizado automáticamente vía YouTube",
        },
        {
          value: "3,5 MILLONES+",
          label: "Impresiones",
          detail: "Histórico del canal",
        },
      ],
      recentTitle: "Últimos 28 días",
      recentDate: "Datos informados en agosto de 2026.",
      recent: [
        { value: "5,8 MIL", label: "Visualizaciones" },
        { value: "75,2", label: "Horas de reproducción" },
      ],
      apiNote:
        "Los suscriptores y las visualizaciones acumuladas se actualizan automáticamente mediante la API oficial de YouTube.",
    },
    games: {
      eyebrow: "Coberturas del canal",
      titleLine1: "JUEGOS",
      titleLine2: "DESTACADOS.",
      description:
        "Las 9 coberturas de juegos con mayor alcance de KILL LIPE, junto con la cobertura más reciente.",
      playlist: "VER PLAYLIST",
      video: "VER VIDEO",
      coverageViews: "VISUALIZACIONES DE LA COBERTURA",
      recentCoverage: "COBERTURA RECIENTE",
      upcomingEyebrow: "Próximamente en el canal",
      upcomingTitle: "PRÓXIMAS COBERTURAS",
      upcomingDescription:
        "",
      confirmed: "COBERTURA PLANIFICADA",
      catalog:
        "El catálogo seguirá creciendo a medida que el canal cubra nuevos juegos.",
      youtube: "VER KILL LIPE EN YOUTUBE",
    },
    companies: {
      eyebrow: "Para empresas",
      title: "COBERTURA DE JUEGOS PARA EL PÚBLICO BRASILEÑO.",
      paragraph1Before: "KILL LIPE está abierto a oportunidades con",
      paragraph1Strong:
        "editoras, desarrolladoras, agencias de relaciones públicas, equipos de comunicación y empresas del sector de los videojuegos",
      paragraph1After:
        ", con foco en contenido en portugués para el público brasileño.",
      paragraph2:
        "El canal trabaja principalmente con gameplays, guías y cobertura de lanzamientos, buscando publicar durante el período de lanzamiento siempre que haya disponibilidad y acceso al juego.",
      creator: "Creador de contenido",
      country: "Brasil",
      language: "Contenido en PT-BR",
      opportunities: [
        {
          number: "01",
          title: "REVIEW & CREATOR KEYS",
          description:
            "Disponible para oportunidades de cobertura y creación de contenido relacionado con nuevos juegos.",
        },
        {
          number: "02",
          title: "ACCESO ANTICIPADO",
          description:
            "Contenido previo al lanzamiento cuando haya oportunidad, disponibilidad y autorización.",
        },
        {
          number: "03",
          title: "CAMPAÑAS & COLABORACIONES",
          description:
            "Abierto a campañas y acciones compatibles con el perfil y la audiencia de KILL LIPE.",
        },
        {
          number: "04",
          title: "EVENTOS & PRENSA",
          description:
            "Disponible para oportunidades, eventos y materiales de prensa relacionados con la industria de los videojuegos.",
        },
      ],
      professionalInfoTitle: "Información profesional",
      info: [
        { label: "Plataforma principal", value: "Xbox Series X|S" },
        { label: "Otras plataformas", value: "PlayStation 5 · PC · Nintendo Switch" },
        { label: "Embargo", value: "Aceptado" },
        { label: "NDA", value: "Aceptado" },
        { label: "Ubicación", value: "São Paulo, Brasil" },
        { label: "Idiomas del sitio", value: "PT-BR · EN · ES" },
      ],
      ctaEyebrow: "Contacto profesional",
      ctaTitle: "¿HABLAMOS DE TU PRÓXIMO LANZAMIENTO?",
      ctaDescription:
        "Para oportunidades de cobertura, campañas, creator keys u otros contactos profesionales relacionados con KILL LIPE.",
      ctaButton: "CONTACTO PROFESIONAL",
    },
    contact: {
      eyebrow: "Contacto",
      title: "¿QUIERES HABLAR CON KILL LIPE?",
      description:
        "Para propuestas profesionales, oportunidades de cobertura, campañas u otros asuntos relacionados con el canal, utiliza el formulario o contacta directamente por correo electrónico.",
      emailLabel: "Correo profesional",
      location: "São Paulo · Brasil",
      name: "Nombre *",
      namePlaceholder: "Tu nombre",
      company: "Empresa",
      companyPlaceholder: "Empresa / estudio",
      email: "Correo *",
      emailPlaceholder: "nombre@empresa.com",
      type: "Tipo de contacto *",
      select: "Selecciona",
      types: [
        "Propuesta profesional",
        "Review / Creator Key",
        "Campaña / colaboración",
        "Evento / prensa",
        "Otro",
      ],
      subject: "Asunto *",
      subjectPlaceholder: "Asunto del mensaje",
      message: "Mensaje *",
      messagePlaceholder:
        "Cuéntame un poco sobre la oportunidad o el motivo del contacto.",
      note:
        "Tu mensaje se enviará directamente al correo profesional de KILL LIPE.",
      submit: "ENVIAR MENSAJE",
      sending: "ENVIANDO...",
      success: "Mensaje enviado correctamente. ¡Gracias por contactarnos!",
      error: "No se pudo enviar el mensaje. Inténtalo de nuevo en unos instantes.",
    },
    footer: {
      about: "Sobre",
      content: "Contenido",
      games: "Juegos",
      companies: "Para empresas",
      contact: "Contacto",
      copyright: "© 2026 KILL LIPE. Todos los derechos reservados.",
      homeAria: "KILL LIPE - Volver al inicio",
    },
  },
} as const;

const localeLabels: Array<{ code: Locale; label: string }> = [
  { code: "pt-BR", label: "PT-BR" },
  { code: "en", label: "EN" },
  { code: "es", label: "ES" },
];

type KillLipeHomeProps = {
  initialLocale: Locale;
};

const localePaths: Record<Locale, string> = {
  "pt-BR": "/",
  en: "/en",
  es: "/es",
};

export default function KillLipeHome({ initialLocale }: KillLipeHomeProps) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [locale, setLocale] = useState<Locale>(initialLocale);
  const [subscriberCount, setSubscriberCount] = useState<number | null>(null);
  const [viewCount, setViewCount] = useState<number | null>(null);
  const [youtubeVideos, setYoutubeVideos] = useState<YouTubeVideo[]>([]);
  const [coverageMetrics, setCoverageMetrics] = useState<CoverageMetric[]>([]);
  const [contactStatus, setContactStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");

  const t = translations[locale];

  const displayVideos =
    youtubeVideos.length >= 4 ? youtubeVideos : fallbackYouTubeVideos;
  const latestVideo = displayVideos[0] ?? fallbackYouTubeVideos[0]!;
  const secondaryVideos = displayVideos.slice(1, 4);
  const coverageMetricsMap = new Map(
    coverageMetrics
      .filter((coverage) => coverage.viewCount > 0)
      .map((coverage) => [coverage.key, coverage] as const)
  );

  const formatCompactCount = (value: number) =>
    new Intl.NumberFormat(locale, {
      notation: "compact",
      maximumSignificantDigits: 3,
    })
      .format(value)
      .toUpperCase();

  const mainStats = t.stats.main.map((stat, index) => {
    if (index === 0 && subscriberCount !== null) {
      return { ...stat, value: formatCompactCount(subscriberCount) };
    }

    if (index === 1 && viewCount !== null) {
      return { ...stat, value: `${formatCompactCount(viewCount)}+` };
    }

    return stat;
  });

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const changeLocale = (nextLocale: Locale) => {
    setLocale(nextLocale);
    window.localStorage.setItem("kill-lipe-language", nextLocale);
    document.documentElement.lang = nextLocale;

    const hash = window.location.hash;
    router.push(`${localePaths[nextLocale]}${hash}`);
    closeMobileMenu();
  };

  const handleContactSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: String(formData.get("name") ?? "").trim(),
      company: String(formData.get("company") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      contactType: String(formData.get("type") ?? "").trim(),
      subject: String(formData.get("subject") ?? "").trim(),
      message: String(formData.get("message") ?? "").trim(),
      website: String(formData.get("website") ?? "").trim(),
    };

    setContactStatus("sending");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Contact request failed");
      }

      form.reset();
      setContactStatus("success");
    } catch (error) {
      console.error("Contact form error:", error);
      setContactStatus("error");
    }
  };

  useEffect(() => {
    const loadYouTubeVideos = async () => {
      try {
        const response = await fetch("/api/youtube/videos");

        if (!response.ok) {
          throw new Error("YouTube videos request failed");
        }

        const data = (await response.json()) as {
          videos?: YouTubeVideo[];
        };

        if (Array.isArray(data.videos) && data.videos.length >= 4) {
          setYoutubeVideos(data.videos.slice(0, 4));
        }
      } catch (error) {
        console.error("YouTube videos error:", error);
      }
    };

    void loadYouTubeVideos();
  }, []);

  useEffect(() => {
    const loadCoverageMetrics = async () => {
      try {
        const response = await fetch("/api/youtube/coverage");

        if (!response.ok) {
          throw new Error("YouTube coverage request failed");
        }

        const data = (await response.json()) as {
          coverages?: CoverageMetric[];
        };

        if (Array.isArray(data.coverages)) {
          setCoverageMetrics(data.coverages);
        }
      } catch (error) {
        console.error("YouTube coverage error:", error);
      }
    };

    void loadCoverageMetrics();
  }, []);

  useEffect(() => {
    const loadYouTubeStats = async () => {
      try {
        const response = await fetch("/api/youtube/stats");

        if (!response.ok) {
          throw new Error("YouTube stats request failed");
        }

        const data = (await response.json()) as {
          subscriberCount?: string;
          viewCount?: string;
        };

        const subscribers = Number(data.subscriberCount);
        const views = Number(data.viewCount);

        if (Number.isFinite(subscribers)) {
          setSubscriberCount(subscribers);
        }

        if (Number.isFinite(views)) {
          setViewCount(views);
        }
      } catch (error) {
        console.error("YouTube stats error:", error);
      }
    };

    void loadYouTubeStats();
  }, []);

  useEffect(() => {
    setLocale(initialLocale);
    document.documentElement.lang = initialLocale;
    window.localStorage.setItem("kill-lipe-language", initialLocale);
  }, [initialLocale]);

  useEffect(() => {
    document.title = t.seo.title;

    const description = document.querySelector('meta[name="description"]');
    if (description) {
      description.setAttribute("content", t.seo.description);
    }
  }, [t.seo.description, t.seo.title]);

  useEffect(() => {
    if (!mobileMenuOpen) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [mobileMenuOpen]);

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F5]">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
          <a
            href="#inicio"
            className="flex items-center gap-3"
            aria-label={`KILL LIPE - ${t.nav.home}`}
            onClick={closeMobileMenu}
          >
            <div className="relative h-11 w-11 overflow-hidden border border-white/15 bg-black">
              <Image
                src="/images/kill-lipe-logo.jpg"
                alt="Logo KILL LIPE"
                fill
                sizes="44px"
                className="object-cover"
                priority
              />
            </div>

            <span
              className="text-sm font-bold tracking-[0.22em] text-white"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              KILL LIPE
            </span>
          </a>

          <nav
            className="hidden items-center gap-7 text-sm text-zinc-400 lg:flex"
            aria-label={t.nav.home}
          >
            <a className="transition hover:text-white" href="#inicio">
              {t.nav.home}
            </a>
            <a className="transition hover:text-white" href="#sobre">
              {t.nav.about}
            </a>
            <a className="transition hover:text-white" href="#conteudo">
              {t.nav.content}
            </a>
            <a className="transition hover:text-white" href="#jogos">
              {t.nav.games}
            </a>
            <a className="transition hover:text-white" href="#empresas">
              {t.nav.companies}
            </a>
            <a className="transition hover:text-white" href="#contato">
              {t.nav.contact}
            </a>
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-2 text-xs font-semibold text-zinc-500 sm:flex">
              {localeLabels.map((item, index) => (
                <div key={item.code} className="flex items-center gap-2">
                  {index > 0 && <span>/</span>}
                  <button
                    className={`transition hover:text-white ${
                      locale === item.code ? "text-white" : "text-zinc-500"
                    }`}
                    type="button"
                    onClick={() => changeLocale(item.code)}
                    aria-pressed={locale === item.code}
                  >
                    {item.label}
                  </button>
                </div>
              ))}
            </div>

            <a
              href="https://www.youtube.com/@killlipe_"
              target="_blank"
              rel="noreferrer"
              className="hidden border border-white/20 px-4 py-2 text-xs font-bold tracking-[0.12em] text-white transition hover:border-white hover:bg-white hover:text-black sm:inline-flex"
            >
              {t.nav.youtube}
            </a>

            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center border border-white/20 transition hover:border-white/40 lg:hidden"
              aria-label={mobileMenuOpen ? t.nav.closeMenu : t.nav.openMenu}
              aria-expanded={mobileMenuOpen}
              aria-controls="menu-mobile"
              onClick={() => setMobileMenuOpen((open) => !open)}
            >
              <span className="relative block h-4 w-4">
                <span
                  className={`absolute left-0 top-[3px] h-px w-full bg-white transition duration-200 ${
                    mobileMenuOpen ? "translate-y-[5px] rotate-45" : ""
                  }`}
                />
                <span
                  className={`absolute left-0 top-[8px] h-px w-full bg-white transition duration-200 ${
                    mobileMenuOpen ? "opacity-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`absolute left-0 top-[13px] h-px w-full bg-white transition duration-200 ${
                    mobileMenuOpen ? "-translate-y-[5px] -rotate-45" : ""
                  }`}
                />
              </span>
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div
            id="menu-mobile"
            className="fixed inset-x-0 top-20 h-[calc(100dvh-5rem)] overflow-y-auto border-t border-white/10 bg-[#050505] lg:hidden"
          >
            <nav className="mx-auto flex min-h-full max-w-7xl flex-col px-6 py-8">
              <div className="divide-y divide-white/10 border-y border-white/10">
                {[
                  ["#inicio", t.nav.home],
                  ["#sobre", t.nav.about],
                  ["#conteudo", t.nav.content],
                  ["#jogos", t.nav.games],
                  ["#empresas", t.nav.companies],
                  ["#contato", t.nav.contact],
                ].map(([href, label]) => (
                  <a
                    key={href}
                    href={href}
                    onClick={closeMobileMenu}
                    className="flex min-h-14 items-center justify-between py-4 text-base font-semibold text-zinc-200"
                  >
                    {label}
                    <span className="text-zinc-600" aria-hidden="true">
                      →
                    </span>
                  </a>
                ))}
              </div>

              <a
                href="https://www.youtube.com/@killlipe_"
                target="_blank"
                rel="noreferrer"
                onClick={closeMobileMenu}
                className="mt-8 inline-flex min-h-12 items-center justify-center bg-white px-6 text-xs font-bold tracking-[0.12em] text-black"
              >
                {t.nav.youtube} ↗
              </a>

              <div className="mt-auto flex items-center justify-center gap-3 border-t border-white/10 pt-8 text-xs font-bold">
                {localeLabels.map((item, index) => (
                  <div key={item.code} className="flex items-center gap-3">
                    {index > 0 && <span className="text-zinc-700">/</span>}
                    <button
                      type="button"
                      onClick={() => changeLocale(item.code)}
                      aria-pressed={locale === item.code}
                      className={
                        locale === item.code ? "text-white" : "text-zinc-600"
                      }
                    >
                      {item.label}
                    </button>
                  </div>
                ))}
              </div>
            </nav>
          </div>
        )}
      </header>

      <main>
        <section
          id="inicio"
          className="relative flex min-h-[760px] items-center overflow-hidden pt-20 sm:min-h-screen"
        >
          <div className="absolute inset-0">
            <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.035] blur-3xl" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>

          <div className="relative mx-auto grid w-full max-w-7xl items-center gap-16 px-6 py-16 sm:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
            <div className="max-w-3xl">
              <p className="mb-6 text-xs font-semibold uppercase tracking-[0.32em] text-zinc-500">
                {t.hero.eyebrow}
              </p>

              <h1
                className="text-6xl font-black tracking-[-0.06em] text-white sm:text-7xl lg:text-8xl"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                {t.hero.title}
              </h1>

              <h2
                className="mt-7 max-w-2xl text-3xl font-semibold tracking-[-0.04em] text-zinc-200 sm:text-4xl lg:text-5xl"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                {t.hero.headline}
              </h2>

              <p className="mt-6 max-w-xl text-base leading-7 text-zinc-400 sm:text-lg">
                {t.hero.description}
              </p>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <a
                  href="https://www.youtube.com/@killlipe_"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-12 items-center justify-center bg-white px-7 text-sm font-bold tracking-[0.08em] text-black transition hover:bg-zinc-200"
                >
                  {t.hero.youtube}
                </a>

                <a
                  href="#empresas"
                  className="inline-flex min-h-12 items-center justify-center border border-white/25 px-7 text-sm font-bold tracking-[0.08em] text-white transition hover:border-white hover:bg-white/5"
                >
                  {t.hero.companies}
                </a>
              </div>

              <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t border-white/10 pt-6 text-xs font-medium uppercase tracking-[0.12em] text-zinc-500 sm:mt-12">
                <span>PT-BR · EN · ES</span>
                <span>{t.hero.platform}</span>
                <span>{t.hero.embargo}</span>
                <span>{t.hero.nda}</span>
              </div>
            </div>

            <div className="relative hidden min-h-[560px] items-center justify-center lg:flex">
              <div className="absolute h-[500px] w-[500px] rounded-full border border-white/[0.07]" />
              <div className="absolute h-[400px] w-[400px] rounded-full border border-white/[0.05]" />
              <div className="absolute h-[340px] w-[340px] bg-white/[0.035] blur-3xl" />

              <div className="relative h-[420px] w-[420px] overflow-hidden bg-black">
                <Image
                  src="/images/kill-lipe-logo.jpg"
                  alt="KILL LIPE"
                  fill
                  sizes="420px"
                  className="object-cover"
                  priority
                />
              </div>

              <span className="absolute bottom-8 right-2 text-[10px] font-semibold uppercase tracking-[0.32em] text-zinc-600">
                {t.hero.visualTag}
              </span>
            </div>
          </div>
        </section>

        <section
          id="conteudo"
          className="scroll-mt-28 border-b border-white/10 bg-[#080808] pb-24 pt-32 sm:pb-28 sm:pt-36"
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex flex-col justify-between gap-6 border-b border-white/10 pb-8 sm:flex-row sm:items-end">
              <div>
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">
                  {t.content.eyebrow}
                </p>
                <h2
                  className="text-4xl font-bold tracking-[-0.04em] text-white sm:text-5xl"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                  {t.content.title}
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-500 sm:text-base">
                  {t.content.description}
                </p>
              </div>

              <a
                href="https://www.youtube.com/@killlipe_"
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-fit items-center gap-3 text-xs font-bold tracking-[0.14em] text-zinc-400 transition hover:text-white"
              >
                {t.content.channel}
                <span aria-hidden="true">→</span>
              </a>
            </div>

            <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(340px,0.7fr)]">
              <div>
                <div className="overflow-hidden border border-white/10 bg-black">
                  <div className="aspect-video">
                    <iframe
                      className="h-full w-full"
                      src={latestVideo.embedUrl}
                      title={latestVideo.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex items-center gap-3">
                    <span className="bg-white px-2.5 py-1 text-[10px] font-bold tracking-[0.14em] text-black">
                      {t.content.latest}
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
                      {t.content.type}
                    </span>
                  </div>

                  <h3
                    className="mt-4 line-clamp-3 max-w-3xl text-2xl font-bold leading-tight tracking-[-0.03em] text-white sm:text-3xl"
                    style={{ fontFamily: "var(--font-space-grotesk)" }}
                    title={latestVideo.title}
                  >
                    {latestVideo.title}
                  </h3>

                  <p className="mt-2 text-sm text-zinc-500">
                    {t.content.latestDescription}
                  </p>

                  <a
                    href={latestVideo.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-flex items-center gap-3 text-xs font-bold tracking-[0.12em] text-zinc-300 transition hover:text-white"
                  >
                    {t.content.watchYoutube}
                    <span aria-hidden="true">→</span>
                  </a>
                </div>
              </div>

              <div className="grid content-start gap-5">
                {secondaryVideos.map((video) => (
                  <a
                    key={video.id}
                    href={video.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group grid grid-cols-[110px_minmax(0,1fr)] items-center overflow-hidden border border-white/10 bg-[#0b0b0b] transition hover:border-white/30 sm:grid-cols-[190px_minmax(0,1fr)] lg:grid-cols-[150px_minmax(0,1fr)] xl:grid-cols-[180px_minmax(0,1fr)]"
                  >
                    <div className="p-3 pr-0">
                      <div
                        className="aspect-video w-full bg-zinc-900 bg-cover bg-center"
                        style={{ backgroundImage: `url("${video.thumbnail}")` }}
                      />
                    </div>

                    <div className="min-w-0 p-4 sm:p-5">
                      <span className="text-[10px] font-bold tracking-[0.16em] text-zinc-500">
                        {t.content.type.toUpperCase()}
                      </span>
                      <h3
                        className="mt-2 line-clamp-3 text-sm font-bold leading-5 text-zinc-200 transition group-hover:text-white sm:text-base"
                        style={{ fontFamily: "var(--font-space-grotesk)" }}
                        title={video.title}
                      >
                        {video.title}
                      </h3>
                      <span className="mt-3 inline-block text-[10px] font-bold tracking-[0.12em] text-zinc-400 transition group-hover:text-zinc-200">
                        {t.content.watch} →
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          id="sobre"
          className="scroll-mt-28 border-b border-white/10 bg-[#050505] py-24 sm:py-32"
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-16 lg:grid-cols-[0.95fr_1.05fr] lg:gap-24">
              <div>
                <p className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">
                  {t.about.eyebrow}
                </p>
                <h2
                  className="max-w-xl text-4xl font-bold leading-[1.05] tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                  {t.about.title}
                </h2>
                <div className="mt-10 h-px w-20 bg-white/40" />
              </div>

              <div className="flex flex-col justify-center">
                <p className="max-w-2xl text-base leading-8 text-zinc-300 sm:text-lg">
                  {t.about.paragraph1Before}{" "}
                  <strong className="font-semibold text-white">
                    {t.about.paragraph1Strong}
                  </strong>
                  {t.about.paragraph1After}
                </p>

                <p className="mt-6 max-w-2xl text-base leading-8 text-zinc-500">
                  {t.about.paragraph2}
                </p>

                <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 border-t border-white/10 pt-7 text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-400">
                  <span>{t.about.location}</span>
                  <span>{t.about.country}</span>
                  <span>{t.about.language}</span>
                </div>
              </div>
            </div>

            <div className="mt-20 grid gap-px border border-white/10 bg-white/10 md:grid-cols-3">
              {t.about.cards.map((item) => (
                <div
                  key={item.number}
                  className="group bg-[#080808] p-7 transition hover:bg-[#0b0b0b] sm:p-8 lg:p-10"
                >
                  <div className="flex items-start justify-between gap-6">
                    <span className="text-[10px] font-semibold tracking-[0.18em] text-zinc-600">
                      {item.number}
                    </span>
                    <span
                      className="text-2xl text-zinc-700 transition group-hover:text-zinc-400"
                      aria-hidden="true"
                    >
                      ↗
                    </span>
                  </div>

                  <h3
                    className="mt-12 text-xl font-bold tracking-[-0.03em] text-white sm:text-2xl"
                    style={{ fontFamily: "var(--font-space-grotesk)" }}
                  >
                    {item.title}
                  </h3>
                  <p className="mt-4 max-w-sm text-sm leading-6 text-zinc-500">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-16 flex flex-col gap-6 border-t border-white/10 pt-10 sm:flex-row sm:items-end sm:justify-between">
              <p
                className="max-w-2xl text-xl font-semibold tracking-[-0.02em] text-zinc-300 sm:text-2xl"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                {t.about.closing}
              </p>
              <a
                href="https://www.youtube.com/@killlipe_"
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-fit items-center gap-3 text-xs font-bold tracking-[0.14em] text-zinc-400 transition hover:text-white"
              >
                {t.about.channel}
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </section>

        <section
          id="numeros"
          className="scroll-mt-28 border-b border-white/10 bg-[#080808] py-24 sm:py-32"
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="border-b border-white/10 pb-12">
              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">
                {t.stats.eyebrow}
              </p>
              <h2
                className="text-4xl font-bold tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                {t.stats.titleLine1}
                <br />
                {t.stats.titleLine2}
              </h2>
            </div>

            <div className="grid border-x border-b border-white/10 md:grid-cols-3">
              {mainStats.map((stat, index) => (
                <div
                  key={stat.label}
                  className={`relative min-w-0 p-7 sm:p-9 lg:p-10 ${
                    index !== mainStats.length - 1
                      ? "border-b border-white/10 md:border-b-0 md:border-r"
                      : ""
                  }`}
                >
                  <span className="text-[10px] font-semibold tracking-[0.18em] text-zinc-600">
                    0{index + 1}
                  </span>
                  <p
                    className={`mt-14 font-bold tracking-[-0.06em] text-white ${
                      index === 2 && locale !== "en"
                        ? "whitespace-nowrap text-[2rem] sm:text-[2.1rem] lg:text-[2.4rem] xl:text-5xl"
                        : "break-words text-4xl sm:text-5xl xl:text-6xl"
                    }`}
                    style={{ fontFamily: "var(--font-space-grotesk)" }}
                  >
                    {stat.value}
                  </p>
                  <p className="mt-4 text-sm font-semibold text-zinc-300">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-xs text-zinc-500">{stat.detail}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-zinc-500">
                  {t.stats.recentTitle}
                </p>
                <p className="mt-3 text-sm leading-6 text-zinc-500">
                  {t.stats.recentDate}
                </p>
              </div>

              <div className="grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2">
                {t.stats.recent.map((stat) => (
                  <div key={stat.label} className="bg-[#050505] p-7 sm:p-8">
                    <p
                      className="text-3xl font-bold tracking-[-0.04em] text-zinc-200 sm:text-4xl"
                      style={{ fontFamily: "var(--font-space-grotesk)" }}
                    >
                      {stat.value}
                    </p>
                    <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-12 flex items-center gap-3 border-t border-white/10 pt-8">
              <span className="h-2 w-2 rounded-full bg-white" />
              <p className="text-xs leading-5 text-zinc-500">{t.stats.apiNote}</p>
            </div>
          </div>
        </section>

        <section
          id="jogos"
          className="scroll-mt-28 border-b border-white/10 bg-[#050505] py-24 sm:py-32"
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-10 border-b border-white/10 pb-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
              <div>
                <p className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">
                  {t.games.eyebrow}
                </p>
                <h2
                  className="text-4xl font-bold tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                  {t.games.titleLine1}
                  <br />
                  {t.games.titleLine2}
                </h2>
              </div>

              <p className="max-w-2xl text-sm leading-7 text-zinc-500 sm:text-base lg:justify-self-end">
                {t.games.description}
              </p>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-5">
              {featuredGames.map((game) => {
                const linkLabel =
                  game.kind === "playlist" ? t.games.playlist : t.games.video;
                const coverageMetric = coverageMetricsMap.get(game.key);

                return (
                  <a
                    key={game.key}
                    href={game.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group block"
                  >
                    <div className="relative aspect-[2/3] overflow-hidden border border-white/10 bg-[#0a0a0a]">
                      <Image
                        src={game.image}
                        alt={`${game.title}`}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                        className="object-cover transition duration-500 group-hover:scale-[1.035]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
                      <div className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-between bg-black/85 px-4 py-3 backdrop-blur-sm transition duration-300 group-hover:translate-y-0">
                        <span className="text-[9px] font-bold tracking-[0.14em] text-zinc-200">
                          {linkLabel}
                        </span>
                        <span className="text-sm text-white" aria-hidden="true">
                          ↗
                        </span>
                      </div>
                    </div>

                    <h3
                      className="mt-3 text-[13px] font-bold leading-5 tracking-[-0.02em] text-zinc-300 transition group-hover:text-white sm:mt-4 sm:text-base"
                      style={{ fontFamily: "var(--font-space-grotesk)" }}
                    >
                      {game.title}
                    </h3>
                    {game.recent ? (
                      <div className="mt-2">
                        <span className="inline-flex items-center border border-white/15 bg-white/[0.04] px-2 py-1 text-[8px] font-bold uppercase tracking-[0.12em] text-zinc-300 sm:text-[9px]">
                          {t.games.recentCoverage}
                        </span>
                      </div>
                    ) : (
                      coverageMetric && (
                        <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                          <span className="text-[11px] font-bold tracking-[-0.01em] text-zinc-200 sm:text-xs">
                            {formatCompactCount(coverageMetric.viewCount)}
                          </span>
                          <span className="text-[8px] font-semibold uppercase tracking-[0.1em] text-zinc-600 sm:text-[9px]">
                            {t.games.coverageViews}
                          </span>
                        </div>
                      )
                    )}

                    <span className="mt-2 inline-flex items-center gap-2 text-[9px] font-bold tracking-[0.12em] text-zinc-500 transition group-hover:text-zinc-300 sm:tracking-[0.14em]">
                      {linkLabel}
                      <span aria-hidden="true">→</span>
                    </span>
                  </a>
                );
              })}
            </div>

            <div className="mt-28 border-t border-white/10 pt-20">
              <div>
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">
                  {t.games.upcomingEyebrow}
                </p>
                <h3
                  className="text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                  {t.games.upcomingTitle}
                </h3>
              </div>

              <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-6">
                {upcomingGames.map((game) => (
                  <article key={game.title}>
                    <div className="group relative aspect-[2/3] overflow-hidden border border-white/10 bg-[#0a0a0a]">
                      <Image
                        src={game.image}
                        alt={game.title}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 17vw"
                        className="object-cover opacity-80 transition duration-500 group-hover:scale-[1.025] group-hover:opacity-100"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />
                      <div className="absolute left-2 top-2 border border-white/20 bg-black/80 px-2 py-1 backdrop-blur-sm sm:left-3 sm:top-3 sm:px-2.5 sm:py-1.5">
                        <span className="whitespace-nowrap text-[6px] font-bold uppercase tracking-[0.08em] text-white sm:text-[8px] sm:tracking-[0.14em]">
                          {t.games.confirmed}
                        </span>
                      </div>
                    </div>

                    <h4
                      className="mt-3 text-[13px] font-bold leading-5 tracking-[-0.02em] text-zinc-300 sm:mt-4 sm:text-base"
                      style={{ fontFamily: "var(--font-space-grotesk)" }}
                    >
                      {game.title}
                    </h4>
                  </article>
                ))}
              </div>
            </div>

            <div className="mt-20 flex flex-col gap-6 border-t border-white/10 pt-10 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-xl text-sm leading-6 text-zinc-500">
                {t.games.catalog}
              </p>
              <a
                href="https://www.youtube.com/@killlipe_"
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-fit items-center gap-3 text-xs font-bold tracking-[0.14em] text-zinc-400 transition hover:text-white"
              >
                {t.games.youtube}
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </section>

        <section
          id="empresas"
          className="scroll-mt-28 border-b border-white/10 bg-[#080808] py-24 sm:py-32"
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-24">
              <div>
                <p className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">
                  {t.companies.eyebrow}
                </p>
                <h2
                  className="max-w-2xl text-4xl font-bold leading-[1.04] tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                  {t.companies.title}
                </h2>
                <div className="mt-10 h-px w-20 bg-white/40" />
              </div>

              <div className="flex flex-col justify-center">
                <p className="max-w-2xl text-base leading-8 text-zinc-300 sm:text-lg">
                  {t.companies.paragraph1Before}{" "}
                  <strong className="font-semibold text-white">
                    {t.companies.paragraph1Strong}
                  </strong>
                  {t.companies.paragraph1After}
                </p>
                <p className="mt-6 max-w-2xl text-base leading-8 text-zinc-500">
                  {t.companies.paragraph2}
                </p>
                <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 border-t border-white/10 pt-7 text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-400">
                  <span>{t.companies.creator}</span>
                  <span>{t.companies.country}</span>
                  <span>{t.companies.language}</span>
                </div>
              </div>
            </div>

            <div className="mt-20 grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2">
              {t.companies.opportunities.map((item) => (
                <div
                  key={item.number}
                  className="group bg-[#050505] p-7 transition hover:bg-[#0b0b0b] sm:p-9 lg:p-10"
                >
                  <div className="flex items-start justify-between gap-6">
                    <span className="text-[10px] font-semibold tracking-[0.18em] text-zinc-600">
                      {item.number}
                    </span>
                    <span
                      className="text-xl text-zinc-700 transition group-hover:text-zinc-300"
                      aria-hidden="true"
                    >
                      ↗
                    </span>
                  </div>
                  <h3
                    className="mt-12 text-xl font-bold tracking-[-0.03em] text-white sm:text-2xl"
                    style={{ fontFamily: "var(--font-space-grotesk)" }}
                  >
                    {item.title}
                  </h3>
                  <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-500">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-16">
              <p className="mb-6 text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500">
                {t.companies.professionalInfoTitle}
              </p>
              <div className="grid border-l border-t border-white/10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                {t.companies.info.map((item) => (
                  <div
                    key={item.label}
                    className="border-b border-r border-white/10 p-6"
                  >
                    <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-zinc-600">
                      {item.label}
                    </p>
                    <p
                      className="mt-3 text-sm font-bold text-zinc-200"
                      style={{ fontFamily: "var(--font-space-grotesk)" }}
                    >
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative mt-20 overflow-hidden border border-white/10 bg-[#050505] p-8 sm:p-10 lg:p-14">
              <div className="pointer-events-none absolute -right-28 -top-28 h-80 w-80 rounded-full border border-white/[0.05]" />
              <div className="pointer-events-none absolute -right-14 -top-14 h-52 w-52 rounded-full border border-white/[0.04]" />

              <div className="relative flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500">
                    {t.companies.ctaEyebrow}
                  </p>
                  <h3
                    className="max-w-3xl text-3xl font-bold leading-tight tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl"
                    style={{ fontFamily: "var(--font-space-grotesk)" }}
                  >
                    {t.companies.ctaTitle}
                  </h3>
                  <p className="mt-5 max-w-2xl text-sm leading-7 text-zinc-500 sm:text-base">
                    {t.companies.ctaDescription}
                  </p>
                </div>

                <a
                  href="#contato"
                  className="inline-flex min-h-12 shrink-0 items-center justify-center gap-4 bg-white px-7 text-xs font-bold tracking-[0.12em] text-black transition hover:bg-zinc-200"
                >
                  {t.companies.ctaButton}
                  <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        <section
          id="contato"
          className="scroll-mt-28 border-b border-white/10 bg-[#050505] py-24 sm:py-32"
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
              <div>
                <p className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">
                  {t.contact.eyebrow}
                </p>
                <h2
                  className="max-w-xl text-4xl font-bold leading-[1.04] tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                  {t.contact.title}
                </h2>
                <p className="mt-8 max-w-xl text-base leading-8 text-zinc-500">
                  {t.contact.description}
                </p>

                <div className="mt-10 border-t border-white/10 pt-8">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                    {t.contact.emailLabel}
                  </p>
                  <a
                    href="mailto:fellipesantos_29@hotmail.com"
                    className="mt-3 inline-block break-all text-lg font-semibold text-zinc-200 transition hover:text-white sm:text-xl"
                    style={{ fontFamily: "var(--font-space-grotesk)" }}
                  >
                    fellipesantos_29@hotmail.com
                  </a>
                </div>

                <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 border-t border-white/10 pt-7 text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-400">
                  <span>{t.contact.location}</span>
                  <span>PT-BR · EN · ES</span>
                </div>
              </div>

              <form
                onSubmit={handleContactSubmit}
                className="border border-white/10 bg-[#080808] p-6 sm:p-8 lg:p-10"
              >
                <div
                  className="absolute -left-[9999px] h-px w-px overflow-hidden"
                  aria-hidden="true"
                >
                  <label>
                    Website
                    <input
                      type="text"
                      name="website"
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </label>
                </div>
                <div className="grid gap-6 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-400">
                      {t.contact.name}
                    </span>
                    <input
                      type="text"
                      name="name"
                      required
                      autoComplete="name"
                      className="mt-3 h-12 w-full border border-white/10 bg-[#050505] px-4 text-sm text-white outline-none transition placeholder:text-zinc-400 focus:border-white/40"
                      placeholder={t.contact.namePlaceholder}
                    />
                  </label>

                  <label className="block">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-400">
                      {t.contact.company}
                    </span>
                    <input
                      type="text"
                      name="company"
                      autoComplete="organization"
                      className="mt-3 h-12 w-full border border-white/10 bg-[#050505] px-4 text-sm text-white outline-none transition placeholder:text-zinc-400 focus:border-white/40"
                      placeholder={t.contact.companyPlaceholder}
                    />
                  </label>

                  <label className="block">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-400">
                      {t.contact.email}
                    </span>
                    <input
                      type="email"
                      name="email"
                      required
                      autoComplete="email"
                      className="mt-3 h-12 w-full border border-white/10 bg-[#050505] px-4 text-sm text-white outline-none transition placeholder:text-zinc-400 focus:border-white/40"
                      placeholder={t.contact.emailPlaceholder}
                    />
                  </label>

                  <label className="block">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-400">
                      {t.contact.type}
                    </span>
                    <select
                      name="type"
                      required
                      defaultValue=""
                      className="mt-3 h-12 w-full border border-white/10 bg-[#050505] px-4 text-sm text-zinc-300 outline-none transition focus:border-white/40"
                    >
                      <option value="" disabled>
                        {t.contact.select}
                      </option>
                      {t.contact.types.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <label className="mt-6 block">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-400">
                    {t.contact.subject}
                  </span>
                  <input
                    type="text"
                    name="subject"
                    required
                    className="mt-3 h-12 w-full border border-white/10 bg-[#050505] px-4 text-sm text-white outline-none transition placeholder:text-zinc-400 focus:border-white/40"
                    placeholder={t.contact.subjectPlaceholder}
                  />
                </label>

                <label className="mt-6 block">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-400">
                    {t.contact.message}
                  </span>
                  <textarea
                    name="message"
                    required
                    rows={6}
                    className="mt-3 w-full resize-y border border-white/10 bg-[#050505] px-4 py-4 text-sm leading-6 text-white outline-none transition placeholder:text-zinc-400 focus:border-white/40"
                    placeholder={t.contact.messagePlaceholder}
                  />
                </label>

                <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="max-w-sm">
                    <p className="text-[11px] leading-5 text-zinc-500">
                      {t.contact.note}
                    </p>

                    <div className="mt-3 min-h-5" aria-live="polite">
                      {contactStatus === "success" && (
                        <p className="text-[11px] font-semibold leading-5 text-zinc-200">
                          {t.contact.success}
                        </p>
                      )}

                      {contactStatus === "error" && (
                        <p className="text-[11px] font-semibold leading-5 text-zinc-300">
                          {t.contact.error}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={contactStatus === "sending"}
                    className="inline-flex min-h-12 shrink-0 items-center justify-center gap-4 bg-white px-7 text-xs font-bold tracking-[0.12em] text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {contactStatus === "sending"
                      ? t.contact.sending
                      : t.contact.submit}
                    <span aria-hidden="true">→</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-black">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="flex flex-col gap-10 border-b border-white/10 pb-10 lg:flex-row lg:items-center lg:justify-between">
            <a
              href="#inicio"
              className="flex w-fit items-center gap-3"
              aria-label={t.footer.homeAria}
            >
              <div className="relative h-11 w-11 overflow-hidden border border-white/15 bg-black">
                <Image
                  src="/images/kill-lipe-logo.jpg"
                  alt="Logo KILL LIPE"
                  fill
                  sizes="44px"
                  className="object-cover"
                />
              </div>
              <span
                className="text-sm font-bold tracking-[0.22em] text-white"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                KILL LIPE
              </span>
            </a>

            <div className="flex flex-wrap gap-x-7 gap-y-4 text-xs font-semibold text-zinc-400">
              <a className="transition hover:text-white" href="#sobre">
                {t.footer.about}
              </a>
              <a className="transition hover:text-white" href="#conteudo">
                {t.footer.content}
              </a>
              <a className="transition hover:text-white" href="#jogos">
                {t.footer.games}
              </a>
              <a className="transition hover:text-white" href="#empresas">
                {t.footer.companies}
              </a>
              <a className="transition hover:text-white" href="#contato">
                {t.footer.contact}
              </a>
              <a
                className="transition hover:text-white"
                href="https://www.youtube.com/@killlipe_"
                target="_blank"
                rel="noreferrer"
              >
                YouTube ↗
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-5 pt-8 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
            <p>{t.footer.copyright}</p>

            <div className="flex items-center gap-3">
              {localeLabels.map((item, index) => (
                <div key={item.code} className="flex items-center gap-3">
                  {index > 0 && <span>/</span>}
                  <button
                    type="button"
                    onClick={() => changeLocale(item.code)}
                    aria-pressed={locale === item.code}
                    className={
                      locale === item.code ? "text-zinc-200" : "text-zinc-600"
                    }
                  >
                    {item.label}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
