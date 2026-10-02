// Navegação entre páginas
const navLinks = document.querySelectorAll(".nav-link");
const pages = document.querySelectorAll(".page");

navLinks.forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();

    // Remove active de todos os links
    navLinks.forEach(l => l.classList.remove("active"));
    link.classList.add("active");

    // Remove active de todas as páginas
    pages.forEach(page => page.classList.remove("active"));

    // Ativa a página correspondente
    const pageId = link.getAttribute("data-page");
    document.getElementById(pageId).classList.add("active");
  });
});

// Carrinho de pedidos
let cart = [];

const addBtns = document.querySelectorAll(".add-btn");

addBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    const name = btn.getAttribute("data-name");
    const price = parseFloat(btn.getAttribute("data-price"));

    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ name, price, quantity: 1 });
    }

    updateCart();
  });
});

// Atualizar carrinho
function updateCart() {
  const cartItemsDiv = document.getElementById("cartItems");
  cartItemsDiv.innerHTML = "";

  if (cart.length === 0) {
    cartItemsDiv.innerHTML = '<p class="empty-message">Nenhum produto adicionado</p>';
    document.getElementById("subtotal").textContent = "R$ 0,00";
    document.getElementById("delivery").textContent = "R$ 0,00";
    document.getElementById("total").textContent = "R$ 0,00";
    return;
  }

  let subtotal = 0;

  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    const itemDiv = document.createElement("div");
    itemDiv.className = "cart-item";
    itemDiv.innerHTML = `
      <div>
        <strong>${item.name}</strong><br>
        <small>Qtd: ${item.quantity}</small>
      </div>
      <span>R$ ${itemTotal.toFixed(2).replace(".", ",")}</span>
    `;
    cartItemsDiv.appendChild(itemDiv);
  });

  const delivery = cart.length > 0 ? 8 : 0;
  const total = subtotal + delivery;

  document.getElementById("subtotal").textContent = `R$ ${subtotal.toFixed(2).replace(".", ",")}`;
  document.getElementById("delivery").textContent = `R$ ${delivery.toFixed(2).replace(".", ",")}`;
  document.getElementById("total").textContent = `R$ ${total.toFixed(2).replace(".", ",")}`;
}

// Filtro de produtos
const categoryBtns = document.querySelectorAll(".category-btn");
const productCards = document.querySelectorAll(".product-card");

categoryBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    const filter = btn.getAttribute("data-filter");

    categoryBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    productCards.forEach(card => {
      const category = card.getAttribute("data-category");

      if (filter === "todos" || category === filter) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  });
});

// Form de pedidos
const orderForm = document.getElementById("orderForm");

orderForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("clientName").value;
  const phone = document.getElementById("clientPhone").value;

  alert(`Pedido confirmado para ${name}! Você será contatado pelo telefone ${phone}.`);

  orderForm.reset();
  cart = [];
  updateCart();
});

// Form de login
const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value;

  alert(`Bem-vindo, ${email}!`);
  loginForm.reset();
});

// Inicializar carrinho
updateCart();