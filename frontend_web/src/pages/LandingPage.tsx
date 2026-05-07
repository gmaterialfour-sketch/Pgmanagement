import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Shield, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <section className="hero">
        <div className="container hero-content">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1>Manage Your Property with <span className="text-gradient">Ease</span></h1>
            <p className="hero-subtitle">
              The all-in-one platform for landlords and tenants. Track payments, manage documents, and automate your rental business.
            </p>
            <div className="hero-cta">
              <Link to="/register" className="btn btn-primary btn-lg">
                Get Started for Free <ArrowRight size={20} />
              </Link>
              <Link to="/login" className="btn btn-secondary btn-lg">
                View Demo
              </Link>
            </div>
          </motion.div>
          
          <motion.div 
            className="hero-image"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="mockup-card">
              <div className="mockup-header">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
              <div className="mockup-body">
                <div className="mockup-chart"></div>
                <div className="mockup-list">
                  <div className="mockup-item"></div>
                  <div className="mockup-item"></div>
                  <div className="mockup-item"></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="features container">
        <div className="feature-card">
          <Zap className="feature-icon" />
          <h3>Automated Rent</h3>
          <p>Schedule rent reminders and automate payment tracking effortlessly.</p>
        </div>
        <div className="feature-card">
          <Shield className="feature-icon" />
          <h3>Secure Payments</h3>
          <p>Integrated payment gateways with bank-grade security for your peace of mind.</p>
        </div>
        <div className="feature-card">
          <CheckCircle className="feature-icon" />
          <h3>Easy Management</h3>
          <p>Manage multiple properties and tenants from a single intuitive dashboard.</p>
        </div>
      </section>

      <style>{`
        .landing-page {
          padding-bottom: 5rem;
        }
        .hero {
          padding: 6rem 0;
          background: radial-gradient(circle at top right, #eef2ff 0%, #ffffff 50%);
          overflow: hidden;
        }
        .hero-content {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 4rem;
          align-items: center;
        }
        h1 {
          font-size: 4rem;
          line-height: 1.1;
          margin-bottom: 1.5rem;
          color: #0f172a;
        }
        .text-gradient {
          background: linear-gradient(to right, var(--primary), #818cf8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .hero-subtitle {
          font-size: 1.25rem;
          color: var(--text-muted);
          margin-bottom: 2.5rem;
          max-width: 540px;
        }
        .hero-cta {
          display: flex;
          gap: 1rem;
        }
        .btn-lg {
          padding: 0.875rem 2rem;
          font-size: 1.125rem;
        }
        .btn-secondary {
          background: white;
          border: 1px solid var(--border);
          color: var(--text-main);
        }
        .mockup-card {
          background: white;
          border-radius: 1rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
          border: 1px solid var(--border);
          width: 100%;
          aspect-ratio: 16/10;
        }
        .mockup-header {
          padding: 1rem;
          border-bottom: 1px solid var(--border);
          display: flex;
          gap: 0.5rem;
        }
        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #e2e8f0;
        }
        .mockup-body {
          padding: 2rem;
        }
        .mockup-chart {
          height: 100px;
          background: linear-gradient(90deg, #f1f5f9 0%, #e2e8f0 100%);
          border-radius: 0.5rem;
          margin-bottom: 1.5rem;
        }
        .mockup-item {
          height: 20px;
          background: #f1f5f9;
          border-radius: 4px;
          margin-bottom: 1rem;
          width: 80%;
        }
        .features {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          margin-top: -4rem;
        }
        .feature-card {
          background: white;
          padding: 2.5rem;
          border-radius: 1.25rem;
          border: 1px solid var(--border);
          box-shadow: var(--shadow);
          transition: transform 0.3s ease;
        }
        .feature-card:hover {
          transform: translateY(-10px);
        }
        .feature-icon {
          color: var(--primary);
          width: 40px;
          height: 40px;
          margin-bottom: 1.5rem;
        }
        .feature-card h3 {
          margin-bottom: 1rem;
          font-size: 1.5rem;
        }
        .feature-card p {
          color: var(--text-muted);
        }
        @media (max-width: 968px) {
          .hero-content {
            grid-template-columns: 1fr;
            text-align: center;
          }
          .hero-subtitle {
            margin-left: auto;
            margin-right: auto;
          }
          .hero-cta {
            justify-content: center;
          }
          .features {
            grid-template-columns: 1fr;
            margin-top: 2rem;
          }
          h1 {
            font-size: 3rem;
          }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
