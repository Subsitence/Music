const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const heading = $('header h2');
const playlist = $('.playlist');
const audio = $('#audio');
const cdThumbnail = $('.cd-thumb');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const repeatBtn = $('.btn-repeat');
const randomBtn = $('.btn-random');
const progress = $('#progress');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRepeat: false,
    isRandom: false,
    randomArray: [],

    songs: [
        {
            name: 'Attention',
            img: './img/Attention.png',
            path: './music/Attention - Charlie Puth.mp3',
            author: 'Charlie Puth'
        },
        {
            name: 'Closer',
            img: './img/Closer.jpg',
            path: './music/Closer - The Chainsmokers_ Halsey.mp3',
            author: 'The Chainsmokers'
        },
        {
            name: 'Girls Like You',
            img: './img/Girls like you.jpg',
            path: './music/Girls Like You - Maroon 5.mp3',
            author: 'Maroon 5'
        },
        {
            name: 'Memories',
            img: './img/Memories.jpg',
            path: './music/Memories - Maroon 5.mp3',
            author: 'Maroon 5'
        },
        {
            name: 'Nevada',
            img: './img/Nevada.jpg',
            path: './music/Nevada - Vicetone_ Cozi Zuehlsdorff.mp3',
            author: 'Vicetone - Cozi Zuehlsdorff'
        },
        {
            name: 'One Call Away',
            img: './img/One Call Away.jpg',
            path: './music/One Call Away - Charlie Puth.mp3',
            author: 'Charlie Puth'
        },
        {
            name: 'See You Again',
            img: './img/See you again.jpg',
            path: './music/See You Again - Wiz Khalifa_ Charlie Put.mp3',
            author: 'Wiz Khalifa - Charlie Put'
        },
        {
            name: 'Cheating On You',
            img: './img/Cheating_on_you.jpg',
            path: './music/Cheating On You - Charlie Puth.mp3',
            author: 'Charlie Puth'
        },
        {
            name: 'Hero',
            img: './img/Hero.jpg',
            path: './music/Hero - Cash Cash_ Christina Perri.mp3',
            author: 'Cash Cash - Christina Perri'
        },
        {
            name: 'Stay',
            img: './img/Stay.jpg',
            path: './music/Stay - The Kid LAROI_ Justin Bieber.mp3',
            author: 'The Kid LAROI - Justin Bieber'
        },
        {
            name: 'Darkside',
            img: './img/Darkside.jpg',
            path: './music/Darkside - Alan Walker_ Tomine Harket_ A.mp3',
            author: 'Alan Walker - Tomine Harket - A'
        },
        {
            name: 'Dusk Till Dawn',
            img: './img/Dusk Till Dawn.jpg',
            path: './music/Dusk Till Dawn - Tyler_ Ryan.mp3',
            author: 'Tyler - Ryan'
        },
        {
            name: 'I Love You 3000',
            img: './img/I Love You 3000.jpg',
            path: './music/I Love You 3000 II - 88rising_ Jackson W.mp3',
            author: '88rising - Jackson W'
        },
        {
            name: 'Symphony',
            img: './img/Symphony.jpg',
            path: './music/Symphony - Clean Bandit_ Zara Larsson.mp3',
            author: 'Clean Bandit - Zara Larsson'
        },
        {
            name: 'Unstoppable',
            img: './img/Unstoppable.jpg',
            path: './music/Unstoppable-Sia-4312901.mp3',
            author: 'Sia'
        },
        {
            name: 'Talking To The Moon',
            img: './img/Talking To The Moon.jpg',
            path: './music/Talking To The Moon - Bruno Mars.mp3',
            author: 'Bruno Mars'
        },
    ],

    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        })
    },

    handleEvent: function() {
        const cd = $('.cd');
        const cdWidth = cd.offsetWidth;
        const _this = this;

        const cdThumbAnimate = cdThumbnail.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 10000,
            iterations: Infinity,
        })
        cdThumbAnimate.pause();
        
        function run() {
            _this.isPlaying = true;
            player.classList.toggle('playing', _this.isPlaying);
            cdThumbAnimate.play();
            audio.play();
        }

        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;
            
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }

        playBtn.onclick = function() {
            _this.isPlaying = !_this.isPlaying;
            player.classList.toggle('playing', _this.isPlaying);
            if(_this.isPlaying) {
                cdThumbAnimate.play();
                audio.play();
            } else {
                cdThumbAnimate.pause();
                audio.pause();
            }
        }

        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song');

            if($('.song.active') && songNode) {
                $('.song.active').classList.remove('active');
                songNode.classList.add('active');
                _this.currentIndex = songNode.dataset.index;
                _this.loadCurrentSong();
                run();
            }

        }

        nextBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.nextSong();
            }

            $('.song.active').classList.remove('active');
            $$('.song')[_this.currentIndex].classList.add('active');

            _this.scrollIntoActiveSong();
            _this.loadCurrentSong();
            run();
        }

        prevBtn.onclick = function() { 
            if(_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.prevSong();
            }

            $('.song.active').classList.remove('active');
            $$('.song')[_this.currentIndex].classList.add('active');

            _this.scrollIntoActiveSong();
            _this.loadCurrentSong();
            run();
        }

        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat;
            this.classList.toggle('active', _this.isRepeat);
        }

        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom;
            this.classList.toggle('active', _this.isRandom);
        }
        
        //Progress of songs
        audio.ontimeupdate = function() {
            if(audio.duration) {
                progress.value = audio.currentTime / audio.duration * 100;
            }
        }

        //seek
        progress.oninput = function(e) {
            audio.currentTime = Number(this.value) * audio.duration / 100;
        }

        //Chuyển bài khi kết thúc
        audio.onended = function() {
            if(_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
        }
    },

    nextSong: function() {
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
    },
    
    prevSong: function() {
        this.currentIndex--;
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
    },

    playRandomSong: function() {
        //Xử lý để random không bị lặp khi chuyển bài
        do {
            var randomIndex = Math.floor(Math.random() * this.songs.length);
            
        } while(this.randomArray.includes(randomIndex));
        
        this.randomArray.push(randomIndex);
        if(this.randomArray.length === this.songs.length) {
            this.randomArray = [randomIndex];
        }

        this.currentIndex = randomIndex;
    },

    scrollIntoActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            }, 400);
        });
    },

    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name;
        cdThumbnail.style.backgroundImage = `url('${this.currentSong.img}')`;
        audio.src = this.currentSong.path;
    },

    renderSongs: function() {
        const html = this.songs.map(function(song, index) {
            return `
            <div class="song" data-index="${index}">
                <div class="thumb" style="background-image: url('${song.img}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.author}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `
        })
        playlist.innerHTML = html.join('');
        $('.song').classList.add('active');
    },
    start: function() {
        this.defineProperties();
        this.renderSongs();
        this.loadCurrentSong();
        this.handleEvent();
    }
}
app.start();