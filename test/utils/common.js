export default {
    baseUrl: window.location.href,

    clearSearchParams() {
        window.history.replaceState(null, null, this.baseUrl)
    },

    setSearchParams(queryString) {
        window.history.pushState(null, null, this.baseUrl + queryString)
    },
}