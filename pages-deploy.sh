#!/bin/bash
# Este script NO hace nada intencionalmente
# Cloudflare Pages debe deployar automáticamente después del build
# Si este script se ejecuta, significa que hay un "deploy command" configurado incorrectamente
echo "✅ Build completed successfully"
echo "⚠️  WARNING: Deploy command should be empty for Cloudflare Pages"
echo "📝 Please remove 'npx wrangler deploy' from Cloudflare dashboard settings"
echo ""
echo "Go to: Settings → Build & deployments → Edit configuration"
echo "Set Deploy command to: (empty)"
exit 0
