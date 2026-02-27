const vipPlansDefault = [
    {
        id: 'standard',
        name: 'Estándar',
        price: 0,
        description: 'Plan básico para comenzar en el mundo del trading.',
        duration: 'Permanente',
        benefits: ['Acceso a la plataforma', 'Gráficos en tiempo real', 'Soporte comunitario']
    },
    {
        id: 'gold',
        name: 'Oro',
        price: 49.99,
        description: 'Ideal para traders que buscan herramientas avanzadas.',
        duration: 'Mensual',
        benefits: ['Señales de trading básicas', 'Acceso a webinar semanal', 'Soporte prioritario']
    },
    {
        id: 'diamond',
        name: 'Diamante',
        price: 99.99,
        description: 'La experiencia completa para profesionales.',
        duration: 'Mensual',
        benefits: ['Señales VIP de alta precisión', 'Mentoría 1 a 1', 'Gestión de cartera avanzada']
    }
];

export default vipPlansDefault;
