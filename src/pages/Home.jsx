import { Link } from 'react-router-dom'

function Home() {
  return (
    <>
      {/* ================================
          NAVBAR
      ================================= */}
      <header className="navbar">
        <div className="container nav-container">

          <Link to="/" className="logo">
            <span className="logo-mark">P</span>
            <span className="logo-text">PhotoShare</span>
          </Link>

          <nav className="nav-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#gallery">Gallery</a>
            <a href="#about">About</a>
          </nav>

          <div className="nav-actions">
            <Link to="/login" className="login-link">
              Login
            </Link>

            <Link to="/register" className="nav-button">
              Get Started
            </Link>
          </div>

        </div>
      </header>


      <main>

        {/* ================================
            HERO
        ================================= */}
        <section className="hero">

          <div className="hero-background"></div>

          <div className="container hero-container">

            <div className="hero-content">

              <div className="hero-badge">
                <span className="status-dot"></span>
                Professional Event Photo Sharing
              </div>

              <h1>
                Share Every
                <span>Moment</span>
              </h1>

              <p className="hero-description">
                A simple and powerful platform for photography teams
                to upload, manage, review, and share event photos
                with customers.
              </p>

              <div className="hero-actions">

                <Link to="/login" className="primary-button">
                  Start Sharing →
                </Link>

                <a
                  href="#how-it-works"
                  className="secondary-button"
                >
                  Learn More
                </a>

              </div>

              <p className="hero-note">
                Built for photography and event teams.
              </p>

            </div>


            {/* HERO VISUAL */}
            <div className="hero-visual">

              <div className="photo-card-main">

                <img
                  src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=85"
                  alt="Wedding photography"
                />

                <div className="photo-overlay">

                  <div>
                    <strong>Wedding Memories</strong>
                    <span>Beautiful moments captured</span>
                  </div>

                  <div className="photo-status">
                    Published
                  </div>

                </div>

              </div>


              {/* UPLOAD CARD */}
              <div className="floating-card upload-card">

                <div className="floating-icon">
                  ↑
                </div>

                <div>
                  <strong>Photos Uploaded</strong>
                  <span>Multiple photos at once</span>
                </div>

              </div>


              {/* GALLERY CARD */}
              <div className="floating-card gallery-card">

                <div className="gallery-mini-images">

                  <img
                    src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=100&q=80"
                    alt="Event"
                  />

                  <img
                    src="https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?auto=format&fit=crop&w=100&q=80"
                    alt="Wedding"
                  />

                  <img
                    src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=100&q=80"
                    alt="Celebration"
                  />

                </div>

                <div>
                  <strong>Customer Gallery</strong>
                  <span>Protected with PIN</span>
                </div>

              </div>

            </div>

          </div>

        </section>


        {/* ================================
            INTRO
        ================================= */}
        <section id="about" className="intro">

          <div className="container intro-container">

            <span className="intro-label">
              PHOTOS MADE SIMPLE
            </span>

            <h2>
              From capturing moments to sharing memories.
            </h2>

            <p>
              PhotoShare gives photography teams one place to
              manage events, upload photos, review selections,
              and deliver beautiful galleries to customers.
            </p>

          </div>

        </section>


        {/* ================================
            FEATURES
        ================================= */}
        <section id="features" className="section features">

          <div className="container">

            <div className="section-heading">

              <span className="section-label">
                FEATURES
              </span>

              <h2>
                Everything your photo team needs.
              </h2>

              <p>
                Manage your complete event photography workflow
                from one place.
              </p>

            </div>


            <div className="feature-grid">

              {/* FEATURE 01 */}
              <div className="feature-card">

                <span className="feature-number">
                  01
                </span>

                <div className="feature-icon">
                  📅
                </div>

                <h3>
                  Event Management
                </h3>

                <p>
                  Create and manage photography events,
                  event details, and team assignments.
                </p>

                <Link to="/login">
                  Manage Events →
                </Link>

              </div>


              {/* FEATURE 02 */}
              <div className="feature-card">

                <span className="feature-number">
                  02
                </span>

                <div className="feature-icon">
                  📷
                </div>

                <h3>
                  Photo Uploads
                </h3>

                <p>
                  Upload multiple event photos and keep
                  everything organized in one place.
                </p>

                <Link to="/login">
                  Upload Photos →
                </Link>

              </div>


              {/* FEATURE 03 */}
              <div className="feature-card">

                <span className="feature-number">
                  03
                </span>

                <div className="feature-icon">
                  🖼️
                </div>

                <h3>
                  Gallery Management
                </h3>

                <p>
                  Review photos, select the best moments,
                  and publish customer galleries.
                </p>

                <Link to="/login">
                  Manage Galleries →
                </Link>

              </div>

            </div>

          </div>

        </section>


        {/* ================================
            WORKFLOW
        ================================= */}
        <section id="how-it-works" className="section workflow">

          <div className="container">

            <div className="section-heading">

              <span className="section-label">
                HOW IT WORKS
              </span>

              <h2>
                From event to gallery.
              </h2>

              <p>
                A simple workflow for photography teams.
              </p>

            </div>


            <div className="workflow-grid">

              {/* STEP 01 */}
              <div className="workflow-step">

                <div className="step-number">
                  01
                </div>

                <h3>
                  Create Event
                </h3>

                <p>
                  Admin creates an event and adds
                  photography team members.
                </p>

              </div>


              <div className="workflow-line"></div>


              {/* STEP 02 */}
              <div className="workflow-step">

                <div className="step-number">
                  02
                </div>

                <h3>
                  Upload Photos
                </h3>

                <p>
                  Team members upload photos taken
                  during the event.
                </p>

              </div>


              <div className="workflow-line"></div>


              {/* STEP 03 */}
              <div className="workflow-step">

                <div className="step-number">
                  03
                </div>

                <h3>
                  Review & Select
                </h3>

                <p>
                  Admin reviews uploaded photos and
                  prepares the customer gallery.
                </p>

              </div>


              <div className="workflow-line"></div>


              {/* STEP 04 */}
              <div className="workflow-step">

                <div className="step-number">
                  04
                </div>

                <h3>
                  Share Gallery
                </h3>

                <p>
                  Customer receives a shareable gallery
                  link protected by a PIN.
                </p>

              </div>

            </div>

          </div>

        </section>


        {/* ================================
            GALLERY PREVIEW
        ================================= */}
        <section id="gallery" className="section gallery-preview">

          <div className="container">

            <div className="gallery-header">

              <div>

                <span className="section-label">
                  CUSTOMER GALLERY
                </span>

                <h2>
                  Beautiful galleries made for sharing.
                </h2>

              </div>

              <p>
                Once your team finishes reviewing an event,
                publish a protected gallery that customers
                can access through a private link and PIN.
              </p>

            </div>


            <div className="gallery-grid">

              <div className="gallery-item gallery-large">

                <img
                  src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1000&q=85"
                  alt="Wedding celebration"
                />

              </div>


              <div className="gallery-item">

                <img
                  src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=700&q=85"
                  alt="Wedding couple"
                />

              </div>


              <div className="gallery-item">

                <img
                  src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=700&q=85"
                  alt="Wedding event"
                />

              </div>


              <div className="gallery-item">

                <img
                  src="https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?auto=format&fit=crop&w=700&q=85"
                  alt="Wedding ceremony"
                />

              </div>


              <div className="gallery-item">

                <img
                  src="https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=700&q=85"
                  alt="Wedding photography"
                />

              </div>

            </div>


            <div className="gallery-protection">

              <div className="protection-icon">
                🔐
              </div>

              <div>

                <strong>
                  Private and protected
                </strong>

                <p>
                  Customers access their gallery through
                  a shareable link and secure PIN.
                </p>

              </div>

            </div>

          </div>

        </section>


        {/* ================================
            CTA
        ================================= */}
        <section className="cta">

          <div className="container cta-container">

            <div>

              <span className="section-label light">
                GET STARTED
              </span>

              <h2>
                Ready to share your moments?
              </h2>

              <p>
                Start managing your photography events
                and galleries today.
              </p>

            </div>


            <div className="cta-actions">

              <Link
                to="/register"
                className="cta-primary"
              >
                Create Account →
              </Link>

              <Link
                to="/login"
                className="cta-secondary"
              >
                Login
              </Link>

            </div>

          </div>

        </section>

      </main>


      {/* ================================
          FOOTER
      ================================= */}
      <footer className="footer">

        <div className="container footer-container">

          <div className="footer-brand">

            <Link to="/" className="logo footer-logo">

              <span className="logo-mark">
                P
              </span>

              <span className="logo-text">
                PhotoShare
              </span>

            </Link>

            <p>
              Making event photo sharing simple.
            </p>

          </div>


          <div className="footer-links">

            <a href="#features">
              Features
            </a>

            <a href="#how-it-works">
              How It Works
            </a>

            <a href="#gallery">
              Gallery
            </a>

            <a href="#about">
              About
            </a>

            <Link to="/login">
              Login
            </Link>

          </div>


          <p className="footer-copy">
            © {new Date().getFullYear()} PhotoShare.
            All rights reserved.
          </p>

        </div>

      </footer>
    </>
  )
}

export default Home