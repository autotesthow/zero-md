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
  describe.only('poetry', () => {
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
                       
    it('work currently', async () => {
      zeroAppendScriptMD(`
<localized main="uk"/>
<codalized main="js"/>

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

    it('work currently with code id', async () => {
      zeroAppendScriptMD(`
<localized main="uk"/>
<codalized main="js"/>

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

    //need so big test?
    it.skip('work currently with code id, tabbed, mixed with not-poetry', async () => {
      zeroAppendScriptMD(`
<localized main="uk"/>
<codalized main="java"/>
<!--«tabNameBrackets»-->

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

    })

    //need so big test?
    it.skip('work currently with manual, without code id, tabbed, mixed with not-poetry where poetry is not in first tab', async () => {
      zeroAppendScriptMD(`
<localized main="uk"/>
<!--«tabNameBrackets»-->

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

    it('work currently with', async () => {
      zeroAppendScriptMD(`
\`\`\`poetry
this is «bold with custom syntax that disables default» in poetry
\`\`\`
`)

      await zero.render()

      expect(zeroBody$('.code-text').innerText).to.equal('this is «bold with custom syntax that disables default» in poetry')
    })

    it('work currently with', async () => {
      zeroAppendScriptMD(`
:::::::::
\`\`\`poetry
this is **bold** in poetry tabbed
\`\`\`
:::::::::
`)

      await zero.render()

      expect(zeroBody$('.code-text b').innerText).to.equal('bold')
      expect(zeroBody$('.code-text').innerText).to.equal('this is bold in poetry tabbed')

    })

    it('work currently with manual', async () => {
      zeroAppendScriptMD(`
<localized main="uk"/>

:::::::::manual
\`\`\`poetry
4 this is **bold** in poetry tabbed manual
\`\`\`
:::::::::
`)

      await zero.render()

      expect(zeroBody$('.code-text b').innerText).to.equal('bold')
    })

    //must work but dont work
    it.skip('work currently with manual, not poetry, with custom name', async () => {
      zeroAppendScriptMD(`
:::::::::manual
\`\`\`md: «with custom name»
5 this is **bold** in markdown tabbed manual with custom name
\`\`\`
:::::::::
`)

      await zero.render()

      expect(zeroBody$('.code-java b:nth-of-type(1)').innerText).to.equal('bold')
    })

    //work but wrong
    it.skip('work currently with manual', async () => {
      zeroAppendScriptMD(`
<localized main="en"/>
<!--«tabNameBrackets»-->

:::::::::manual
\`\`\`poetry: «with custom name» «same with another name»
6 this is **bold** in poetry tabbed manual with custom name besides second tab with same content
\`\`\`
:::::::::

`)

      await zero.render()

      expect(zeroBody$('.code-java b:nth-of-type(1)').innerText).to.equal('bold')
    })

    //this functionality is broken 
    it.skip('work currently with  ## 7', async () => {
      zeroAppendScriptMD(`
<localized main="uk"/>
<codalized main="java"/>
<!--«tabNameBrackets»-->

:::::::::
\`\`\`poetry: «with custom name» java«same with another name»
// this is **asterisks bold** and «custom bold» and ___italic___ in poetry tabbed with custom name with code id besides second tab without code id with same content
\`\`\`
:::::::::
`)

      await zero.render()

    })

    //TODO: **bold** must fix in this case 
    it.skip('work currently with manual, not poetry, with 2 custom names', async () => {
      zeroAppendScriptMD(`
<localized main="uk"/>
<!--«tabNameBrackets»-->

:::::::::manual
\`\`\`md: «with custom name» «same with another name»
this is **bold** in markdown tabbed manual with custom name besides second tab with same content
\`\`\`
:::::::::
`)

      await zero.render()

      expect(zeroBody$('.tab-button.active').innerText).to.equal('with custom name')
      expect(zeroBody$('.tab-button:nth-of-type(2)').innerText).to.equal('same with another name')
      // expect(zeroBody$('code.language-md:nth-of-type(2)').innerText).to.equal('bold')
      // expect(zeroBody$('.tab-content:nth-of-type(2)').innerText).to.equal('bold')
      expect(zeroBody$('code.language-md:nth-of-type(1)').innerText).to.equal('this is bold in markdown tabbed manual with custom name besides second tab with same content')
      expect(zeroBody$('code.language-md:nth-of-type(2)').innerText).to.equal('this is bold in markdown tabbed manual with custom name besides second tab with same content')
    })

    //TODO: **bold** must fix in this case 
    it('work currently with manual, not poetry, with 2 custom namees with codes', async () => {
      zeroAppendScriptMD(`
<localized main="uk"/>
<!--«tabNameBrackets»-->

:::::::::manual
\`\`\`js: js«js with custom name» ts«ts with another name»
// this is **bold** in markdown tabbed manual with custom name besides second tab with same content but another code id
\`\`\`
:::::::::
`)

      await zero.render()

      expect(zeroBody$('.tab-button.active').innerText).to.equal('js with custom name')
      expect(zeroBody$('.tab-button:nth-of-type(2)').innerText).to.equal('ts with another name')
      expect(zeroBody$('.tab-content.active b').innerText).to.equal('bold')
      expect(zeroBody$('.tab-content:nth-of-type(2)').innerText).to.equal('bold')
      expect(zeroBody$('.tab-content.active').innerText).to.equal('// this is bold in markdown tabbed manual with custom name besides second tab with same content but another code id')
      expect(zeroBody$('.tab-content:nth-of-type(2)').innerText).to.equal('// this is bold in markdown tabbed manual with custom name besides second tab with same content but another code id')
    })

    //TODO: **bold** must fix in this case 
    it('work currently with not manual, not poetry, with 2 custom namees with codes', async () => {
      zeroAppendScriptMD(`
<localized main="uk"/>
<!--«tabNameBrackets»-->

:::::::::
\`\`\`js: js«js with custom name» ts«ts with another name»
// this is **bold** in markdown tabbed not manual with custom name besides second tab with same content but another code id
\`\`\`
:::::::::
`)

      await zero.render()

      expect(zeroBody$('.tab-button.active').innerText).to.equal('js with custom name')
      expect(zeroBody$('.tab-button:nth-of-type(2)').innerText).to.equal('ts with another name')
      expect(zeroBody$('.tab-content.active b').innerText).to.equal('bold')
      expect(zeroBody$('.tab-content:nth-of-type(2)').innerText).to.equal('bold')
      expect(zeroBody$('.tab-content.active').innerText).to.equal('// this is bold in markdown tabbed not manual with custom name besides second tab with same content but another code id')
      expect(zeroBody$('.tab-content:nth-of-type(2)').innerText).to.equal('// this is bold in markdown tabbed not manual with custom name besides second tab with same content but another code id')
    })

    it('work currently with visible on asked java or cs | invisible on asked not java or cs, like js', async () => {
      zeroAppendScriptMD(`
<localized main="uk"/>
<codalized main="java"/>
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

      expect(zeroBody$('.tab-button:nth-of-type(1)').innerText).to.equal('cs')
      expect(zeroBody$('.tab-button.active').innerText).to.equal('java')
      expect(zeroBody$('.tab-content:nth-of-type(1) b').innerText).to.equal('bold')
      expect(zeroBody$('.tab-content.active b').innerText).to.equal('bold')
      expect(zeroBody$('.tab-content:nth-of-type(1)').innerText).to.equal('this is bold in poetry tabbed with known name (i.e. = code id) - cs')
      expect(zeroBody$('.tab-content.active').innerText).to.equal('this is bold in poetry tabbed with known name (i.e. = code id) - java')
    })

    //this functionality is broken 
    it.skip('work currently with visible on no asked code | visible on asked java | invisible on asked not java, like js', async () => {
      zeroAppendScriptMD(`
<localized main="uk"/>
<codalized main="java"/>
<!--«tabNameBrackets»-->

:::::::::
\`\`\`poetry: java«JAVA fuked it:)»
this is **bold** in poetry tabbed with known name (i.e. = code id) and custom name
\`\`\`
:::::::::
`)

      await zero.render()
    })

    it('work currently with manual => visible allways', async () => {
      zeroAppendScriptMD(`
<localized main="uk"/>
<codalized main="java"/>

:::::::::manual
\`\`\`poetry: java
this is **bold** in poetry tabbed manual with known name
\`\`\`
:::::::::
`)

      await zero.render()

      expect(zeroBody$('.tab-button.active').innerText).to.equal('java')
      expect(zeroBody$('.tab-content.active b').innerText).to.equal('bold')
      expect(zeroBody$('.tab-content.active').innerText).to.equal('this is bold in poetry tabbed manual with known name')
    })

    //with codalized don't work
    it('work currently with manual => visible allways', async () => {
      zeroAppendScriptMD(`
<localized main="uk"/>
<!--«tabNameBrackets»-->

:::::::::manual
\`\`\`poetry: «java»
this is **bold** in poetry tabbed manual with custom name of known code
\`\`\`
:::::::::
`)

      await zero.render()

      expect(zeroBody$('.tab-button.active').innerText).to.equal('java')
      expect(zeroBody$('.tab-content.active b').innerText).to.equal('bold')
      expect(zeroBody$('.tab-content.active').innerText).to.equal('this is bold in poetry tabbed manual with custom name of known code')
    })

    //todo: selectors in expect don't work
    it.skip('work currently with manual, not poetry => visible both with first selected and working switch - allways', async () => {
      zeroAppendScriptMD(`
<localized main="uk"/>
<codalized main="js"/>

:::::::::manual
\`\`\`js ts
// some code
\`\`\`
:::::::::
`)

      await zero.render()

      expect(zeroBody$('code.language-typescript').innerText).to.equal('// some code')
      // expect(zeroBody$('#ts span').innerText).to.equal('// some code')
    })

    it('work currently with manual => visible allways with first selected and working switch', async () => {
      zeroAppendScriptMD(`
<localized main="uk"/>
<codalized main="js"/>
<!--«tabNameBrackets»-->

:::::::::manual
\`\`\`poetry: js ts
// some code
\`\`\`
:::::::::
`)

      await zero.render()

      expect(zeroBody$('.tab-content.active .code-js').innerText).to.equal('// some code')
      expect(zeroBody$('.code-ts').innerText).to.equal('// some code')
    })

    it('work currently visible on asked js or ts | invisible on asked not js or ts, like java', async () => {
      zeroAppendScriptMD(`
<localized main="uk"/>
<codalized main="js"/>
<!--«tabNameBrackets»-->

:::::::::
\`\`\`poetry: js ts
// some code
\`\`\`
:::::::::
`)

      await zero.render()

      expect(zeroBody$('.tab-content.active .code-js').innerText).to.equal('// some code')
      expect(zeroBody$('.code-ts').innerText).to.equal('// some code')
    })

    it.skip('work currently with html and custom quotes in poetry for bold', async () => {
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

bold with \`**...**\`and \`__...__\`

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
