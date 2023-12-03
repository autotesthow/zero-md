export default {
    clearSearchParams(baseUrl) {
        window.history.replaceState(null, null, baseUrl)
    },

    setSearchParams(baseUrl, queryString) {
        window.history.pushState(null, null, baseUrl + queryString)
    },

    addHtml(html) {
        const template = document.createElement('template')
        template.innerHTML = html
        return document.body.appendChild(template.content.firstElementChild)
    },
}