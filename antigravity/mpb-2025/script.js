const songs = [
    {
        id: 1,
        title: "Solar do Amanhã",
        artist: "Silva & Anitta",
        duration: "3:12",
        plays: "125M",
        cover: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=200&h=200&fit=crop"
    },
    {
        id: 2,
        title: "Vento de Salvador",
        artist: "Luedji Luna",
        duration: "3:45",
        plays: "98M",
        cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&h=200&fit=crop"
    },
    {
        id: 3,
        title: "Neon Tropicália",
        artist: "Marina Sena",
        duration: "2:58",
        plays: "89M",
        cover: "https://images.unsplash.com/photo-1514525253440-b393452e3383?w=200&h=200&fit=crop"
    },
    {
        id: 4,
        title: "Cores do Tempo",
        artist: "Gilsons",
        duration: "3:30",
        plays: "82M",
        cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&h=200&fit=crop"
    },
    {
        id: 5,
        title: "Raiz e Futuro",
        artist: "Liniker",
        duration: "4:05",
        plays: "76M",
        cover: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=200&h=200&fit=crop"
    },
    {
        id: 6,
        title: "Maré Alta",
        artist: "Jão & Marisa Monte",
        duration: "3:22",
        plays: "70M",
        cover: "https://images.unsplash.com/photo-1459749411177-0473ef7161a9?w=200&h=200&fit=crop"
    },
    {
        id: 7,
        title: "Samba Cyber",
        artist: "Seu Jorge",
        duration: "3:50",
        plays: "65M",
        cover: "https://images.unsplash.com/photo-1501612780327-45045538702b?w=200&h=200&fit=crop"
    },
    {
        id: 8,
        title: "Afeto Digital",
        artist: "Duda Beat",
        duration: "3:15",
        plays: "58M",
        cover: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=200&h=200&fit=crop"
    },
    {
        id: 9,
        title: "Rio 2050",
        artist: "Criolo",
        duration: "4:10",
        plays: "52M",
        cover: "https://images.unsplash.com/photo-1510915361408-376c6caf6a59?w=200&h=200&fit=crop"
    },
    {
        id: 10,
        title: "Doce Mistério",
        artist: "Lagum",
        duration: "3:05",
        plays: "48M",
        cover: "https://images.unsplash.com/photo-1485579149621-3123dd979885?w=200&h=200&fit=crop"
    }
];

const songList = document.getElementById('songList');
const playerBar = document.getElementById('playerBar');
const playerTitle = document.getElementById('playerTitle');
const playerArtist = document.getElementById('playerArtist');
const playerCover = document.getElementById('playerCover');
const mainPlayBtn = document.getElementById('mainPlayBtn');
const playAllBtn = document.getElementById('playAllBtn');

let isPlaying = false;
let currentSongId = null;

function renderSongs() {
    songList.innerHTML = songs.map((song, index) => `
        <div class="song-item" onclick="playSong(${song.id})">
            <span class="song-rank">${index + 1}</span>
            <img src="${song.cover}" alt="${song.title}" class="song-cover" onerror="this.src='default_cover.png'">
            <div class="song-details">
                <span class="song-title">${song.title}</span>
                <span class="song-artist">${song.artist}</span>
            </div>
            <div class="song-meta">
                <span><i class="fas fa-play" style="font-size: 0.8rem; margin-right: 5px;"></i> ${song.plays}</span>
                <span>${song.duration}</span>
            </div>
            <div class="play-icon">
                <i class="fas fa-play"></i>
            </div>
        </div>
    `).join('');
}

function playSong(id) {
    const song = songs.find(s => s.id === id);
    if (!song) return;

    currentSongId = id;
    playerTitle.textContent = song.title;
    playerArtist.textContent = song.artist;
    playerCover.src = song.cover;
    playerCover.onerror = function () { this.src = 'default_cover.png'; };

    playerBar.classList.add('active');
    isPlaying = true;
    updatePlayButton();

    // Simulate playing state in the list
    const items = document.querySelectorAll('.song-item');
    items.forEach((item, index) => {
        if (songs[index].id === id) {
            item.style.background = 'rgba(255, 255, 255, 0.15)';
            item.style.borderColor = 'var(--primary)';
        } else {
            item.style.background = 'var(--glass-bg)';
            item.style.borderColor = 'transparent';
        }
    });
}

function updatePlayButton() {
    const icon = mainPlayBtn.querySelector('i');
    if (isPlaying) {
        icon.classList.remove('fa-play');
        icon.classList.add('fa-pause');
    } else {
        icon.classList.remove('fa-pause');
        icon.classList.add('fa-play');
    }
}

mainPlayBtn.addEventListener('click', () => {
    isPlaying = !isPlaying;
    updatePlayButton();
});

playAllBtn.addEventListener('click', () => {
    playSong(songs[0].id);
});

// Initialize
renderSongs();
