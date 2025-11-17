 
const app = document.getElementById('app');

function renderBase(content){
    app.innerHTML = `
    <div class="search-box">
        <input id="poke-search" type="text"
        placeholder="Digite o nome do Pokémon para buscar..." />
        <button id="btn-search">Buscar</button>
        <button id="btn-list">Listar 20</button> 
    </div>
    <div id="content">${content || ''}</div>
    <p>Dados da <strong>PokeAPI</strong> (pokeapi.co)</p>
    `;

    document.getElementById('btn-search').addEventListener('click', () => {
        const term = document.getElementById('poke-search').value.toLowerCase().trim();
        if(term){
            loadPokemonByName(term);
        }
    });

    document.getElementById('btn-list').addEventListener('click', () => {
        loadPokemonList();
    });
}

async function loadPokemonList() {
    try {
        const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=20');
        if (!res.ok) throw new Error('Erro na API');
        const data = await res.json();

        const listHTML = `
        <h2>Lista de Pokémons</h2>
        <div class="poke-list">
            ${data.results.map((p, i) => `
                <div class="poke-card">
                    <span>${i + 1}. ${p.name}</span>
                    <button data-name="${p.name}" class="btn-details">Detalhes</button>
                </div>
            `).join('')}
        </div>
        `;

        renderBase(listHTML);

        document.querySelectorAll('.btn-details').forEach((btn) => {
            btn.addEventListener('click', (e) => {
                const name = e.target.getAttribute('data-name');
                loadPokemonByName(name);
            });
        });

    } catch (err) {
        console.error(err); 
        renderBase(`<h2>Erro ao carregar a lista de pokémons.</h2>
        <p>Tente novamente mais tarde.</p>`);
    }
}

async function loadPokemonByName(name) {
    renderBase('<p>Buscando Pokémon...</p>');

    try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
        if (!res.ok) throw new Error('Pokémon não encontrado');
        const p = await res.json();

        const types = p.types.map((t) => t.type.name).join(', ');

        const html = `
        <h2>${p.name} (#${p.id})</h2>
        <div class="poke-details">
            <img src="${p.sprites.front_default}" alt="${p.name}" />
            <div>
                <p><strong>Altura:</strong> ${p.height}</p>
                <p><strong>Peso:</strong> ${p.weight}</p>
                <p><strong>Tipo(s):</strong> ${types}</p>
                <p><strong>Base XP:</strong> ${p.base_experience}</p>
            </div>
        </div>
        `;

        renderBase(html);

    } catch (err) {
        console.error(err);
        renderBase(`<h2>Erro ao carregar o Pokémon.</h2>
        <p>Verifique se o nome está correto e tente novamente.</p>`);
    }
}

loadPokemonList();