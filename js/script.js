// Interaksi website Kopi Kenangan Senja
document.addEventListener('DOMContentLoaded', () => {
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

  const navbarNav = $('.navbar-nav');
  const searchForm = $('.search-form');
  const searchBox = $('#search-box');
  const shoppingCart = $('.shopping-cart');
  const modal = $('#item-detail-modal');
  const modalImage = $('.modal-content img', modal);
  const modalTitle = $('.modal-content h3', modal);
  const modalDescription = $('.modal-content p', modal);
  const modalPrice = $('.modal-content .product-price', modal);
  let selectedProduct = null;
  const cart = [];

  const formatPrice = value => new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', maximumFractionDigits: 0
  }).format(value);

  function closePanels(except) {
    if (except !== 'nav') navbarNav?.classList.remove('active');
    if (except !== 'search') searchForm?.classList.remove('active');
    if (except !== 'cart') shoppingCart?.classList.remove('active');
  }

  $('#hamburger-menu')?.addEventListener('click', event => {
    event.preventDefault();
    const open = navbarNav.classList.toggle('active');
    if (open) closePanels('nav');
  });

  $('#search-button')?.addEventListener('click', event => {
    event.preventDefault();
    const open = searchForm.classList.toggle('active');
    if (open) {
      closePanels('search');
      searchBox?.focus();
    }
  });

  $('#shopping-cart-button')?.addEventListener('click', event => {
    event.preventDefault();
    const open = shoppingCart.classList.toggle('active');
    if (open) closePanels('cart');
  });

  document.addEventListener('click', event => {
    if (!event.target.closest('#hamburger-menu, .navbar-nav')) navbarNav?.classList.remove('active');
    if (!event.target.closest('#search-button, .search-form')) searchForm?.classList.remove('active');
    if (!event.target.closest('#shopping-cart-button, .shopping-cart')) shoppingCart?.classList.remove('active');
  });

  // Pencarian sederhana: menyaring kartu produk dan menu.
  searchBox?.addEventListener('input', () => {
    const term = searchBox.value.trim().toLowerCase();
    $$('.product-card').forEach(card => {
      card.hidden = !card.dataset.name.toLowerCase().includes(term);
    });
    $$('.menu-card').forEach(card => {
      card.hidden = term && !card.textContent.toLowerCase().includes(term);
    });
  });

  function getProduct(card) {
    return {
      name: card.dataset.name,
      price: Number(card.dataset.price),
      image: card.dataset.image,
      description: card.dataset.description
    };
  }

  function renderCart() {
    if (!cart.length) {
      shoppingCart.innerHTML = '<p class="cart-empty">Keranjang masih kosong.</p>';
      return;
    }
    shoppingCart.innerHTML = cart.map((item, index) => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}">
        <div class="item-detail">
          <h3>${item.name}</h3>
          <div class="item-price">${formatPrice(item.price)} × ${item.quantity}</div>
        </div>
        <button type="button" class="remove-item" data-index="${index}" aria-label="Hapus ${item.name}">
          <i data-feather="trash-2"></i>
        </button>
      </div>`).join('') +
      `<div class="cart-total">Total: ${formatPrice(cart.reduce((sum, item) => sum + item.price * item.quantity, 0))}</div>`;
    if (window.feather) window.feather.replace();
  }

  function addToCart(product) {
    const existing = cart.find(item => item.name === product.name);
    if (existing) existing.quantity += 1;
    else cart.push({ ...product, quantity: 1 });
    renderCart();
    shoppingCart.classList.add('active');
    closePanels('cart');
  }

  $$('.product-card').forEach(card => {
    const product = getProduct(card);
    $('.add-to-cart', card)?.addEventListener('click', () => addToCart(product));
    $('.item-detail-button', card)?.addEventListener('click', () => {
      selectedProduct = product;
      modalImage.src = product.image;
      modalImage.alt = product.name;
      modalTitle.textContent = product.name;
      modalDescription.textContent = product.description;
      modalPrice.textContent = formatPrice(product.price);
      modal.style.display = 'flex';
      modal.setAttribute('aria-hidden', 'false');
    });
  });

  $('.modal-add-to-cart')?.addEventListener('click', () => {
    if (selectedProduct) addToCart(selectedProduct);
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
  });

  $('.modal .close-icon')?.addEventListener('click', () => {
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
  });

  shoppingCart?.addEventListener('click', event => {
    const button = event.target.closest('.remove-item');
    if (!button) return;
    cart.splice(Number(button.dataset.index), 1);
    renderCart();
  });

  modal?.addEventListener('click', event => {
    if (event.target === modal) {
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      closePanels();
      if (modal) {
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
      }
    }
  });

  // Ganti ikon placeholder setelah seluruh elemen tersedia.
  if (window.feather) window.feather.replace();
});
