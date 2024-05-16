let currentSite = 'narou';

document.getElementById('siteSelect').addEventListener('change', function() {
    currentSite = this.value;
    document.getElementById('hamelnSpecialTags').style.display = currentSite === 'hameln' ? 'block' : 'none';
});

document.getElementById('saveButton').addEventListener('click', function() {
    const title = document.getElementById('novelTitle').value;
    const subtitle = document.getElementById('novelSubtitle').value;
    const content = document.getElementById('novelContent').value;
    localStorage.setItem('novelTitle', title);
    localStorage.setItem('novelSubtitle', subtitle);
    localStorage.setItem('novelContent', content);
    alert('内容が保存されました');
    updatePreview();
});

document.getElementById('loadButton').addEventListener('click', function() {
    const title = localStorage.getItem('novelTitle');
    const subtitle = localStorage.getItem('novelSubtitle');
    const content = localStorage.getItem('novelContent');
    if (title || subtitle || content) {
        document.getElementById('novelTitle').value = title;
        document.getElementById('novelSubtitle').value = subtitle;
        document.getElementById('novelContent').value = content;
        alert('内容が読み込まれました');
        updatePreview();
    } else {
        alert('保存された内容がありません');
    }
});

document.getElementById('clearButton').addEventListener('click', function() {
    if (confirm('本当に内容をクリアしますか？')) {
        document.getElementById('novelTitle').value = '';
        document.getElementById('novelSubtitle').value = '';
        document.getElementById('novelContent').value = '';
        localStorage.removeItem('novelTitle');
        localStorage.removeItem('novelSubtitle');
        localStorage.removeItem('novelContent');
        alert('内容がクリアされました');
        updatePreview();
    }
});

