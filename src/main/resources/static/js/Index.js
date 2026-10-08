document.addEventListener("DOMContentLoaded", () => {
  const toast = document.createElement("div");
  toast.className = "toast";
  document.body.appendChild(toast);

  const showToast = (message) => {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(showToast.timeoutId);
    showToast.timeoutId = setTimeout(() => {
      toast.classList.remove("show");
    }, 1800);
  };

  const cartKey = "cafeteriaCart";
  const formatCurrency = (value) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(value);

  const getCart = () => {
    try {
      return JSON.parse(localStorage.getItem(cartKey)) || [];
    } catch {
      return [];
    }
  };

  const saveCart = (cart) => {
    localStorage.setItem(cartKey, JSON.stringify(cart));
  };

  const addToCart = (name, price) => {
    const cart = getCart();
    const existing = cart.find((item) => item.name === name);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ name, price, quantity: 1 });
    }

    saveCart(cart);
    showToast(`${name} adicionado ao pedido!`);
  };

  const renderCart = () => {
    const cartItemsContainer = document.getElementById("cartItems");
    if (!cartItemsContainer) return;

    const cart = getCart();
    if (!cart.length) {
      cartItemsContainer.innerHTML = '<p class="empty-message">Nenhum produto adicionado</p>';
      document.getElementById("subtotal").textContent = "R$ 0,00";
      document.getElementById("delivery").textContent = "R$ 0,00";
      document.getElementById("total").textContent = "R$ 0,00";
      return;
    }

    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const deliveryFee = subtotal >= 80 ? 0 : 12;
    const total = subtotal + deliveryFee;

    cartItemsContainer.innerHTML = cart
      .map(
        (item) =>
          `<div class="cart-item">
            <div class="cart-item-info">
              <strong>${item.name}</strong>
              <span>Qtd: ${item.quantity}</span>
            </div>
            <strong>${formatCurrency(item.price * item.quantity)}</strong>
          </div>`
      )
      .join("");

    document.getElementById("subtotal").textContent = formatCurrency(subtotal);
    document.getElementById("delivery").textContent = formatCurrency(deliveryFee);
    document.getElementById("total").textContent = formatCurrency(total);
  };

  document.querySelectorAll(".add-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const name = button.dataset.name;
      const price = Number(button.dataset.price);
      addToCart(name, price);
    });
  });

  const filterProducts = () => {
    const buttons = document.querySelectorAll(".category-btn");
    const cards = document.querySelectorAll(".product-card");

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const selected = button.dataset.filter;

        buttons.forEach((btn) => btn.classList.toggle("active", btn === button));
        cards.forEach((card) => {
          const matches = selected === "todos" || card.dataset.category === selected;
          card.style.display = matches ? "flex" : "none";
        });
      });
    });
  };

  const orderForm = document.getElementById("orderForm");
  if (orderForm) {
    orderForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const cart = getCart();
      if (!cart.length) {
        alert("Adicione pelo menos um produto antes de confirmar o pedido.");
        return;
      }

      const formData = {
        name: document.getElementById("clientName").value.trim(),
        phone: document.getElementById("clientPhone").value.trim(),
        address: document.getElementById("clientAddress").value.trim(),
        city: document.getElementById("clientCity").value.trim(),
        zip: document.getElementById("clientZip").value.trim(),
        paymentMethod: document.getElementById("paymentMethod").value,
        observations: document.getElementById("observations").value.trim()
      };

      const allFieldsFilled = Object.values(formData).every((value) => value !== "");
      if (!allFieldsFilled) {
        alert("Preencha todos os dados do pedido.");
        return;
      }

      alert(`Pedido confirmado para ${formData.name}! Em breve entraremos em contato.`);
      localStorage.removeItem(cartKey);
      orderForm.reset();
      renderCart();
    });
  }

  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const email = document.getElementById("loginEmail").value.trim();
      const password = document.getElementById("loginPassword").value.trim();

      if (!email || !password) {
        alert("Informe seu email e senha.");
        return;
      }

      localStorage.setItem("cafeteriaLoggedIn", "true");
      alert("Login realizado com sucesso!");
      window.location.href = "index.html";
    });
  }

  renderCart();
  filterProducts();
});