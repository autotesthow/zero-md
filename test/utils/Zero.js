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

    async render() {
        await this.zero.render()
    }

    setCodeByConfig(code) {
        this.zero.config.code = code
    }

    setCodeByAttribute(code) {
        this.zero.setAttribute('code', code)
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

}