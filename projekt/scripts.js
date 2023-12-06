const baza = {
  host: 'localhost',
  user: 'root',
  pass: '',
  baza: 'uzbrojenie',
  sql: ''
}

const baseURL = 'http://localhost/projekt/';

/*
  INFORMAZJE NA TEMAT BAZY DANYCH:
  SQL Encji:
  CREATE TABLE Bron
  (
    IdBroni INT NOT NULL AUTO_INCREMENT,
    Opis VARCHAR(200) NOT NULL,
    LinkObrazka VARCHAR(200),
    PRIMARY KEY (IdBroni)
  );
  Tabela Broni zawiera informację o jej nazwie, opisie oraz linku do obrazka, ponieważ baza nie przechowuje obrazów tylko korzysta z zewnętrznych źródeł.

  CREATE TABLE Recenzja
  (
    Ocena INT NOT NULL AUTO_INCREMENT,
    NazwaProfilu VARCHAR(50) NOT NULL,
    Data DATE NOT NULL,
    Godzina VARCHAR(5) NOT NULL,
    IdRecenzji INT NOT NULL,
    Opis VARCHAR(200) NOT NULL,
    IdBroni INT NOT NULL,
    PRIMARY KEY (IdRecenzji, IdBroni),
    FOREIGN KEY (IdBroni) REFERENCES Bron(IdBroni)
  );
  Tabela Recenzji zawiera informację o nazwie autora, treści, ocenie wystawionej oraz id_broni której dotyczy

  CREATE TABLE Bron_SlowaKlucze
  (
    SlowaKlucze VARCHAR(30) NOT NULL,
    IdBroni INT NOT NULL,
    PRIMARY KEY (SlowaKlucze, IdBroni),
    FOREIGN KEY (IdBroni) REFERENCES Bron(IdBroni)
  );
  Tabela Słów kluczowych zawiera słowa klucze i bronie których dotyczą.
*/

window.onload = function () {
  displayProducts(null);
  addNavigation();
  addSearching();
  document.getElementById("add-weapon").addEventListener("click", generateWeaponForm);
}

/*
  Funkcja dodająca do paska wyszukiwarki oraz przyscisku funkcjonalność filtrowania broni
*/
function addSearching() {
  const searchInput = document.getElementById("search-input");
  const searchButton = document.getElementById("enter-search");

  searchInput.addEventListener("keyup", async (event) => {
    if (event.key === "Enter") {
      displayProducts(await search(searchInput.value));
    }
  });

  searchButton.addEventListener("click", async() => displayProducts(await search(searchInput.value)));
}
/*
  Funkcja zwracająca id broni w oparciu o słowo klucz
  1. W pierwszej kolejności fetchowane są id pasujące
  2. Następnie jeśli takowe nie zostają znalezione, fetchowane są wszystkie słowa klucze i poddawane filtracji algorytmem Levenisha. 
  Te z podobieństwem mniejszym mniż 0.75 są odrzucane
*/
async function search(keyword) {
  console.log(`keyword: ${keyword}`);

  if(!keyword) {
    null;
  }

  baza.sql = `SELECT IdBroni FROM bron_slowaklucze WHERE SlowaKlucze = '${keyword.toLowerCase()}'`;
  const dataToSend = JSON.stringify(baza);
  let url = new URL('post_baza.php', baseURL);

  let response = await fetch(url, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json; charset=UTF-8'
      },
      body: dataToSend
  })
  let result = await response.json();
  console.log(`result: ${result}`);
  const finalResult = [];
  if (result.length !== 0) {
    result.forEach(element => {
      finalResult.push(element.IdBroni);
    });
    console.log(`final result: ${finalResult}`);
    return finalResult;
  } else {
    baza.sql = `SELECT * FROM bron_slowaklucze`;
    const dataToSend = JSON.stringify(baza);
    response = await fetch(url, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json; charset=UTF-8'
      },
      body: dataToSend
    })
    result = await response.json();
    console.log(`result: ${result}`);
    result.forEach(element => {
      const similarity = calculateSimilarity(element.SlowaKlucze, keyword);
      console.log(`similarity: ${similarity}`)
      if (similarity > 0.75) {
        finalResult.push(element.IdBroni);
      }
    });
    console.log(`final result: ${finalResult}`);
    return finalResult;
  }
}


