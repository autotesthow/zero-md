/* eslint-env mocha */
/* global chai */

export default function() {
  mocha.setup({
    ui: 'bdd'
  })

  chai.config.truncateThreshold = 0
  const assert = chai.assert
  const expect = chai.expect

  const add = (html) => {
    const template = document.createElement('template')
    template.innerHTML = html
    return document.body.appendChild(template.content.firstElementChild)
  }

  const sleep = (t) => new Promise((resolve) => setTimeout(resolve, t))

  describe('buildMd()', () => {
    let zero
    beforeEach(() => {
      zero = add(`<zero-md manual-render></zero-md>`)
    })
    afterEach(() => {
      zero.remove()
    })
    const zero$ = (selector) => zero.shadowRoot.querySelector(selector)
    const zeroBody = () => zero$('.markdown-body')
    const zeroBody$ = (selector) => zeroBody().querySelector(selector)

    const zeroAppendScriptMD = (text) => {
      const script = document.createElement('script')
      script.setAttribute('type', 'text/markdown')
      script.text = text
      zero.appendChild(script)
    }

    it('converts md from src to html', async () => {
      zero.src = './fixtures/h1.md'

      await zero.render()

      expect(zeroBody$('h1').innerText).to.equal('First level header')
    })

    it('falls back to script when src is falsy', async () => {
      const script = document.createElement('script')
      script.setAttribute('type', 'text/markdown')
      script.text = `# fallback`
      zero.appendChild(script)

      await zero.render()

      expect(zeroBody$('h1').innerText).to.equal('fallback')
    })

    it('highlights java code too', async () => {
      zero.src = 'fixture.md'
      zeroAppendScriptMD(
        '\n' +
          '\n```java' +
          '\npublic class HelloWorld {' +
          '\n  public static void main(String[] args) {' +
          '\n    System.out.println("Hello, World!");' +
          '\n  }' +
          '\n}' +
          '\n```' +
          '\n'
      )

      await zero.render()
      await sleep(200) // freaking ugly but blame prism

      const el = zeroBody$('pre>code.language-java :first-child')
      assert(el.classList.contains('token'))
    })

    it('language-detects unhinted code blocks as NOTHING o_O', async () => {
      zeroAppendScriptMD(
        '\n' +
          '\n```' +
          '\npublic class HelloWorld {' +
          '\n  public static void main(String[] args) {' +
          '\n    System.out.println("Hello, World!");' +
          '\n  }' +
          '\n}' +
          '\n```' +
          '\n'
      )

      await zero.render()

      // TODO: uncomment when prismajs is fixed and unhinted code is again marked as language-text
      //       (as part of https://kanbanflow.com/t/S7V4boFD)
      // expect([...zeroBody$('pre>code').classList]).to.contain('language-text')
      expect([...zeroBody$('pre>code').classList]).to.be.empty
    })

    it('dedents when script data-dedent set', async () => {
      const script = document.createElement('script')
      script.setAttribute('type', 'text/markdown')
      script.setAttribute('data-dedent', '')
      script.text = `
        # fallback`
      zero.appendChild(script)

      await zero.render()

      expect(zero.shadowRoot.querySelector('.markdown-body>h1').innerText).to.equal('fallback')
    })

    // TODO: make it pass
    it.skip('resolves md links base urls relative to src', async () => {
      zero.src = 'fixtures/with-relative-img-link.md'

      await zero.render()

      const [_, relative] = /https?:\/\/[^/]+(.*)/.exec(zeroBody$('img').src)
      expect(relative).to.equal('/test1/cat.jpg')
    })    
  })
}
