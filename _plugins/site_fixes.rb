# 記事の updated を検索エンジン向けの last_modified_at にも入れる（seo-tag の dateModified、sitemap の lastmod が読む）
Jekyll::Hooks.register :posts, :post_init do |post|
  if post.data['updated'] && !post.data['last_modified_at']
    post.data['last_modified_at'] = post.data['updated']
  end
end

# 記事が0本のカテゴリページは noindex にしてサイトマップから外す
Jekyll::Hooks.register :site, :post_read do |site|
  site.pages.each do |page|
    next unless page.data['layout'] == 'category'
    slug = page.data['slug'] || File.basename(page.name, '.*')
    next if site.categories[slug] && !site.categories[slug].empty?
    page.data['sitemap'] = false
    page.data['noindex'] = true
  end
end
