// 楽天市場の商品検索APIで、.item-box を写真・価格つきの商品カードにする
(function () {
  var cfg = window.RAKUTEN || {};
  if (!cfg.appId || !cfg.accessKey) return;
  var boxes = document.querySelectorAll('.item-box');
  boxes.forEach(function (box, i) {
    var params = {
      applicationId: cfg.appId, accessKey: cfg.accessKey, affiliateId: cfg.affiliateId,
      format: 'json', formatVersion: 2, hits: 1, imageFlag: 1, availability: 1, sort: 'standard'
    };
    if (box.dataset.item) params.itemCode = box.dataset.item; else params.keyword = box.dataset.keyword;
    var qs = Object.keys(params).filter(function (k) { return params[k]; })
      .map(function (k) { return k + '=' + encodeURIComponent(params[k]); }).join('&');
    var url = 'https://openapi.rakuten.co.jp/ichibams/api/IchibaItem/Search/20260701?' + qs;
    setTimeout(function () {
      fetch(url).then(function (r) { return r.json(); }).then(function (d) {
        var it = d.Items && d.Items[0]; if (!it) return;
        if (it.Item) it = it.Item;
        var img = (it.mediumImageUrls && it.mediumImageUrls[0]) || '';
        if (typeof img === 'object') img = img.imageUrl;
        img = img.replace('?_ex=128x128', '?_ex=300x300');
        var link = it.affiliateUrl || it.itemUrl;
        var btn = box.querySelector('a.btn-rakuten');
        var note = box.querySelector('.item-note');
        var d = new Date(); var day = (d.getMonth() + 1) + '月' + d.getDate() + '日';
        var rev = it.reviewCount ? '★' + it.reviewAverage + '（レビュー' + Number(it.reviewCount).toLocaleString() + '件）' : '';
        box.classList.add('loaded');
        box.innerHTML =
          '<a class="item-card" href="' + link + '" target="_blank" rel="nofollow sponsored noopener">' +
          '<div class="item-img"><img src="' + img + '" alt="" loading="lazy"></div>' +
          '<div class="item-info"><p class="item-name"></p>' +
          '<p class="item-price">' + Number(it.itemPrice).toLocaleString() + '<small>円（税込・' + day + '時点）</small></p>' +
          '<p class="item-meta">' + rev + '</p>' +
          '<p class="item-shop"></p><span class="item-btn">楽天市場で今の価格を見る</span></div></a>';
        if (note) box.insertBefore(note, box.firstChild);
        box.querySelector('.item-name').textContent = it.itemName.length > 60 ? it.itemName.slice(0, 60) + '…' : it.itemName;
        box.querySelector('.item-shop').textContent = it.shopName || '';
        if (btn) { btn.classList.add('btn-sub'); btn.textContent = 'ほかの商品も見る'; box.appendChild(btn); }
      }).catch(function () {});
    }, i * 350); // APIの回数制限を避けるため少しずつ呼ぶ
  });
})();
