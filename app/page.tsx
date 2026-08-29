import {
  ArrowDownRight, ArrowRight, ArrowUpRight, CirclePlay, Clapperboard,
  Mail, Menu, Palette, Sparkles, Video,
} from 'lucide-react';
import { ContactForm } from '@/components/contact-form';

const services = [
  { icon: Video, number: '01', title: 'Vidéos courtes', text: 'Des formats dynamiques pour présenter votre produit simplement et capter l’attention rapidement.' },
  { icon: CirclePlay, number: '02', title: 'TikTok & Instagram', text: 'Des publicités pensées pour les codes des réseaux sociaux, sans perdre l’identité de votre startup.' },
  { icon: Palette, number: '03', title: 'Créations visuelles', text: 'Des visuels clairs et modernes pour vos campagnes, lancements et prises de parole.' },
  { icon: Sparkles, number: '04', title: 'Animations publicitaires', text: 'Du mouvement pour expliquer une idée, mettre un produit en valeur ou raconter une histoire.' },
  { icon: Clapperboard, number: '05', title: 'Contenus promotionnels', text: 'Des contenus sur mesure pour faire comprendre ce que vous construisez et donner envie d’en savoir plus.' },
];

const projects = [
  { number: '01', title: 'Votre projet ici', type: 'Vidéo produit · 15 sec', text: 'Emplacement réservé à une future publicité vidéo.', className: 'project-orange' },
  { number: '02', title: 'Prochaine création', type: 'Social ad · Format vertical', text: 'Emplacement facilement remplaçable par une vidéo ou une image.', className: 'project-dark' },
  { number: '03', title: 'À venir', type: 'Animation · Lancement', text: 'Une future réalisation sera présentée ici avec son contexte.', className: 'project-blue' },
];

