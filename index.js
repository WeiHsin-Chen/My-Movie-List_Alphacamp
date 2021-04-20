//設定變數
//設定 URL 變數
const base_URL = 'https://movie-list.alphacamp.io'
const index_URL = base_URL + '/api/v1/movies/'
const poster_URL = base_URL + '/posters/'
//MOvies資料變數
const dataPanel = document.querySelector('#data-panel')
const movies = []
//篩選Movies資料變數
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
let filteredMovies = []
//Movies分頁變數
const paginator = document.querySelector('#paginator')
const MOVIES_PER_PAGE = 12
let pageNumber = 1
//Change Mode變數
const changeMode = document.querySelector('#change-mode')
let mode = 'cardmode'

//從API抓取Movies資料
axios.get(index_URL)
  .then((response) => {
    //Array(80)
    // for (const movie of response.data.results) {
    //   movies.push(movie)
    // }
    movies.push(...response.data.results)
    renderMovieList(getMoviesByPage(1))
    renderPaginator(movies.length)
    // renderListMode(movies)
  })

//Function Section
//渲染Movies Cards資料
function renderMovieList(data) {
  let rawHTML = ''
  if (mode === 'cardmode') {
    data.forEach((item) => {
      rawHTML +=
        ` <div class="col-sm-3">
          <div class="mb-2">
            <div class="card">
              <img src="${poster_URL + item.image}" class="card-img-top" alt="Movie Poster">
              <div class="card-body">
                <h5 class="card-title">${item.title}</h5>
              </div>
              <div class="card-footer">
                <button class="btn btn-primary btn-show-movie" data-toggle="modal"
                  data-target="#movie-modal" data-id="${item.id}">More</button>
                <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
              </div>
            </div>
          </div>
        </div>
        `
    })
  }
  if (mode === 'listmode') {
    rawHTML += `
      <ul class="list-group" style="width: 100rem"> 
      `
    data.forEach((item) => {
      rawHTML += `
      <li class="list-group-item d-flex justify-content-between">${item.title}
        <div class="button">
          <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#movie-modal"
            data-id="${item.id}">More</button>
          <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
        </div>
      </li>    
      `
    })
    rawHTML += `</ul>`
  }
  dataPanel.innerHTML = rawHTML
}

//Function for Madal
function showMovieModal(id) {
  const modalTitle = document.querySelector('#movie-modal-title')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalDescription = document.querySelector('#movie-modal-decription')

  axios.get(index_URL + id)
    .then(response => {
      const data = response.data.results
      modalTitle.innerText = data.title
      modalImage.innerHTML = `<img src="${poster_URL + data.image}" alt="movie-poster" class="img-fluid">`
      modalDate.innerText = 'Release Date： ' + data.release_date
      modalDescription.innerText = data.description
    })
}

//Function for Favorite
function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  const movie = movies.find((movie) => movie.id === id)
  // function isMovieIdMatched(movie) {
  //   return movie.id === id
  // }

  if (list.some((movie) => movie.id === id)) {
    return alert('The movie is already in favorite list.')
  }
  list.push(movie)
  localStorage.setItem('favoriteMovies', JSON.stringify(list))
  // const jsonString = JSON.stringify(list)
  // console.log('json string:', jsonString)
  // console.log('json object: ', JSON.parse(jsonString))
}

//Function for Pagination
//渲染分頁頁碼
function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / MOVIES_PER_PAGE)
  let rawHTML = ''

  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}"> ${page} </a></li>`
  }
  paginator.innerHTML = rawHTML
}

//將電影資料分頁顯示
function getMoviesByPage(page) {
  const data = filteredMovies.length ? filteredMovies : movies
  const startIndex = (page - 1) * MOVIES_PER_PAGE
  return data.slice(startIndex, startIndex + MOVIES_PER_PAGE)
}

//EventListener Section
//Modal和我的最愛監聽器
dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-movie')) {
    console.log(event.target.dataset)
    showMovieModal(Number(event.target.dataset.id))
  }
  else if (event.target.matches('.btn-add-favorite')) {
    addToFavorite(Number(event.target.dataset.id))
  }
})

//分頁監聽器
paginator.addEventListener('click', function onPaginatorClicked(event) {
  if (event.target.tagName !== 'A') return
  pageNumber = Number(event.target.dataset.page)
  renderMovieList(getMoviesByPage(pageNumber))
})

//搜尋監聽器
searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  event.preventDefault()
  let keyword = searchInput.value.trim().toLowerCase()
  filteredMovies = movies.filter((movie) => { return movie.title.toLowerCase().includes(keyword) })
  if (filteredMovies.length === 0) {
    return alert('Cannot find movies with keyword：' + keyword)
  }
  // for (const movie of movies) {
  //   if (movie.title.toLowerCase().includes(keyword)) {
  //     filteredMovies.push(movie)
  //   }
  // }
  renderMovieList(getMoviesByPage(pageNumber))
  renderPaginator(filteredMovies.length)
})

//List/Card Mode監聽器
changeMode.addEventListener('click', function onChangeModeClicked(event) {
  if (event.target.id === "card-mode") {
    mode = 'cardmode'
    renderMovieList(getMoviesByPage(pageNumber))
  }
  else if (event.target.id === "list-mode") {
    mode = 'listmode'
    renderMovieList(getMoviesByPage(pageNumber))
  }
})

