import { motion, AnimatePresence } from 'framer-motion';
import { assets, collectionsList } from '../utils/constants';

export default function LandingView({ setCurrentTab, token, setIsLoginView, setShowAuth, activeTechnique, setActiveTechnique }) {
  
  const handleOpenAuth = (isLogin) => {
    setIsLoginView(isLogin);
    setShowAuth(true);
  };

  return (
    <div className="btx-page">
      <header className="btv-header">
        <button className="btv-wordmark" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="saree-brand-title-dark"
            style={{ fontSize: '18px' }}
          >
            BHAIRAVI THREADS
          </motion.span>
        </button>
        <nav>
          <a href="#btv-craft">Craft</a>
          <a href="#btv-collections">Collections</a>
          <a href="#btv-story">Story</a>
          <a href="#btv-runway">Runway</a>
          <a href="#btv-journal">Journal</a>
        </nav>
        <div className="btv-header-right">
          {!token ? (
            <button onClick={() => handleOpenAuth(true)}>LOGIN / SIGN UP</button>
          ) : (
            <button onClick={() => setCurrentTab("profile")}>MY ACCOUNT</button>
          )}
          <button onClick={() => setCurrentTab("store")}>SHOP ↗</button>
        </div>
      </header>

      <main>
        <section className="btv-hero">
          <video src={assets.heroVideo} autoPlay muted loop playsInline className="btv-hero-bg-video" />
          <div className="btv-hero-shade" />

          <div className="btv-hero-copy">
            <motion.span
              initial={{ opacity: 0, letterSpacing: '0.1em' }}
              animate={{ opacity: 1, letterSpacing: '0.3em' }}
              transition={{ duration: 1 }}
              className="btv-overline"
              style={{ marginBottom: '1rem', color: '#ccc' }}
            >
              HANDWOVEN · HAND-PAINTED · INDIA
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="saree-brand-title btv-hero-title"
            >
              BHAIRAVI THREADS
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="btv-hero-subtitle"
            >
              The Rhythm of the Loom — Woven Stories & Painted Souls
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              Contemporary sarees shaped by the loom, the brush and the human hand.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="btv-hero-actions"
            >
              <a href="#btv-collections" className="btv-dark-button">EXPLORE COLLECTIONS ↓</a>
              <button onClick={() => setCurrentTab("store")} className="btv-line-button">SHOP STORE ↗</button>
            </motion.div>
          </div>
        </section>

        <section id="btv-runway" className="btv-runway-fluid">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="btv-runway-intro"
          >
            <div>
              <span className="btv-overline">THE MODEL SHOWCASE</span>
              <h2>DRAPED IN<br /><em>MOVEMENT.</em></h2>
            </div>
            <p>Experience how our drapes flow, catch the light, and move in real time with absolute grace and poise.</p>
          </motion.div>

          <div className="btv-runway-strip">
            <motion.div className="btv-runway-item" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>
              <div className="btv-runway-video-wrap">
                <video src={assets.modelVideo1} autoPlay muted loop playsInline className="btv-runway-vid" />
                <div className="btv-runway-gradient" />
              </div>
              <div className="btv-runway-details">
                <span>LOOK 01</span>
                <h3>The Silk Pallu Reveal</h3>
                <p>Fluid handwoven textures caught in motion.</p>
              </div>
            </motion.div>

            <motion.div className="btv-runway-item" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
              <div className="btv-runway-video-wrap">
                <video src={assets.modelVideo2} autoPlay muted loop playsInline className="btv-runway-vid" />
                <div className="btv-runway-gradient" />
              </div>
              <div className="btv-runway-details">
                <span>LOOK 02</span>
                <h3>Hand-Painted Canvases</h3>
                <p>Artisanal strokes draping across pure silk.</p>
              </div>
            </motion.div>

            <motion.div className="btv-runway-item" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }}>
              <div className="btv-runway-video-wrap">
                <video src={assets.modelVideo3} autoPlay muted loop playsInline className="btv-runway-vid" />
                <div className="btv-runway-gradient" />
              </div>
              <div className="btv-runway-details">
                <span>LOOK 03</span>
                <h3>Raga Tissue Shimmer</h3>
                <p>Gossamer metallic threads catching the evening sun.</p>
              </div>
            </motion.div>

            <motion.div className="btv-runway-item" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.4 }}>
              <div className="btv-runway-video-wrap">
                <video src={assets.modelVideo4} autoPlay muted loop playsInline className="btv-runway-vid" />
                <div className="btv-runway-gradient" />
              </div>
              <div className="btv-runway-details">
                <span>LOOK 04</span>
                <h3>Kalamkari Narratives</h3>
                <p>Earth tones and organic dye expressions in motion.</p>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="btv-story" className="btv-philosophy">
          <div className="btv-number">01</div>
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="btv-philosophy-title">
            <span className="btv-overline">OUR PHILOSOPHY</span>
            <h2>THE ART<br />OF THE <em>THREAD.</em></h2>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="btv-philosophy-copy">
            <span className="btv-rule" />
            <p className="btv-lead">We believe the most beautiful things retain evidence of the human hand.</p>
            <p>A line that is slightly irregular. A colour that breathes. A stitch that took time. Bhairavi Threads brings these quiet signatures of Indian textile craft into a modern wardrobe.</p>
          </motion.div>
        </section>

        <section id="btv-craft" className="btv-craft">
          <div className="btv-craft-media">
            <img src={assets.artisan} alt="Artisan working with textile" />
            <span>02 / THE HAND BEHIND IT</span>
          </div>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="btv-craft-content">
            <span className="btv-overline" style={{ color: '#666' }}>THE CRAFT</span>
            <h2>MADE<br /><em>SLOWLY.</em></h2>
            <h3>MEANT TO STAY.</h3>
            <p>From the loom to the painted border, every saree is shaped by patience, touch and intention. Craft is not decoration added later. It is the soul of the fabric.</p>
            <div className="btv-craft-seal">
              <strong>MADE</strong>
              <small>WITH INTENTION</small>
            </div>
          </motion.div>
        </section>

        <section id="btv-collections" className="btv-collections">
          <div className="btv-collections-head">
            <div>
              <span className="btv-overline">03 / THE COLLECTIONS</span>
              <h2>TEXTILES WITH<br /><em>A POINT OF VIEW.</em></h2>
            </div>
            <p>Six expressions of cloth. Each one carrying its own rhythm, colour and memory.</p>
          </div>

          <div className="btv-collection-list">
            {collectionsList.map((item, index) => (
              <motion.article
                key={item.id}
                className={`btv-collection-card ${index % 2 === 1 ? "dark" : ""}`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: .15 }}
                transition={{ duration: .7 }}
                onClick={() => setCurrentTab("store")}
              >
                <div className="btv-card-image">
                  <img src={item.image} alt={item.title} loading="lazy" />
                  <span>0{index + 1}</span>
                </div>
                <div className="btv-card-copy">
                  <span className="btv-card-kicker">{item.id}</span>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                  <button>DISCOVER ↗</button>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="btv-atlas">
          <div className="btv-atlas-heading">
            <span className="btv-overline">04 / THE TEXTILE ATLAS</span>
            <h2>CHOOSE A THREAD.<br /><em>ENTER ITS WORLD.</em></h2>
          </div>
          <div className="btv-atlas-body">
            <div className="btv-atlas-visual">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeTechnique.id}
                  src={activeTechnique.image}
                  alt={activeTechnique.title}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: .5 }}
                />
              </AnimatePresence>
              <div>
                <span>{activeTechnique.id}</span>
                <b>{activeTechnique.title}</b>
              </div>
            </div>
            <div className="btv-atlas-list">
              {collectionsList.map((item, index) => (
                <button
                  key={item.id}
                  className={activeTechnique.id === item.id ? "active" : ""}
                  onClick={() => setActiveTechnique(item)}
                >
                  <span>0{index + 1}</span>
                  <b>{item.title}</b>
                  <i>↗</i>
                </button>
              ))}
              <p>{activeTechnique.desc}</p>
            </div>
          </div>
        </section>

        <section className="btv-artisan">
          <div className="btv-artisan-heading">
            <span className="btv-overline">05 / THE ARTISAN</span>
            <h2>MADE BY HAND.<br /><em>CARRIED BY HEART.</em></h2>
          </div>
          <div className="btv-artisan-grid">
            <div className="btv-artisan-photo">
              <img src={assets.artisan} alt="Artisan textile work" loading="lazy" />
            </div>
            <div className="btv-artisan-copy">
              <p className="btv-lead">Every saree begins with a pair of hands.</p>
              <p>The weaver, painter, embroiderer and wearer become part of the same story. We keep that connection visible through fabric, movement and detail.</p>
            </div>
          </div>
        </section>

        <section id="btv-journal" className="btv-journal">
          <video src={assets.heroVideo} autoPlay muted loop playsInline />
          <div className="btv-journal-overlay" />
          <div className="btv-journal-copy">
            <span className="btv-overline">06 / A MOVING TEXTILE</span>
            <h2>WEAR THE<br /><em>STORY.</em></h2>
            <p>Movement, colour and the quiet luxury of something made by hand.</p>
          </div>
        </section>

        <section className="btv-manifesto">
          <span className="btv-overline">07 / WE BELIEVE</span>
          <div className="btv-manifesto-lines">
            <p>Craft should be <em>felt.</em></p>
            <p>Tradition can <em>evolve.</em></p>
            <p>Imperfection can be <em>beautiful.</em></p>
            <p>Every thread carries a <em>story.</em></p>
            <p>Every saree carries a <em>soul.</em></p>
          </div>
          <strong>THIS IS BHAIRAVI THREADS.</strong>
        </section>

        <section className="btv-final">
          <img src={assets.handpainted} alt="Hand-painted saree" />
          <div className="btv-final-shade" />
          <div className="btv-final-copy">
            <span className="btv-overline">YOUR STORY STARTS HERE</span>
            <h2>FIND YOUR<br /><em>THREAD.</em></h2>
            <div>
              <button onClick={() => setCurrentTab("store")}>EXPLORE COLLECTION ↗</button>
              <a href="#btv-story">OUR STORY ↗</a>
            </div>
          </div>
        </section>
      </main>

      <footer className="btv-footer">
        <div className="btv-footer-grid">
          <div>
            <span className="saree-brand-title-dark" style={{ fontSize: '22px' }}>BHAIRAVI THREADS</span>
            <p>Woven Stories. Painted Souls.</p>
          </div>
          <div className="btv-footer-links">
            <a href="#btv-collections">Collections</a>
            <a href="#btv-craft">Craft</a>
            <a href="#btv-story">Our Story</a>
            <a href="#btv-journal">Journal</a>
            <button onClick={() => setCurrentTab("store")}>Store ↗</button>
          </div>
          <div>
            <span className="btv-overline">JOIN THE JOURNAL</span>
            <div className="btv-footer-input">
              <input type="email" placeholder="Your email address" />
              <button onClick={() => alert("Thank you for joining!")}>↗</button>
            </div>
          </div>
        </div>
        <div className="btv-footer-bottom">
          <span>© {new Date().getFullYear()} Bhairavi Threads</span>
          <span>Made with patience · Pune, India</span>
          <span>Handcrafted for a modern wardrobe</span>
        </div>
      </footer>
    </div>
  );
}