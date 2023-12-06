/* eslint-env mocha */
/* global chai */

import { Zero } from '../utils/Zero.js'

export default function() {
  mocha.setup({
    ui: 'bdd'
  })

  chai.config.truncateThreshold = 0
  const expect = chai.expect

  const zero = new Zero()

  describe('Poetry', () => {
    beforeEach(() => {
      zero.addHtml(`<zero-md manual-render></zero-md>`)
    })
    afterEach(() => {
      zero.remove()
    })
                       
    it('codeblock renders all font transformation', async () => {
      zero.appendScriptMdLocalizedCodalized('uk', 'js', `
\`\`\`poetry
this is **bold** in poetry
this is __default bold (disabled)__ in poetry
this is «custom bold» in poetry
this is ___italic___ in poetry
this is ____underlined____ in poetry
\`\`\`
`)

      await zero.render()

      expect(zero.body$('.code-text b:nth-of-type(1)').innerText).to.equal('bold')
      expect(zero.body$('.code-text b:nth-of-type(2)').innerText).to.equal('default bold (disabled)')
      //TODO: understand how work custom bold
      expect(zero.body$('.code-text em').innerText).to.equal('italic')
      expect(zero.body$('span[style="text-decoration:underline"]').innerText).to.equal('underlined')
    })

    it('codeblock renders with code id', async () => {
      zero.appendScriptMdLocalizedCodalized('uk', 'js', `
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

      expect(zero.body$('.code-java b:nth-of-type(1)').innerText).to.equal('bold')
      expect(zero.body$('.code-java b:nth-of-type(2)').innerText).to.equal('default bold (disabled)')
      //TODO: understand how work custom bold
      expect(zero.body$('.code-java em').innerText).to.equal('italic')
      expect(zero.body$('.code-java span[style="text-decoration:underline"]').innerText).to.equal('underlined')
    })

    it('codegroup renders with code id, tabbed, mixed with not-poetry', async () => {
      zero.appendScriptMdLocalizedCodalized('uk', 'java', `
<!--«tabNameBrackets»-->

::::::::::
\`\`\`poetry: java
// (with code id = java)
// this is **bold** in poetry
// this is __default bold (disabled)__ in poetry
// this is «custom bold» in poetry
// this is ___italic___ in poetry
// this is ____underlined____ in poetry
\`\`\`
\`\`\`java: «java highlighted block, not poetry»
// (with code id = java, NOT POETRY)
// this is **bold** in poetry
// this is __default bold (disabled)__ in poetry
// this is «custom bold» in poetry
// this is ___italic___ in poetry
// this is ____underlined____ in poetry
\`\`\`
\`\`\`poetry: py
# (with code id = py)
# this is **bold** in poetry
# this is __default bold (disabled)__ in poetry
# this is «custom bold» in poetry
# this is ___italic___ in poetry
# this is ____underlined____ in poetry
\`\`\`
\`\`\`poetry
(without code id)
this is **bold** in poetry
this is __default bold (disabled)__ in poetry
this is «custom bold» in poetry
this is ___italic___ in poetry
this is ____underlined____ in poetry
\`\`\`
::::::::::
`)

      await zero.render()

      expect(zero.body$('.tab-button.active').innerText).to.equal('java')
      expect(zero.body$('.tab-button:nth-of-type(2)').innerText).to.equal('java highlighted block, not poetry')
      expect(zero.body$('.tab-button:nth-of-type(3)').innerText).to.equal('py')
      expect(zero.body$('.tab-button:nth-of-type(4)').innerText).to.equal('text')
      expect(zero.body$('.tab-content:nth-of-type(3) b').innerText).to.equal('bold')
      expect(zero.body$('.tab-content:nth-of-type(4) em').innerText).to.equal('italic')
      expect(zero.body$('.tab-content.active span[style="text-decoration:underline"]').innerText).to.equal('underlined')
      expect(zero.body$('.tab-content:nth-of-type(2)').innerText).to.equal('// (with code id = java, NOT POETRY)\n// this is **bold** in poetry\n// this is __default bold (disabled)__ in poetry\n// this is «custom bold» in poetry\n// this is ___italic___ in poetry\n// this is ____underlined____ in poetry')
    })

    it('codegroup renders with manual, without code id, tabbed, mixed with not-poetry where poetry is not in first tab', async () => {
      zero.appendScriptMdLocalized('uk', `
<!--«tabNameBrackets»-->

::::::::::manual
\`\`\`textile
this is **bold** in poetry
\`\`\`
\`\`\`text
this is **bold** in poetry
\`\`\`
\`\`\`poetry: «poetry»
(without code id)
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

      expect(zero.body$('.tab-button.active').innerText).to.equal('textile')
      expect(zero.body$('.tab-button:nth-of-type(2)').innerText).to.equal('text')
      expect(zero.body$('.tab-button:nth-of-type(3)').innerText).to.equal('poetry')
      expect(zero.body$('.tab-button:nth-of-type(4)').innerText).to.equal('html')
      expect(zero.body$('.tab-content:nth-of-type(3) b').innerText).to.equal('bold')
      expect(zero.body$('.tab-content:nth-of-type(3) em').innerText).to.equal('italic')
      expect(zero.body$('.tab-content:nth-of-type(3) span[style="text-decoration:underline"]').innerText).to.equal('underlined')
      expect(zero.body$('.tab-content:nth-of-type(2)').innerText).to.equal('this is **bold** in poetry\n')
      expect(zero.body$('.tab-content:nth-of-type(4)').innerText).to.equal('this is **bold** in poetry\n')
    })

    it('codeblock renders with custom syntax that disables default', async () => {
      zero.appendScriptMD(`
\`\`\`poetry
this is «bold with custom syntax that disables default» in poetry
\`\`\`
`)

      await zero.render()

      expect(zero.body$('.code-text').innerText).to.equal('this is «bold with custom syntax that disables default» in poetry')
    })

    it('codeblock renders in codegroup with bold text', async () => {
      zero.appendScriptMD(`
:::::::::
\`\`\`poetry
this is **bold** in poetry tabbed
\`\`\`
:::::::::
`)

      await zero.render()

      expect(zero.body$('.code-text b').innerText).to.equal('bold')
      expect(zero.body$('.code-text').innerText).to.equal('this is bold in poetry tabbed')

    })

    it('codegroup renders with manual', async () => {
      zero.appendScriptMdLocalized('uk', `
:::::::::manual
\`\`\`poetry
4 this is **bold** in poetry tabbed manual
\`\`\`
:::::::::
`)

      await zero.render()

      expect(zero.body$('.code-text b').innerText).to.equal('bold')
    })

    //bold work right or not?
    it('codegroup renders with md codeblock with manual, not poetry, with custom name', async () => {
      zero.appendScriptMD(`
<!--«tabNameBrackets»-->

:::::::::manual
\`\`\`md: «with custom name»
this is **bold** in markdown tabbed manual with custom name
\`\`\`
:::::::::
`)

      await zero.render()

      expect(zero.body$('.tab-button.active').innerText).to.equal('with custom name')
      //locators don't work
      //expect(zero.body$('span.token.content').innerText).to.equal('bold')
      expect(zero.body$('.tab-content.active').innerText).to.equal('this is **bold** in markdown tabbed manual with custom name')
    })

    it('codegroup renders with poetry codeblock with manual', async () => {
      zero.appendScriptMdLocalized('en', `
<!--«tabNameBrackets»-->

:::::::::manual
\`\`\`poetry: «with custom name» «same with another name»
this is **bold** in poetry tabbed manual with custom name besides second tab with same content
\`\`\`
:::::::::

`)

      await zero.render()

      expect(zero.body$('.tab-button.active').innerText).to.equal('with custom name')
      expect(zero.body$('.tab-button:nth-of-type(2)').innerText).to.equal('same with another name')
      expect(zero.body$('.tab-content.active b').innerText).to.equal('bold')
      expect(zero.body$('.tab-content:nth-of-type(2) b').innerText).to.equal('bold')
      expect(zero.body$('.tab-content.active').innerText).to.equal('this is bold in poetry tabbed manual with custom name besides second tab with same content')
      expect(zero.body$('.tab-content:nth-of-type(1)').innerText).to.equal('this is bold in poetry tabbed manual with custom name besides second tab with same content')

    })

    //custom bold don't work. wright expect when he start work
    it('codegroup renders with codeblocks with custom name', async () => {
      zero.appendScriptMdLocalizedCodalized('uk', 'java', `
<!--«tabNameBrackets»-->

:::::::::
\`\`\`poetry: «with custom name» java «same with another name»
// this is **asterisks bold** and «custom bold» and ___italic___ in poetry tabbed with custom name with code id besides second tab without code id with same content
\`\`\`
:::::::::
`)

      await zero.render()
      expect(zero.body$('.tab-button:nth-of-type(1)').innerText).to.equal('with custom name')
      expect(zero.body$('.tab-button.active').innerText).to.equal('java')
      expect(zero.body$('.tab-button:nth-of-type(3)').innerText).to.equal('same with another name')
      expect(zero.body$('.tab-content.active b').innerText).to.equal('asterisks bold')
      expect(zero.body$('.tab-content.active em').innerText).to.equal('italic')
      expect(zero.body$('.tab-content.active').innerText).to.equal('// this is asterisks bold and «custom bold» and italic in poetry tabbed with custom name with code id besides second tab without code id with same content')
      expect(zero.body$('.tab-content:nth-of-type(1) b').innerText).to.equal('asterisks bold')
      expect(zero.body$('.tab-content:nth-of-type(3) em').innerText).to.equal('italic')
      expect(zero.body$('.tab-content:nth-of-type(1)').innerText).to.equal('// this is asterisks bold and «custom bold» and italic in poetry tabbed with custom name with code id besides second tab without code id with same content')
    })

    //TODO: **bold** must fix in this case
    it('codegroup renders with manual, not poetry, with 2 custom names', async () => {
      zero.appendScriptMdLocalized('uk', `
<!--«tabNameBrackets»-->

:::::::::manual
\`\`\`md: «with custom name» «same with another name»
this is **bold** in markdown tabbed manual with custom name besides second tab with same content
\`\`\`
:::::::::
`)

      await zero.render()

      expect(zero.body$('.tab-button.active').innerText).to.equal('with custom name')
      expect(zero.body$('.tab-button:nth-of-type(2)').innerText).to.equal('same with another name')
      //TODO when **bold** start work active expect
      //expect(zero.body$('.tab-content.active b').innerText).to.equal('bold')
      //expect(zero.body$('.tab-content:nth-of-type(2) b').innerText).to.equal('bold')
      expect(zero.body$('.tab-content.active').innerText).to.equal('this is **bold** in markdown tabbed manual with custom name besides second tab with same content')
      expect(zero.body$('.tab-content:nth-of-type(2)').innerText).to.equal('this is **bold** in markdown tabbed manual with custom name besides second tab with same content')
    })

    //TODO: understand must work **bold** or not
    it('codegroup renders with manual, not poetry, with 2 custom namees with codes', async () => {
      zero.appendScriptMdLocalized('uk', `
<!--«tabNameBrackets»-->

:::::::::manual
\`\`\`js: js«js with custom name» ts«ts with another name»
// this is **bold** in markdown tabbed manual with custom name besides second tab with same content but another code id
\`\`\`
:::::::::
`)

      await zero.render()

      expect(zero.body$('.tab-button.active').innerText).to.equal('js with custom name')
      expect(zero.body$('.tab-button:nth-of-type(2)').innerText).to.equal('ts with another name')
      expect(zero.body$('.tab-content.active').innerText).to.equal('// this is **bold** in markdown tabbed manual with custom name besides second tab with same content but another code id')
      expect(zero.body$('.tab-content:nth-of-type(2)').innerText).to.equal('// this is **bold** in markdown tabbed manual with custom name besides second tab with same content but another code id')
    })

    //TODO: understand must work **bold** or not
    it('codegroup renders with not manual, not poetry, with 2 custom names with codes', async () => {
      zero.appendScriptMdLocalized('uk', `
<!--«tabNameBrackets»-->

:::::::::
\`\`\`js: js«js with custom name» ts«ts with another name»
// this is **bold** in markdown tabbed not manual with custom name besides second tab with same content but another code id
\`\`\`
:::::::::
`)

      await zero.render()

      expect(zero.body$('.tab-button.active').innerText).to.equal('js with custom name')
      expect(zero.body$('.tab-button:nth-of-type(2)').innerText).to.equal('ts with another name')
      expect(zero.body$('.tab-content.active').innerText).to.equal('// this is **bold** in markdown tabbed not manual with custom name besides second tab with same content but another code id')
      expect(zero.body$('.tab-content:nth-of-type(2)').innerText).to.equal('// this is **bold** in markdown tabbed not manual with custom name besides second tab with same content but another code id')
    })

    it('codegroup renders with visible on asked java or cs | invisible on asked not java or cs, like js', async () => {
      zero.appendScriptMdLocalizedCodalized('uk', 'java', `
<!--«tabNameBrackets»-->

:::::::::
\`\`\`poetry: cs
this is **bold** in poetry tabbed with known name (i.e. = code id) - cs
\`\`\`
\`\`\`poetry: java
this is **bold** in poetry tabbed with known name (i.e. = code id) - java
\`\`\`
:::::::::
`)

      await zero.render()

      expect(zero.body$('.tab-button:nth-of-type(1)').innerText).to.equal('cs')
      expect(zero.body$('.tab-button.active').innerText).to.equal('java')
      expect(zero.body$('.tab-content:nth-of-type(1) b').innerText).to.equal('bold')
      expect(zero.body$('.tab-content.active b').innerText).to.equal('bold')
      expect(zero.body$('.tab-content:nth-of-type(1)').innerText).to.equal('this is bold in poetry tabbed with known name (i.e. = code id) - cs')
      expect(zero.body$('.tab-content.active').innerText).to.equal('this is bold in poetry tabbed with known name (i.e. = code id) - java')
    })

    it('codegroup renders with visible on no asked code | visible on asked java | invisible on asked not java, like js', async () => {
      zero.appendScriptMdLocalizedCodalized('uk', 'java', `
<!--«tabNameBrackets»-->

:::::::::
\`\`\`poetry: java «JAVA with another name»
this is **bold** in poetry tabbed with known name (i.e. = code id) and custom name
\`\`\`
:::::::::
`)

      await zero.render()

      expect(zero.body$('.tab-button.active').innerText).to.equal('java')
      expect(zero.body$('.tab-button:nth-of-type(2)').innerText).to.equal('JAVA with another name')
      expect(zero.body$('.tab-content.active b').innerText).to.equal('bold')
      expect(zero.body$('.tab-content:nth-of-type(2) b').innerText).to.equal('bold')
      expect(zero.body$('.tab-content.active').innerText).to.equal('this is bold in poetry tabbed with known name (i.e. = code id) and custom name')
      expect(zero.body$('.tab-content:nth-of-type(2)').innerText).to.equal('this is bold in poetry tabbed with known name (i.e. = code id) and custom name')
    })

    it('codegroup renders with manual => visible allways', async () => {
      zero.appendScriptMdLocalizedCodalized('uk', 'java', `
:::::::::manual
\`\`\`poetry: java
this is **bold** in poetry tabbed manual with known name
\`\`\`
:::::::::
`)

      await zero.render()

      expect(zero.body$('.tab-button.active').innerText).to.equal('java')
      expect(zero.body$('.tab-content.active b').innerText).to.equal('bold')
      expect(zero.body$('.tab-content.active').innerText).to.equal('this is bold in poetry tabbed manual with known name')
    })

    //with codalized don't work
    it('codegroup renders with manual => visible allways', async () => {
      zero.appendScriptMdLocalized('uk', `
<!--«tabNameBrackets»-->

:::::::::manual
\`\`\`poetry: «java»
this is **bold** in poetry tabbed manual with custom name of known code
\`\`\`
:::::::::
`)

      await zero.render()

      expect(zero.body$('.tab-button.active').innerText).to.equal('java')
      expect(zero.body$('.tab-content.active b').innerText).to.equal('bold')
      expect(zero.body$('.tab-content.active').innerText).to.equal('this is bold in poetry tabbed manual with custom name of known code')
    })

    //todo: selector two in expect don't work
    it.skip('codegroup renders with manual, not poetry => visible both with first selected and working switch - allways', async () => {
      zero.appendScriptMdLocalizedCodalized('uk', 'js', `
:::::::::manual
\`\`\`js ts
// some code
\`\`\`
:::::::::
`)

      await zero.render()

      expect(zero.body$('code.language-typescript').innerText).to.equal('// some code\n')
      //expect(zero.body$('#ts span.token.comment').innerText).to.equal('// some code')
    })

    it('codegroup renders with manual => visible allways with first selected and working switch', async () => {
      zero.appendScriptMdLocalizedCodalized('uk', 'js', `
<!--«tabNameBrackets»-->

:::::::::manual
\`\`\`poetry: js ts
// some code
\`\`\`
:::::::::
`)

      await zero.render()

      expect(zero.body$('.tab-content.active .code-js').innerText).to.equal('// some code')
      expect(zero.body$('.code-ts').innerText).to.equal('// some code')
    })

    it('codegroup renders visible on asked js or ts | invisible on asked not js or ts, like java', async () => {
      zero.appendScriptMdLocalizedCodalized('uk', 'js', `
<!--«tabNameBrackets»-->

:::::::::
\`\`\`poetry: js ts
// some code
\`\`\`
:::::::::
`)

      await zero.render()

      expect(zero.body$('.tab-content.active .code-js').innerText).to.equal('// some code')
      expect(zero.body$('.code-ts').innerText).to.equal('// some code')
    })

    it.skip('codegroup renders with html and custom quotes in poetry for bold', async () => {
      zero.appendScriptMdLocalizedCodalized('uk', 'java', `
Все html-элементы выглядят примерно так:

\`\`\`html
<element attribute1="value1" attribute2="value2"> внутренности </element>
\`\`\`

bold with «...»

\`\`\`poetry
<element attribute1="value1" attribute2="value2"> «какой-то текст» </element>
\`\`\`

bold with \`**...**\`and \`__...__\`

\`\`\`poetry
<element attribute1="value1" attribute2="value2"> **какой**-то __текст__ </element>
\`\`\`
`)

      await zero.render()

      expect(zero.body$('.code-java b:nth-of-type(1)').innerText).to.equal('bold')
      expect(zero.body$('.code-java b:nth-of-type(2)').innerText).to.equal('default bold (disabled)')
      //TODO: understand how work custom bold
      expect(zero.body$('.code-java em').innerText).to.equal('italic')
      expect(zero.body$('.code-java span[style="text-decoration:underline"]').innerText).to.equal('underlined')
    })
  })
}
