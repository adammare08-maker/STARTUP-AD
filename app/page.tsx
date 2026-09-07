import {
  ArrowDownRight, ArrowRight, ArrowUpRight, CirclePlay,
  MessageCircle, Palette, Sparkles, Video, Search, Users, Lightbulb, PencilLine,
} from 'lucide-react';

const services = [
  ['01', 'Publicité vidéo courte', 'Un format court pour raconter clairement votre produit ou votre idée.', Video],
  ['02', 'TikTok / Reels', 'Un contenu vertical pensé pour les usages des réseaux sociaux.', CirclePlay],
  ['03', 'Visuel publicitaire', 'Une image simple et forte pour présenter, lancer ou expliquer.', Palette],
  ['04', 'Animation', 'Du mouvement pour rendre une idée ou un produit plus facile à comprendre.', Sparkles],
  ['05', 'Présentation de startup', 'Un contenu qui aide les autres à saisir ce que vous construisez.', ArrowUpRight],
] as const;

const steps = [
  ['01', 'Vous me racontez votre startup.', 'La première étape, c’est une vraie conversation.'],
  ['02', 'J’essaie de comprendre.', 'Votre produit, les personnes à qui vous parlez et ce qui compte vraiment.'],
  ['03', 'Nous trouvons ce que la pub doit raconter.', 'Une idée claire avant de parler de format ou d’effets.'],
  ['04', 'Je crée.', 'Je transforme cette idée en vidéo, visuel ou animation.'],
  ['05', 'Nous regardons ensemble.', 'Vous me dites ce qui fonctionne et ce qui mérite d’être amélioré.'],
  ['06', 'Je livre la création finale.', 'Une version prête à être utilisée par votre startup.'],
];

const phases = [
  ['01', 'Prospecter', 'Oser aller vers les autres.', 'Je recherche des entrepreneurs, je vais vers eux et je présente STARTUP/AD. Prospecter m’apprend aussi à parler de mon travail, à recevoir des refus et à progresser.', Search],
  ['02', 'Rencontrer', 'Découvrir la personne derrière la startup.', 'Un prospect n’est pas seulement un client potentiel. C’est un fondateur ou une fondatrice avec une histoire, une ambition et une vision. Je veux d’abord rencontrer cette personne.', Users],
  ['03', 'Comprendre', 'Aller au fond du projet.', 'Je ne veux pas créer une publicité sans comprendre ce qu’il y a derrière : le problème, le public, la philosophie et ce que le projet veut faire ressentir.', MessageCircle],
  ['04', 'Proposer', 'Transformer l’écoute en direction claire.', 'Si mon service peut réellement être utile, je propose une prestation claire. Nous définissons ensemble le format, le besoin, le prix, le délai et les attentes.', Lightbulb],
  ['05', 'Créer', 'Créer avec l’entrepreneur.', 'Je crée à partir de ce que j’ai compris. Je présente le résultat, j’écoute les retours et nous l’améliorons ensemble avant la livraison finale.', PencilLine],
] as const;

