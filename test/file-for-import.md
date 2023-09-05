<!--«poetryBold»-->
<!--«tabNameBrackets»-->

<!--ru~{{and}}~и~-->
<!--uk~{{and}}~і~-->
<!--en~{{and}}~and~-->

<!--ru~{{or}}~или~-->
<!--uk~{{or}}~або~-->
<!--en~{{or}}~or~-->

<!--ru~{{FROM}}~из~-->
<!--uk~{{FROM}}~з~-->
<!--en~{{FROM}}~from~-->

<!--ru~{{Review}}~Ревью~-->
<!--uk~{{Review}}~Рев’ю~-->
<!--en~{{Review}}~Review~-->

<!--ru~{{VS}}~против~-->
<!--uk~{{VS}}~проти~-->
<!--en~{{VS}}~vs~-->

<!--~{{CURRENT_CODE}}~<js>JS</js><ts>TS</ts><py>Python</py><java>Java</java><cs>C#</cs>~-->

<!--~{{RED}}~style="color:red;"~-->

<!--~{{TBD}}~**_<p {{RED}}><en>Waiting to be documented...</en><uk>Очікуємо на документування...</uk><ru>Ожидаем документирование...</ru></p>_**~-->

<!--~{{TBD\(([\s\S]+?)\)}}~**_<p {{RED}}><en>Waiting to be documented</en><uk>Очікуємо на документування</uk><ru>Ожидаем документирование</ru>: $1</p>_**~-->

<!--~{{BOTTOM_CAPTION\((.+)\)}}~↗️ *$1*

</br>~-->

<!--~{{BOTTOM_CAPTION_IMPORTS}}~↗️ *<uk>імпорти</uk><ru>импорты</ru><en>imports</en>*

</br>~-->
<!--~{{BOTTOM_CAPTION_SETUP}}~↗️ *<uk>сетап</uk><ru>сетап</ru><en>setup</en>*

</br>~-->
<!--~{{BOTTOM_CAPTION_TEST}}~↗️ *<uk>тест</uk><ru>тест</ru><en>test</en>*

</br>~-->
<!--~{{BOTTOM_CAPTION_TEST_CODE}}~↗️ *<uk>код тесту</uk><ru>код теста</ru><en>test code</en>*

</br>~-->

<!--ru~{{NO_CHANGES}}~без изменений~-->
<!--uk~{{NO_CHANGES}}~без змін~-->
<!--en~{{NO_CHANGES}}~no changes~-->

<!--~{{CODE_GROUP_NO_CHANGES}}~::::::::
```js ts
// {{NO_CHANGES}}
```
```py
# {{NO_CHANGES}}
```
```java cs
// {{NO_CHANGES}}
```
::::::::~-->

<!--~{{LOOM\(https:\/\/www\.loom\.com\/share\/(\w+)\)}}~<div style="position: relative; padding-bottom: 56.25%; height: 0;"><iframe src="https://www.loom.com/embed/$1" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></iframe></div>

,,,,,,,,,,,,,,,,,,,,,,,,,,,,,~-->

<!--~{{YOUTUBE\(https:\/\/youtu\.be\/([\w-]+)\)}}~<iframe width="760" height="427.5" src="https://www.youtube.com/embed/$1" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

,,,,,,,,,,,,,,,,,,,,,,,,,,,,,~-->

<!--~{{OF_THIS_TUTORIAL}}~<uk> цього туторіалу</uk><ru> этого туториала</ru><en> of this tutorial</en>~-->
<!--~{{OF_THIS_GUIDE}}~<uk> цього гайду</uk><ru> этого гайда</ru><en> of this guide</en>~-->

<!--~{{OTHER_CODE_VERSIONS\((.*)\)}}~
<ru>Другие версии</ru><uk>Інші версії</uk><en>Other versions</en>$1:

<js>

