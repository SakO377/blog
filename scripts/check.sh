#!/bin/bash
# サイトが壊れていないかローカルでビルドして確認する。成功なら "BUILD OK" と出る。
set -e
gem list -i jekyll >/dev/null 2>&1 || gem install --no-document jekyll minima jekyll-feed jekyll-seo-tag jekyll-sitemap >/dev/null
SRC=$(mktemp -d); OUT=$(mktemp -d)
cp -r "$(dirname "$0")/.." "$SRC/site" && rm -f "$SRC/site/Gemfile"
cd "$SRC/site" && ruby "$(gem contents jekyll | grep 'exe/jekyll$')" build -q -d "$OUT" 2>&1 | grep -iE '^\s*(error|liquid)' && exit 1
echo "BUILD OK ($(find "$OUT" -name index.html | wc -l) pages)"
