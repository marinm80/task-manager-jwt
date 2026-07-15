// Módulo único de copy de landing (D-08 de plan.md). Toda sección de
// `components/landing/` (Grupo 4, fuera del alcance de esta tarea) debe leer
// su texto de aquí en vez de hardcodearlo en JSX, para que la verificación
// palabra por palabra contra el handoff se haga en un solo lugar.
//
// Procedencia del copy (trazabilidad para QA manual de T-013 y @code-reviewer):
// - El título/descripción/CTAs del hero son literales de `spec.md` RF-03
//   (que a su vez cita `DESIGN_HANDOFF.md` → sección "Hero").
// - El orden y la existencia de las 11 secciones vienen de `spec.md` RF-04 /
//   `DESIGN_HANDOFF.md` → sección "Landing".
// - Los enlaces obligatorios de footer (Privacidad/Términos/Soporte) vienen
//   de `spec.md` RF-09.
// - `DESIGN_HANDOFF.md` fija el tono y la estructura de cada sección pero no
//   incluye el texto literal de beneficios/cómo-funciona/producto/precios/
//   testimonio/FAQ/footer con ese nivel de detalle (montos de precio,
//   preguntas de FAQ, cita del testimonio, marcas de prueba social). Para
//   esas piezas se usa, palabra por palabra, el prototipo de referencia
//   `taskly-design-handoff/reference-source/page.tsx` — el mismo paquete de
//   diseño aprobado (ver `.state.json → source_documents`), que es la única
//   fuente que contiene ese copy exacto en español.

// --- Hero (RF-03: título/descripción/CTAs literales y obligatorios) ---
export const heroContent = {
  eyebrow: 'NUEVO',
  eyebrowHighlight: 'Ahora con recordatorios inteligentes',
  title: 'Organiza tu trabajo. Termina más.',
  description:
    'Taskly te ayuda a planear, priorizar y terminar tareas sin complicaciones. Para ti y para el equipo con el que haces que las cosas pasen.',
  ctaPrimaryLabel: 'Empieza gratis',
  ctaSecondaryLabel: 'Ver demo en vivo',
  supportText: 'Gratis para siempre · Sin tarjeta · Configura en 2 minutos',
  proofRating: '★★★★★',
  proofText: '4.9 por más de 2,000 equipos',
  proofAvatars: ['LM', 'AR', 'JS', '+2k'],
};

// --- Prueba social ---
export const socialProofContent = {
  eyebrow: 'EQUIPOS QUE HACEN MÁS CON TASKLY',
  logos: ['Northstar', '△ vertex', 'loomly', 'MONO', 'bright.'],
};

// --- Beneficios (4 tarjetas numeradas, RF-04) ---
export const benefitsContent = {
  eyebrow: 'TODO BAJO CONTROL',
  title: 'Menos caos. Más trabajo bien hecho.',
  description:
    'Una experiencia pensada para que pases menos tiempo organizando tareas y más tiempo avanzando.',
  items: [
    {
      number: '01',
      title: 'Claridad sin esfuerzo',
      description:
        'Prioriza el trabajo importante y entiende qué sigue con una interfaz limpia y veloz.',
    },
    {
      number: '02',
      title: 'Tu equipo, sincronizado',
      description:
        'Comparte proyectos, asigna responsables y mantén cada decisión en un solo lugar.',
    },
    {
      number: '03',
      title: 'Seguridad de verdad',
      description:
        'Sesiones protegidas, permisos por rol y autenticación en dos pasos cuando la necesites.',
    },
    {
      number: '04',
      title: 'Crece a tu ritmo',
      description:
        'Empieza gratis y suma proyectos, automatizaciones y personas cuando tu equipo avance.',
    },
  ],
};

// --- Cómo funciona (3 pasos, fondo verde bosque, RF-04) ---
export const howItWorksContent = {
  eyebrow: 'LISTO EN MINUTOS',
  title: 'De la idea al trabajo terminado.',
  steps: [
    {
      number: '1',
      title: 'Crea tu espacio',
      description: 'Regístrate gratis y elige cómo prefieres organizar tu trabajo.',
    },
    {
      number: '2',
      title: 'Ordena tus prioridades',
      description: 'Crea proyectos, añade tareas y decide qué necesita atención.',
    },
    {
      number: '3',
      title: 'Avanza en equipo',
      description: 'Asigna, comenta y celebra cada objetivo que completan juntos.',
    },
  ],
};

// --- Bloque destacado de producto ---
export const productContent = {
  eyebrow: 'TU DÍA, A TU MANERA',
  title: 'Todo lo que necesitas. Nada que te distraiga.',
  description:
    'Una vista clara de tu trabajo, con herramientas potentes cuando las necesitas y calma cuando no.',
  features: [
    {
      title: 'Lista y tablero Kanban',
      description: 'Cambia de perspectiva sin perder el contexto.',
    },
    {
      title: 'Filtros que sí ayudan',
      description: 'Encuentra lo urgente por fecha, etiqueta o responsable.',
    },
    {
      title: 'Recordatorios oportunos',
      description: 'Taskly te avisa sin convertirse en ruido.',
    },
  ],
  linkLabel: 'Explorar todas las funciones →',
};

