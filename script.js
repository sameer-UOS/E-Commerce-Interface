// Store all products in one array
const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        category: "Electronics",
        price: 4500,
        image: "images/headphone.png",
        description: "Comfortable wireless headphones for everyday use."
    },

    {
        id: 2,
        name: "Casual T-Shirt",
        category: "Clothing",
        price: 1800,
        image: "images/tshirt.png",
        description: "Simple and comfortable cotton t-shirt."
    },

    {
        id: 3,
        name: "Running Shoes",
        category: "Shoes",
        price: 5200,
        image: "images/shoes.png",
        description: "Lightweight shoes designed for daily running."
    },

    {
        id: 4,
        name: "Laptop Backpack",
        category: "Accessories",
        price: 3000,
        image: "images/laptop.png",
        description: "Practical backpack for laptops and daily use."
    },

    {
        id: 5,
        name: "Smart Watch",
        category: "Electronics",
        price: 6500,
        image: "images/smartwatch.png",
        description: "A simple smartwatch for everyday activities."
    },

    {
        id: 6,
        name: "Denim Jacket",
        category: "Clothing",
        price: 4200,
        image: "images/jacket.png",
        description: "Classic denim jacket suitable for casual wear."
    }
];

// These variables store the current filter and cart information
let selectedCategory = "All";
let searchText = "";
let minPrice = 0;
let maxPrice = Infinity;
let sortOption = "default";
let cart = [];

const productContainer = document.getElementById("product-container");

// Display the products on the page
function displayProducts(productsToDisplay) {
    productContainer.innerHTML = "";

    const productCount = document.getElementById("product-count");
    const noProducts = document.getElementById("no-products");

    productCount.textContent = `${productsToDisplay.length} products found`;

    if (productsToDisplay.length === 0) {
        noProducts.style.display = "block";
        return;
    }

    noProducts.style.display = "none";

    // Create a product card for each product
    productsToDisplay.forEach(function(product) {
        const productCard = document.createElement("div");

        productCard.className = "product-card";

        // Add product information and button to the card
        productCard.innerHTML = 
            `<img src="${product.image}" alt="${product.name}">

            <div class="product-info">
                <h3>${product.name}</h3>

                <p class="category">${product.category}</p>

                <p class="description">${product.description}</p>

                <p class="price">Rs. ${product.price}</p>

                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div> `

        productContainer.appendChild(productCard);
    });
}

// Add a selected product to the shopping cart
function addToCart(productId) {

    const product = products.find(function(product) {
        return product.id === productId;
    });

    const existingItem = cart.find(function(item) {
        return item.id === productId;
    });

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }

    updateCartCount();
    displayCart();
}

// Update the number shown on the cart button
function updateCartCount() {

    const cartCount = document.getElementById("cart-count");

    const totalItems = cart.reduce(function(total, item) {
        return total + item.quantity;
    }, 0);

    cartCount.textContent = totalItems;
}

// Handle clicks on product and cart buttons
document.addEventListener("click", function(event) {

    if (event.target.classList.contains("add-to-cart")) {

        const productId = Number(event.target.dataset.id);

        addToCart(productId);
    }


    if (event.target.classList.contains("increase-btn")) {

        const productId = Number(event.target.dataset.id);

        changeQuantity(productId, 1);
    }


    if (event.target.classList.contains("decrease-btn")) {

        const productId = Number(event.target.dataset.id);

        changeQuantity(productId, -1);
    }


    if (event.target.classList.contains("remove-btn")) {

        const productId = Number(event.target.dataset.id);

        removeFromCart(productId);
    }

});

