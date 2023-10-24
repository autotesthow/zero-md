/* eslint-env mocha */
/* global chai */

export default function() {
  mocha.setup({
    ui: 'bdd'
  })

  chai.config.truncateThreshold = 0
  const expect = chai.expect

  const add = (html) => {
    const template = document.createElement('template')
    template.innerHTML = html
    return document.body.appendChild(template.content.firstElementChild)
  }
  
    describe('Local import testing', () => {
    let zero
    beforeEach(() => {
      zero = add(`<zero-md manual-render></zero-md>`)
    })
    afterEach(() => {
      // zero.remove()
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

    let scenarios = {
      '"{{Review}}", "ru", "py"': {
        whenLang: 'ru',
        whenCode: 'py',
        whatWeUse: '{{Review}}',
        shouldBe: 'Ревью',
      },
      '"{{lang}}", "en", "cs"': {
        whenLang: 'en',
        whenCode: 'cs',
        whatWeUse: '{{lang}}',
        shouldBe: 'C#',
      },
      '"{{NO_CHANGES}}", "uk", "java"': {
        whenLang: 'uk',
        whenCode: 'java',
        whatWeUse: '{{NO_CHANGES}}',
        shouldBe: 'без змін',
      },
    }

    let isOnly = false
    Object.entries(scenarios).forEach((args) => {
      if (args[1].only) {
        isOnly = true
      }
    })

    Object.entries(scenarios).forEach((args) => {
      const [
        scenario,
        { only, whenLang: lang, whenCode: code, whatWeUse, shouldBe: text }
      ] = args
      if (!only && isOnly) {
        return
      }
      it(`<!--import()--> work with  ${scenario}`, async () => {
        zeroAppendScriptMD(`
<!--import(./variables-for-local-import-tests.md)-->
<localized main="${lang}"/>
<codalized main="${code}"/>

<p> 
<uk-en-ru><py-js-ts-java-cs>${whatWeUse}</py-js-ts-java-cs></uk-en-ru>
<p>`)
        
        await zero.render()
  
        expect(zeroBody$('p').innerText).to.equals(text)
      })
    })
    
    it.skip(`<!--import()--> work in variables`, async () => {
      zeroAppendScriptMD(`
<!--import(./variables-for-local-import-tests.md)-->
<localized main="en"/>
<codalized main="js"/>
<!----js~{{var}}~({{lang}}) good job~-->

<p> 
<uk-en-ru><py-js-ts-java-cs>{{var}}</py-js-ts-java-cs></uk-en-ru>
<p>`)
        
      await zero.render()

      expect(zeroBody$('p').innerText).to.equals('JavaScript good job')
    })

    it(`<!--import()--> work with "{{YOUTUBE()}}", "uk", "java"`, async () => {
      zeroAppendScriptMD(`
<!--import(./variables-for-local-import-tests.md)-->
<localized main="uk"/>
<codalized main="java"/>

<p>  
<uk-en-ru><py-js-ts-java-cs>{{YOUTUBE(https://youtu.be/I1SBGzclwE0)}}</py-js-ts-java-cs></uk-en-ru>
<p>`)
        
      await zero.render()

      expect(zeroBody$('iframe').src).to.equals('https://www.youtube.com/embed/I1SBGzclwE0')
    })
          
    it(`<!--import()--> work with "{{LOOM()}}", "en", "js"`, async () => {
      zeroAppendScriptMD(`
<!--import(./variables-for-local-import-tests.md)-->
<localized main="en"/>
<codalized main="js"/>

<p>
<uk-en-ru><py-js-ts-java-cs>{{LOOM(https://www.loom.com/share/75f1210f206f49348541008c0cf2ad1d)}}</py-js-ts-java-cs></uk-en-ru>
<p>`)
        
      await zero.render()

      expect(zeroBody$('iframe').src).to.equals('https://www.loom.com/embed/75f1210f206f49348541008c0cf2ad1d')
    })

    //TODO make it pass 
    it.skip('import one translation variable work in one translation variable', async () => {
      zeroAppendScriptMD(`
<!--import(./variables-for-local-import-tests.md)-->
<localized main="en"/>
<codalized main="js"/>
<!----js~{{js-lang}}~{{one-lang-from-import}} language~-->

<p>
<uk-en-ru><py-js-ts-java-cs>{{js-lang}}</py-js-ts-java-cs></uk-en-ru>
<p>`)
      
      await zero.render()

      expect(zeroBody$('p').innerText).to.equals('JavaScript language')
    })

    it('import general translation variable work in one translation variable', async () => {
      zeroAppendScriptMD(`
<!--import(./variables-for-local-import-tests.md)-->
<localized main="en"/>
<codalized main="js"/>
<!----js~{{one-lang}}~{{general-lang-from-import}} language~-->

<p>
<uk-en-ru><py-js-ts-java-cs>{{one-lang}}</py-js-ts-java-cs></uk-en-ru>
<p>`)
      
      await zero.render()

      expect(zeroBody$('p').innerText).to.equals('Any language')
    })

    it('import one translation variable work in general translation variable', async () => {
      zeroAppendScriptMD(`
<!--import(./variables-for-local-import-tests.md)-->
<localized main="en"/>
<codalized main="js"/>
<!--~{{general-lang}}~{{one-lang-from-import}} language~-->

<p>
<uk-en-ru><py-js-ts-java-cs>{{general-lang}}</py-js-ts-java-cs></uk-en-ru>
<p>`)
      
      await zero.render()

      expect(zeroBody$('p').innerText).to.equals('JavaScript language')
    })

    it('import general translation variable work in general translation variable', async () => {
      zeroAppendScriptMD(`
<!--import(./variables-for-local-import-tests.md)-->
<localized main="en"/>
<codalized main="js"/>
<!--~{{general-lang}}~{{general-lang-from-import}} language~-->

<p>
<uk-en-ru><py-js-ts-java-cs>{{general-lang}}</py-js-ts-java-cs></uk-en-ru>
<p>`)
      
      await zero.render()

      expect(zeroBody$('p').innerText).to.equals('Any language')
    })

    it('import one translation variable dont work in general translation variable with wrong code language', async () => {
      zeroAppendScriptMD(`
<!--import(./variables-for-local-import-tests.md)-->
<localized main="en"/>
<codalized main="py"/>
<!--~{{general-lang}}~{{one-lang-from-import}} language~-->

<p>
<uk-en-ru><py-js-ts-java-cs>{{general-lang}}</py-js-ts-java-cs></uk-en-ru>
<p>`)
      
      await zero.render()

      expect(zeroBody$('p').innerText).to.equals('{{one-lang-from-import}} language')
    })
  })
}
