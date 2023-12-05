export default {
    baseUrl: window.location.href,

    clearSearchParams() {
        window.history.replaceState(null, null, this.baseUrl)
    },

    setSearchParams(queryString) {
        window.history.pushState(null, null, this.baseUrl + queryString)
    },

    addHtml(html) {
        const template = document.createElement('template')
        template.innerHTML = html
        return document.body.appendChild(template.content.firstElementChild)
    },
}