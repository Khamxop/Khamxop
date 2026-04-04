const form = document.getElementById('form');
const search = document.getElementById('search');
const result = document.getElementById('result');
const more = document.getElementById('more');

const apiURL="https://api.lyrics.ovh/";
form.addEventListener('submit',e=>{
    e.preventDefault();
    const songtext=search.value.trim();
    if(!songtext){
        alert('Please enter a song name');
    }else{
        searchSongs(songtext);
    };
})


async function searchSongs(song){
    const res = await fetch(`${apiURL}suggest/${song}`);
    const data = await res.json();
    showData(data);
}

function showData(data){
    result.innerHTML=`
    <ul class="song-list">
        ${data.data.map(song=>`
        <li>
            <span><strong>${song.artist.name}</strong> - ${song.title}</span>
            <button class="btn" data-artist="${song.artist.name}" data-songtitle="${song.title}">Get Lyrics</button>
        </li>
        `).join('')}
    </ul>
    `;
    if(data.prev || data.next){
        more.innerHTML=`
        ${data.prev ? `<button class="btn" onclick="getMoreSongs('${data.prev}')">Prev</button>` : ''}
        ${data.next ? `<button class="btn" onclick="getMoreSongs('${data.next}')">Next</button>` : ''}
        `;
    }    else{
        more.innerHTML='';
    }
}

async function getMoreSongs(songURL) {

    const res = await fetch(`https://cors-anywhere.herokuapp.com/${songURL}`);
    const data = await res.json();
    showData(data);
}

result.addEventListener('click', e => {
    const clickedEl = e.target;
    if(clickedEl.tagName === 'BUTTON'){
        const artist = clickedEl.getAttribute('data-artist');
        const songTitle = clickedEl.getAttribute('data-songtitle');
        getLyrics(artist, songTitle);
    }
})

function getLyrics(artist, songTitle){
    fetch(`${apiURL}v1/${artist}/${songTitle}`)
    .then(res=>res.json())  
    .then(data=>{
        if(data.lyrics){
            const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g,'<br>');
            result.innerHTML=`<h2><strong>${artist}</strong> - ${songTitle}</h2>
            <span>${lyrics}</span>`;
            more.innerHTML='';
        }else{
            result.innerHTML=`<h2><strong>${artist}</strong> - ${songTitle}</h2>
            <span>Lyrics not found.</span>`;
        }
    })
    .catch(err=>{
        result.innerHTML=`<h2><strong>${artist}</strong> - ${songTitle}</h2>
        <span>Error fetching lyrics.</span>`;
        console.error("Fetch error: ", err);
    });
}