const questions = [
  'Pourquoi cette startup existe-t-elle ?',
  'Quel problème cherche-t-elle à résoudre ?',
  'Pour qui ?',
  'Quelle est l’ambition du fondateur ?',
  'Quelle est la philosophie du projet ?',
  'Que doit comprendre ou ressentir le public ?',
];

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#accueil" aria-label="STARTUP/AD — Accueil">STARTUP<span>/</span>AD</a>
        <nav aria-label="Navigation principale">
          <a href="#accueil">Accueil</a><a href="#services">Services</a>
          <a href="#creations">Réalisations</a><a href="#a-propos">À propos</a>
          <a href="#pourquoi">Ma vision</a>
        </nav>
        <div className="header-actions">
          <a className="header-cta" href="mailto:startup.ad.contact@gmail.com">Me contacter <ArrowUpRight size={16} /></a>
        </div>
      </header>

      <section className="hero" id="accueil">
        <div className="hero-copy">
          <div className="kicker"><span /> Adam · 18 ans · en train de construire</div>
          <h1>Des pubs pour ceux qui <em>construisent.</em></h1>
          <p className="hero-personal">Je crée des publicités pour les startups. Mais avant de créer, je veux rencontrer les personnes derrière les projets et comprendre ce qu’elles construisent.</p>
          <div className="hero-actions">
            <a className="button button-primary" href="mailto:startup.ad.contact@gmail.com">Me contacter <ArrowUpRight size={18} /></a>
            <a className="button button-secondary" href="#creations">Voir ce que je crée <ArrowDownRight size={18} /></a>
          </div>
          <p className="direct-note"><MessageCircle size={18} /> Vous travaillerez directement avec moi, du premier message à la livraison.</p>
        </div>
        <div className="hero-portrait portrait-frame">
          <img src="/images/adam-portrait.png?v=2" alt="Adam, créateur de STARTUP/AD" width={1312} height={1199} fetchPriority="high" />
          <span className="portrait-label">Moi, c’est Adam.</span>
        </div>
        <div className="hero-note" aria-hidden="true">Je préfère apprendre<br />en faisant. ↘</div>
      </section>

      <section className="intro-strip" aria-label="En bref">
        <b>Prospecter.</b><b>Rencontrer.</b><b>Comprendre.</b><b>Proposer.</b><b>Créer.</b>
      </section>

      <section className="journey section" id="methode">
        <div className="journey-heading">
          <p className="section-index">01 / MA MANIÈRE DE TRAVAILLER</p>
          <h2>Une publicité commence <em>avant la création.</em></h2>
          <p>STARTUP/AD n’est pas une boutique où l’on commande puis disparaît. Ma méthode commence par aller vers les entrepreneurs, les rencontrer et écouter ce qu’ils construisent.</p>
        </div>
        <ol className="phase-list">
          {phases.map(([number, title, subtitle, text, Icon]) => (
            <li key={number}>
              <div className="phase-marker"><span>{number}</span><Icon size={24} strokeWidth={1.5} /></div>
              <div><h3>{title}</h3><strong>{subtitle}</strong></div>
              <p>{text}</p>
            </li>
          ))}
        </ol>
        <div className="understand-panel">
          <div><span>03</span><h3>Comprendre avant de créer.</h3><p>Ce sont les questions que je veux poser avant d’ouvrir un logiciel de montage.</p></div>
          <ul>{questions.map((question) => <li key={question}>{question}</li>)}</ul>
        </div>
      </section>

      <section className="about section" id="a-propos">
        <div className="about-aside">
          <p className="section-index">02 / MOI, C’EST ADAM</p>
          <div className="small-photo portrait-frame">
            <img src="/images/adam-portrait.png?v=2" alt="Portrait d’Adam" width={1312} height={1199} loading="lazy" decoding="async" />
          </div>
          <p className="hand-note">Pas une équipe fictive.<br />Juste moi, pour l’instant.</p>
        </div>
        <div className="about-story">
          <h2>Je préfère apprendre <em>en faisant.</em></h2>
          <div className="story-columns">
            <p>Je développe STARTUP/AD comme une activité freelance de création publicitaire destinée aux startups. Mon objectif n’est pas seulement de créer des publicités : je veux aussi rencontrer les personnes qui construisent les projets et comprendre leur vision.</p>
            <p>Je suis au début de mon parcours entrepreneurial. Je ne prétends pas tout savoir. Je préfère apprendre sur le terrain, en créant, en prospectant et en échangeant avec ceux qui construisent.</p>
          </div>
          <blockquote>« Je suis encore au début. Je ne prétends pas tout savoir. Mais je suis là, je travaille et j’ai envie de comprendre ce que vous construisez. »</blockquote>
          <a className="underlined-link" href="#pourquoi">Pourquoi je fais ça <ArrowDownRight size={18} /></a>
        </div>
      </section>

      <section className="services section" id="services">
        <div className="section-title">
          <p className="section-index">03 / CE QUE JE PEUX CRÉER</p>
          <h2>Une offre volontairement <em>simple.</em></h2>
          <p>Je prends le temps de comprendre ce que vous construisez pour créer une publicité qui vous ressemble.</p>
        </div>
        <div className="service-list">
          {services.map(([number, title, text, Icon]) => (
            <article key={number}>
              <span>{number}</span><Icon size={24} strokeWidth={1.5} /><h3>{title}</h3><p>{text}</p>
            </article>
          ))}
        </div>
        <div className="fair-price">
          <p><b>Des tarifs raisonnables.</b> Je cherche à garder mes prestations accessibles aux startups qui n’ont pas forcément le budget d’une grosse agence.</p>
          <a className="button button-primary" href="mailto:startup.ad.contact@gmail.com">Me contacter <ArrowRight size={18} /></a>
        </div>
      </section>

      <section className="client-value section">
        <p className="section-index">04 / CE QUE VOUS Y GAGNEZ</p>
        <div className="client-value-grid">
          <h2>Votre projet mérite d’être compris <em>avant d’être présenté.</em></h2>
          <div><p className="client-lead">Une bonne publicité ne commence pas par un logiciel de montage. Elle commence par une discussion.</p><p>Je prends le temps de comprendre votre startup, votre public et ce que vous voulez réellement transmettre. Vous achetez une vraie prestation, pensée à partir de votre projet — pas un modèle générique.</p><a className="underlined-link" href="mailto:startup.ad.contact@gmail.com">Écrire à Adam <ArrowDownRight size={18} /></a></div>
        </div>
      </section>

      <section className="work section" id="creations">
        <div className="section-title work-title">
          <div><p className="section-index">05 / MON TRAVAIL</p><h2>Des créations vraies,<br /><em>au fur et à mesure.</em></h2></div>
          <p>Je partage ici mes créations personnelles au fur et à mesure : des projets concrets pour présenter des idées, tester des formats et continuer à progresser.</p>
        </div>
        <div className="work-grid">
          <article className="work-item work-video">
            <video className="portfolio-video" controls playsInline preload="metadata" poster="/videos/premiere-publicite-canva.jpg" aria-label="Ma première publicité, créée par moi-même avec Canva">
              <source src="/videos/premiere-publicite-canva.mp4" type="video/mp4" />
              Votre navigateur ne permet pas de lire cette vidéo. <a href="/videos/premiere-publicite-canva.mp4">Ouvrir ma première publicité</a>.
            </video>
            <div className="work-caption"><span>01</span><div><h3>Ma première publicité</h3><p>Date Rencontre Express · Vidéo verticale · Créée par moi-même avec Canva.</p><p>Une vidéo pour présenter l’application et son idée. Je la partage ici comme le début de mon travail, avec l’envie de créer, de tester et de m’améliorer.</p></div></div>
          </article>
          <article className="work-item work-visual">
            <video className="portfolio-video" controls playsInline preload="metadata" poster="/videos/presentation-animee-startup-ad.jpg" aria-label="Présentation animée de mon service STARTUP/AD">
              <source src="/videos/presentation-animee-startup-ad.mp4" type="video/mp4" />
              Votre navigateur ne permet pas de lire cette vidéo. <a href="/videos/presentation-animee-startup-ad.mp4">Ouvrir la présentation animée de STARTUP/AD</a>.
            </video>
            <div className="work-caption"><span>02</span><div><h3>Présentation animée de STARTUP/AD</h3><p>Création personnelle · Vidéo verticale animée.</p><p>Je lance <strong>STARTUP/AD</strong>, mon service de création de publicités pour les startups. 🚀<br />Mon objectif : créer, rencontrer des entrepreneurs et évoluer à leurs côtés.</p></div></div>
          </article>
        </div>
      </section>

      <section className="why section" id="pourquoi">
        <div className="why-heading">
          <p className="section-index">06 / POURQUOI STARTUP/AD ?</p>
          <h2>J’ai choisi d’aller <em>sur le terrain.</em></h2>
          <p>Pendant longtemps, j’ai beaucoup réfléchi à des idées de startups. Avec STARTUP/AD, je veux aussi apprendre autrement : en faisant quelque chose de concret et en travaillant directement avec des entrepreneurs.</p>
        </div>
        <div className="why-verbs" aria-label="Ce que STARTUP/AD me permet de faire"><span>Créer.</span><span>Prospecter.</span><span>Rencontrer.</span><span>Écouter.</span><span>Comprendre.</span><span>Construire.</span></div>
        <p className="why-close">STARTUP/AD est mon moyen de faire tout cela tout en apportant une vraie prestation aux startups avec lesquelles je travaille.</p>
        <p>Je fais évoluer STARTUP/AD à partir du terrain : travailler avec de vrais clients, rencontrer un problème, le comprendre, puis améliorer ce qui doit l’être. Pas de fonctionnalités en avance, juste ce qui aide vraiment à travailler ensemble.</p>
      </section>

      <section className="learning">
        <div className="learning-statement">
          <p className="section-index">07 / APPRENDRE EN FAISANT</p>
          <h2>Je construis autant mon expérience que <em>mon entreprise.</em></h2>
        </div>
        <div className="learning-copy">
          <p>Une mission reste d’abord une vraie prestation : vous me confiez une publicité, je m’engage à la créer sérieusement.</p>
          <p>Mais derrière STARTUP/AD, j’ai aussi une motivation personnelle : chaque échange m’aide à mieux comprendre la publicité, la vente, les produits, les clients et la réalité des entrepreneurs.</p>
          <div className="learning-tags"><span>Publicité</span><span>Vente</span><span>Startups</span><span>Produits</span><span>Entrepreneurs</span><span>Clients</span></div>
        </div>
      </section>

      <section className="process section">
        <div className="section-title process-title">
          <div><p className="section-index">08 / VOTRE PROJET, CONCRÈTEMENT</p><h2>Tout commence par<br /><em>une conversation.</em></h2></div>
          <p>Pas besoin d’un brief parfait. Je commence par vous écouter, puis nous avançons étape par étape.</p>
        </div>
        <ol className="steps">
          {steps.map(([number, title, text]) => <li key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p><ArrowDownRight size={22} /></li>)}
        </ol>
      </section>

      <footer>
        <div className="footer-brand"><a className="brand" href="#accueil">STARTUP<span>/</span>AD</a><p>Adam crée des publicités accessibles pour les startups.</p></div>
        <div><strong>Sur cette page</strong><a href="#a-propos">Qui je suis</a><a href="#services">Ce que je crée</a><a href="#creations">Mon travail</a><a href="#pourquoi">Ma vision</a></div>
        <div><strong>Informations</strong><a href="/mentions-legales">Mentions légales — à compléter</a><a href="/confidentialite">Confidentialité</a><a href="mailto:startup.ad.contact@gmail.com">Écrire à Adam</a></div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} STARTUP/AD</span><span>Adam · 18 ans · j’apprends en faisant.</span></div>
      </footer>
    </main>
  );
}