// --- Precios (RF-04/RF-07: informativo, ningún CTA ejecuta cobro real) ---
// Encabezado de sección aparte de los planes: `pricingPlans` se mantiene
// como arreglo puro (nombre fijado por tasks.md T-013) para que quien
// consuma los 3 planes no tenga que desestructurar un objeto envolvente.
export const pricingSectionContent = {
  eyebrow: 'PRECIOS SIMPLES',
  title: 'Empieza gratis. Crece cuando quieras.',
  subtitle: 'Sin costes ocultos. Cancela o cambia de plan en cualquier momento.',
};

export const pricingPlans = [
  {
    name: 'Free',
    price: '$0',
    note: 'Para organizarte mejor',
    features: ['3 proyectos activos', 'Hasta 100 tareas', 'Vista lista y Kanban'],
    ctaLabel: 'Empieza gratis',
    featured: false,
  },
  {
    name: 'Pro',
    price: '$9',
    note: 'por usuario / mes',
    features: ['Proyectos ilimitados', 'Recordatorios y filtros', '14 días de prueba'],
    ctaLabel: 'Prueba Pro 14 días',
    featured: true,
    badge: 'MÁS ELEGIDO',
  },
  {
    name: 'Team',
    price: '$16',
    note: 'por usuario / mes',
    features: ['Roles y permisos', 'Historial completo', 'Soporte prioritario'],
    ctaLabel: 'Elegir Team',
    featured: false,
  },
];

// --- Testimonio ---
export const testimonialContent = {
  quote:
    'Taskly nos devolvió algo que habíamos perdido: saber exactamente qué importa cada día. El equipo se adaptó sin una sola reunión de formación.',
  authorName: 'Elena Campos',
  authorRole: 'COO en Northstar Studio',
  authorInitials: 'EC',
};

// --- FAQ (RF-08: acordeón accesible con details/summary) ---
// `faqItems` se mantiene como arreglo puro porque `Faq.jsx` (T-026, fuera
// de esta tarea) lo usa como valor por defecto directo de su prop
// `items? = faqItems` (contrato fijado en plan.md).
export const faqSectionContent = {
  eyebrow: 'PREGUNTAS FRECUENTES',
  title: 'Todo claro antes de empezar.',
  supportText: '¿Necesitas algo más?',
  supportLinkLabel: 'Habla con nuestro equipo',
  supportEmail: 'soporte@taskly.app',
};

export const faqItems = [
  {
    question: '¿Mis datos están seguros?',
    answer:
      'Sí. Protegemos tus sesiones, ciframos la información en tránsito y ofrecemos autenticación en dos pasos.',
  },
  {
    question: '¿Puedo cancelar cuando quiera?',
    answer:
      'Claro. No hay permanencia y conservarás tu plan hasta terminar el periodo facturado.',
  },
  {
    question: '¿Taskly funciona para equipos remotos?',
    answer:
      'Sí. Roles, comentarios y actividad mantienen al equipo alineado desde cualquier lugar.',
  },
  {
    question: '¿Necesito tarjeta para probar Pro?',
    answer: 'No. Puedes probar todas las funciones Pro durante 14 días sin añadir una tarjeta.',
  },
];

// --- CTA final ---
export const finalCtaContent = {
  eyebrow: 'TU PRÓXIMO LOGRO EMPIEZA AQUÍ',
  title: 'Haz espacio para lo que importa.',
  description: 'Únete a miles de personas que ya trabajan con más calma y claridad.',
  ctaLabel: 'Empieza gratis',
};

// --- Footer (RF-09: Privacidad/Términos/Soporte obligatorios + columnas
// Producto/Compañía/Recursos del handoff) ---
export const footerLinks = {
  tagline: 'Trabajo claro. Equipos imparables.',
  columns: [
    {
      title: 'Producto',
      links: [
        { label: 'Funciones', href: '#beneficios' },
        { label: 'Precios', href: '#precios' },
        { label: 'Demo', href: '#producto' },
      ],
    },
    {
      title: 'Compañía',
      links: [
        { label: 'Sobre nosotros', href: '#como-funciona' },
        { label: 'Blog', href: '#' },
        { label: 'Contacto', href: '#' },
      ],
    },
    {
      // El prototipo de referencia usa "Centro de ayuda" en esta columna;
      // se sustituye por "Soporte" porque `spec.md` RF-09 exige ese
      // literal exacto como uno de los 3 enlaces obligatorios del footer
      // (spec.md es la fuente de verdad de requisitos, por encima del
      // prototipo visual de referencia).
      title: 'Recursos',
      links: [
        { label: 'Privacidad', href: '#' },
        { label: 'Términos', href: '#' },
        { label: 'Soporte', href: '#' },
      ],
    },
  ],
  copyright: '© 2026 Taskly. Hecho para avanzar.',
};
