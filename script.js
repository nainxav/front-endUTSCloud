
document.addEventListener('DOMContentLoaded', function() {
    const productsGrid = document.getElementById('products-grid');
    const cartCount = document.querySelector('.cart-count');
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Update cart count
    function updateCartCount() {
        cartCount.textContent = cartItems.length;
    }
    
    // Fetch products from backend
    async function fetchProducts() {
        try {
            productsGrid.innerHTML = '<div class="loader">Loading products...</div>';
            
            // In production, replace with your backend EC2 URL or domain
            //const response = await fetch('http://10.0.2.188:3001/api/products');
            const response = await fetch('/api/api/products');

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            const products = await response.json();
	    console.log(products);
            displayProducts(products);
        } catch (error) {
            console.error('Error fetching products:', error);
            productsGrid.innerHTML = '<div class="error">Failed to load products. Please try again later.</div>';
        }
    }
    
    // Display products in the grid
    function displayProducts(products) {
        if (products.length === 0) {
            productsGrid.innerHTML = '<div class="no-products">No products available at the moment.</div>';
            return;
        }
        
        productsGrid.innerHTML = '';
        
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            
            productCard.innerHTML = `
                <img src="${product.image_path}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-price">$${product.price}</p>
                    <p class="product-description">${product.description || ''}</p>
                    <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
                </div>
            `;
            
            productsGrid.appendChild(productCard);
        });
        
        // Add event listeners to all "Add to Cart" buttons
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', addToCart);
        });
    }
    
    // Add product to cart
    function addToCart(event) {
        const productId = event.target.getAttribute('data-id');
        
        // In a real app, you would get the full product details from your backend
        // For this example, we'll just store the ID
        cartItems.push(productId);
        localStorage.setItem('cart', JSON.stringify(cartItems));
        updateCartCount();
        
        // Show a quick notification
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.textContent = 'Item added to cart!';
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 2000);
    }
    
    // Initialize
    updateCartCount();
    fetchProducts();
});
