let produtos = [];
let carrinho = [];

// Carrega JSON
fetch("produtos.json")
  .then(res => res.json())
  .then(data => {
      produtos = data.produtos;
      mostrarProdutos(produtos);
  });

// Exibe produtos
function mostrarProdutos(lista) {
  const container = document.getElementById("lista-produtos");
  container.innerHTML = "";

  lista.forEach(prod => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.setAttribute("data-cat", prod.categoria);

      card.innerHTML = `
          <img src="${prod.imagem}" alt="${prod.nome}">
          <h3>${prod.nome}</h3>
          <p><strong>R$ ${prod.preco}</strong></p>
          <button class="btn-add" onclick="adicionarCarrinho('${prod.nome}', ${prod.preco})">
              Adicionar
          </button>
      `;

      container.appendChild(card);
  });
}

//
// ---------------- FILTROS (RESTAURADO) ----------------
//

document.querySelectorAll(".filtro").forEach(btn => {
    btn.addEventListener("click", () => {

        document.querySelectorAll(".filtro").forEach(b => b.classList.remove("ativo"));
        btn.classList.add("ativo");

        const cat = btn.dataset.cat;

        if (cat === "todos") {
            mostrarProdutos(produtos);
        } else {
            const filtrados = produtos.filter(p => p.categoria === cat);
            mostrarProdutos(filtrados);
        }
    });
});

//
// ---------------- CARRINHO ----------------
//

// Adicionar ao carrinho
function adicionarCarrinho(nome, preco) {
  carrinho.push({ nome, preco });
  atualizarCarrinhoBar();
  carregarItensCarrinho();
}

// Atualiza barra inferior
function atualizarCarrinhoBar() {
  const info = document.getElementById("carrinho-info");

  if (carrinho.length === 0) {
      info.textContent = "🛒 Carrinho vazio";
  } else {
      let total = carrinho.reduce((s, item) => s + Number(item.preco), 0);
      info.textContent = `🛒 ${carrinho.length} itens | Total: R$ ${total.toFixed(2)}`;
  }
}

// Exibir itens no popup do carrinho
function carregarItensCarrinho() {
  const lista = document.getElementById("carrinho-itens");
  lista.innerHTML = "";

  carrinho.forEach((item, index) => {
      lista.innerHTML += `
          <div>
              <span>${item.nome} - R$ ${item.preco}</span>
              <span class="btn-remover" onclick="removerItem(${index})">✖</span>
          </div>
      `;
  });
}

// Remover item específico
function removerItem(index) {
  carrinho.splice(index, 1);
  atualizarCarrinhoBar();
  carregarItensCarrinho();
}

// Limpar carrinho
document.getElementById("btn-limpar").addEventListener("click", () => {
  carrinho = [];
  atualizarCarrinhoBar();
  carregarItensCarrinho();
});

// Abrir carrinho
document.getElementById("btn-ver-carrinho").addEventListener("click", () => {
  document.getElementById("carrinho-box").classList.remove("hidden");
});

// Fechar carrinho
document.getElementById("btn-fechar-carrinho").addEventListener("click", () => {
  document.getElementById("carrinho-box").classList.add("hidden");
});

// Finalizar pedido → WhatsApp
document.getElementById("btn-finalizar").addEventListener("click", () => {
  if (carrinho.length === 0) {
      alert("Seu carrinho está vazio!");
      return;
  }

  let mensagem = "Olá! Tenho interesse nestes produtos:%0A%0A";

  carrinho.forEach(item => {
      mensagem += `• ${item.nome} – R$ ${item.preco}%0A`;
  });

  let total = carrinho.reduce((s, item) => s + Number(item.preco), 0);
  mensagem += `%0ATotal: R$ ${total.toFixed(2)}%0A`;

  window.open(`https://wa.me/5594992805113?text=${mensagem}`, "_blank");
});