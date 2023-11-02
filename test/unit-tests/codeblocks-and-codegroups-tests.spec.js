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
  describe.only('example', () => {
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
    it.skip(`<!--import()--> work with  ${scenario}`, async () => {
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
          
    it.skip('values from URLSearchParams should be the highest priority', async () => {
      zeroAppendScriptMD(`
<localized main="uk"/>
<codalized main="clj"/>

::::::::::::
\`\`\`js
<uk>Привіт</uk><ru>Привет</ru><en>Hello</en>
\`\`\`
\`\`\`ts
<uk>Привіт</uk><ru>Привет</ru><en>Hello</en>
\`\`\`
\`\`\`py
<uk>Привіт</uk><ru>Привет</ru><en>Hello</en>
\`\`\`
\`\`\`clojure
<uk>Привіт</uk><ru>Привет</ru><en>Hello</en>
\`\`\`
\`\`\`sdfsdf
<uk>sdfsdf</uk><ru>Привет</ru><en>Hello</en>
\`\`\`
::::::::::::
\`\`\`clojure
<uk>Привіт</uk><ru>Привет</ru><en>Hello</en>
\`\`\`
\`\`\`sdfsdf
<uk>sdfsdf</uk><ru>Привет</ru><en>Hello</en>
\`\`\`
`)

      await zero.render()

      expect(zeroBody$('.tab-button.active').innerText).to.equal('cs')
      expect(zeroBody$('.tab-content.active').innerText.split('\n')[0]).to.equal('Привіт')
    })

              
    it('priority work currently', async () => {
      zeroAppendScriptMD(`
<localized main="uk"/>
<codalized main="clj"/>

\`\`\`poetry
1.1
this is **bold** in poetry
this is __default bold (disabled)__ in poetry
this is «custom bold» in poetry
this is ___italic___ in poetry
this is ____underlined____ in poetry
\`\`\`
`)

      await zero.render()

      expect(zeroBody$('.code-text b:nth-of-type(1)').innerText).to.equal('bold')
      expect(zeroBody$('.code-text b:nth-of-type(2)').innerText).to.equal('default bold (disabled)')
      //TODO: understand how work custom bold
      expect(zeroBody$('.code-text em').innerText).to.equal('italic')
      expect(zeroBody$('span[style="text-decoration:underline"]').innerText).to.equal('underlined')
    })

    it('priority work currently with code id', async () => {
      zeroAppendScriptMD(`
<localized main="uk"/>
<codalized main="clj"/>

\`\`\`poetry: java
// 1.2 (with code id)
// this is **bold** in poetry
// this is __default bold (disabled)__ in poetry
// this is «custom bold» in poetry
// this is ___italic___ in poetry
// this is ____underlined____ in poetry
\`\`\`
`)

      await zero.render()

      expect(zeroBody$('.code-java b:nth-of-type(1)').innerText).to.equal('bold')
      expect(zeroBody$('.code-java b:nth-of-type(2)').innerText).to.equal('default bold (disabled)')
      //TODO: understand how work custom bold
      expect(zeroBody$('.code-java em').innerText).to.equal('italic')
      expect(zeroBody$('.code-java span[style="text-decoration:underline"]').innerText).to.equal('underlined')
    })

    //don't work how it work in poetry file
    it.skip('priority work currently with code id, tabbed, mixed with not-poetry', async () => {
      zeroAppendScriptMD(`
<localized main="uk"/>
<codalized main="java"/>

::::::::::
\`\`\`poetry: java
// 1.2 (with code id = java)
// this is **bold** in poetry
// this is __default bold (disabled)__ in poetry
// this is «custom bold» in poetry
// this is ___italic___ in poetry
// this is ____underlined____ in poetry
\`\`\`
\`\`\`java: «java highlighted block, not poetry»
// 1.2 (with code id = java, NOT POETRY)
// this is **bold** in poetry
// this is __default bold (disabled)__ in poetry
// this is «custom bold» in poetry
// this is ___italic___ in poetry
// this is ____underlined____ in poetry
\`\`\`
\`\`\`poetry: py
# 1.2 (with code id = py)
# this is **bold** in poetry
# this is __default bold (disabled)__ in poetry
# this is «custom bold» in poetry
# this is ___italic___ in poetry
# this is ____underlined____ in poetry
\`\`\`
\`\`\`poetry
1.2 (without code id)
this is **bold** in poetry
this is __default bold (disabled)__ in poetry
this is «custom bold» in poetry
this is ___italic___ in poetry
this is ____underlined____ in poetry
\`\`\`
::::::::::
`)

      await zero.render()

      expect(zeroBody$('.code-java b:nth-of-type(1)').innerText).to.equal('bold')
      expect(zeroBody$('.code-java b:nth-of-type(2)').innerText).to.equal('default bold (disabled)')
      //TODO: understand how work custom bold
      expect(zeroBody$('.code-java em').innerText).to.equal('italic')
      expect(zeroBody$('.code-java span[style="text-decoration:underline"]').innerText).to.equal('underlined')
    })

    it.skip('priority work currently with manual, without code id, tabbed, mixed with not-poetry where poetry is not in first tab', async () => {
      zeroAppendScriptMD(`
<localized main="uk"/>
<codalized main="java"/>

::::::::::manual
\`\`\`textile
this is **bold** in poetry
\`\`\`
\`\`\`text
this is **bold** in poetry
\`\`\`
\`\`\`poetry: «poetry»
1.2 (without code id)
this is **bold** in poetry
this is __default bold (disabled)__ in poetry
this is «custom bold» in poetry
this is ___italic___ in poetry
this is ____underlined____ in poetry

(without custom name or id this content will never be switched to if previous content was text or poetry)
\`\`\`
\`\`\`html
this is **bold** in poetry
\`\`\`
::::::::::
`)

      await zero.render()

      expect(zeroBody$('.code-java b:nth-of-type(1)').innerText).to.equal('bold')
      expect(zeroBody$('.code-java b:nth-of-type(2)').innerText).to.equal('default bold (disabled)')
      //TODO: understand how work custom bold
      expect(zeroBody$('.code-java em').innerText).to.equal('italic')
      expect(zeroBody$('.code-java span[style="text-decoration:underline"]').innerText).to.equal('underlined')
    })

    it.skip('priority work currently with', async () => {
      zeroAppendScriptMD(`
<localized main="uk"/>
<codalized main="java"/>

\`\`\`poetry
2 this is «bold with custom syntax that disables default» in poetry
\`\`\`
`)

      await zero.render()

      expect(zeroBody$('.code-java b:nth-of-type(1)').innerText).to.equal('bold')
      expect(zeroBody$('.code-java b:nth-of-type(2)').innerText).to.equal('default bold (disabled)')
      //TODO: understand how work custom bold
      expect(zeroBody$('.code-java em').innerText).to.equal('italic')
      expect(zeroBody$('.code-java span[style="text-decoration:underline"]').innerText).to.equal('underlined')
    })

    it.skip('priority work currently with', async () => {
      zeroAppendScriptMD(`
<localized main="uk"/>
<codalized main="java"/>

:::::::::
\`\`\`poetry
3 this is **bold** in poetry tabbed
\`\`\`
:::::::::
`)

      await zero.render()

      expect(zeroBody$('.code-java b:nth-of-type(1)').innerText).to.equal('bold')
      expect(zeroBody$('.code-java b:nth-of-type(2)').innerText).to.equal('default bold (disabled)')
      //TODO: understand how work custom bold
      expect(zeroBody$('.code-java em').innerText).to.equal('italic')
      expect(zeroBody$('.code-java span[style="text-decoration:underline"]').innerText).to.equal('underlined')
    })

    it.skip('priority work currently with manual', async () => {
      zeroAppendScriptMD(`
<localized main="uk"/>
<codalized main="java"/>

:::::::::manual
\`\`\`poetry
4 this is **bold** in poetry tabbed manual
\`\`\`
:::::::::
`)

      await zero.render()

      expect(zeroBody$('.code-java b:nth-of-type(1)').innerText).to.equal('bold')
      expect(zeroBody$('.code-java b:nth-of-type(2)').innerText).to.equal('default bold (disabled)')
      //TODO: understand how work custom bold
      expect(zeroBody$('.code-java em').innerText).to.equal('italic')
      expect(zeroBody$('.code-java span[style="text-decoration:underline"]').innerText).to.equal('underlined')
    })

    it.skip('priority work currently with manual, not poetry, with custom name', async () => {
      zeroAppendScriptMD(`
<localized main="uk"/>
<codalized main="java"/>

:::::::::manual
\`\`\`md: «with custom name»
5 this is **bold** in markdown tabbed manual with custom name
\`\`\`
:::::::::
`)

      await zero.render()

      expect(zeroBody$('.code-java b:nth-of-type(1)').innerText).to.equal('bold')
      expect(zeroBody$('.code-java b:nth-of-type(2)').innerText).to.equal('default bold (disabled)')
      //TODO: understand how work custom bold
      expect(zeroBody$('.code-java em').innerText).to.equal('italic')
      expect(zeroBody$('.code-java span[style="text-decoration:underline"]').innerText).to.equal('underlined')
    })

        it.skip('priority work currently with manual ## 6', async () => {
      zeroAppendScriptMD(`
<localized main="uk"/>
<codalized main="java"/>

:::::::::manual
\`\`\`poetry: «with custom name» «same with another name»
6 this is **bold** in poetry tabbed manual with custom name besides second tab with same content
\`\`\`
:::::::::
`)

      await zero.render()

      expect(zeroBody$('.code-java b:nth-of-type(1)').innerText).to.equal('bold')
      expect(zeroBody$('.code-java b:nth-of-type(2)').innerText).to.equal('default bold (disabled)')
      //TODO: understand how work custom bold
      expect(zeroBody$('.code-java em').innerText).to.equal('italic')
      expect(zeroBody$('.code-java span[style="text-decoration:underline"]').innerText).to.equal('underlined')
    })

    it.skip('priority work currently with  ## 7', async () => {
      zeroAppendScriptMD(`
<localized main="uk"/>
<codalized main="java"/>

:::::::::
\`\`\`poetry: «with custom name» java«same with another name»
// 7 this is **asterisks bold** and «custom bold» and ___italic___ in poetry tabbed with custom name with code id besides second tab without code id with same content
\`\`\`
:::::::::
`)

      await zero.render()

      expect(zeroBody$('.code-java b:nth-of-type(1)').innerText).to.equal('bold')
      expect(zeroBody$('.code-java b:nth-of-type(2)').innerText).to.equal('default bold (disabled)')
      //TODO: understand how work custom bold
      expect(zeroBody$('.code-java em').innerText).to.equal('italic')
      expect(zeroBody$('.code-java span[style="text-decoration:underline"]').innerText).to.equal('underlined')
    })

    it.skip('priority work currently with  ## 8.1', async () => {
      zeroAppendScriptMD(`
<localized main="uk"/>
<codalized main="java"/>

:::::::::manual
\`\`\`md: «with custom name» «same with another name»
8.1 this is **bold** in markdown tabbed manual with custom name besides second tab with same content
\`\`\`
:::::::::
`)

      await zero.render()

      expect(zeroBody$('.code-java b:nth-of-type(1)').innerText).to.equal('bold')
      expect(zeroBody$('.code-java b:nth-of-type(2)').innerText).to.equal('default bold (disabled)')
      //TODO: understand how work custom bold
      expect(zeroBody$('.code-java em').innerText).to.equal('italic')
      expect(zeroBody$('.code-java span[style="text-decoration:underline"]').innerText).to.equal('underlined')
    })

    it.skip('priority work currently with  ## 8.2', async () => {
      zeroAppendScriptMD(`
<localized main="uk"/>
<codalized main="java"/>

:::::::::manual
\`\`\`js: js«js with custom name» ts«ts with another name»
// 8.2 this is **bold** in markdown tabbed manual with custom name besides second tab with same content but another code id
\`\`\`
:::::::::
`)

      await zero.render()

      expect(zeroBody$('.code-java b:nth-of-type(1)').innerText).to.equal('bold')
      expect(zeroBody$('.code-java b:nth-of-type(2)').innerText).to.equal('default bold (disabled)')
      //TODO: understand how work custom bold
      expect(zeroBody$('.code-java em').innerText).to.equal('italic')
      expect(zeroBody$('.code-java span[style="text-decoration:underline"]').innerText).to.equal('underlined')
    })

    it.skip('priority work currently with  ## 8.3', async () => {
      zeroAppendScriptMD(`
<localized main="uk"/>
<codalized main="java"/>

:::::::::
\`\`\`js: js«js with custom name» ts«ts with another name»
// 8.3 this is **bold** in markdown tabbed not manual with custom name besides second tab with same content but another code id
\`\`\`
:::::::::
`)

      await zero.render()

      expect(zeroBody$('.code-java b:nth-of-type(1)').innerText).to.equal('bold')
      expect(zeroBody$('.code-java b:nth-of-type(2)').innerText).to.equal('default bold (disabled)')
      //TODO: understand how work custom bold
      expect(zeroBody$('.code-java em').innerText).to.equal('italic')
      expect(zeroBody$('.code-java span[style="text-decoration:underline"]').innerText).to.equal('underlined')
    })

    it.skip('priority work currently with  ## 9', async () => {
      zeroAppendScriptMD(`
<localized main="uk"/>
<codalized main="java"/>

:::::::::
\`\`\`poetry: cs
9 this is **bold** in poetry tabbed with known name (i.e. = code id) - cs
\`\`\`
\`\`\`poetry: java
9 this is **bold** in poetry tabbed with known name (i.e. = code id) - java
\`\`\`
:::::::::
`)

      await zero.render()

      expect(zeroBody$('.code-java b:nth-of-type(1)').innerText).to.equal('bold')
      expect(zeroBody$('.code-java b:nth-of-type(2)').innerText).to.equal('default bold (disabled)')
      //TODO: understand how work custom bold
      expect(zeroBody$('.code-java em').innerText).to.equal('italic')
      expect(zeroBody$('.code-java span[style="text-decoration:underline"]').innerText).to.equal('underlined')
    })

    it.skip('priority work currently with  ## 10', async () => {
      zeroAppendScriptMD(`
<localized main="uk"/>
<codalized main="java"/>

:::::::::
\`\`\`poetry: java«JAVA fuked it:)»
10 this is **bold** in poetry tabbed with known name (i.e. = code id) and custom name
\`\`\`
:::::::::
`)

      await zero.render()

      expect(zeroBody$('.code-java b:nth-of-type(1)').innerText).to.equal('bold')
      expect(zeroBody$('.code-java b:nth-of-type(2)').innerText).to.equal('default bold (disabled)')
      //TODO: understand how work custom bold
      expect(zeroBody$('.code-java em').innerText).to.equal('italic')
      expect(zeroBody$('.code-java span[style="text-decoration:underline"]').innerText).to.equal('underlined')
    })

    it.skip('priority work currently with  ## 11', async () => {
      zeroAppendScriptMD(`
<localized main="uk"/>
<codalized main="java"/>

:::::::::manual
\`\`\`poetry: java
11 this is **bold** in poetry tabbed manual with known name
\`\`\`
:::::::::
`)

      await zero.render()

      expect(zeroBody$('.code-java b:nth-of-type(1)').innerText).to.equal('bold')
      expect(zeroBody$('.code-java b:nth-of-type(2)').innerText).to.equal('default bold (disabled)')
      //TODO: understand how work custom bold
      expect(zeroBody$('.code-java em').innerText).to.equal('italic')
      expect(zeroBody$('.code-java span[style="text-decoration:underline"]').innerText).to.equal('underlined')
    })

    it.skip('priority work currently with  ## 12', async () => {
      zeroAppendScriptMD(`
<localized main="uk"/>
<codalized main="java"/>

:::::::::manual
\`\`\`poetry: «java»
12 this is **bold** in poetry tabbed manual with custom name of known code
\`\`\`
:::::::::
`)

      await zero.render()

      expect(zeroBody$('.code-java b:nth-of-type(1)').innerText).to.equal('bold')
      expect(zeroBody$('.code-java b:nth-of-type(2)').innerText).to.equal('default bold (disabled)')
      //TODO: understand how work custom bold
      expect(zeroBody$('.code-java em').innerText).to.equal('italic')
      expect(zeroBody$('.code-java span[style="text-decoration:underline"]').innerText).to.equal('underlined')
    })

    it.skip('priority work currently with  ## 13', async () => {
      zeroAppendScriptMD(`
<localized main="uk"/>
<codalized main="java"/>

:::::::::manual
\`\`\`js ts
13 // some code
\`\`\`
:::::::::
`)

      await zero.render()

      expect(zeroBody$('.code-java b:nth-of-type(1)').innerText).to.equal('bold')
      expect(zeroBody$('.code-java b:nth-of-type(2)').innerText).to.equal('default bold (disabled)')
      //TODO: understand how work custom bold
      expect(zeroBody$('.code-java em').innerText).to.equal('italic')
      expect(zeroBody$('.code-java span[style="text-decoration:underline"]').innerText).to.equal('underlined')
    })

    it.skip('priority work currently with  ## 14', async () => {
      zeroAppendScriptMD(`
<localized main="uk"/>
<codalized main="java"/>

:::::::::manual
\`\`\`poetry: js ts
14 // some code
\`\`\`
:::::::::
`)

      await zero.render()

      expect(zeroBody$('.code-java b:nth-of-type(1)').innerText).to.equal('bold')
      expect(zeroBody$('.code-java b:nth-of-type(2)').innerText).to.equal('default bold (disabled)')
      //TODO: understand how work custom bold
      expect(zeroBody$('.code-java em').innerText).to.equal('italic')
      expect(zeroBody$('.code-java span[style="text-decoration:underline"]').innerText).to.equal('underlined')
    })

    it.skip('priority work currently with  ## 15', async () => {
      zeroAppendScriptMD(`
<localized main="uk"/>
<codalized main="java"/>

:::::::::
\`\`\`poetry: js ts
15 // some code
\`\`\`
:::::::::
`)

      await zero.render()

      expect(zeroBody$('.code-java b:nth-of-type(1)').innerText).to.equal('bold')
      expect(zeroBody$('.code-java b:nth-of-type(2)').innerText).to.equal('default bold (disabled)')
      //TODO: understand how work custom bold
      expect(zeroBody$('.code-java em').innerText).to.equal('italic')
      expect(zeroBody$('.code-java span[style="text-decoration:underline"]').innerText).to.equal('underlined')
    })

    it.skip('priority work currently with  ## 16', async () => {
      zeroAppendScriptMD(`
<localized main="uk"/>
<codalized main="java"/>

Все html-элементы выглядят примерно так:

\`\`\`html
<element attribute1="value1" attribute2="value2"> внутренности </element>
\`\`\`

bold with «...»

\`\`\`poetry
<element attribute1="value1" attribute2="value2"> «какой-то текст» </element>
\`\`\`

bold with `**...**`and `__...__`

\`\`\`poetry
<element attribute1="value1" attribute2="value2"> **какой**-то __текст__ </element>
\`\`\`
`)

      await zero.render()

      expect(zeroBody$('.code-java b:nth-of-type(1)').innerText).to.equal('bold')
      expect(zeroBody$('.code-java b:nth-of-type(2)').innerText).to.equal('default bold (disabled)')
      //TODO: understand how work custom bold
      expect(zeroBody$('.code-java em').innerText).to.equal('italic')
      expect(zeroBody$('.code-java span[style="text-decoration:underline"]').innerText).to.equal('underlined')
    })
  })
}
