---
layout: page
title: カテゴリー
permalink: /categories/
---
{% for cat in site.data.categories %}{% if cat.hidden %}{% continue %}{% endif %}
- [{{ cat.name }}]({{ '/category/' | append: cat.slug | append: '/' | relative_url }})（{{ site.categories[cat.slug] | size }}記事）
{% endfor %}
