document.addEventListener('DOMContentLoaded', () => {

    // --- サンプルデータ ---
    let newsData = [
        { date: '2025-10-15', title: 'ハロウィンイベント開催のお知らせ', content: '10月28日〜31日はキャストが可愛いコスプレでお出迎え！限定ドリンクもあります♪' },
        { date: '2025-10-10', title: '週末限定ダーツ大会！', content: '毎週土曜日はダーツ大会を開催！優勝者には豪華景品をご用意しています。' },
        { date: '2025-10-01', title: 'グランドオープン！', content: 'Girlsbar&Darts withが新規オープンしました！皆様のご来店を心よりお待ちしております。' }
    ];

    let castData = [
        { name: 'あい', height: 160, bwh: '85/58/86', hobby: 'ダーツ, カラオケ', likes: 'カシスオレンジ', img: 'https://placehold.co/300x400/f3f4f6/3b82f6?text=あい' },
        { name: 'りな', height: 158, bwh: '83/57/85', hobby: '映画鑑賞', likes: 'ファジーネーブル', img: 'https://placehold.co/300x400/f3f4f6/3b82f6?text=りな' },
        { name: 'みう', height: 165, bwh: '88/60/88', hobby: 'ショッピング', likes: 'シャンパン', img: 'https://placehold.co/300x400/f3f4f6/3b82f6?text=みう' }
    ];
    
    let systemData = [
        { item: '60分1セット (飲み放題)', price: '4,000円' },
        { item: '延長 60分', price: '4,000円' },
        { item: '延長 30分', price: '2,500円' },
        { item: 'キャストドリンク', price: '1,000円' },
        { item: 'カラオケ (歌い放題)', price: '1,000円' }
    ];

    // --- 要素取得 ---
    const tabButtons = document.querySelectorAll('.tab-btn');
    const contentSections = document.querySelectorAll('.tab-content');
    const newsList = document.getElementById('news-list');
    const newsForm = document.getElementById('news-form');
    const castListAdmin = document.getElementById('cast-list-admin');
    const castForm = document.getElementById('cast-form');
    const couponForm = document.getElementById('coupon-form');
    const systemList = document.getElementById('system-list');
    const addSystemItemBtn = document.getElementById('add-system-item');

    // --- モーダル関連 ---
    const modal = document.getElementById('edit-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const closeModalBtn = document.getElementById('close-modal-btn');

    const openModal = () => modal.classList.remove('hidden');
    const closeModal = () => modal.classList.add('hidden');

    closeModalBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // --- タブ切り替え機能 ---
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            contentSections.forEach(section => section.classList.add('hidden'));
            button.classList.add('active');
            document.getElementById(button.dataset.target).classList.remove('hidden');
        });
    });
    if (tabButtons.length > 0) tabButtons[0].click();

    // --- お知らせ機能 ---
    const renderNews = () => {
        newsList.innerHTML = '';
        newsData.forEach((news, index) => {
            const div = document.createElement('div');
            div.className = 'p-3 border rounded-md bg-gray-50 flex justify-between items-center';
            div.innerHTML = `
                <div>
                    <p class="text-sm text-gray-500">${news.date}</p>
                    <p class="font-bold">${news.title}</p>
                </div>
                <div class="space-x-2">
                    <button data-index="${index}" class="news-edit-btn text-sky-500 hover:text-sky-700"><i class="fas fa-edit"></i></button>
                    <button data-index="${index}" class="news-delete-btn text-red-500 hover:text-red-700"><i class="fas fa-trash"></i></button>
                </div>
            `;
            newsList.appendChild(div);
        });
    };

    newsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        newsData.unshift({
            date: document.getElementById('news-date').value,
            title: document.getElementById('news-title').value,
            content: document.getElementById('news-content').value
        });
        renderNews();
        newsForm.reset();
        alert('お知らせを追加しました。');
    });

    newsList.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;

        const index = btn.dataset.index;
        if (btn.classList.contains('news-delete-btn')) {
            if (confirm(`「${newsData[index].title}」を削除しますか？`)) {
                newsData.splice(index, 1);
                renderNews();
                alert('お知らせを削除しました。');
            }
        } else if (btn.classList.contains('news-edit-btn')) {
            editNews(index);
        }
    });

    const editNews = (index) => {
        const news = newsData[index];
        modalTitle.textContent = 'お知らせを編集';
        modalBody.innerHTML = `
            <form id="edit-news-form" class="space-y-4" data-index="${index}">
                <div>
                    <label class="block text-sm font-medium">日付</label>
                    <input type="date" id="edit-news-date" value="${news.date}" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required>
                </div>
                <div>
                    <label class="block text-sm font-medium">タイトル</label>
                    <input type="text" id="edit-news-title" value="${news.title}" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required>
                </div>
                <div>
                    <label class="block text-sm font-medium">内容</label>
                    <textarea id="edit-news-content" rows="3" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">${news.content}</textarea>
                </div>
                <button type="submit" class="w-full bg-sky-500 text-white font-bold py-2 px-4 rounded-md hover:bg-sky-600">更新する</button>
            </form>
        `;
        openModal();
        document.getElementById('edit-news-form').addEventListener('submit', (e) => {
            e.preventDefault();
            newsData[index] = {
                date: document.getElementById('edit-news-date').value,
                title: document.getElementById('edit-news-title').value,
                content: document.getElementById('edit-news-content').value
            };
            renderNews();
            closeModal();
            alert('お知らせを更新しました。');
        });
    };
    
    // --- クーポン機能 ---
    couponForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // ここに実際の保存処理を実装
        alert('クーポン情報を更新しました。（実際の保存処理は未実装です）');
    });

    // --- キャスト機能 ---
    const renderCasts = () => {
        castListAdmin.innerHTML = '';
        castData.forEach((cast, index) => {
            const div = document.createElement('div');
            div.className = 'bg-gray-50 rounded-lg shadow overflow-hidden text-center';
            div.innerHTML = `
                <img src="${cast.img}" alt="${cast.name}" class="w-full h-32 object-cover">
                <div class="p-2">
                    <h4 class="font-bold">${cast.name}</h4>
                    <div class="flex space-x-2 mt-2">
                        <button data-index="${index}" class="cast-edit-btn flex-1 text-sm bg-sky-500 text-white py-1 rounded hover:bg-sky-600">編集</button>
                        <button data-index="${index}" class="cast-delete-btn flex-1 text-sm bg-red-500 text-white py-1 rounded hover:bg-red-600">削除</button>
                    </div>
                </div>
            `;
            castListAdmin.appendChild(div);
        });
    };
    
    castForm.addEventListener('submit', (e) => {
        e.preventDefault();
        castData.push({
            name: document.getElementById('cast-name').value,
            height: document.getElementById('cast-height').value,
            bwh: document.getElementById('cast-bwh').value,
            hobby: document.getElementById('cast-hobby').value,
            likes: document.getElementById('cast-likes').value,
            img: 'https://placehold.co/300x400/f3f4f6/3b82f6?text=' + document.getElementById('cast-name').value
        });
        renderCasts();
        castForm.reset();
        alert('キャストを追加しました。');
    });

    castListAdmin.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;
        const index = btn.dataset.index;

        if (btn.classList.contains('cast-delete-btn')) {
            if (confirm(`${castData[index].name}さんの情報を削除しますか？`)) {
                castData.splice(index, 1);
                renderCasts();
                alert('キャスト情報を削除しました。');
            }
        } else if (btn.classList.contains('cast-edit-btn')) {
            editCast(index);
        }
    });

    const editCast = (index) => {
        const cast = castData[index];
        modalTitle.textContent = 'キャスト情報を編集';
        modalBody.innerHTML = `
            <form id="edit-cast-form" class="space-y-4" data-index="${index}">
                 <input type="text" id="edit-cast-name" value="${cast.name}" placeholder="名前" class="block w-full px-3 py-2 border border-gray-300 rounded-md" required>
                 <input type="number" id="edit-cast-height" value="${cast.height || ''}" placeholder="身長" class="block w-full px-3 py-2 border border-gray-300 rounded-md">
                 <input type="text" id="edit-cast-bwh" value="${cast.bwh || ''}" placeholder="B/W/H" class="block w-full px-3 py-2 border border-gray-300 rounded-md">
                 <input type="text" id="edit-cast-hobby" value="${cast.hobby || ''}" placeholder="趣味" class="block w-full px-3 py-2 border border-gray-300 rounded-md">
                 <input type="text" id="edit-cast-likes" value="${cast.likes || ''}" placeholder="好きなもの" class="block w-full px-3 py-2 border border-gray-300 rounded-md">
                <button type="submit" class="w-full bg-sky-500 text-white font-bold py-2 px-4 rounded-md hover:bg-sky-600">更新する</button>
            </form>
        `;
        openModal();
        document.getElementById('edit-cast-form').addEventListener('submit', (e) => {
            e.preventDefault();
            castData[index] = {
                ...castData[index], // 画像など既存の情報を保持
                name: document.getElementById('edit-cast-name').value,
                height: document.getElementById('edit-cast-height').value,
                bwh: document.getElementById('edit-cast-bwh').value,
                hobby: document.getElementById('edit-cast-hobby').value,
                likes: document.getElementById('edit-cast-likes').value,
            };
            renderCasts();
            closeModal();
            alert('キャスト情報を更新しました。');
        });
    };
    
    // --- 料金システム機能 ---
    const renderSystem = () => {
        systemList.innerHTML = '';
        systemData.forEach((data, index) => {
            const div = document.createElement('div');
            div.className = 'flex items-center space-x-2';
            div.innerHTML = `
                <input type="text" value="${data.item}" class="system-item-input flex-1 px-3 py-2 border border-gray-300 rounded-md">
                <input type="text" value="${data.price}" class="system-price-input w-28 px-3 py-2 border border-gray-300 rounded-md">
                <button data-index="${index}" class="system-delete-btn text-red-500 hover:text-red-700"><i class="fas fa-times-circle"></i></button>
            `;
            systemList.appendChild(div);
        });
    };
    
    addSystemItemBtn.addEventListener('click', () => {
        systemData.push({ item: '新しい項目', price: '0円' });
        renderSystem();
    });
    
    systemList.addEventListener('click', (e) => {
        if (e.target.closest('.system-delete-btn')) {
            const index = e.target.closest('.system-delete-btn').dataset.index;
            systemData.splice(index, 1);
            renderSystem();
        }
    });
    
    document.getElementById('save-system').addEventListener('click', () => {
       alert('料金システムを保存しました。（実際の保存処理は未実装です）');
    });

    // --- 初期表示 ---
    renderNews();
    renderCasts();
    renderSystem();
});