/*
  Funkcja licząca podobieństwo w skali 0-1
*/
function calculateSimilarity(str1, str2) {
  const maxLength = Math.max(str1.length, str2.length);
  const distance = levenshteinDistance(str1, str2);

  const similarity = 1 - distance / maxLength;

  return similarity;
}

/*
  Algorytm Levenisha do liczenia podobieństwa
*/
function levenshteinDistance(str1, str2) {
  const matrix = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      let cost = 0;
      if( str1[j - 1] === str2[i - 1]) {
        cost = 0;
      } else {
        cost = 1;
      }
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[str2.length][str1.length];
}

/*
  Funkcja wypełniająca stronę tabelą fetchowanych broni poprzez element appcontent.
  Są dodawane w dwóch kolumnach.
  Obrazek ilości gwiazdek zależy od wartości zwracanej przez funkcję getReview();
  Z dodatkowym warunkiem:
  - Jeśli jest parametr i jego typ to tablica, to w tej tablicy musi się znajdować indeks broni.
*/
async function displayProducts(productIds) {
  const appcontent = document.getElementById("appcontent");

  appcontent.innerHTML = "";
  
  const table = document.createElement("table");
  table.id = "products-table";

  appcontent.appendChild(table);

  baza.sql = "SELECT Nazwa, Opis, LinkObrazka, IdBroni FROM bron";
  const dataToSend = JSON.stringify(baza);
  let url = new URL('post_baza.php', baseURL);

  let response = await fetch(url, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json; charset=UTF-8'
      },
      body: dataToSend
  })

  let result = await response.json();
  console.log(result);

  let row = table.insertRow(0);
  let j = 0;
  for(let i = 0; i < result.length; i++) {
    console.log(productIds);
    if(!productIds ||  (Array.isArray(productIds) && productIds.includes(result[i].IdBroni))) {
      const review =  await getReview(result[i].IdBroni);
      if(j%2 === 0) {
        row = table.insertRow(j/2);
        const cell = row.insertCell(-1);
        cell.innerHTML = `
        <span class="product-preview-container" data-product-id="${result[i].IdBroni}">
          <div>
            <label class="product-preview-label">${result[i].Nazwa}</label>
          </div>
          <div>
            <img class="product-preview-image" src="${result[i].LinkObrazka}">
          </div>
          <div>
            <img class="product-preview-rating" src="images/rating-${review}.png">
          </div>
        </span>
        `;
      } else {
        const cell = row.insertCell(0);
        cell.innerHTML = `
        <span class="product-preview-container" data-product-id="${result[i].IdBroni}">
          <div>
            <label class="product-preview-label">${result[i].Nazwa}</label>
          </div>
          <div>
            <img class="product-preview-image" src="${result[i].LinkObrazka}">
          </div>
          <div>
            <img class="product-preview-rating" src="images/rating-${review}.png">
          </div>
        </span>
        `;
      }
      j++;
    } 
  }
}

/*
  Funkcja fetchująca wszystkie recenzję broni o danym id, a następnie zwracająca ich średnią,
  zaokrągloną do najbliższej piątki.
*/
async function getReview(productID) {
  baza.sql = `SELECT Ocena FROM recenzja WHERE IdBroni = ${productID}`;
  const dataToSend = JSON.stringify(baza);
  let url = new URL('post_baza.php', baseURL);

  let response = await fetch(url, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json; charset=UTF-8'
      },
      body: dataToSend
  })

  let result = await response.json();
  let totalRating = 0;

  if(result.length === 0) {
    return 0;
  }

  for(let i = 0; i < result.length; i++) {
    totalRating += parseInt(result[i].Ocena);
  }
  const averageRating = totalRating / result.length;
  const leftover = averageRating % 5;
  let roundedRating;
  if (leftover > 2.5) {
    roundedRating = averageRating + (5 - (averageRating % 5));
  } else {
    roundedRating = averageRating - (averageRating % 5);
  }

  return roundedRating;
}

