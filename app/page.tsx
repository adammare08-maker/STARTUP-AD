import {
  ArrowDownRight, ArrowRight, ArrowUpRight, CirclePlay, Mail, Menu,
  MessageCircle, Palette, Sparkles, Video,
} from 'lucide-react';
import { ContactForm } from '@/components/contact-form';

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

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#accueil" aria-label="STARTUP/AD — Accueil">STARTUP<span>/</span>AD</a>
        <nav aria-label="Navigation principale">
          <a href="#a-propos">Adam</a><a href="#services">Ce que je crée</a>
          <a href="#creations">Mon travail</a><a href="#contact">Me parler</a>
        </nav>
        <a className="header-cta" href="#contact">Parlez-moi de votre startup <ArrowUpRight size={16} /></a>
        <a className="mobile-menu" href="#contact" aria-label="Aller au contact"><Menu size={22} /></a>
      </header>

      <section className="hero" id="accueil">
        <div className="hero-copy">
          <div className="kicker"><span /> Adam · 18 ans · en train de construire</div>
          <h1>Des pubs pour ceux qui <em>construisent.</em></h1>
          <p className="hero-personal">Moi, c’est Adam. Je crée des publicités accessibles pour les startups — et j’aime surtout rencontrer les personnes derrière les projets.</p>
          <div className="hero-actions">
            <a className="button button-primary" href="#contact">Parlez-moi de votre startup <ArrowUpRight size={18} /></a>
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
        <span>Je crée</span><b>des pubs accessibles</b><span>pour</span><b>les startups</b><span>avec</span><b>beaucoup d’écoute</b>
      </section>

      <section className="about section" id="a-propos">
        <div className="about-aside">
          <p className="section-index">01 / MOI, C’EST ADAM</p>
          <div className="small-photo portrait-frame">
            <img src="/images/adam-portrait.png?v=2" alt="Portrait d’Adam" width={1312} height={1199} loading="lazy" decoding="async" />
          </div>
          <p className="hand-note">Pas une équipe fictive.<br />Juste moi, pour l’instant.</p>
        </div>
        <div className="about-story">
          <h2>Je construis mon expérience entrepreneuriale <em>sur le terrain.</em></h2>
          <div className="story-columns">
            <p>Je me suis intéressé très jeune à l’entrepreneuriat et j’ai déjà essayé plusieurs idées. Cela m’a appris que je n’ai pas besoin de trouver immédiatement « la startup de ma vie ».</p>
            <p>Pour le moment, je préfère construire quelque chose de simple, réel et utile. STARTUP/AD me permet de créer, de prospecter et surtout de travailler avec de vrais entrepreneurs.</p>
          </div>
          <blockquote>« Je suis encore au début. Je ne prétends pas tout savoir. Mais je suis là, je travaille et j’ai envie de comprendre ce que vous construisez. »</blockquote>
          <a className="underlined-link" href="#pourquoi">Pourquoi je fais ça <ArrowDownRight size={18} /></a>
        </div>
      </section>

      <section className="services section" id="services">
        <div className="section-title">
          <p className="section-index">02 / CE QUE JE PEUX CRÉER</p>
          <h2>Une offre volontairement <em>simple.</em></h2>
          <p>Je crée des contenus publicitaires pour aider une jeune entreprise à présenter son produit, son idée ou son univers.</p>
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
          <a className="button button-primary" href="#contact">Parlons de votre besoin <ArrowRight size={18} /></a>
        </div>
      </section>

      <section className="work section" id="creations">
        <div className="section-title work-title">
          <div><p className="section-index">03 / MON TRAVAIL</p><h2>Des créations vraies,<br /><em>au fur et à mesure.</em></h2></div>
          <p>Voici ma première publicité, créée par moi-même avec Canva. Un premier pas concret dans mon parcours : apprendre en faisant, puis continuer à progresser.</p>
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
            <div className="work-placeholder">
              <span>EMPLACEMENT VISUEL — À REMPLACER</span><strong>AD/</strong><b>Une vraie création prendra cette place.</b>
            </div>
            <div className="work-caption"><span>02</span><div><h3>Création à venir</h3><p>Nom du projet · format · ce que la publicité devait raconter</p></div></div>
          </article>
        </div>
      </section>

      <section className="why section" id="pourquoi">
        <div className="why-heading">
          <p className="section-index">04 / POURQUOI STARTUP/AD ?</p>
          <h2>J’ai choisi d’aller <em>sur le terrain.</em></h2>
          <p>Je pourrais chercher une idée de startup après l’autre, seul devant mon écran. Pour le moment, j’ai choisi autre chose : créer un service concret et aller rencontrer les personnes qui entreprennent vraiment.</p>
        </div>
        <div className="field-path" aria-label="Mon parcours d’apprentissage">
          <div><span>01</span><b>Créer</b><small>faire quelque chose de réel</small></div>
          <ArrowRight aria-hidden="true" />
          <div><span>02</span><b>Prospecter</b><small>oser aller vers les autres</small></div>
          <ArrowRight aria-hidden="true" />
          <div><span>03</span><b>Rencontrer</b><small>écouter des fondateurs</small></div>
          <ArrowRight aria-hidden="true" />
          <div><span>04</span><b>Comprendre</b><small>voir les vrais problèmes</small></div>
          <ArrowRight aria-hidden="true" />
          <div><span>05</span><b>Progresser</b><small>construire la suite</small></div>
        </div>
        <p className="why-close">STARTUP/AD est mon moyen de faire tout cela tout en apportant une vraie prestation aux startups avec lesquelles je travaille.</p>
      </section>

      <section className="learning">
        <div className="learning-statement">
          <p className="section-index">05 / APPRENDRE EN FAISANT</p>
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
          <div><p className="section-index">06 / COMMENT ON TRAVAILLE</p><h2>Tout commence par<br /><em>une conversation.</em></h2></div>
          <p>Pas besoin d’un brief parfait. Je commence par vous écouter, puis nous avançons étape par étape.</p>
        </div>
        <ol className="steps">
          {steps.map(([number, title, text]) => <li key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p><ArrowDownRight size={22} /></li>)}
        </ol>
      </section>

      <section className="contact" id="contact">
        <div className="contact-copy">
          <p className="section-index">07 / VENEZ ME PARLER</p>
          <h2>Vous construisez quelque chose ? <em>Racontez-moi.</em></h2>
          <p>Vous n’avez pas besoin d’arriver avec un brief marketing de dix pages. Présentez-moi simplement votre startup, votre produit et ce que vous essayez de faire.</p>
          <p className="no-pressure">Et si mon service n’est pas pertinent tout de suite, nous aurons quand même eu une bonne conversation.</p>
          <div className="contact-links">
            <a href="mailto:adam.mare08@gmail.com"><Mail size={18} /> adam.mare08@gmail.com <ArrowUpRight size={16} /></a>
            <a href="#" aria-label="LinkedIn à configurer"><b aria-hidden="true">in</b> LinkedIn <span>À CONFIGURER</span></a>
            <a href="#" aria-label="Autre réseau à configurer"><b aria-hidden="true">@</b> Autre réseau <span>À CONFIGURER</span></a>
          </div>
        </div>
        <ContactForm />
      </section>

      <footer>
        <div className="footer-brand"><a className="brand" href="#accueil">STARTUP<span>/</span>AD</a><p>Adam crée des publicités accessibles pour les startups.</p></div>
        <div><strong>Sur cette page</strong><a href="#a-propos">Qui je suis</a><a href="#services">Ce que je crée</a><a href="#creations">Mon travail</a><a href="#contact">Me parler</a></div>
        <div><strong>Informations</strong><a href="/mentions-legales">Mentions légales — à compléter</a><a href="/confidentialite">Confidentialité</a><a href="mailto:adam.mare08@gmail.com">adam.mare08@gmail.com</a></div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} STARTUP/AD</span><span>Adam · 18 ans · j’apprends en faisant.</span></div>
      </footer>
    </main>
  );
}
