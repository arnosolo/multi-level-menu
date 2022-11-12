import {
    defineConfig,
    presetAttributify,
    presetIcons,
    presetTypography,
    presetUno,
    presetWebFonts,
    transformerDirectives,
    transformerVariantGroup,
} from 'unocss';

export default defineConfig({
    theme: {
        colors: {
            primary: '#5983FF',
            error: '#FA665E',
        },
    },
    shortcuts: [
        ['btn', 'px-4 py-1 rounded bg-teal-700 text-white hover:bg-teal-800 disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50'],
    ],
    presets: [
        presetUno(),
        presetAttributify(),
        presetIcons({
            scale: 1,
            warn: true,
        }),
        presetTypography(),
        presetWebFonts({
            fonts: {
                sans: 'DM Sans',
                serif: ['DM Serif Display', 'Source Serif Pro'],
                mono: 'DM Mono',
                helvetica: 'Helvetica',
            },
        }),
    ],
    transformers: [
        transformerDirectives(),
        transformerVariantGroup(),
    ],
    safelist: 'prose prose-sm m-auto text-left'.split(' '),
});
