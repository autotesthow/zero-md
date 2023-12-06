export class Zero {
    addHtml(html) {
        const template = document.createElement('template')
        template.innerHTML = html
        this.zero = document.body.appendChild(template.content.firstElementChild)
    }

    get() {
        return this.zero
    }

    appendScriptMD (text) {
        const script = document.createElement('script')
        script.setAttribute('type', 'text/markdown')
        script.text = text
        this.zero.appendChild(script)
    }

    src(src) {
        this.zero.src = src
    }

    async render() {
        await this.zero.render()
    }

    setCodeByConfig(code) {
        this.zero.config.code = code
    }

    setLangByConfig(lang) {
        this.zero.config.lang = lang
    }

    setCodeByAttribute(code) {
        this.zero.setAttribute('code', code)
    }

    setLangByAttribute(lang) {
        this.zero.setAttribute('lang', lang)
    }

    remove() {
        this.zero.remove()
    }

    $(selector) {
        return this.zero.shadowRoot.querySelector(selector)
    }

    body() {
        return this.$('.markdown-body')
    }

    body$(selector) {
        return this.body().querySelector(selector)
    }

    body$$(selector) {
        return this.body().querySelectorAll(selector)
    }
}