document.getElementById('downloadButton').addEventListener('click', function() {
    const title = document.getElementById('novelTitle').value;
    const subtitle = document.getElementById('novelSubtitle').value;
    const content = document.getElementById('novelContent').value;
    const blob = new Blob([title + "\n\n" + subtitle + "\n\n" + content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = (title ? title : 'novel') + '.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

document.getElementById('novelContent').addEventListener('input', updatePreview);
document.getElementById('novelTitle').addEventListener('input', updatePreview);
document.getElementById('novelSubtitle').addEventListener('input', updatePreview);

function updatePreview() {
    const title = document.getElementById('novelTitle').value;
    const subtitle = document.getElementById('novelSubtitle').value;
    const content = document.getElementById('novelContent').value;
    const previewTitle = document.getElementById('previewTitle');
    const previewSubtitle = document.getElementById('previewSubtitle');
    const previewContent = document.getElementById('previewContent');
    
    previewTitle.textContent = `タイトル：${title}`;
    previewSubtitle.textContent = `サブタイトル：${subtitle}`;
    
    let formattedContent = content;

    // ルビのフォーマットをプレビュー用に変換
    formattedContent = formattedContent
        .replace(/｜(.*?)《(.*?)》/g, '<ruby>$1<rt>$2</rt></ruby>')
        .replace(/#(.*?)__(.*?)__/g, '<ruby>$1<rt>$2</rt></ruby>')
        .replace(/《ruby》(.*?)《rt》(.*?)《\/rt》《\/ruby》/g, '<ruby>$1<rt>$2</rt></ruby>')
        .replace(/\{(.*?)\|(.*?)\}/g, '<ruby>$1<rt>$2</rt></ruby>');

    // 傍点のフォーマットをプレビュー用に変換
    formattedContent = formattedContent
        .replace(/｜(.*?)《・(.*?)》/g, '<span class="bouten">$1</span>')
        .replace(/《《(.*?)》》/g, '<span class="bouten">$1</span>')
        .replace(/#(.*?)__(.*?)__/g, '<span class="bouten">$1</span>')
        .replace(/【(.*?)】/g, '<span class="bouten">$1</span>');

    // 特殊タグのフォーマットをプレビュー用に変換
    formattedContent = formattedContent
        .replace(/《b》(.*?)《\/b》/g, '<b>$1</b>')
        .replace(/《i》(.*?)《\/i》/g, '<i>$1</i>')
        .replace(/《s》(.*?)《\/s》/g, '<s>$1</s>')
        .replace(/《u》(.*?)《\/u》/g, '<u>$1</u>')
        .replace(/《small》(.*?)《\/small》/g, '<small>$1</small>')
        .replace(/《big》(.*?)《\/big》/g, '<big>$1</big>')
        .replace(/《xsmall》(.*?)《\/xsmall》/g, '<span style="font-size:smaller;">$1</span>')
        .replace(/《xbig》(.*?)《\/xbig》/g, '<span style="font-size:larger;">$1</span>')
        .replace(/《center》(.*?)《\/center》/g, '<div style="text-align:center;">$1</div>')
        .replace(/《right》(.*?)《\/right》/g, '<div style="text-align:right;">$1</div>')
        .replace(/《left》(.*?)《\/left》/g, '<div style="text-align:left;">$1</div>');

    previewContent.innerHTML = formattedContent;
}

// 各ボタンの挿入操作の後にプレビューを更新する
document.getElementById('insertRubyButton').addEventListener('click', updatePreview);
document.getElementById('insertBoutenButton').addEventListener('click', updatePreview);
document.getElementById('insertSpecialTagButton').addEventListener('click', updatePreview);

// Ruby button functionality
document.getElementById('rubyButton').addEventListener('click', function() {
    document.getElementById('rubyPopup').style.display = 'block';
});

document.querySelector('#rubyPopup .close').addEventListener('click', function() {
    document.getElementById('rubyPopup').style.display = 'none';
});

document.getElementById('insertRubyButton').addEventListener('click', function() {
    const base = document.getElementById('rubyBase').value;
    const ruby = document.getElementById('rubyText').value;
    if (base && ruby) {
        const content = document.getElementById('novelContent');
        const cursorPos = content.selectionStart;
        const textBefore = content.value.substring(0, cursorPos);
        const textAfter = content.value.substring(cursorPos, content.value.length);
        let rubyText = '';

        if (currentSite === 'narou' || currentSite === 'kakuyomu') {
            rubyText = `｜${base}《${ruby}》`;
        } else if (currentSite === 'alphapolis') {
            rubyText = `#${base}__${ruby}__#`;
        } else if (currentSite === 'hameln') {
            rubyText = `《ruby》${base}《rt》${ruby}《/rt》《/ruby》`;
        } else if (currentSite === 'pixiv') {
            rubyText = `{${base}|${ruby}}`;
        }

        content.value = textBefore + rubyText + textAfter;
        content.selectionStart = cursorPos + rubyText.length;
        content.selectionEnd = cursorPos + rubyText.length;
        content.focus();
        document.getElementById('rubyPopup').style.display = 'none';
        updatePreview();
    } else {
        alert('基の文字とルビを入力してください');
    }
});

// Bouten button functionality
document.getElementById('boutenButton').addEventListener('click', function() {
    document.getElementById('boutenPopup').style.display = 'block';
});

document.querySelector('#boutenPopup .close').addEventListener('click', function() {
    document.getElementById('boutenPopup').style.display = 'none';
});

document.getElementById('insertBoutenButton').addEventListener('click', function() {
    const base = document.getElementById('boutenBase').value;
    if (base) {
        const content = document.getElementById('novelContent');
        const cursorPos = content.selectionStart;
        const textBefore = content.value.substring(0, cursorPos);
        const textAfter = content.value.substring(cursorPos, content.value.length);
        let boutenText = '';

        if (currentSite === 'narou') {
            boutenText = `｜${base}《・${'・'.repeat(base.length - 1)}》`;
        } else if (currentSite === 'kakuyomu' || currentSite === 'hameln') {
            boutenText = `《《${base}》》`;
        } else if (currentSite === 'alphapolis') {
            boutenText = `#${base}__・__#`;
        } else if (currentSite === 'pixiv') {
            boutenText = `【${base}】`;
        }

        content.value = textBefore + boutenText + textAfter;
        content.selectionStart = cursorPos + boutenText.length;
        content.selectionEnd = cursorPos + boutenText.length;
        content.focus();
        document.getElementById('boutenPopup').style.display = 'none';
        updatePreview();
    } else {
        alert('基の文字を入力してください');
    }
});

// Special tag functionality
document.getElementById('openSpecialTagPopupButton').addEventListener('click', function() {
    document.getElementById('specialTagPopup').style.display = 'block';
});

document.querySelector('#specialTagPopup .close').addEventListener('click', function() {
    document.getElementById('specialTagPopup').style.display = 'none';
});

document.getElementById('insertSpecialTagButton').addEventListener('click', function() {
    const specialTag = document.getElementById('specialTagSelect').value;
    const specialText = document.getElementById('specialTagText').value;
    const content = document.getElementById('novelContent');
    const cursorPos = content.selectionStart;
    const textBefore = content.value.substring(0, cursorPos);
    const textAfter = content.value.substring(cursorPos, content.value.length);
    let tagText = '';

    if (specialTag === 'b') {
        tagText = `《b》${specialText}《/b》`;
    } else if (specialTag === 'i') {
        tagText = `《i》${specialText}《/i》`;
    } else if (specialTag === 's') {
        tagText = `《s》${specialText}《/s》`;
    } else if (specialTag === 'u') {
        tagText = `《u》${specialText}《/u》`;
    } else if (specialTag === 'small') {
        tagText = `《small》${specialText}《/small》`;
    } else if (specialTag === 'big') {
        tagText = `《big》${specialText}《/big》`;
    } else if (specialTag === 'xsmall') {
        tagText = `《xsmall》${specialText}《/xsmall》`;
    } else if (specialTag === 'xbig') {
        tagText = `《xbig》${specialText}《/xbig》`;
    } else if (specialTag === 'center') {
        tagText = `《center》${specialText}《/center》`;
    } else if (specialTag === 'right') {
        tagText = `《right》${specialText}《/right》`;
    } else if (specialTag === 'left') {
        tagText = `《left》${specialText}《/left》`;
    }

    content.value = textBefore + tagText + textAfter;
    content.selectionStart = cursorPos + tagText.length;
    content.selectionEnd = cursorPos + tagText.length;
    content.focus();
    document.getElementById('specialTagPopup').style.display = 'none';
    updatePreview();
});
