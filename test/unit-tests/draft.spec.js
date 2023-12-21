/* eslint-env mocha */
/* global chai */

import common from './../utils/common.js'

export default function() {
  mocha.setup({
    ui: 'bdd'
  })

  chai.config.truncateThreshold = 0
  const expect = chai.expect

  describe('Draft', () => {
    let zero
    beforeEach(() => {
      zero = common.addHtml(`<zero-md manual-render></zero-md>`)
    })
    afterEach(() => {
      zero.remove()
    })

    let baseUrl = window.location.href

    const zero$ = (selector) => zero.shadowRoot.querySelector(selector)
    const zeroBody = () => zero$('.markdown-body')
    const zeroBody$ = (selector) => zeroBody().querySelector(selector)
    const zeroBody$$ = (selector) => zeroBody().querySelectorAll(selector)

    const zeroAppendScriptMD = (text) => {
      const script = document.createElement('script')
      script.setAttribute('type', 'text/markdown')
      script.text = text
      zero.appendChild(script)
    }

    it('hides text', async () => {
      zeroAppendScriptMD(`
One text

<draft>
Text to hide
</draft>

Other text`)

      await zero.render()

      expect(zeroBody$('draft')).not.exist
      expect(zeroBody$$('p').length).to.be.equal(2)
    })

    it('shows text by showDrafts option', async () => {
      zeroAppendScriptMD(`
<!--«showDrafts»-->

One text

<draft>
Text to hide
</draft>

Other text
`)

      await zero.render()

      expect(zeroBody$('draft')).not.exist
      expect(zeroBody$$('p')[1].innerText).to.equals('Text to hide')
      expect(zeroBody$$('p').length).to.be.equal(3)
    })

    it('hides text by showDrafts option overides by searchParam', async () => {
      zeroAppendScriptMD(`
<!--«showDrafts»-->

One text

<draft>
Text to hide
</draft>

Other text

<draft>
Text to hide
</draft>
`)

      const queryString = '?showDrafts=false';
      common.setSearchParams(baseUrl, queryString)

      await zero.render()

      expect(zeroBody$('draft')).not.exist
      expect(zeroBody$$('p').length).to.be.equal(2)

      common.clearSearchParams(baseUrl)
    })

    it('shows text by searchParam', async () => {
      zeroAppendScriptMD(`
One text

<draft>
Text to hide
</draft>

Other text
`)

      const queryString = '?showDrafts=true';
      common.setSearchParams(baseUrl, queryString)

      await zero.render()

      expect(zeroBody$('draft')).not.exist
      expect(zeroBody$$('p')[1].innerText).to.equals('Text to hide')
      expect(zeroBody$$('p').length).to.be.equal(3)

      common.clearSearchParams(baseUrl)
    })

    it('hides text with title in TOC', async () => {
      zeroAppendScriptMD(`
 [TOC]<!--TOC>-->
       
 # 1 title {#first-item}
 
 Some text
 
 <draft>
 # 2 To be hidden title {#second-item}
 
 Text to hide
 </draft>
 `)
 
       await zero.render()
 
       expect(zeroBody$('a').innerText).to.equals('1 title')
       expect(zeroBody$$('a')[1].innerText).not.to.equals('2 To be hidden title')
     })

    it('shows text with title in TOC by searchParam', async () => {
      zeroAppendScriptMD(`
 [TOC]<!--TOC>-->
       
 # 1 title {#first-item}
 
 Some text
 
 <draft>
 # 2 To be hidden title {#second-item}
 
 Text to hide
 </draft>
 `)
 
       const queryString = '?showDrafts=true';
       common.setSearchParams(baseUrl, queryString)
 
       await zero.render()
 
       expect(zeroBody$('a').innerText).to.equals('1 title')
       expect(zeroBody$$('a')[1].innerText).to.equals('2 To be hidden title')
       expect(zeroBody$('a[href="#second-item"]').innerText).to.equals('2 To be hidden title')

       common.clearSearchParams(baseUrl)
     })
  })
}
