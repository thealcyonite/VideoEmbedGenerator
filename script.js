document.addEventListener('DOMContentLoaded', function(){
    document.getElementById("generate-btn").addEventListener('click', function(){
        validate();
    })
    document.getElementById("select-platform").addEventListener('change', function(){
        let p = document.getElementById("select-platform").value;
        if (infoLinks[p] !== ""){
            showInfoLink(true)
            setInfoLink(infoLinks[p]);
        }
        else{
            showInfoLink(false)
        }
    })
    showInfoLink(true)
    setInfoLink(infoLinks["youtube"]);
})
function tl(val) {
    let btn = document.getElementById("generate-btn");
    btn.innerHTML = val ? `<span class="loader"></span>` : `Generate`;
}
function shakeInput(input) {
    input.classList.add("shake");
    setTimeout(() => {
        input.classList.remove("shake");
    }, 500);
}
function showInfoLink(val) {
    let a = document.getElementById("info-icon");
    a.style.display = val ? "block" : "none";
}
function setInfoLink(url){
    let a = document.getElementById("info-icon");
    a.href = url;
}
function isValidURL(url) {
    try {
        new URL(url);
        return true;
    } catch (err) {
        return false;
    }
}
function escape(str) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
let infoLinks = {
    "youtube": "https://developers.google.com/youtube/player_parameters",
    "vimeo": "https://help.vimeo.com/hc/en-us/articles/12426259908881-How-do-I-embed-my-video",
    "daily-motion": "https://developers.dailymotion.com/guides/embed-with-oembed",
    "google-drive": "",
}
let actions = {
    "youtube": youtube,
    "vimeo": vimeo,
    "daily-motion": dailymotion,
    "google-drive": googledrive
}
let regexes = {
    "youtube": /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    "vimeo": /vimeo\.com\/(?:.*\/)?(?:videos?\/)?(\d+)/,
    "daily-motion": /(?:dailymotion\.com\/(?:video|embed\/video)|dai\.ly)\/([a-zA-Z0-9]+)/,
    "google-drive": /(?:drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?export=view&id=|uc\?id=)|drive\.google\.com\/uc\?id=)([a-zA-Z0-9_-]{10,})/
}
let css = `
iframe{
    width: 640px;
    aspect-ratio: 16 / 9;
    border: none;
    border-radius: 5px;
}`

function validate(){
    let p = document.getElementById("select-platform").value;
    let url = document.getElementById("video-url").value;
    let v = document.getElementById("link-validation");
    if (url.trim() === ""){
        v.innerHTML = `<i class="bi bi-x-circle-fill"></i> Field Is Empty`;
        v.style.color = "var(--deep-rose)";
        v.style.backgroundColor = "#d4508750";
        tl(false)
        shakeInput(document.getElementById("video-url"));
        return false
    }
    else {
        if (isValidURL(url.trim())) {
            v.innerHTML = `<i class="bi bi-check-circle-fill"></i> URL Format OK`;
            v.style.color = "var(--bright-green)";
            v.style.backgroundColor = "#73fa7950";
            tl(true)
            setTimeout(function(){
                if (v){
                    actions[p](url)
                }
                tl(false)
            }, 1000);
            return true
        } else {
            v.innerHTML = `<i class="bi bi-exclamation-triangle-fill"></i> Invalid URL Format`;
            v.style.color = "var(--pumpkin-orange)";
            v.style.backgroundColor = "#ffa60050";
            tl(false)
            shakeInput(document.getElementById("video-url"));
            return false
        }
    }
}
function highlight(){
    document.querySelectorAll('pre code').forEach((el) => {
        delete el.dataset.highlighted;
        hljs.highlightElement(el);
    });
}

function youtube(url){
    let p = document.getElementById("select-platform").value;
    let regex = regexes[p];
    try {
        let src = `https://youtube.com/embed/${url.match(regex)[1]}`
        document.getElementById("embed-url").value = src;
        document.getElementById("language-html").innerHTML = escape(`\n\n<iframe src="${src}" title="YouTube Video Player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`);
        document.getElementById("language-css").innerHTML = `\n${css}`;
        document.getElementById("embed-preview").src = src;
        document.getElementById("play-btn-icon").style.display = "none";
        highlight()
    }catch(err){
        alert("Failed to generate video url, make sure again you have the correct URL and the correct chosen platform");
    }
}

function vimeo(url){
    let p = document.getElementById("select-platform").value;
    let regex = regexes[p];
    try {
        let src = `https://player.vimeo.com/video/${url.match(regex)[1]}`
        document.getElementById("embed-url").value = src;
        document.getElementById("language-html").innerHTML = escape(`\n\n<iframe src="${src}" allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" title="Vimeo Video Player"></iframe>\n<script src="https://player.vimeo.com/api/player.js"></script>`);
        document.getElementById("language-css").innerHTML = `\n${css}`;
        document.getElementById("embed-preview").src = src;
        document.getElementById("play-btn-icon").style.display = "none";
        highlight()
    }catch(err){
        alert("Failed to generate video url, make sure again you have the correct URL and the correct chosen platform");
    }
}

function dailymotion(url){
    let p = document.getElementById("select-platform").value;
    let regex = regexes[p];
    try {
        let src = `https://www.dailymotion.com/embed/video/${url.match(regex)[1]}`
        document.getElementById("embed-url").value = src;
        document.getElementById("language-html").innerHTML = escape(`\n\n<iframe src="${src}" allowfullscreen title="Dailymotion Video Player" allow="web-share"></iframe>`);
        document.getElementById("language-css").innerHTML = `\n${css}`;
        document.getElementById("embed-preview").src = src;
        document.getElementById("play-btn-icon").style.display = "none";
        highlight()
    }catch(err){
        alert("Failed to generate video url, make sure again you have the correct URL and the correct chosen platform");
    }
}

function googledrive(url){
    let p = document.getElementById("select-platform").value;
    let regex = regexes[p];
    try {
        let src = `https://drive.google.com/file/d/${url.match(regex)[1]}/preview`
        document.getElementById("embed-url").value = src;
        document.getElementById("language-html").innerHTML = escape(`\n\n<iframe src="${src}" allowfullscreen title="Google Drive Preview"></iframe>`);
        document.getElementById("language-css").innerHTML = `\n${css}`;
        document.getElementById("embed-preview").src = src;
        document.getElementById("play-btn-icon").style.display = "none";
        highlight()
    }catch(err){
        alert("Failed to generate video url, make sure again you have the correct URL and the correct chosen platform");
    }
}

function copyEmbedURL(){
    const text = document.getElementById("embed-url").value;
    navigator.clipboard.writeText(text).then(() => {
        copySuccess()
    });
}
function copyHTML(){
    const html = document.getElementById("language-html").textContent;
    navigator.clipboard.writeText(html).then(() => {
        copySuccess()
    });
}
function copyCSS(){
    const text = document.getElementById("language-css").textContent;
    navigator.clipboard.writeText(text).then(() => {
        copySuccess()
    });
}
function copySuccess(){
    let c = document.getElementById("copy-success")
    c.style.opacity = "1";
    setTimeout(() => {
        c.style.opacity = "0";
    }, 2000)
}

