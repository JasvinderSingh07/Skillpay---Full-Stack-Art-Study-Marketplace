/*
* This class manages the ENTIRE checkout page.
*/
class CheckoutPage {
  constructor() {
        // 1. Get the cart from localStorage
        this.cart = JSON.parse(localStorage.getItem('skillpay_cart')) || [];

        // 2. Define constants
        this.shippingCost = 40.00;
        this.discountRate = 0.08; // 8%

        this.API_BASE = (window.location.port === '3000') ? '' : 'http://localhost:3000';
        // 3. Select all DOM elements
        this.selectDOMElements();
        
        // 4. Start the page
        this.renderPage();
        this.initListeners();
    }

    selectDOMElements() {
        this.cartContainer = document.getElementById('cart-items-container');
        
        this.subtotalAmountEl = document.getElementById('subtotal-amount');
        this.discountAmountEl = document.getElementById('discount-amount');
        this.totalPayableEl = document.getElementById('total-payable');

        this.form = document.getElementById('checkout-form');
        this.fullNameInput = document.getElementById('fullName');
        this.phoneInput = document.getElementById('phone');
        this.addressInput = document.getElementById('address');
    }

    renderPage() {
        if (!this.cartContainer) return;
        this.cartContainer.innerHTML = '';
        
        let subtotal = 0;

        // Loop through the cart array
        if (this.cart.length === 0) {
            this.cartContainer.innerHTML = '<p class="text-gray-500">Your cart is empty.</p>';
            // Set all totals to 0, but keep shipping
            this.updateTotals(0);
        } else {
            this.cart.forEach(item => {
                // 1. Create the HTML for this item
                // Added a "Remove" button
                const itemHTML = `
                    <div class="flex items-center gap-3">
                        <img src="${item.image}" alt="${item.name}" class="w-16 h-16 rounded-lg object-cover shadow-sm" />
                        <div class="flex-1">
                            <p class="font-semibold text-gray-800">${item.name}</p>
                            <p class="text-sm text-gray-500">₹${item.price.toFixed(2)}</p>
                        </div>
                        <button type="button" class="remove-item-btn" data-id="${item.id}">
                            &times;
                        </button>
                    </div>
                `;
                
                // 2. Add the HTML to the container
                this.cartContainer.insertAdjacentHTML('beforeend', itemHTML);
                
                // 3. Add this item's price to the subtotal
                subtotal += item.price;
            });
            
            // 4. Update the final totals
            this.updateTotals(subtotal);
            
            // 5. Add listeners to the new "Remove" buttons
            this.initRemoveListeners();
        }
    }

    updateTotals(subtotal) {
        const discount = subtotal * this.discountRate;
        const total = (subtotal > 0) ? (subtotal - discount) + this.shippingCost : 0;

        if (this.subtotalAmountEl) this.subtotalAmountEl.textContent = `₹${subtotal.toFixed(2)}`;
        if (this.discountAmountEl) this.discountAmountEl.textContent = `- ₹${discount.toFixed(2)}`;
        if (this.totalPayableEl) this.totalPayableEl.textContent = `₹${total.toFixed(2)}`;
    }

    initListeners() {
        if (!this.form) return;
        this.form.addEventListener('submit', (event) => {
            event.preventDefault(); 
            this.handlePlaceOrder();
        });
    }

    initRemoveListeners() {
        const removeButtons = document.querySelectorAll('.remove-item-btn');
        removeButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const itemId = event.target.dataset.id;
                this.removeFromCart(itemId);
            });
        });
    }

    removeFromCart(itemId) {
        // Filter out the item that was clicked
        this.cart = this.cart.filter(item => item.id !== itemId);
        
        // Save the new, smaller cart back to localStorage
        localStorage.setItem('skillpay_cart', JSON.stringify(this.cart));
        
        // Re-render the entire cart and totals
        this.renderPage();
    }

    handlePlaceOrder() {
        const fullName = this.fullNameInput.value;
        const phone = this.phoneInput.value;
        const address = this.addressInput.value;

        if (fullName.trim() === '' || phone.trim() === '' || address.trim() === '') {
            alert('Please fill in all required fields: Full Name, Phone Number, and Address.');
            return;
        }
        if (this.cart.length === 0) {
            alert('Your cart is empty! Please add items before placing an order.');
            return;
        }

        const subtotal = this.cart.reduce((s, i) => s + Number(i.price || 0), 0);
        const discount = subtotal * this.discountRate;
        const total = (subtotal > 0) ? (subtotal - discount) + this.shippingCost : 0;

        const payload = {
            customer: { name: fullName, phone, address, email: document.getElementById('email')?.value || '' },
            items: this.cart.map(i => ({ id: i.id, name: i.name, price: Number(i.price), image: i.image, qty: 1 })),
            subtotal, discount, shipping: this.shippingCost, total
        };

        fetch(`${this.API_BASE}/api/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        .then(res => {
            if (!res.ok) throw new Error('Order creation failed');
            return res.json();
        })
        .then(data => {
            alert('Order placed successfully!');
            localStorage.removeItem('skillpay_cart');
            window.location.href = 'select.html';
        })
        .catch(err => {
            alert('Error placing order: ' + (err.message || err));
        });
    }
}

// Start the checkout page
new CheckoutPage();