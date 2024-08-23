// https://www.omdbapi.com/?s=dark&apikey=8dea0f06
//https://www.omdbapi.com/?s=dark&page=2&apikey=8dea0f06
//https://www.omdbapi.com/?t=The-Dark-Knight&apikey=8dea0f06`

const results = document.querySelector('.results');
const showmore = document.querySelector('.show-more-button');
const scrollToTop = document.querySelector('.scroll-to-top-button');
const userInputBox = document.querySelector('.user-input-movie');
const searchButoon = document.querySelector('.search-btn');
const form = document.querySelector('form');
const card = document.querySelector('.card');
const helperText = document.querySelector('.helper-text');
const loading = document.querySelector('.loading')

let page = 1;
let flag = 0;
let resultFlag = 0;

form.addEventListener("submit", (e)=>{
    e.preventDefault()
    helperText.textContent = ''
    loading.classList.add('load');
    document.querySelector('.bottom-btn').style.display = 'none'
    results.innerHTML = ''
    // console.log("done");
    if(userInputBox.value === ""){
        loading.classList.remove('load')
        helperText.textContent = `Search Your Favorite Movie Here!`
        return
    }
    searchCinema(userInputBox.value.trim())
    // console.log(userInputBox.value.trim());
    resultFlag = 0
})

function searchCinema(movieName, pageNumber = 1){
    fetch(`https://www.omdbapi.com/?s=${movieName}&page=${pageNumber}&apikey=8dea0f06`)
    .then(response => response.json())
    .then(data => {
        // console.log(data);
        // console.log(data.Search);
        showMovieResults(data.Search)
    }).catch(()=>{
        errorHandle();
        // console.error("error");
    })
}

function showMovieResults(movie){
    if(resultFlag === 0) helperText.textContent = `Showing results for: "${userInputBox.value.trim()}"`

    movie.forEach(element => {
        const movieDiv = document.createElement('div')
        const movieName = document.createElement('p')

        movieDiv.className = `movie-div flex flex-col`
        movieName.className = `movie-name`

        if(element.Poster === `N/A`) movieDiv.style.backgroundImage = `url(./image/default-poster.jpg)`
        else movieDiv.style.backgroundImage = `url(${element.Poster})`

        movieName.textContent = `${element.Title} (${element.Year})`

        movieDiv.append(movieName)
        loading.classList.remove('load')
        results.append(movieDiv)
        document.querySelector('.bottom-btn').style.display = 'block'
        resultFlag = 1

        movieDiv.addEventListener("click", (e)=>{
            e.preventDefault()
            if(flag === 1) return
            loading.classList.add('load')
            getCinemaPlot(element.Title)
        })
    });
}

function getCinemaPlot(movieName){
    fetch(`https://www.omdbapi.com/?t=${movieName}&apikey=8dea0f06`)
    .then(response => response.json())
    .then(data => {
        // console.log(data);
        addMoreInfoCard(data)
    }).catch(()=>{
        // console.error("error");
        errorHandle()
    })
}

function addMoreInfoCard(movie){
    const moviePoster = document.createElement('img')
    const movieTitle = document.createElement('p')
    const movieRuntime = document.createElement('p')
    const movieDirector = document.createElement('p')
    const movieGenre = document.createElement('p')
    const movieRating = document.createElement('p')
    const movieActor = document.createElement('p')
    const moviePlot = document.createElement('p')
    const movieRelease = document.createElement('p')
    
    if(movie.Poster === 'N/A') moviePoster.setAttribute('src', `./image/default-poster.jpg`)
    else moviePoster.setAttribute('src', `${movie.Poster}`)
    movieTitle.textContent = movie.Title
    movieRuntime.textContent = `Runtime : ${movie.Runtime}`
    movieDirector.textContent = `Director : ${movie.Director}`
    movieGenre.textContent = `Genre : ${movie.Genre}`
    movieRating.innerHTML = `Rating : ${movie.imdbRating} &#x2B50`
    movieActor.textContent = `Actors : ${movie.Actors}`
    moviePlot.textContent = `${movie.Plot}`
    movieRelease.textContent = `Released on : ${movie.Released}`
    
    moviePoster.className = 'movie-poster';
    movieTitle.className = 'card-movie-title';
    moviePlot.className = 'card-movie-plot';
    movieRelease.classList = 'card-movie-oth';
    movieActor.classList = 'card-movie-oth';
    movieDirector.classList = 'card-movie-oth';
    movieGenre.classList = 'card-movie-oth';
    movieRating.classList = 'card-movie-oth';
    movieRuntime.classList = 'card-movie-oth';

    card.appendChild(moviePoster)
    card.appendChild(movieTitle)
    card.appendChild(movieRelease)
    card.appendChild(movieDirector)
    card.appendChild(moviePlot)
    card.appendChild(movieGenre)
    card.appendChild(movieActor)
    card.appendChild(movieRuntime)
    card.appendChild(movieRating)
    loading.classList.remove('load')
    card.classList.add('active')
    document.querySelector('.container').classList.add('blur')
    flag = 1
}

document.body.addEventListener("click",()=>{
    card.innerHTML = ``
    card.classList.remove('active')
    document.querySelector('.container').classList.remove('blur')
    flag = 0
})

showmore.addEventListener("click",()=>{
    loading.classList.add('load')
    searchCinema(userInputBox.value.trim(), ++page)
})

scrollToTop.addEventListener("click",()=>{
    window.scrollTo({
        top : 0,
        behavior: "smooth"
    })
})

function errorHandle(){
    document.querySelector('.error-text').classList.add('load');
    
    if(resultFlag==0)helperText.textContent = 'No results found';
    setTimeout(()=>{
        if(resultFlag==0){
            document.querySelector('.bottom-btn').style.display = 'none';
        }
        document.querySelector('.error-text').classList.remove('load');
        document.querySelector('.loading').classList.remove('load');
    },3000);
}