* **JavaScript <ru>(выбрано сейчас)</ru><uk>(обрано зараз)</uk><en>(selected now)</en>**,
* [TypeScript](?lang=<ru>ru</ru><uk>uk</uk><en>en</en>&code=ts),
* [Python](?lang=<ru>ru</ru><uk>uk</uk><en>en</en>&code=py),
* [Java](?lang=<ru>ru</ru><uk>uk</uk><en>en</en>&code=java),
* [C#](?lang=<ru>ru</ru><uk>uk</uk><en>en</en>&code=cs)

</js>

<ts>

* [JavaScript](?lang=<ru>ru</ru><uk>uk</uk><en>en</en>&code=js),
* **TypeScript <ru>(выбрано сейчас)</ru><uk>(обрано зараз)</uk><en>(selected now)</en>**,
* [Python](?lang=<ru>ru</ru><uk>uk</uk><en>en</en>&code=py),
* [Java](?lang=<ru>ru</ru><uk>uk</uk><en>en</en>&code=java),
* [C#](?lang=<ru>ru</ru><uk>uk</uk><en>en</en>&code=cs)

</ts>

<py>

* [JavaScript](?lang=<ru>ru</ru><uk>uk</uk><en>en</en>&code=js),
* [TypeScript](?lang=<ru>ru</ru><uk>uk</uk><en>en</en>&code=ts),
* **Python <ru>(выбрано сейчас)</ru><uk>(обрано зараз)</uk><en>(selected now)</en>**,
* [Java](?lang=<ru>ru</ru><uk>uk</uk><en>en</en>&code=java),
* [C#](?lang=<ru>ru</ru><uk>uk</uk><en>en</en>&code=cs)

</py>

<java>

* [JavaScript](?lang=<ru>ru</ru><uk>uk</uk><en>en</en>&code=js),
* [TypeScript](?lang=<ru>ru</ru><uk>uk</uk><en>en</en>&code=ts),
* [Python](?lang=<ru>ru</ru><uk>uk</uk><en>en</en>&code=py),
* **Java <ru>(выбрано сейчас)</ru><uk>(обрано зараз)</uk><en>(selected now)</en>**,
* [C#](?lang=<ru>ru</ru><uk>uk</uk><en>en</en>&code=cs)

</java>

<cs>

* [JavaScript](?lang=<ru>ru</ru><uk>uk</uk><en>en</en>&code=js),
* [TypeScript](?lang=<ru>ru</ru><uk>uk</uk><en>en</en>&code=ts),
* [Python](?lang=<ru>ru</ru><uk>uk</uk><en>en</en>&code=py),
* [Java](?lang=<ru>ru</ru><uk>uk</uk><en>en</en>&code=java),
* **C# <ru>(выбрано сейчас)</ru><uk>(обрано зараз)</uk><en>(selected now)</en>**

</cs>~-->


<!--js-ts~{{Selenide}}~SelenideJs~-->
<!-----py~{{Selenide}}~Selene~-->
<!---java~{{Selenide}}~Selenide~-->
<!-----cs~{{Selenide}}~NSelene~-->

<!--~{{DRIVER}}~Selenium WebDriver~-->

<!--js-ts~{{TestRunner}}~Jest~-->
<!-----py~{{TestRunner}}~Pytest~-->
<!---java~{{TestRunner}}~JUnit~-->
<!-----cs~{{TestRunner}}~NUnit~-->

<!----js~{{lang}}~JavaScript~-->
<!----ts~{{lang}}~TypeScript~-->
<!----py~{{lang}}~Python~-->
<!--java~{{lang}}~Java~-->
<!----cs~{{lang}}~C#~-->

<!--js-ts-py~{{by}}~by.*(value)~-->
<!---java-cs~{{by}}~By.*(value)~-->

<!----js~{{this}}~this~-->
<!----ts~{{this}}~this~-->
<!----py~{{this}}~self~-->
<!--java~{{this}}~this~-->
<!----cs~{{this}}~this~-->

<!--ru~{{модуль}}~<js-ts-py>модуль</js-ts-py><java-cs>класс</java-cs>~-->
<!--uk~{{модуль}}~<js-ts-py>модуль</js-ts-py><java-cs>клас</java-cs>~-->
<!--en~{{module}}~<js-ts-py>module</js-ts-py><java-cs>class</java-cs>~-->

<!--ru~{{модуле}}~<js-ts-py>модуле</js-ts-py><java-cs>классе</java-cs>~-->
<!--uk~{{модулі}}~<js-ts-py>модулі</js-ts-py><java-cs>класі</java-cs>~-->

<!--ru~{{модули}}~<js-ts-py>модули</js-ts-py><java-cs>классы</java-cs>~-->
<!--uk~{{модулі}}~<js-ts-py>модулі</js-ts-py><java-cs>класи</java-cs>~-->
<!--en~{{modules}}~<js-ts-py>modules</js-ts-py><java-cs>classes</java-cs>~-->

<!--ru~{{модулях}}~<js-ts-py>модулях</js-ts-py><java-cs>классах</java-cs>~-->
<!--uk~{{модулях}}~<js-ts-py>модулях</js-ts-py><java-cs>классах</java-cs>~-->

<!--ru~{{функция}}~<js-ts-py>функция</js-ts-py><java-cs>метода</java-cs>~-->
<!--uk~{{функцiя}}~<js-ts-py>функцiя</js-ts-py><java-cs>метод</java-cs>~-->
<!--en~{{function}}~<js-ts-py>function</js-ts-py><java-cs>method</java-cs>~-->

<!--ru~{{функций}}~<js-ts-py>функций</js-ts-py><java-cs>методов</java-cs>~-->
<!--uk~{{функцій}}~<js-ts-py>функцiй</js-ts-py><java-cs>методів</java-cs>~-->

<!--ru~{{функции}}~<js-ts-py>функции</js-ts-py><java-cs>методы</java-cs>~-->
<!--uk~{{функції}}~<js-ts-py>функції</js-ts-py><java-cs>методи</java-cs>~-->
<!--en~{{functions}}~<js-ts-py>functions</js-ts-py><java-cs>methods</java-cs>~-->

<!--ru~{{функциями}}~<js-ts-py>функциями</js-ts-py><java-cs>методами</java-cs>~-->
<!--uk~{{функціями}}~<js-ts-py>функцiями</js-ts-py><java-cs>методами</java-cs>~-->

<!--ru~{{из функции}}~<js-ts-py>из функции</js-ts-py><java-cs>из метода</java-cs>~-->
<!--uk~{{з функції}}~<js-ts-py>з функції</js-ts-py><java-cs>з метода</java-cs>~-->