/*
  Funkcja elementom wygenerowanym w displayProducts(), funkcjonalność.
  Gdy zostaną kliknięte, zmieniają zawartość strony (appcontent) na swój artykuł, generowany w funkcji fetchProductArticle(idBroni).
  Dodatkowo przyciskowi dodawania recenzji wygenerowanemu w tym przydziela sięfunkcję generateReviewForm() przy kliknięciu.
*/
function addNavigation() {
  console.log("addNavigation function called");

  const appcontent = document.getElementById("appcontent");
  
  appcontent.addEventListener('click', async function (event) {
    const productContainer = event.target.closest('.product-preview-container');
    
    if (productContainer) {
      const productId = productContainer.getAttribute('data-product-id');
      console.log("Product clicked. ID:", productId);
      appcontent.innerHTML = await fetchProductArticle(productId);
      document.getElementById('add-review-button').addEventListener('click', generateReviewForm);
    }
  });
}

/*
  Funkcja fetchująca Encję broni a następnie generująca artykuł w oparciu o otrzymane dane.
  Pod artykułem w elemencie 'form-review-container' dodawana jest lista recenzji.
*/
async function fetchProductArticle(productId) {
  
  const keywords = async () => {
    let result = "";
    const keywords = await getKeywordsByWeaponId(productId);
    keywords.forEach((keyword) => {
      result += `#${keyword} `;
    });
    return result;
  }

  baza.sql = `SELECT IdBroni, Nazwa, LinkObrazka, Opis FROM bron WHERE IdBroni = ${productId}`;
  const dataToSend = JSON.stringify(baza);
  let url = new URL('post_baza.php', baseURL);
  const review = await getReview(productId);
  let response = await fetch(url, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json; charset=UTF-8'
    },
    body: dataToSend
  })

  let result = await response.json();

  const html = `
  <span id="product-article-container" data-product-id="${result[0].IdBroni}">
      <label class="product-article-label">${result[0].Nazwa}</label>

      <img class="product-article-image" src="${result[0].LinkObrazka}">

      <p class="product-article-describtion">${result[0].Opis}</p>
      <div id="keywords-list">
        <p >
        ${await keywords()}
        </p>
      </div>
      <div class="product-article-rating">
        <label>
          Średnia Ocena: 
        </label> 
        <img src="images/rating-${review}.png">
      </div>
  </span>
  <div id="product-review-container">
    <div id="reviews-header">
      <p id="reviews-headline">Recenzje:</p>
      <button id = "add-review-button" class="add-review">Dodaj Recenzję</button>
    </div>
    <div id="form-review-container">
      ${await fetchReviews(productId)}
    </div>
  </div>
    
  `;
  console.log(await getKeywordsByWeaponId(productId));
  return html;
}

/*
Funkcja zwraca słowa klucze danej broni jako array.
*/
async function getKeywordsByWeaponId(productId) {
  const url = new URL('post_baza.php', baseURL); 
  baza.sql = `SELECT SlowaKlucze FROM Bron_SlowaKlucze WHERE IdBroni = ${productId}`;
  const dataToSend = JSON.stringify(baza);

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8'
    },
    body: dataToSend
  });

  const result = await response.json();
  const resultArray = [];
  result.forEach((element) => {
    resultArray.push(element.SlowaKlucze);
  })
  return resultArray;
}

/*
  Funkcja zwracająca html recenzji.
  Fetchowane są wszystkie recenzje danej broni i dla każdej tworzony jest kontener w postaci diva.
*/
async function fetchReviews(productId) {
  console.log("fetching reviews");
  let html = "";
  html += "<div>";
  baza.sql = `SELECT Ocena, NazwaProfilu, Godzina, Data, Opis FROM recenzja WHERE IdBroni = ${productId}`;
  const dataToSend = JSON.stringify(baza);
  let url = new URL('post_baza.php', baseURL);
  let response = await fetch(url, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json; charset=UTF-8'
    },
    body: dataToSend
  })
  console.log("fetching results complete");
  let result = await response.json();
  console.log(`result: ${result}`);
  result.forEach(element => {
    console.log(` Recenzja:\nnazwa: ${element.NazwaProfilu} data:${element.Data} godzina:${element.Godzina}`);
    html += `<div class="review">`;
    html += `<div class="review-header"><p class="reviewer-name">${element.NazwaProfilu}</p><p class= "review-time">${element.Data} ${element.Godzina}</p></div><div class="review-rating"> <img src="images/rating-${element.Ocena}.png" ></div>`;
    html += `<div class="review-content"><p >${element.Opis}</p></div>`;
    html += "</div>";
  });

  html += "</div>";
  return html;
}

