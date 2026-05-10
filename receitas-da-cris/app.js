const recipesContainer = document.querySelector("#recipes");
const searchInput = document.querySelector("#search");
const categorySelect = document.querySelector("#category");
const sourceForm = document.querySelector("#source-form");
const draftOutput = document.querySelector("#draft");

let recipes = [];

function normalize(value) {
  return value.toLocaleLowerCase("pt-BR").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function sourceIcon(type) {
  return {
    instagram: "📸",
    pdf: "📄",
    video: "🎬",
    image: "🖼️",
    link: "🔗",
  }[type] || "🔗";
}

function renderCategories() {
  const categories = [...new Set(recipes.map((recipe) => recipe.category))].sort();
  for (const category of categories) {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categorySelect.append(option);
  }
}

function recipeMatches(recipe) {
  const query = normalize(searchInput.value.trim());
  const selectedCategory = categorySelect.value;
  const haystack = normalize([
    recipe.title,
    recipe.category,
    recipe.description,
    recipe.tags.join(" "),
    recipe.ingredients.join(" "),
  ].join(" "));

  return (!query || haystack.includes(query)) &&
    (selectedCategory === "Todas" || recipe.category === selectedCategory);
}

function renderRecipes() {
  const visibleRecipes = recipes.filter(recipeMatches);
  recipesContainer.innerHTML = visibleRecipes.length
    ? visibleRecipes.map((recipe) => `
      <article class="recipe-card">
        <div>
          <p class="eyebrow">${recipe.category}</p>
          <h2>${recipe.title}</h2>
          <p>${recipe.description}</p>
        </div>
        <div class="recipe-card__meta">
          <span class="badge">⏱️ ${recipe.timeMinutes} min</span>
          <span class="badge">⭐ ${recipe.difficulty}</span>
          <span class="badge">🍽️ ${recipe.yield}</span>
        </div>
        <div class="tags">${recipe.tags.map((tag) => `<span>#${tag}</span>`).join("")}</div>
        <section>
          <h3>Ingredientes</h3>
          <ul>${recipe.ingredients.map((ingredient) => `<li>${ingredient}</li>`).join("")}</ul>
        </section>
        <section>
          <h3>Fluxo de execução</h3>
          <ol>${recipe.flow.map((step) => `<li>${step}</li>`).join("")}</ol>
        </section>
        <section>
          <h3>Fontes</h3>
          <div class="sources">
            ${recipe.sources.map((source) => `
              <a href="${source.url}" target="_blank" rel="noreferrer">
                ${sourceIcon(source.type)} ${source.label}
              </a>
            `).join("")}
          </div>
        </section>
        ${recipe.notes ? `<p><strong>Notas da Cris:</strong> ${recipe.notes}</p>` : ""}
      </article>
    `).join("")
    : `<p>Nenhuma receita encontrada. Tente remover filtros ou adicionar uma nova fonte.</p>`;
}

function inferSourceType(url) {
  if (url.includes("instagram.com")) return "instagram";
  if (url.endsWith(".pdf")) return "pdf";
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "video";
  if (/\.(png|jpe?g|webp|gif)$/i.test(url)) return "image";
  return "link";
}

function createDraft(event) {
  event.preventDefault();
  const data = new FormData(sourceForm);
  const title = data.get("title").toString().trim();
  const url = data.get("url").toString().trim();
  const category = data.get("category").toString();
  const id = normalize(title).replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const draft = {
    id,
    title,
    category,
    tags: ["para-testar"],
    timeMinutes: 0,
    difficulty: "A definir",
    yield: "A definir",
    description: "Nova descoberta para transformar em receita executável.",
    ingredients: ["Completar ingredientes"],
    flow: ["Assistir/ler a fonte", "Anotar medidas", "Testar preparo", "Registrar ajustes"],
    sources: [{ type: inferSourceType(url), label: "Fonte original", url }],
    notes: "Adicionar observações depois do primeiro teste.",
  };

  draftOutput.textContent = JSON.stringify(draft, null, 2);
}

async function init() {
  const response = await fetch("./data/recipes.json");
  recipes = await response.json();
  renderCategories();
  renderRecipes();
}

searchInput.addEventListener("input", renderRecipes);
categorySelect.addEventListener("change", renderRecipes);
sourceForm.addEventListener("submit", createDraft);

init();
