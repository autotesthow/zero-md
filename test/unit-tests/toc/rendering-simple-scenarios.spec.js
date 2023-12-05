/* eslint-env mocha */
/* global chai */

import { Zero } from '../../utils/Zero.js'

export default function() {
  mocha.setup({
    ui: 'bdd'
  })

  chai.config.truncateThreshold = 0
  const expect = chai.expect
  const zero = new Zero()

  beforeEach(() => {
    zero.addHtml(`<zero-md manual-render></zero-md>`)
  })
  afterEach(() => {
    zero.remove()
  })

  describe('Rendering simple scenarios', () => {
    it('# correctly', async () => {
      zero.appendScriptMD(`
[TOC]<!--TOC>-->
      
# 1 title {#first-item}`)

      await zero.render()

      expect(zero.body$('.toc div').style.marginLeft).to.equals('0px')
      expect(zero.body$('a[href="#first-item"]').innerText).to.equals('1 title')
    })

    it('## correctly', async () => {
      zero.appendScriptMD(`
[TOC]<!--TOC>-->
      
## 1 title {#first-item}`)

      await zero.render()

      expect(zero.body$('.toc div').style.marginLeft).to.equals('40px')
      expect(zero.body$('a[href="#first-item"]').innerText).to.equals('1 title')
    })
    
    it('### correctly', async () => {
      zero.appendScriptMD(`
[TOC]<!--TOC>-->
      
### 1 title {#first-item}`)

      await zero.render()

      expect(zero.body$('.toc div').style.marginLeft).to.equals('80px')
      expect(zero.body$('a[href="#first-item"]').innerText).to.equals('1 title')
    })

    it('#### correctly', async () => {
      zero.appendScriptMD(`
[TOC]<!--TOC>-->
      
#### 1 title {#first-item}`)

      await zero.render()

      expect(zero.body$('.toc div').style.marginLeft).to.equals('120px')
      expect(zero.body$('a[href="#first-item"]').innerText).to.equals('1 title')
    })
    
    it('by filter with level 0', async () => {
      zero.appendScriptMD(`
[TOC]<!--TOC>-->
      
# 1 title {#first-item}
## 2 title {#second-item}
### 3 title {#third-item}
#### 4 title {#fourth-item}`)

      await zero.render()

      expect(zero.body$('.toc div:nth-child(1)').style.marginLeft).to.equals('0px')
      expect(zero.body$('a[href="#first-item"]').innerText).to.equals('1 title')
      expect(zero.body$('.toc div:nth-child(2)').style.marginLeft).to.equals('40px')
      expect(zero.body$('a[href="#second-item"]').innerText).to.equals('2 title')
      expect(zero.body$('.toc div:nth-child(3)').style.marginLeft).to.equals('80px')
      expect(zero.body$('a[href="#third-item"]').innerText).to.equals('3 title')
      expect(zero.body$('.toc div:nth-child(4)').style.marginLeft).to.equals('120px')
      expect(zero.body$('a[href="#fourth-item"]').innerText).to.equals('4 title')
    })
  
    it('by filter with level 1', async () => {
      zero.appendScriptMD(`
[TOC]<!--TOC>1-->

# 1 title {#first-item}
## 2 title {#second-item}
### 3 title {#third-item}
#### 4 title {#fourth-item}`)

      await zero.render()

      expect(zero.body$('.toc div:nth-child(1)').style.marginLeft).to.equals('0px')
      expect(zero.body$('a[href="#second-item"]').innerText).to.equals('2 title')
      expect(zero.body$('.toc div:nth-child(2)').style.marginLeft).to.equals('40px')
      expect(zero.body$('a[href="#third-item"]').innerText).to.equals('3 title')
      expect(zero.body$('.toc div:nth-child(3)').style.marginLeft).to.equals('80px')
      expect(zero.body$('a[href="#fourth-item"]').innerText).to.equals('4 title')
    })
  
    it('by filter with level 2', async () => {
      zero.appendScriptMD(`
[TOC]<!--TOC>2-->
      
# 1 title {#first-item}
## 2 title {#second-item}
### 3 title {#third-item}
#### 4 title {#fourth-item}`)

      await zero.render()

      expect(zero.body$('.toc div:nth-child(1)').style.marginLeft).to.equals('0px')
      expect(zero.body$('a[href="#third-item"]').innerText).to.equals('3 title')
      expect(zero.body$('.toc div:nth-child(2)').style.marginLeft).to.equals('40px')
      expect(zero.body$('a[href="#fourth-item"]').innerText).to.equals('4 title')
    })

    it('by filter with level 3', async () => {
      zero.appendScriptMD(`
[TOC]<!--TOC>3-->
      
# 1 title {#first-item}
## 2 title {#second-item}
### 3 title {#third-item}
#### 4 title {#fourth-item}`)

      await zero.render()

      expect(zero.body$('.toc div:nth-child(1)').style.marginLeft).to.equals('0px')
      expect(zero.body$('a[href="#fourth-item"]').innerText).to.equals('4 title')
    })
    
    it('# correctly without anchor', async () => {
      zero.appendScriptMD(`
[TOC]<!--TOC>-->
      
# 1 title`)

      await zero.render()

      expect(zero.body$('.toc div').style.marginLeft).to.equals('0px')
      expect(zero.body$('a[href="#1-title"]').innerText).to.equals('1 title')
    })

    it('# correctly without anchor with trouble naming', async () => {
      zero.appendScriptMD(`
[TOC]<!--TOC>1-->
      
## 1        .   $%^*  title`)

      await zero.render()

      expect(zero.body$('.toc div').style.marginLeft).to.equals('0px')
      expect(zero.body$('a[href="#1-title"]').innerText).to.equals('1 . $%^* title')
    })
      
    it('by filter with level 2 without anchor', async () => {
      zero.appendScriptMD(`
[TOC]<!--TOC>2-->
      
# 1 title
## 2 title 
### 3 title
#### 4 title`)

      await zero.render()

      expect(zero.body$('.toc div:nth-child(1)').style.marginLeft).to.equals('0px')
      expect(zero.body$('a[href="#3-title"]').innerText).to.equals('3 title')
      expect(zero.body$('.toc div:nth-child(2)').style.marginLeft).to.equals('40px')
      expect(zero.body$('a[href="#4-title"]').innerText).to.equals('4 title')
    })
  })
}