/*
  Html elementu 'form-review-container' jest zastępowany formularzem dodawania recenzji.
  Przy założeniu że element ten istnieje dzięki funkcji fetchProductArticle()
*/
function generateReviewForm() {
  console.log("generating review form");
  const buttonContainer = document.getElementById("reviews-header");
  buttonContainer.innerHTML = "Recenzje:";
  const formContainer = document.getElementById("form-review-container");
  let options = "";
  for(let i = 0; i <= 50; i+=5) {
    options+=`<option value="${i}" style="background-image: url(images/rating-${i}.png);">${i*0.1}⭐</option>`;
  }
  const formHTML = `
    <form id="add-review-form">
      <label for="new-name">Nazwa Użytkownika:</label>
      <input type="text" id="new-name"required>
      
      <label for="new-rating">Ocena:</label>
      <select id="new-rating" required>
        ${options}
      </select>
      
      <label for="new-review-content">Treść recenzji:</label>
      <textarea id="new-review-content" rows="5" required></textarea>
      
      <button type="button" class="add-review" onclick="submitReview()">Dodaj recenzję</button>
      <p id="form-error"></p>
    </form>
  `;

  formContainer.innerHTML = formHTML;
}

/*
  ***Funkcja nie używana***
  Pierwotnie miała służyć do aktualizowania obrazków w tle elementu wyboru oceny (<select>) dla formularza generowanego w funkcji generateReviewForm(),
  w oparciu o parametr 'value', żeby wybierane opcje były obrazkami z gwiazdkami z folderu /images a nie tekstem.
  Ostatecznie mi nie wyszło i nie chciało się wczytywać ale funkcję zostawiłem i nie usunąłem.
*/
function updateRatingImage() {
  const selectElement = document.getElementById('new-rating');
  const imageElement = document.getElementById('rating-image');

  const selectedRating = selectElement.value;

  if (selectedRating !== '0') {
    imageElement.src = `images/rating-${selectedRating}.png`;
  } else {
    imageElement.src = '';
  }
}

/*
  Funkcja wykonująca fetchem zapytanie INSERT do tabeli 'recenzje' z danymi z formularza,
  generowanego w generateReviewForm(),
  a następnie odświerzająca artykuł broni
*/
async function submitReview() {
  const form = document.getElementById('add-review-form')
  for (let i = 0; i < form.elements.length; i++) {
    if(form.elements[i].type !== "button" && form.elements[i].type !== "label") {
      if (form.elements[i].value === '') {
        document.getElementById("form-error").innerHTML = "<p>*Nie wszystkie pola są wypełnione</p>";
        return;
      }
    }
  }

  const username = document.getElementById('new-name').value;
  const rating = document.getElementById('new-rating').value;
  const description = document.getElementById('new-review-content').value;
  const productId = document.getElementById('product-article-container').getAttribute('data-product-id');

  //formatowanie daty i godziny
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  let month = currentDate.getMonth();
  let day = currentDate.getDay();
  if(month < 10) {
    month = '0' + month;
  }
  if(day < 10) {
    day = '0' + day;
  }
  const formattedDate = `${year}-${month}-${day}`;
  console.log(formattedDate);
  const formattedTime = currentDate.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}); 

  baza.sql = `INSERT INTO recenzja (Opis, Ocena, NazwaProfilu, Data, Godzina, IdBroni) 
  VALUES ('${description}', ${rating}, '${username}', '${formattedDate}', '${formattedTime}', ${productId})`;

  console.log(baza);

  const url = new URL('post_baza.php', baseURL);
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8'
    },
    body: JSON.stringify(baza)
  });

  console.log(response);
  console.log("successfully added a new review");
  const appcontent = document.getElementById("appcontent");
  appcontent.innerHTML = await fetchProductArticle(productId);
  document.getElementById('add-review-button').addEventListener('click', generateReviewForm);
}

