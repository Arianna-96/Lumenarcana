import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

/**
 * Maps every human-readable asset filename in src/assets/ back to the
 * original figma:asset/<hash>.png virtual module so the Figma Make asset
 * resolver can serve them.  This lets all source files use clean local
 * imports (e.g. "../../assets/card-back.png") instead of opaque hashes,
 * while still resolving correctly at build time.
 */
function figmaAssetMapper() {
  const ASSET_MAP: Record<string, string> = {
    // ── Background / UI ──────────────────────────────────────────────────
    'noise-texture.png':          'figma:asset/06fee90265c62de6a6e3fb89b341c45b439a08b9.png',
    'noise-texture-2.png':        'figma:asset/b42f23b75535bf4f39dd7f3cc65c12c590b2d488.png',
    // ── Card backs ──────────────────────────────────────────────────────
    'card-back.png':              'figma:asset/7133d78ef8afb52858f4e053f0468225d2216220.png',
    'card-back-alt.png':          'figma:asset/89a25bd313de2c5f9f6ed86cc70834000108cb8c.png',
    // ── Zodiac signs ─────────────────────────────────────────────────────
    'zodiac-aries.png':           'figma:asset/a780b72891f9a9894fb960fa2100006487547eca.png',
    'zodiac-taurus.png':          'figma:asset/8194b14f700563f5013a983f8391dcd9a48c0d87.png',
    'zodiac-gemini.png':          'figma:asset/d972e8ca39891d5f3841664e3894d455591e21c3.png',
    'zodiac-cancer.png':          'figma:asset/eb95a79da87f1dd7b252ff340819059f5bbf2333.png',
    'zodiac-leo.png':             'figma:asset/5889b14e3375786a31e16aba6613479e691a6099.png',
    'zodiac-virgo.png':           'figma:asset/d235001dabbc9fac1504720416cc209dd0e0b788.png',
    'zodiac-libra.png':           'figma:asset/66c91c1669635a8911518677df67957c8bedc29d.png',
    'zodiac-scorpio.png':         'figma:asset/2e3c75d10814e4611a8b1e14845f48d2b32c4b5a.png',
    'zodiac-sagittarius.png':     'figma:asset/12da9aab2d51820c656fa81b61a676582a66daef.png',
    'zodiac-capricorn.png':       'figma:asset/ae77802d2734b6b1a1b6a7c9db2b4e9f5473e815.png',
    'zodiac-aquarius.png':        'figma:asset/8786fcf48ed329d84094a919c7c349aef60d817a.png',
    'zodiac-pisces.png':          'figma:asset/9715616bb5f8d120266e3b1d85fa458b68c0e30d.png',
    // ── Tarot illustrations ───────────────────────────────────────────────
    'tarot-fool.png':             'figma:asset/ca93e22a3857ab460cde4683dc42f434ad324002.png',
    'tarot-magician.png':         'figma:asset/efa9104f49bda5d3dc9f34b3ceacf7e8dcb813bd.png',
    'tarot-high-priestess.png':   'figma:asset/e385ff419c76beadc4eda85b473a2c01df95d45a.png',
    'tarot-empress.png':          'figma:asset/ba410538a70a5351c7e5a2339bdccefb53961595.png',
    'tarot-emperor.png':          'figma:asset/234cb090b5e1bd6d453b9dbf8af8758cc090b5d6.png',
    'tarot-hierophant.png':       'figma:asset/7a5e3a23951e95f8b0e272b757170d911ae4c513.png',
    'tarot-strength.png':         'figma:asset/1860db53d65fe495539bb80862bbed9b4ac15089.png',
    'tarot-hermit.png':           'figma:asset/e25ae0f22102f1d52b47fa62323d467496da8cbd.png',
    'tarot-wheel-of-fortune.png': 'figma:asset/d1b282476e8968dd1221be8c3a3647a404659fb0.png',
    'tarot-hanged-man.png':       'figma:asset/6c83da25331c967ef04b1165cc8f856ff5e135ae.png',
    'tarot-death.png':            'figma:asset/3eb0be2855753bdadaa8d438d7334c16a603debf.png',
    'tarot-temperance.png':       'figma:asset/5aff86b2f83c15e444d8a30219ef282e229609a5.png',
    'tarot-devil.png':            'figma:asset/56938326b49e61324a11acfe6b75e8a5ecb0521f.png',
    'tarot-tower.png':            'figma:asset/3b64894ef62f5e4472eed57d190094424067faf4.png',
    'tarot-star.png':             'figma:asset/4eb2d49e8d726110fe49125fc1f9782a69e14bc7.png',
    'tarot-sun.png':              'figma:asset/4f43842a3f82898228354d098195fc3f08b4fc5a.png',
    'tarot-judgement.png':        'figma:asset/8db4718c9395ca4e0bfc88caa67310d3fb5d8e8f.png',
    'tarot-world.png':            'figma:asset/62df1a687f4c2e303312bcaa70631b775f25f91c.png',
  };

  // Matches any import whose path ends in /assets/<filename>.png
  const ASSETS_RE = /(?:^|[/\\])assets[/\\]([^/\\]+\.png)$/;

  return {
    name: 'figma-asset-mapper',
    enforce: 'pre' as const,
    resolveId(id: string) {
      const match = id.match(ASSETS_RE);
      if (match) {
        const filename = match[1];
        const figmaId = ASSET_MAP[filename];
        if (figmaId) return { id: figmaId, external: false };
      }
    },
  };
}

export default defineConfig({
  plugins: [
    figmaAssetMapper(),
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})