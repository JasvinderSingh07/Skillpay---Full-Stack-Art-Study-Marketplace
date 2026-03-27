class StudyPageManager {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('skillpay_cart')) || [];

        this.coursesGallery = document.getElementById('courses-gallery');
        this.booksGallery = document.getElementById('books-gallery');
        this.stationeryGallery = document.getElementById('stationery-gallery');
        this.notesGallery = document.getElementById('notes-gallery');
        this.journalsGallery = document.getElementById('journals-gallery');
        this.projectsGallery = document.getElementById('projects-gallery');

        this.data = null;
        this.API_BASE = (window.location.port === '3000') ? '' : 'http://localhost:3000';
        this.STATIC_PREFIX = (window.location.port === '3000') ? '/static/' : '';
        this.loadProducts();
        this.initSearch();
    }

    async loadProducts() {
        try {
            let data;
            try {
                const response = await fetch(`${this.API_BASE}/api/products/catalog/study`);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                data = await response.json();
            } catch (err) {
                console.warn("Backend API failed, falling back to local JSON:", err);
                const localResponse = await fetch('study-products.json');
                data = await localResponse.json();
            }
            this.data = data;
            this.renderAll(data);
        } catch (error) {
            console.error("Could not fetch study products:", error);
            if (this.coursesGallery) {
                this.coursesGallery.innerHTML = "<p>Error loading products.</p>";
            }
        }
    }

    populateSection(products, container, showRating = false) {
        if (!container) return;

        let galleryHTML = '';
        products.forEach(product => {
            const ratingHTML = showRating && product.rating ? 
                `<div class="resource-rating">
                    ★ ${product.rating} <span class="review-count">(${product.reviews || 0} reviews)</span>
                </div>` : '';
            
            const img = (() => {
                if (!product.image) return 'https://placehold.co/400x400?text=Image';
                if (product.image.startsWith('http')) return product.image;
                if (product.image.startsWith('/')) return product.image;
                return encodeURI(this.STATIC_PREFIX + product.image);
            })();
            galleryHTML += `
                <div class="resource-card">
                    <img src="${img}" alt="${product.name}" class="resource-image"/>
                    <div class="resource-title">${product.name}</div>
                    ${ratingHTML}
                    <div class="card-footer">
                        <span class="resource-price">₹${product.price}/-</span>
                        <button class="add-to-cart-btn"
                                data-id="${product.id}"
                                data-name="${product.name}"
                                data-price="${product.price}"
                                data-image="${img}">
                            <i data-lucide="shopping-cart" class="w-5 h-5"></i>
                        </button>
                    </div>
                </div>
            `;
        });

        container.innerHTML = galleryHTML;
        lucide.createIcons();
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
    renderAll(data) {
        this.populateSection(data.courses, this.coursesGallery, true);
        this.populateSection(data.books, this.booksGallery, true);
        this.populateSection(data.stationery, this.stationeryGallery, true);
        this.populateSection(data.notes, this.notesGallery, true);
        this.populateSection(data.journals, this.journalsGallery, true);
        this.populateSection(data.projects, this.projectsGallery, true);
    }

    initSearch() {
        const input = document.getElementById('search');
        if (!input) return;
        const debounce = (fn, d=200) => { let t; return (...args)=>{ clearTimeout(t); t=setTimeout(()=>fn(...args), d); }; };
        input.addEventListener('input', debounce(() => {
            const q = input.value.trim().toLowerCase();
            if (!this.data) return;
            if (!q) { this.renderAll(this.data); return; }
            const f = arr => arr.filter(p => p.name.toLowerCase().includes(q) || (p.category||'').toLowerCase().includes(q));
            const filtered = {
                courses: f(this.data.courses||[]),
                books: f(this.data.books||[]),
                stationery: f(this.data.stationery||[]),
                notes: f(this.data.notes||[]),
                journals: f(this.data.journals||[]),
                projects: f(this.data.projects||[])
            };
            this.renderAll(filtered);
        }));
    }
}

// Initialize the page manager when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new StudyPageManager();
    });
} else {
    new StudyPageManager();
}
