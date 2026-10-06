#!/usr/bin/env bash
# Graphify kod haritasini tazeler: AST grafi + semantik katman + topluluk adlari + KOD_HARITASI.md
# Kullanim: bash scripts/graphify/guncelle.sh
# Guvenlik (Security OS karari, 06.10.2026): surum 0.9.77 sabit; yalniz --code-only (yerel AST);
# API anahtarlari ortamdan silinir; hook/skill kurulmaz; .env ve veri haritaya girmez (.graphifyignore).
set -euo pipefail
KOK="$(cd "$(dirname "$0")/../.." && pwd)"
PROJE="$(basename "$KOK")"
SURUM="0.9.77"
BURADA="$(cd "$(dirname "$0")" && pwd)"
VENV="${GRAPHIFY_VENV:-$HOME/.graphify-venv}"
if [ ! -x "$VENV/bin/graphify" ] || ! "$VENV/bin/python" -I -c "import importlib.metadata as m,sys; sys.exit(m.version('graphifyy')!='$SURUM')" 2>/dev/null; then
  python3 -m venv "$VENV"
  "$VENV/bin/pip" install -q --disable-pip-version-check --no-input "graphifyy[sql]==$SURUM"
fi
G="$VENV/bin/graphify"
temiz() { env -u ANTHROPIC_API_KEY -u OPENAI_API_KEY -u GEMINI_API_KEY -u GOOGLE_API_KEY -u DEEPSEEK_API_KEY -u MOONSHOT_API_KEY \
  GRAPHIFY_QUERY_LOG_DISABLE=1 GRAPHIFY_NO_TIPS=1 GRAPHIFY_SKIP_HOOK=1 "$@"; }
cd "$KOK"
cp "$BURADA/graphifyignore" "$KOK/.graphifyignore"
mkdir -p graphify-out
rm -rf graphify-out/graph.json graphify-out/.graphify_labels.json* graphify-out/manifest.json graphify-out/20[0-9][0-9]-*
temiz "$G" extract . --code-only >/dev/null
python3 -I "$BURADA/katman.py" "$KOK"
temiz "$G" cluster-only . --no-label --no-viz >/dev/null
python3 -I "$BURADA/katman.py" "$KOK" --etiket --rapor --proje "$PROJE"
cp graphify-out/KOD_HARITASI.md "$BURADA/KOD_HARITASI.md"
echo "graphify guncel: $(git rev-parse --short HEAD 2>/dev/null || echo '?') · $(python3 -I -c "import json;d=json.load(open('graphify-out/graph.json'));print(len(d['nodes']),'dugum',len(d['links']),'kenar')")"
