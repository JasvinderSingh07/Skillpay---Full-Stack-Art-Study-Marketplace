class ArtPageManager {
  constructor() {
    this.cart = JSON.parse(localStorage.getItem('skillpay_cart')) || [];

    this.sketchGallery = document.getElementById('sketches-gallery');
    this.sculptureGallery = document.getElementById('sculptures-gallery');
    this.paintingsGallery = document.getElementById('paintings-gallery');
    this.artsGallery = document.getElementById('arts-gallery');
    this.photographsGallery = document.getElementById('photographs-gallery');
    this.newArrivalsGallery = document.getElementById('newArrivals-gallery');

    this.API_BASE = (window.location.port === '3000') ? '' : 'http://localhost:3000';
    this.STATIC_PREFIX = (window.location.port === '3000') ? '/static/' : '';
    this.loadProducts();
  }

  async loadProducts() {
    try {
      let data;
      try {
        const response = await fetch(`${this.API_BASE}/api/products/catalog/art`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        data = await response.json();
      } catch (err) {
        console.warn("Backend API failed, falling back to local JSON:", err);
        const localResponse = await fetch('art-products.json');
        data = await localResponse.json();
      }

      this.populateSection(data.sketches, this.sketchGallery);
      this.populateSection(data.sculptures, this.sculptureGallery);
      this.populateSection(data.paintings, this.paintingsGallery);
      this.populateSection(data.arts, this.artsGallery);
      this.populateSection(data.photographs, this.photographsGallery);
      this.populateSection(data.newArrivals, this.newArrivalsGallery);
    } catch (error) {
      console.error("Could not fetch art products:", error);
      if (this.sketchGallery) {
        this.sketchGallery.innerHTML = "<p>Error loading products.</p>";
      }
    }
  }

  populateSection(products, container) {
    if (!container) return;

    let galleryHTML = '';
    products.forEach(product => {
      const img = (() => {
        if (!product.image) return 'https://placehold.co/400x400?text=Image';
        if (product.image.startsWith('http')) return product.image;
        if (product.image.startsWith('/')) return product.image;
        return encodeURI(this.STATIC_PREFIX + product.image);
      })();
      galleryHTML += `
        <div class="art-card">
          <img class="art-img" src="${img}" alt="${product.name}" />
          <div class="art-title">${product.name}</div>
          <div class="art-price-heart">
            <span class="art-price">₹${product.price}/-</span>
            <button class="add-to-cart-btn"
                    data-id="${product.id}"
                    data-name="${product.name}"
                    data-price="${product.price}"
                    data-image="${img}">
              <i data-lucide="shopping-cart" class="w-5 h-5"></i>
            </button>
          </div>
        </div>`;
    });
    container.innerHTML = galleryHTML;

    // Re-initialize icons after adding HTML
    lucide.createIcons();

    // Add event listeners to all "Add to Cart" buttons in this section
    this.initCartListeners(container);
  }

  initCartListeners(container) {
    const addButtons = container.querySelectorAll('.add-to-cart-btn');
    addButtons.forEach(button => {
      button.addEventListener('click', (event) => {
        const btn = event.currentTarget;
        const product = {
          id: btn.dataset.id,
          name: btn.dataset.name,
          price: parseFloat(btn.dataset.price),
          image: btn.dataset.image
        };
        this.addToCart(product);
      });
    });
  }

  addToCart(product) {
    const existingItem = this.cart.find(item => item.id === product.id);
    if (existingItem) {
      alert(`${product.name} is already in your cart.`);
    } else {
      this.cart.push(product);
      localStorage.setItem('skillpay_cart', JSON.stringify(this.cart));
      alert(`Added ${product.name} to your cart!`);
    }
  }
}

// Initialize the page manager when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new ArtPageManager();
  });
} else {
  new ArtPageManager();
}
