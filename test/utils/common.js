export default {
    clearSearchParams(baseUrl) {
        window.history.replaceState(null, null, baseUrl)
    },

    setSearchParams(baseUrl, queryString) {
        window.history.pushState(null, null, baseUrl + queryString)
    },

    // zeroAppendScriptMd(text) {
    //     const script = document.createElement('script')
    //     script.setAttribute('type', 'text/markdown')
    //     script.text = text
    //     zero.appendChild(script)
    // },

    addHtml(html) {
        const template = document.createElement('template')
        template.innerHTML = html
        return document.body.appendChild(template.content.firstElementChild)
      },
}