const steps = [
  ['01', 'On discute', 'Vous me racontez votre startup, simplement.'],
  ['02', 'Je comprends', 'Je cherche à comprendre le produit, l’objectif et le public.'],
  ['03', 'On choisit', 'Nous décidons ensemble du format publicitaire adapté.'],
  ['04', 'Je crée', 'Je réalise la publicité avec une direction claire.'],
  ['05', 'On affine', 'Nous échangeons sur le résultat et les modifications utiles.'],
];

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#accueil" aria-label="STARTUP/AD — Accueil">STARTUP<span>/</span>AD</a>
        <nav aria-label="Navigation principale">
          <a href="#accueil">Accueil</a><a href="#creations">Créations</a><a href="#services">Services</a>
          <a href="#a-propos">À propos</a><a href="#contact">Contact</a>
        </nav>
        <a className="header-cta" href="#contact">Discutons <ArrowUpRight size={16} /></a>
        <a className="mobile-menu" href="#contact" aria-label="Aller au contact"><Menu size={22} /></a>
      </header>

      <section className="hero" id="accueil">
        <div className="hero-kicker"><span /> Création publicitaire pour startups</div>
        <h1>Votre startup mérite une pub qui donne envie de la <em>découvrir.</em></h1>
        <div className="hero-bottom">
          <p>Je crée des publicités modernes et accessibles pour aider les startups à présenter leurs produits, leurs idées et leur univers.</p>
          <div className="hero-actions">
            <a className="button button-primary" href="#contact">Discuter de votre projet <ArrowUpRight size={18} /></a>
            <a className="button button-secondary" href="#creations">Voir mes créations <ArrowDownRight size={18} /></a>
          </div>
        </div>
        <div className="hero-mark" aria-hidden="true"><span>UNE BONNE IDÉE</span><strong>MÉRITE D’ÊTRE VUE.</strong></div>
      </section>

      <section className="section services" id="services">
        <div className="section-heading">
          <p className="eyebrow">01 — Ce que je propose</p>
          <h2>Faire comprendre.<br />Donner envie. <i>Simplement.</i></h2>
          <p className="section-intro">Des créations adaptées aux besoins réels des jeunes entreprises, avec un interlocuteur unique du premier échange à la livraison.</p>
        </div>
        <div className="service-grid">
          {services.map(({ icon: Icon, number, title, text }) => (
            <article className="service-card" key={number}>
              <div className="card-top"><span>{number}</span><Icon size={25} strokeWidth={1.6} /></div>
              <h3>{title}</h3><p>{text}</p>
            </article>
          ))}
          <aside className="price-card">
            <Sparkles size={27} /><p>Tarifs pensés pour rester accessibles aux jeunes startups.</p>
            <a href="#contact">Demander un tarif <ArrowRight size={17} /></a>
          </aside>
        </div>
      </section>

      <section className="section creations" id="creations">
        <div className="section-heading row-heading">
          <div><p className="eyebrow">02 — Mes créations</p><h2>Le travail<br /><i>parle aussi.</i></h2></div>
          <p className="section-intro">Cette galerie accueillera progressivement mes vidéos, visuels et animations. Aucun faux projet : seulement du travail réel, dès qu’il sera prêt.</p>
        </div>
        <div className="project-grid">
          {projects.map((project) => (
            <article className="project-card" key={project.number}>
              <div className={`project-visual ${project.className}`}>
                <span className="placeholder-label">PLACEHOLDER — À REMPLACER</span>
                <div className="visual-word">AD<span>/</span></div><div className="play"><CirclePlay size={44} /></div>
              </div>
              <div className="project-meta"><span>{project.number}</span><div><h3>{project.title}</h3><p>{project.type}</p><small>{project.text}</small></div></div>
            </article>
          ))}
        </div>
      </section>

      <section className="manifesto">
        <div className="manifesto-label">03 — Pourquoi STARTUP/AD</div>
        <blockquote>« Aider les startups à mieux présenter ce qu’elles construisent, <em>sans forcément passer par une grosse agence.</em> »</blockquote>
        <div className="manifesto-copy">
          <p>STARTUP/AD est né d’une idée simple : proposer un service publicitaire accessible, direct et humain.</p>
          <p>Je veux travailler avec les fondateurs, comprendre leur produit et créer une publicité réellement adaptée à leur projet.</p>
        </div>
      </section>

      <section className="section about" id="a-propos">
        <div className="portrait-placeholder" role="img" aria-label="Emplacement réservé pour une future photo d’Adam">
          <span>VOTRE PHOTO</span><strong>ADAM</strong><small>PLACEHOLDER À REMPLACER</small>
        </div>
        <div className="about-copy">
          <p className="eyebrow">04 — Qui suis-je ?</p>
          <h2>Moi, c’est <i>Adam.</i></h2>
          <p className="lead">J’ai 18 ans et je développe STARTUP/AD avec l’envie de construire mon expérience directement sur le terrain.</p>
          <div className="about-columns">
            <p>Je suis passionné par l’entrepreneuriat, curieux de comprendre comment naissent les projets et motivé par le travail aux côtés de celles et ceux qui les portent.</p>
            <p>Je ne prétends pas tout savoir. Je préfère apprendre en faisant, progresser à chaque création et être transparent dans mes échanges.</p>
          </div>
          <div className="traits"><span>Ambitieux</span><span>Curieux</span><span>Sérieux</span><span>En apprentissage</span></div>
          <a className="text-link" href="#contact">Venez me parler de votre idée <ArrowUpRight size={18} /></a>
        </div>
      </section>

      <section className="section process">
        <div className="section-heading row-heading">
          <div><p className="eyebrow">05 — Ma façon de travailler</p><h2>Simple, proche,<br /><i>sans détour.</i></h2></div>
          <p className="section-intro">Pas de tunnel compliqué. Nous avançons ensemble, avec des échanges clairs à chaque étape.</p>
        </div>
        <ol className="steps">
          {steps.map(([number, title, text]) => <li key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p><ArrowDownRight size={22} /></li>)}
        </ol>
      </section>

      <section className="contact" id="contact">
        <div className="contact-copy">
          <p className="eyebrow">06 — Contact</p>
          <h2>Vous construisez une startup ? <i>Parlons-en.</i></h2>
          <p>Même si vous n’avez pas encore une idée précise de la publicité dont vous avez besoin, vous pouvez simplement venir discuter de votre projet avec moi.</p>
          <div className="contact-links">
            <a href="mailto:VOTRE-EMAIL@EXEMPLE.COM"><Mail size={18} /> Email à configurer <ArrowUpRight size={16} /></a>
            <a href="#" aria-label="LinkedIn à configurer"><b aria-hidden="true">in</b> LinkedIn <span>À CONFIGURER</span></a>
            <a href="#" aria-label="Instagram à configurer"><b aria-hidden="true">@</b> Instagram <span>À CONFIGURER</span></a>
          </div>
        </div>
        <ContactForm />
      </section>

      <footer>
        <div className="footer-brand"><a className="brand" href="#accueil">STARTUP<span>/</span>AD</a><p>Création publicitaire pour startups.</p></div>
        <div><strong>Navigation</strong><a href="#services">Services</a><a href="#creations">Créations</a><a href="#a-propos">À propos</a><a href="#contact">Contact</a></div>
        <div><strong>Informations</strong><a href="/mentions-legales">Mentions légales — à compléter</a><a href="/confidentialite">Confidentialité — à compléter</a><span>Email — à configurer</span></div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} STARTUP/AD</span><span>Construit avec ambition par Adam.</span></div>
      </footer>
    </main>
  );
}
