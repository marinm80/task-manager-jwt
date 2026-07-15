import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PublicHeader from '../components/layout/PublicHeader';
import PublicFooter from '../components/layout/PublicFooter';
import Hero from '../components/landing/Hero';
import SocialProof from '../components/landing/SocialProof';
import Benefits from '../components/landing/Benefits';
import HowItWorks from '../components/landing/HowItWorks';
import ProductShowcase from '../components/landing/ProductShowcase';
import Pricing from '../components/landing/Pricing';
import Testimonial from '../components/landing/Testimonial';
import Faq from '../components/landing/Faq';
import FinalCta from '../components/landing/FinalCta';

// Orquestador de la landing pública (RF-01/RF-04). Integra todas las
// secciones del Grupo 4 en el orden exacto fijado por RF-04: navegación,
// hero, prueba social, beneficios, cómo funciona, producto, precios,
// testimonio, FAQ, CTA final y footer.
//
// Es la única pieza de este grupo que lee Redux directamente (D-09): resuelve
// RF-06 leyendo `accessToken` del store para decidir el destino de "Ver demo
// en vivo" — `/dashboard` si hay sesión activa, `/login` si no. Nunca abre un
// modal de autenticación simulada.
export default function LandingPage() {
  const navigate = useNavigate();
  const accessToken = useSelector((state) => state.auth.accessToken);

  const handleViewDemoClick = useCallback(() => {
    navigate(accessToken ? '/dashboard' : '/login');
  }, [accessToken, navigate]);

  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <main>
        <Hero onSecondaryCtaClick={handleViewDemoClick} />
        <SocialProof />
        <Benefits />
        <HowItWorks />
        <ProductShowcase />
        <Pricing />
        <Testimonial />
        <Faq />
        <FinalCta />
      </main>
      <PublicFooter />
    </div>
  );
}
