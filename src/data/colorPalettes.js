export const colorPalettes = [
    {
        id: 'sunset',
        name: 'Atardecer Dorado',
        accent: '#f59e0b',
        accentDark: '#b45309',
        accentLight: '#fbbf24',
        accentGlow: 'rgba(245, 158, 11, 0.4)',
        gradientAccent: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        gradientBlue: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        gradientGreen: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        gradientPurple: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
        gradientRed: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        blue: '#3b82f6',
        green: '#10b981',
        purple: '#8b5cf6',
        red: '#ef4444',
        bgMain: '#0f172a',
        bgSidebar: '#1e293b',
        bgCard: 'rgba(30, 41, 59, 0.7)'
    }
];

export const defaultPalette = colorPalettes[0];

export const getPaletteById = (id) => {
    return colorPalettes.find(p => p.id === id) || defaultPalette;
};

export const getAllPalettes = () => colorPalettes;
