import '../sass/index.scss';
import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
const API_KEY = '33415298-271b0b6a0a6f42bbb2b32552d';
const URL = 'https://pixabay.com/api/';

const loadMore = document.querySelector(".load-more");
const input = document.querySelector("input[name='searchQuery']");

const form = document.getElementById("search-form");
let query = "";
let page = 1;
let totalHits = 0;

async function onSubmit(e){
 e.preventDefault();
 page = 1;
 query = input.value.trim();
 if (query === "") {
    hideButton();
    updateNewList("");
    Notiflix.Notify.failure('Please enter a request');
    form.reset();
    return;
 }
 console.log(query);
 try {
const results = await fetchImages(query);
console.log(results);
if (results.length ===0){
  hideButton();
  updateNewList("");
  Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
  return;
}
   const markup = createMarkup( results );  
   updateNewList(markup);
   showButton();
   Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`)
 } catch (error){
    console.log(error);
 } finally {
    form.reset();
    page+=1;
 }
} 

async function onButtonClick(){
  try {
  const results = await fetchImages(query);
  const markup = createMarkup( results );
  loadMoreList(markup);
  console.log(results);
} catch (error){
  console.log(error);
} finally {
  form.reset();
  page+=1;

}}

async function fetchImages(query){
        const response = await axios
        .get(`${URL}?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`);
        totalHits = response.data.totalHits;
        return response.data.hits;
        
};
function updateNewList(markup){
document.querySelector(".gallery").innerHTML = markup;
new SimpleLightbox('.gallery a').refresh();
}

function loadMoreList(markup){
  document.querySelector(".gallery").insertAdjacentHTML("beforeend", markup);
  new SimpleLightbox('.gallery a').refresh();
if (page === Math.ceil(totalHits/40)) {
  Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
  hideButton();
}
}

form.addEventListener("submit", onSubmit);

loadMore.addEventListener("click", onButtonClick);

function createMarkup( results ){
 return results.map(result => 
    `<div class="photo-card">
    <a href=${result.largeImageURL}><img src=${result.webformatURL} alt=${result.tags} loading="lazy" /></a>
      <div class="info">
        <p class="info-item">${result.likes}
          <b>Likes</b>
        </p>
        <p class="info-item">${result.views}
          <b>Views</b>
        </p>
        <p class="info-item">${result.comments}
          <b>Comments</b>
        </p>
        <p class="info-item">${result.downloads}
          <b>Downloads</b>
        </p>
      </div>
    </div>`
    ).join("");
}

function showButton() {
  loadMore.classList.remove("disabled");
};
function hideButton(){
  loadMore.classList.add("disabled");
}