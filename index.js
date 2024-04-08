document.addEventListener('DOMContentLoaded', function () {
    const moviesGrid = document.getElementById('moviesGrid');
    const searchInput = document.getElementById('searchInput');
    const genreFilter = document.getElementById('genreFilter');
    const yearFilter = document.getElementById('yearFilter');

    let moviesData = []; 

    
    const apiKey = '8b4022918a3496c57b323839c1bb486e';
    const accessToken = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4YjQwMjI5MThhMzQ5NmM1N2IzMjM4MzljMWJiNDg2ZSIsInN1YiI6IjY2MDUxNDllZDdmNDY1MDE3Y2RiYjU4MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.2jRm6WMHajunAM29SxOwGpvArK9YNb34JNMwqrJhlRU';
    const apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_original_language=te`;
    fetch(apiUrl, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log('Json data coming from Api');
        console.log(data)
        moviesData = data.results.map(movie => ({
            title: movie.title,
            genre: movie.genre_ids.map(id => getGenreName(id)), 
            year: movie.release_date.split('-')[0],
            poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        }));
        localStorage.setItem('moviesData', JSON.stringify(moviesData));
        console.log('Initial Movie data');
        console.log(moviesData);
        displayMovies(moviesData);
        populateGenresFilter(moviesData);
        populateYearsFilter(moviesData);
    })
    .catch(error => console.error('Error fetching movie data:', error));

    function displayMovies(movies) {
        if (movies.length === 0) {
            moviesGrid.innerHTML = '<p>No movies found</p>';
            return;
        }

        moviesGrid.innerHTML = '';
        movies.forEach(movie => {
            const movieCard = document.createElement('div');
            movieCard.classList.add('movie-card');
            movieCard.innerHTML = `
                <img src="${movie.poster}" alt="${movie.title}">
                <div class="movie-info">
                    <h2 class="movie-title">${movie.title}</h2>
                    <p>${movie.genre.join(', ')} (${movie.year})</p>
                </div>
            `;
            const movieTitle = movieCard.querySelector('.movie-title');
            movieTitle.addEventListener('click', () => openMovieDetails(movie));
            moviesGrid.appendChild(movieCard);
        });
    }

    function filterMovies() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedGenre = genreFilter.value;
        const selectedYear = yearFilter.value;

        let filteredMovies = moviesData.filter(movie => {
            const matchesSearchTerm = movie.title.toLowerCase().includes(searchTerm);
            const matchesGenre = selectedGenre === '' || movie.genre.includes(selectedGenre);
            const matchesYear = selectedYear === '' || movie.year === selectedYear;
            //console.log(matchesSearchTerm && matchesGenre && matchesYear)
            return matchesSearchTerm && matchesGenre && matchesYear;
        });
        console.log('Filtered movies data');
        console.log(filteredMovies);

        if (filteredMovies.length === 0) {
            moviesGrid.innerHTML = '<p>No movies found</p>';
            return;
        }

        displayMovies(filteredMovies);
    }

    searchInput.addEventListener('input', filterMovies);
    genreFilter.addEventListener('change', filterMovies);
    yearFilter.addEventListener('change', filterMovies);

    function populateYearsFilter(movies) {
        const years = movies.map(movie => movie.year);
        const uniqueYears = Array.from(new Set(years));
        uniqueYears.sort((a, b) => b - a); 
        uniqueYears.forEach(year => {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearFilter.appendChild(option);
        });
    }

    function populateGenresFilter(movies) {
        const allGenres = movies.flatMap(movie => movie.genre);
        const uniqueGenres = Array.from(new Set(allGenres));
        uniqueGenres.forEach(genre => {
            const option = document.createElement('option');
            option.value = genre;
            option.textContent = genre;
            genreFilter.appendChild(option);
        });
    }

    function getGenreName(id) {
        switch (id) {
            case 28:
                return 'Action';
            case 35:
                return 'Comedy';
            case 18:
                return 'Drama';
            default:
                return 'Unknown';
        }
    }

    function openMovieDetails(movie) {
        const searchQuery = `${movie.title} movie details`; // Constructing search query
        const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
        
        window.open(googleSearchUrl, '_blank');
    }
});
