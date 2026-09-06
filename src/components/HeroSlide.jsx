'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, Crosshair, ShieldCheck, Settings, Headphones, 
  Layers, Zap, Sliders, CheckCircle2, Wrench, Award, Cpu, MapPin 
} from 'lucide-react';

const iconMap = {
  Crosshair, ShieldCheck, Settings, Headphones, Layers,
  Zap, Sliders, CheckCircle2, Wrench, Award, Cpu, MapPin
};

export default function HeroSlide({ slide, isActive, onOpenQuote }) {
  const [imgSrc, setImgSrc] = useState(slide.image || '/images/machines/stirrup-bender-d4.jpg');

  const handleError = () => {
    if (slide.fallbackImage && imgSrc !== slide.fallbackImage) {
      setImgSrc(slide.fallbackImage);
    } else {
      setImgSrc('/images/machines/rebar-bending-machine.webp');
    }
  };

  const title = slide.title || (slide.headingLine1 ? `${slide.headingLine1} ${slide.headingLine2 || ''}` : 'Heavy Duty Construction Machinery');
  const description = slide.subtitle || slide.description || 'High performance B2B construction equipment manufactured in India with ex-factory pricing and 1-year warranty.';
  const badgeText = slide.badge || slide.eyebrow || 'R K GLOBAL ENGINEERING';
  const featuresList = slide.features && Array.isArray(slide.features) ? slide.features : [
    { icon: 'ShieldCheck', label: 'ISO 9001 Certified' },
    { icon: 'Award', label: 'Factory Direct Price' },
    { icon: 'Wrench', label: '1-Year Warranty' },
    { icon: 'CheckCircle2', label: 'Pan-India Delivery' }
  ];

  return (
    <div className="hero-slide-container">
      {/* Single unified row: text left, image right */}
      <div className="hero-slide-row">

        {/* LEFT: Text block */}
        <div className="hero-slide-text-col">

          {/* Badge */}
          <div style={{ marginBottom: '16px' }}>
            <span className="hero-slide-badge">
              {badgeText}
            </span>
          </div>

          {/* Headline */}
          <h1 className="hero-slide-title">
            {title}
          </h1>

          {/* Description */}
          <p className="hero-slide-desc">
            {description}
          </p>

          {/* Features */}
          <div className="hero-slide-features">
            {featuresList.map((feat, idx) => {
              const IconComp = iconMap[feat.icon] || ShieldCheck;
              return (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    backgroundColor: 'rgba(244,123,32,0.12)',
                    color: '#F47B20',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <IconComp size={13} />
                  </div>
                  <span style={{ fontSize: '0.83rem', fontWeight: 700, color: '#1A202C' }}>
                    {feat.label || feat.text}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Buttons */}
          <div className="hero-slide-btn-group">
            <button
              type="button"
              className="btn btn-primary hero-cta-btn"
              onClick={onOpenQuote}
            >
              <span>{slide.btnPrimaryText || 'Request Quote Now'}</span>
              <ArrowRight size={17} />
            </button>
            <Link
              href="/products"
              className="btn btn-outline hero-cta-btn"
              style={{ borderColor: '#0B1F33', color: '#0B1F33' }}
            >
              <span>{slide.btnSecondaryText || 'View 2026 Catalog'}</span>
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>

        {/* RIGHT: Image */}
        <div className="hero-slide-img-col">
          <img
            src={slide.image || imgSrc}
            alt={title}
            onError={handleError}
            className="hero-slide-img"
          />
        </div>

      </div>

      <style jsx>{`
        .hero-slide-container {
          display: flex;
          align-items: center;
          min-height: 560px;
          width: 100%;
          background-color: #FFFFFF;
          position: relative;
          overflow: hidden;
          border-bottom: 4px solid #F47B20;
        }
        .hero-slide-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 50px 60px;
          width: 100%;
          max-width: 1300px;
          margin: 0 auto;
          box-sizing: border-box;
        }
        .hero-slide-text-col {
          flex: 1 1 50%;
          padding-right: 40px;
        }
        .hero-slide-badge {
          background-color: #F47B20;
          color: #fff;
          font-size: 0.72rem;
          font-weight: 900;
          padding: 6px 16px;
          border-radius: 20px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          display: inline-block;
        }
        .hero-slide-title {
          font-size: clamp(1.85rem, 3.2vw, 3rem);
          font-weight: 900;
          line-height: 1.18;
          margin-bottom: 16px;
          color: #0B1F33;
        }
        .hero-slide-desc {
          font-size: 0.98rem;
          color: #4A5568;
          line-height: 1.65;
          margin-bottom: 24px;
        }
        .hero-slide-features {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px 20px;
          margin-bottom: 30px;
        }
        .hero-slide-btn-group {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
        }
        .hero-cta-btn {
          padding: 13px 26px;
          font-size: 0.92rem;
          border-radius: 8px;
        }
        .hero-slide-img-col {
          flex: 1 1 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .hero-slide-img {
          max-width: 100%;
          max-height: 440px;
          width: auto;
          height: auto;
          object-fit: contain;
          mix-blend-mode: multiply;
        }

        @media (max-width: 992px) {
          .hero-slide-container {
            min-height: auto;
          }
          .hero-slide-row {
            flex-direction: column-reverse;
            padding: 36px 20px;
            gap: 28px;
          }
          .hero-slide-text-col {
            padding-right: 0;
            width: 100%;
            text-align: center;
          }
          .hero-slide-title {
            font-size: clamp(1.6rem, 5vw, 2.4rem);
          }
          .hero-slide-features {
            justify-content: center;
            grid-template-columns: repeat(2, minmax(130px, 1fr));
            text-align: left;
            max-width: 480px;
            margin: 0 auto 28px;
          }
          .hero-slide-btn-group {
            justify-content: center;
          }
          .hero-slide-img-col {
            width: 100%;
          }
          .hero-slide-img {
            max-height: 320px;
          }
        }

        @media (max-width: 540px) {
          .hero-slide-row {
            padding: 24px 14px;
            gap: 20px;
          }
          .hero-slide-title {
            font-size: clamp(1.4rem, 6vw, 1.85rem);
            margin-bottom: 12px;
          }
          .hero-slide-desc {
            font-size: 0.88rem;
            margin-bottom: 18px;
          }
          .hero-slide-features {
            grid-template-columns: 1fr;
            gap: 10px;
            margin-bottom: 22px;
          }
          .hero-slide-btn-group {
            flex-direction: column;
            width: 100%;
            gap: 10px;
          }
          .hero-cta-btn {
            width: 100%;
            justify-content: center;
          }
          .hero-slide-img {
            max-height: 240px;
          }
        }
      `}</style>
    </div>
  );
}
