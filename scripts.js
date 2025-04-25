function toggleMenu() {
    var menuContent = document.getElementById('menuContent');
    if (menuContent.style.display === 'block') {
        menuContent.style.display = 'none';
    } else {
        menuContent.style.display = 'block';
    }
}

// Script para carregar dados do arquivo JSON e criar dinamicamente os elementos HTML para os produtos
let urlsDeus = [];
let urlsNatureza = [];
let urlsTecnologia = [];

// Função para carregar os dados do arquivo JSON
async function carregarURLs() {
    try {
        const response = await fetch('./data/urls.json');
        const data = await response.json();
        
        urlsDeus = data.deus || [];
        urlsNatureza = data.natureza || [];
        urlsTecnologia = data.tecnologia || [];
        
        // Atualizar contadores de projetos
        document.getElementById('count-Deus').textContent = urlsDeus.length;
        document.getElementById('count-natureza').textContent = urlsNatureza.length;
        document.getElementById('count-tecnologia').textContent = urlsTecnologia.length;
        
        // Criar elementos de produto
        createProductElements(urlsDeus, productsContainerDeus);
        createProductElements(urlsNatureza, productsContainerNatureza);
        createProductElements(urlsTecnologia, productsContainerTecnologia);
        
        // Carregar meta tags
        carregarMetaTags();
    } catch (error) {
        console.error('Erro ao carregar o arquivo JSON:', error);
    }
}

const productsContainerDeus = document.getElementById("products");
const productsContainerNatureza = document.getElementById("products-natureza");
const productsContainerTecnologia = document.getElementById("products-tecnologia");


function createProductElements(urls, container) {
    urls.forEach((url, index) => {
        const productDiv = document.createElement("div");
        productDiv.className = "product";

        productDiv.innerHTML = `
            <a href="${url}">
            <img id="image-${container.id}-${index}" alt="Imagem do Produto"></a>
            <h2 id="title-${container.id}-${index}">Carregando título...</h2>
            <p id="description-${container.id}-${index}">Carregando descrição...</p>
            
        `;
        // <p><strong>Preço:</strong> <span id="price-${container.id}-${index}">Carregando preço...</span></p>
        container.appendChild(productDiv);
    });
}

// Iniciar o carregamento dos dados
carregarURLs();


async function fetchMetaTags(url) {
    try {
        const response = await fetch(url);
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, "text/html");

        return {
            url,
            title: doc.querySelector('meta[property="og:title"]')?.getAttribute("content") || "Sem título",
            description: doc.querySelector('meta[property="og:description"]')?.getAttribute("content") || "Sem descrição",
            image: doc.querySelector('meta[property="og:image"]')?.getAttribute("content") || "Sem imagem",
            price: doc.querySelector('meta[property="og:price"]')?.getAttribute("content") || "Sem preço",
        };
    } catch (error) {
        console.error(`Erro ao buscar meta tags de ${url}:`, error);
        return { url, error: error.message };
    }
}

async function fetchMultipleMetaTags(urls) {
    const promises = urls.map(fetchMetaTags);
    return Promise.all(promises);
}

// Função para atualizar os elementos com os dados das meta tags
function updateProductElements(data, category) {
    data.forEach((meta, index) => {
        const titleElement = document.getElementById(`title-${category}-${index}`);
        const descriptionElement = document.getElementById(`description-${category}-${index}`);
        const imageElement = document.getElementById(`image-${category}-${index}`);
        const priceElement = document.getElementById(`price-${category}-${index}`);

        if (titleElement) titleElement.innerHTML = meta.title;
        if (descriptionElement) descriptionElement.innerHTML = meta.description;
        if (imageElement) imageElement.src = meta.image;
        if (priceElement) priceElement.innerHTML = meta.price;
    });
}

// Função para carregar e processar as meta tags
async function carregarMetaTags() {
    const dataDeus = await fetchMultipleMetaTags(urlsDeus);
    const dataNatureza = await fetchMultipleMetaTags(urlsNatureza);
    const dataTecnologia = await fetchMultipleMetaTags(urlsTecnologia);

    console.log("Meta Tags Deus:", dataDeus);
    console.log("Meta Tags Natureza:", dataNatureza);
    console.log("Meta Tags Tecnologia:", dataTecnologia);

    updateProductElements(dataDeus, 'products');
    updateProductElements(dataNatureza, 'products-natureza');
    updateProductElements(dataTecnologia, 'products-tecnologia');
}