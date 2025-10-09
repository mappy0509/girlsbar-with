document.addEventListener('DOMContentLoaded', function() {

    // --- スライドショー ---
    const slides = document.getElementsByClassName("slide");
    let currentSlideIndex = 0;
    if (slides.length > 0) {
        const crossfadeSlides = () => {
            if (slides.length < 2) return;
            slides[currentSlideIndex].classList.remove('visible');
            currentSlideIndex = (currentSlideIndex + 1) % slides.length;
            slides[currentSlideIndex].classList.add('visible');
        };
        slides[0].classList.add('visible');
        setInterval(crossfadeSlides, 4000);
    }

    // --- モバイルメニュー ---
    const menuBtn = document.getElementById('menu-btn');
    const closeBtn = document.getElementById('close-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
        const menuLinks = mobileMenu.querySelectorAll('a');
        const closeMobileMenu = () => mobileMenu.classList.add('hidden');
        if (menuBtn) menuBtn.addEventListener('click', () => mobileMenu.classList.remove('hidden'));
        if (closeBtn) closeBtn.addEventListener('click', closeMobileMenu);
        mobileMenu.addEventListener('click', (e) => e.target === mobileMenu && closeMobileMenu());
        menuLinks.forEach(link => link.addEventListener('click', closeMobileMenu));
    }
    
    // --- 求人フォーム ---
    // 経験有無
    const experienceRadios = document.querySelectorAll('input[name="experience"]');
    const experienceDetails = document.getElementById('experience_details');
    if (experienceDetails) {
        experienceRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                experienceDetails.classList.toggle('hidden', e.target.value !== 'yes');
            });
        });
    }

    // メーラー起動
    const submitBtn = document.getElementById('submit-form-btn');
    if (submitBtn) {
        submitBtn.addEventListener('click', function() {
            const form = document.getElementById('recruit-form');
            if (!form.reportValidity()) {
                 alert('必須項目を入力してください。');
                 return;
            }

            const getVal = (id) => form.querySelector(`#${id}`).value;
            const getRadioVal = (name) => form.querySelector(`input[name="${name}"]:checked`)?.value || '指定なし';
            
            const name = getVal('name');
            const experience = getRadioVal('experience');

            let body = "【「Girlsbar&Darts with」求人応募】\n\n";
            body += `■ お名前: ${name}\n`;
            body += `■ 年齢: ${getVal('age')}\n`;
            body += `■ 電話番号: ${getVal('phone')}\n`;
            body += `■ メールアドレス: ${getVal('email')}\n`;
            body += `■ LINE ID: ${getVal('line_id') || '未記入'}\n\n`;
            body += `■ 希望面接日: ${getVal('interview_date') || '未指定'}\n`;
            body += `■ 希望の返信方法: ${getRadioVal('reply_method')}\n\n`;
            body += `■ 経験の有無: ${experience === 'yes' ? '有り' : '無し'}\n`;
            if (experience === 'yes') {
                body += `  - 経験内容: ${getVal('experience_text')}\n`;
            }
            body += `■ 希望出勤日数/週: ${getVal('days') || '未記入'}\n`;
            body += `■ 希望時給: ${getVal('wage') || '未記入'}\n`;

            const subject = '【求人応募】' + name + '様より';
            window.location.href = `mailto:k.k.meke2212@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        });
    }

    // --- LINEモーダル ---
    const lineModal = document.getElementById('line-modal');
    if (lineModal) {
        const stickyLineBtn = document.getElementById('sticky-line-btn');
        const closeModalBtn = document.getElementById('close-modal-btn');
        const copyBtn = document.getElementById('copy-btn');
        const lineIdText = document.getElementById('line-id-text');
        const copyFeedback = document.getElementById('copy-feedback');

        const openLineModal = () => lineModal.classList.remove('hidden');
        const closeLineModal = () => {
            lineModal.classList.add('hidden');
            if (copyFeedback) copyFeedback.textContent = '';
        };

        if (stickyLineBtn) stickyLineBtn.addEventListener('click', openLineModal);
        if (closeModalBtn) closeModalBtn.addEventListener('click', closeLineModal);
        lineModal.addEventListener('click', (e) => e.target === lineModal && closeLineModal());
        
        if (copyBtn && lineIdText) {
            copyBtn.addEventListener('click', () => {
                navigator.clipboard.writeText(lineIdText.textContent).then(() => {
                    if (copyFeedback) copyFeedback.textContent = 'コピーしました！';
                }).catch(err => {
                    if (copyFeedback) copyFeedback.textContent = 'コピーに失敗しました';
                });
                setTimeout(() => { if (copyFeedback) copyFeedback.textContent = ''; }, 2000);
            });
        }
    }

    // --- キャスト一覧 & 詳細モーダル ---
    const casts = [
        { name: 'あい', height: 160, bwh: '85/58/86', charm: 'えくぼ', hobby: 'ダーツ, カラオケ', likes: 'カシスオレンジ', dislikes: '日本酒' },
        { name: 'りな', height: 158, bwh: '83/57/85', charm: '笑顔', hobby: '映画鑑賞', likes: 'ファジーネーブル', dislikes: 'ビール' },
        { name: 'みう', height: 165, bwh: '88/60/88', charm: 'スタイル', hobby: 'ショッピング', likes: 'シャンパン', dislikes: '焼酎' },
        { name: 'さくら', height: 155, bwh: '82/56/83', charm: '優しい声', hobby: '料理', likes: '梅酒', dislikes: 'ウイスキー' },
        { name: 'ゆい', height: 162, bwh: '86/59/87', charm: '長い髪', hobby: '旅行', likes: 'ジントニック', dislikes: 'テキーラ' },
        { name: 'はな', height: 168, bwh: '90/61/90', charm: 'おっとり', hobby: '読書', likes: 'ワイン', dislikes: 'ウォッカ' },
        { name: 'もも', height: 153, bwh: '84/57/84', charm: '甘え上手', hobby: 'ゲーム', likes: 'カルーアミルク', dislikes: '辛口のお酒' },
        { name: 'あやか', height: 163, bwh: '87/59/88', charm: '聞き上手', hobby: 'カフェ巡り', likes: 'モヒート', dislikes: '泡盛' }
    ];

    const castListContainer = document.getElementById('cast-list');
    const castModal = document.getElementById('cast-modal');
    const castModalContent = document.getElementById('cast-modal-content');

    if (castListContainer && castModal && castModalContent) {
        const closeCastModal = () => castModal.classList.add('hidden');
        
        castModal.addEventListener('click', (e) => {
            if (e.target === castModal) closeCastModal();
        });

        casts.forEach((cast, index) => {
            const castCard = document.createElement('div');
            castCard.className = 'bg-white rounded-lg shadow-lg overflow-hidden text-center';
            castCard.innerHTML = `
                <img src="https://placehold.co/300x400/f3f4f6/3b82f6?text=${cast.name}" alt="${cast.name}の写真" class="w-full h-48 object-cover">
                <div class="p-4">
                    <h3 class="font-bold text-lg text-pink-500">${cast.name}</h3>
                    <button data-index="${index}" class="mt-4 w-full bg-sky-500 text-white font-bold py-2 px-4 rounded-full hover:bg-sky-600 transition-colors text-sm view-details-btn">
                        詳細を見る
                    </button>
                </div>
            `;
            castListContainer.appendChild(castCard);
        });

        document.querySelectorAll('.view-details-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const castIndex = e.target.getAttribute('data-index');
                const cast = casts[castIndex];

                castModalContent.innerHTML = `
                    <button id="close-cast-modal-btn" class="absolute top-2 right-3 text-2xl text-gray-500 hover:text-gray-800">&times;</button>
                    <img src="https://placehold.co/300x400/f3f4f6/3b82f6?text=${cast.name}" alt="${cast.name}の写真" class="w-32 h-40 object-cover rounded-lg mx-auto mb-4">
                    <h3 class="text-2xl font-bold text-pink-500">${cast.name}</h3>
                    <div class="text-left text-gray-700 mt-4 space-y-2 text-base">
                        <p><i class="fa-solid fa-ruler-vertical text-sky-400 w-5"></i> <strong>身長:</strong> ${cast.height}cm</p>
                        <p><i class="fa-solid fa-venus-mars text-sky-400 w-5"></i> <strong>B/W/H:</strong> ${cast.bwh}</p>
                        <p><i class="fa-solid fa-heart text-sky-400 w-5"></i> <strong>チャームポイント:</strong> ${cast.charm}</p>
                        <p><i class="fa-solid fa-gamepad text-sky-400 w-5"></i> <strong>趣味:</strong> ${cast.hobby}</p>
                        <p><i class="fa-solid fa-martini-glass-citrus text-sky-400 w-5"></i> <strong>好きなもの:</strong> ${cast.likes}</p>
                        <p><i class="fa-solid fa-thumbs-down text-sky-400 w-5"></i> <strong>苦手なもの:</strong> ${cast.dislikes}</p>
                    </div>
                `;
                
                document.getElementById('close-cast-modal-btn').addEventListener('click', closeCastModal);
                castModal.classList.remove('hidden');
            });
        });
    }
});