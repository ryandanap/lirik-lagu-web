const form = document.getElementById('form');
const search = document.getElementById('search');
const result = document.getElementById('result');


// API URL
const apiURL = 'https://api.lyrics.ovh'

// form input
form.addEventListener('submit', e => {
    e.preventDefault();
    searchValue = search.value.trim();

    if(!searchValue) {
        alert("Tidak ada lagu untuk di cari")
    } else {
        searchSong(searchValue);
    }
});

// search song
async function searchSong(searchValue) {
    const searchResult = await fetch(`${apiURL}/suggest/${searchValue}`);
    const data = await searchResult.json();
    
    showData(data);
}

// display final result
function showData(data) {
    currentData = data;
    result.innerHTML = `
    <section class="result-box" id="result">Hasil pencarian</section>
         <ul class="song-list">
            ${data.data.map(song => `
                <li>
                <div class="box-content">
                        <img src="${song.artist.picture}" alt="${song.artist.name}">
                        <div class="box-text">
                            <strong>${song.artist.name}</strong>
                            <p class="song-title">${song.title}</p>
                        </div>
                    </div>
                    <span data-artist="${song.artist.name}" data-songtitle="${song.title}">Lirik</span>
                </li>
            `)
            .join(``)}
        </ul>
    `;
}

// untuk mendapatkan button lirik
result.addEventListener('click', e => {
    const clickElement = e.target;

    if (clickElement.tagName === 'SPAN') {
        const artist = clickElement.getAttribute('data-artist');
        const songTitle = clickElement.getAttribute('data-songtitle');

        getLyrics(artist, songTitle)
    }
})

// untuk mendapatkan lirik lagu
async function getLyrics(artist, songTitle) {
    const res = await fetch(`${apiURL}/v1/${artist}/${songTitle}`);
    
    const data = await res.json();

    const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');

    result.innerHTML = `
    <div class="full-lyrics">
        <div class="back-lyrics" id="back-lyrics">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M7.82843 10.9999H20V12.9999H7.82843L13.1924 18.3638L11.7782 19.778L4 11.9999L11.7782 4.22168L13.1924 5.63589L7.82843 10.9999Z"></path>
            </svg>
            Kembali
        </div>
        <br>
        <h2>${artist} - ${songTitle}</h2>
        <p>${lyrics}</p>
    </div>
`;
}

let currentData = null;
result.addEventListener('click', e => {
    if (e.target.closest('#back-lyrics')) {
        if (currentData) {
            showData(currentData); // Kembali ke halaman sebelumnya dengan memanggil showData
        }
    }
});