/*
  Funkcja zastępująca treść strony (appcontent) formularzem dodawania nowej broni
*/
async function generateWeaponForm() {
  const appcontent = document.getElementById("appcontent");

  const formHTML = `
    <form id="add-new-weapon-form">
      <label for="new-weapon-name">Nazwa Broni:*</label>
      <input type="text" id="new-weapon-name" required>

      <label for="new-weapon-image">Link do Ikony:*</label>
      <input type="text" id="new-weapon-image" required>

      <label for="new-weapon-description">Opis Oręża:*</label>
      <textarea id="new-weapon-description" rows="5" required></textarea>
      <button type="button" id="keyword-adder" class="add-review">Dodaj słowo klucz</button>
      <button type="button" id="add-article-button" class="add-review">Dodaj Oręż</button>
      <div id="weapon-form-error"></div>
    </form>
  `;

  appcontent.innerHTML = formHTML;
  document.getElementById("keyword-adder").addEventListener("click", addKeywordField);
  document.getElementById("add-article-button").addEventListener("click", submitWeapon);
}

/*
  Funkcja wykonująca fetchem zapytanie INSERT do tabeli 'broń' a następnie 
  wykonująca fetchem zapytanie INSERT do tabeli 'słowa klucze' dodając do niej każde słowo klucz w formularzu + nazwę broni.
*/
async function submitWeapon() {
  const form = document.getElementById('add-new-weapon-form')
  for (let i = 0; i < form.elements.length; i++) {
    if(form.elements[i].type !== "button" && form.elements[i].type !== "label") {
      if (form.elements[i].value === '' && form.elements[i].required) {
        document.getElementById("weapon-form-error").innerHTML = "<p>*Nie wszystkie pola są wypełnione</p>";
        return;
      }
    }
  }

  const name = document.getElementById("new-weapon-name").value;
  const link = document.getElementById("new-weapon-image").value;
  const description = document.getElementById("new-weapon-description").value;
  
  baza.sql = `INSERT INTO bron (Opis, LinkObrazka, Nazwa) VALUES ('${description}','${link}','${name}')`;
  
  const url = new URL('post_baza.php', baseURL);
  await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8'
    },
    body: JSON.stringify(baza)
  });

  console.log("dodano do bazy");

  baza.sql = `SELECT IdBroni FROM bron WHERE Nazwa = '${name}'`;
  
  let response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8'
    },
    body: JSON.stringify(baza)
  });

  let result = await response.json();

  console.log(`zwrócono ID: ${result[0].IdBroni}`);

  let keywordSql = "INSERT INTO bron_slowaklucze (SlowaKlucze, IdBroni) VALUES ";
  console.log(`elements: ${form.elements}`);
  for (let i = 0; i < form.elements.length; i++) {
    if (form.elements[i].tagName === 'INPUT' && form.elements[i].className === 'new-keyword') {
      keywordSql += `('${form.elements[i].value.toLowerCase()}','${result[0].IdBroni}'),`;
    }
  }
  keywordSql += `('${name.toLowerCase()}','${result[0].IdBroni}');`;
  console.log(keywordSql);
  baza.sql = keywordSql;

  await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8'
    },
    body: JSON.stringify(baza)
  });

  displayProducts(null);
}

/*
  funkcja dodająca do formularza dodawania broni pole słowa klucz do wypełnienia
*/
function addKeywordField() {

  const form = document.getElementById("add-new-weapon-form");
  const keywordField = document.createElement("div");
  keywordField.innerHTML = `
  <label for="new-keyword">Słowo Klucz:</label>
  <input type = "text" class="new-keyword"></input>
  `;


  form.appendChild(keywordField);
}