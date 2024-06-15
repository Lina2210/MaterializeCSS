/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
  // Cordova is now initialized. Have fun!
  fetch('https://api.spaceflightnewsapi.net/v3/articles')
    .then(response => response.json())
    .then(data => {
      const newsList = document.getElementById('news-list');
      newsList.innerHTML = '';
      data.forEach(article => {
        const li = document.createElement('li');
        li.classList.add('collection-item');
        li.innerHTML = `<a href="#!" onclick="loadFullArticle('${article.id}')">${article.title}</a>`;
        newsList.appendChild(li);
      });
    })
    .catch(error => {
      console.error('Error fetching articles:', error);
    });

  console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
  document.getElementById('deviceready').classList.add('ready');
}

function loadFullArticle(articleId) {
  // Realizar la solicitud a la API para obtener el artículo específico
  fetch(`https://api.spaceflightnewsapi.net/v3/articles/${articleId}`)
    .then(response => response.json())
    .then(article => {
      // Actualizar el título del artículo
      document.getElementById('article-title').textContent = article.title;

      // Actualizar el contenido del artículo
      const articleContent = document.getElementById('article-content');
      articleContent.innerHTML = `
        <div class="row">
          <div class="col s12">
            <img src="${article.imageUrl}" alt="Article Image" class="responsive-img">
            <p>${article.summary}</p>
          </div>
        </div>
      `;

      // Actualizar el enlace para la noticia original
      const originalLink = document.getElementById('original-link');
      originalLink.setAttribute('onclick', `openExternalLink('${article.url}')`);

      // Seleccionar automáticamente el tab2 usando Materialize
      $('.tabs').tabs('select', 'tab2');
    })
    .catch(error => {
      console.error('Error fetching article:', error);
    });
}

function loadNewsInCards() {
    fetch('https://api.spaceflightnewsapi.net/v3/articles')
      .then(response => response.json())
      .then(data => {
        const newsCards = document.getElementById('news-cards');
        newsCards.innerHTML = '';
        data.forEach(article => {
          newsCards.innerHTML += `
            <div class="col s12 m6">
              <div class="card">
                <div class="card-image">
                  <img src="${article.imageUrl}" alt="Article Image">
                  <span class="card-title">${article.title}</span>
                </div>
                <div class="card-content">
                  <p>${article.summary}</p>
                </div>
                <div class="card-action">
                  <a href="#" onclick="openExternalLink('${article.url}')">Noticia original.</a>
                </div>
              </div>
            </div>
          `;
        });
      });
  }

// Función para abrir enlace externo en el navegador del dispositivo
function openExternalLink(url) {
  window.open(url, '_system');
  return false;
}