// Display all items currently present in the cart
function displayCart() {

    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");

    cartItems.innerHTML = "";

    if (cart.length === 0) {
        cartItems.innerHTML = "<p>Your cart is empty.</p>";
        cartTotal.textContent = "0";
        return;
    }

    let total = 0;

    cart.forEach(function(item) {

        const itemTotal = item.price * item.quantity;

        total += itemTotal;

        const cartItem = document.createElement("div");

        cartItem.className = "cart-item";

        cartItem.innerHTML = `
            <h3>${item.name}</h3>

            <p>Rs. ${item.price}</p>

            <div class="quantity-controls">
                <button class="decrease-btn" data-id="${item.id}">
                    -
                </button>

                <span>${item.quantity}</span>

                <button class="increase-btn" data-id="${item.id}">
                    +
                </button>
            </div>

            <p>
                Subtotal: Rs. ${itemTotal}
            </p>

            <button class="remove-btn" data-id="${item.id}">
                Remove
            </button>
        `;

        cartItems.appendChild(cartItem);
    });

    cartTotal.textContent = total;
}

// Change the quantity of a cart item
function changeQuantity(productId, change) {

    const item = cart.find(function(item) {
        return item.id === productId;
    });

    if (!item) {
        return;
    }

    item.quantity += change;

    if (item.quantity <= 0) {
        cart = cart.filter(function(cartItem) {
            return cartItem.id !== productId;
        });
    }

    updateCartCount();
    displayCart();
}

// Remove a product completely from the cart
function removeFromCart(productId) {

    cart = cart.filter(function(item) {
        return item.id !== productId;
    });

    updateCartCount();
    displayCart();
}

const checkoutButton = document.getElementById("checkout-btn");

// Handle the checkout button click
checkoutButton.addEventListener("click", function() {

    if (cart.length === 0) {
        alert("Your cart is empty.");
        return;
    }

    alert("Thank you! Your order has been placed successfully.");

    cart = [];

    updateCartCount();
    displayCart();

    cartPanel.style.display = "none";

});

// Apply search, category, and price filters
function applyFilters() {
    let filteredProducts = products.filter(function(product) {

        const matchesSearch =
            product.name.toLowerCase().includes(searchText.toLowerCase());

        const matchesCategory =
            selectedCategory === "All" ||
            product.category === selectedCategory;

        const matchesPrice =
            product.price >= minPrice &&
            product.price <= maxPrice;

        return matchesSearch && matchesCategory && matchesPrice;
    });


    if (sortOption === "low-high") {
        filteredProducts.sort(function(a, b) {
            return a.price - b.price;
        });
    }


    if (sortOption === "high-low") {
        filteredProducts.sort(function(a, b) {
            return b.price - a.price;
        });
    }


    displayProducts(filteredProducts);
}

const priceFilterButton = document.getElementById("price-filter-btn");
const minPriceInput = document.getElementById("min-price");
const maxPriceInput = document.getElementById("max-price");
const cartToggle = document.getElementById("cart-toggle");
const cartPanel = document.getElementById("cart-panel");
const closeCart = document.getElementById("close-cart");

// Apply the selected price range
priceFilterButton.addEventListener("click", function() {

    minPrice = Number(minPriceInput.value) || 0;

    maxPrice = Number(maxPriceInput.value) || Infinity;

    applyFilters();

});

const sortProducts = document.getElementById("sort-products");

// Apply the selected sorting option
sortProducts.addEventListener("change", function() {

    sortOption = sortProducts.value;

    applyFilters();

});

const searchInput = document.getElementById("search-input");

// Apply search whenever the user types
searchInput.addEventListener("input", function() {
    searchText = searchInput.value;

    applyFilters();
});

const filterButtons = document.querySelectorAll(".filter-btn");

// Add a click event to every category button
filterButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        selectedCategory = button.dataset.category;

        filterButtons.forEach(function(btn) {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        applyFilters();
    });

});

// Open the shopping cart panel
cartToggle.addEventListener("click", function() {
    cartPanel.style.display = "flex";
});

// Close the shopping cart panel
closeCart.addEventListener("click", function() {
    cartPanel.style.display = "none";
});

// Display all products when the page first loads
displayProducts(products);