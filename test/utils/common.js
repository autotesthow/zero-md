export default {
    clearSearchParams(baseUrl) {
        window.history.replaceState(null, null, baseUrl)
    }
}