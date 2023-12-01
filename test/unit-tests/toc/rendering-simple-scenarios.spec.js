/* eslint-env mocha */
/* global chai */

import common from './../../utils/common.js'

export default function() {
  mocha.setup({
    ui: 'bdd'
  })

  chai.config.truncateThreshold = 0
  const expect = chai.expect

  describe('Rendering simple scenarios', () => {
    let zero
    beforeEach(() => {
      zero = common.addHtml(`<zero-md manual-render></zero-md>`)
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

    it('# correctly', async () => {
      zeroAppendScriptMD(`
[TOC]<!--TOC>-->
      
# 1 title {#first-item}`)

      await zero.render()

      expect(zeroBody$('.toc div').style.marginLeft).to.equals('0px')
      expect(zeroBody$('a[href="#first-item"]').innerText).to.equals('1 title')
    })

    it('## correctly', async () => {
      zeroAppendScriptMD(`
[TOC]<!--TOC>-->
      
## 1 title {#first-item}`)

      await zero.render()

      expect(zeroBody$('.toc div').style.marginLeft).to.equals('40px')
      expect(zeroBody$('a[href="#first-item"]').innerText).to.equals('1 title')
    })
    
    it('### correctly', async () => {
      zeroAppendScriptMD(`
[TOC]<!--TOC>-->
      
### 1 title {#first-item}`)

      await zero.render()

      expect(zeroBody$('.toc div').style.marginLeft).to.equals('80px')
      expect(zeroBody$('a[href="#first-item"]').innerText).to.equals('1 title')
    })

    it('#### correctly', async () => {
      zeroAppendScriptMD(`
[TOC]<!--TOC>-->
      
#### 1 title {#first-item}`)

      await zero.render()

      expect(zeroBody$('.toc div').style.marginLeft).to.equals('120px')
      expect(zeroBody$('a[href="#first-item"]').innerText).to.equals('1 title')
    })
    
    it('by filter with level 0', async () => {
      zeroAppendScriptMD(`
[TOC]<!--TOC>-->
      
# 1 title {#first-item}
## 2 title {#second-item}
### 3 title {#third-item}
#### 4 title {#fourth-item}`)

      await zero.render()

      expect(zeroBody$('.toc div:nth-child(1)').style.marginLeft).to.equals('0px')
      expect(zeroBody$('a[href="#first-item"]').innerText).to.equals('1 title')
      expect(zeroBody$('.toc div:nth-child(2)').style.marginLeft).to.equals('40px')
      expect(zeroBody$('a[href="#second-item"]').innerText).to.equals('2 title')
      expect(zeroBody$('.toc div:nth-child(3)').style.marginLeft).to.equals('80px')
      expect(zeroBody$('a[href="#third-item"]').innerText).to.equals('3 title')
      expect(zeroBody$('.toc div:nth-child(4)').style.marginLeft).to.equals('120px')
      expect(zeroBody$('a[href="#fourth-item"]').innerText).to.equals('4 title')
    })
  
    it('by filter with level 1', async () => {
      zeroAppendScriptMD(`
[TOC]<!--TOC>1-->

# 1 title {#first-item}
## 2 title {#second-item}
### 3 title {#third-item}
#### 4 title {#fourth-item}`)

      await zero.render()

      expect(zeroBody$('.toc div:nth-child(1)').style.marginLeft).to.equals('0px')
      expect(zeroBody$('a[href="#second-item"]').innerText).to.equals('2 title')
      expect(zeroBody$('.toc div:nth-child(2)').style.marginLeft).to.equals('40px')
      expect(zeroBody$('a[href="#third-item"]').innerText).to.equals('3 title')
      expect(zeroBody$('.toc div:nth-child(3)').style.marginLeft).to.equals('80px')
      expect(zeroBody$('a[href="#fourth-item"]').innerText).to.equals('4 title')
    })
  
    it('by filter with level 2', async () => {
      zeroAppendScriptMD(`
[TOC]<!--TOC>2-->
      
# 1 title {#first-item}
## 2 title {#second-item}
### 3 title {#third-item}
#### 4 title {#fourth-item}`)

      await zero.render()

      expect(zeroBody$('.toc div:nth-child(1)').style.marginLeft).to.equals('0px')
      expect(zeroBody$('a[href="#third-item"]').innerText).to.equals('3 title')
      expect(zeroBody$('.toc div:nth-child(2)').style.marginLeft).to.equals('40px')
      expect(zeroBody$('a[href="#fourth-item"]').innerText).to.equals('4 title')
    })

    it('by filter with level 3', async () => {
      zeroAppendScriptMD(`
[TOC]<!--TOC>3-->
      
# 1 title {#first-item}
## 2 title {#second-item}
### 3 title {#third-item}
#### 4 title {#fourth-item}`)

      await zero.render()

      expect(zeroBody$('.toc div:nth-child(1)').style.marginLeft).to.equals('0px')
      expect(zeroBody$('a[href="#fourth-item"]').innerText).to.equals('4 title')
    })
    
    it('# correctly without anchor', async () => {
      zeroAppendScriptMD(`
[TOC]<!--TOC>-->
      
# 1 title`)

      await zero.render()

      expect(zeroBody$('.toc div').style.marginLeft).to.equals('0px')
      expect(zeroBody$('a[href="#1-title"]').innerText).to.equals('1 title')
    })

    it('# correctly without anchor with trouble naming', async () => {
      zeroAppendScriptMD(`
[TOC]<!--TOC>1-->
      
## 1        .   $%^*  title`)

      await zero.render()

      expect(zeroBody$('.toc div').style.marginLeft).to.equals('0px')
      expect(zeroBody$('a[href="#1-title"]').innerText).to.equals('1 . $%^* title')
    })
      
    it('by filter with level 2 without anchor', async () => {
      zeroAppendScriptMD(`
[TOC]<!--TOC>2-->
      
# 1 title
## 2 title 
### 3 title
#### 4 title`)

      await zero.render()

      expect(zeroBody$('.toc div:nth-child(1)').style.marginLeft).to.equals('0px')
      expect(zeroBody$('a[href="#3-title"]').innerText).to.equals('3 title')
      expect(zeroBody$('.toc div:nth-child(2)').style.marginLeft).to.equals('40px')
      expect(zeroBody$('a[href="#4-title"]').innerText).to.equals('4 title')
    })
  })
}
