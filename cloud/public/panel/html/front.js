
const Translations = {
  'pt-br': {
    'request entity too large': 'Essa solicitação está além do esperado.',
    'Can not duplicate this item.': 'Não podemos duplicar esse cadastro.',
    'User not found.': 'Não encontramos esse e-mail. Verifique seu cadastro.',
  }
}

const Translator = ({
  in: (language) => ({
    speak: (phrase) => {
      const phrases = Translations[language]

      if (phrases) {
        return phrases[phrase] || 'no translation'
      }
    }
  })
})

const Styles = {
  'default': {
    'background-color': '#cccccc',
    'padding-bottom': '0.5rem',
    'margin-bottom': '0.5rem',
    'text-align': 'center',
    'padding': '0.5rem',
    'margin': '0.5rem',
    'width': '100%',
    'color': '#000',
  }
}

const Front = {
  pageLink: (...path) => `http://0.0.0.0/${path.join('/')}`,

  apiLink: (...path) => `http://0.0.0.0/api/v1/${path.join('/')}`,
  apiLinkPath: (...path) => path.join('/'),

  setData: (name, value) => localStorage.setItem(name, JSON.stringify(value)),
  getData: (name) => JSON.parse(localStorage.getItem(name)),

  dateDiff: (date = new Date) => {
    const now = new Date()
    const diff = Math.floor((now - date) / 1000)

    switch (true) {
      case diff < 60: return 'Agora mesmo'
      case diff < 60 * 60: return 'Há poucos minutos'
      case diff < 60 * 60 * 48: return `Há ${Math.floor(diff / (60 * 60))} horas`
    }

    return `Há ${Math.floor(diff / (60 * 60 * 24))} dias`
  }
}

const Str = {
  normalizeSpecialChar: (letter) => {
    switch (letter) {
      case ' ':
      case '!':
      case '@':
      case '#':
      case '%':
      case '&':
      case '*':
      case '<':
      case '>':
      case '(':
      case ')':
      case '{':
      case '}':
      case '[':
      case ']':
      case '+':
      case '-':
      case '_':
      case '=':
      case ',':
      case '.':
      case ':':
      case ';':
      case '?':
      case '|':
      case '|':
      case '/':
      case '"':
      case '\'':
      case '\\':
        letter = '-';
        break;

      case '$':
        letter = 's'
        break;

      case 'á':
      case 'à':
      case 'â':
      case 'ã':
        letter = 'a';
        break;

      case 'é':
      case 'ê':
        letter = 'e';
        break;

      case 'í':
        letter = 'i';
        break;

      case 'ó':
      case 'ô':
      case 'ò':
      case 'õ':
        letter = 'o';
        break;

      case 'ú':
      case 'ü':
        letter = 'u';
        break;

      case 'ç':
        letter = 'c';
        break;
    }

    return letter
  },

  toURL: (str) => {
    return str.toString()
      .split('').map(letter => Str.normalizeSpecialChar(letter))
      .join('').replace(/[-]+/ig, '-').replace(/^-|-$/ig, '')
      .trim().toLowerCase()
  }
}

const Flow = {}

Flow.goTo = (url) => (window.location = url)

class nBug {

  id = null

  container = document.createElement('div')
  element = document.createElement('div')

  options = {}
  logs = {
    element: [],
    container: [],
  }

  constructor(options = {}) {
    this.options = options
  }

  build() {
    if (this.options?.element?.tagName) {
      this.element = document.createElement(this.options.element.tagName)
    }

    if (this.options?.container?.tagName) {
      this.container = document.createElement(this.options?.container?.tagName)
    }

    const name = this.options?.component?.name || undefined
    this.container.classList.add(`ct-${name}`)
    this.element.classList.add(`el-${name}`)

    this.style('outline', 'none')
    this.style('box-sizing', 'border-box')
  }

  static fromElement(el, options = {}) {
    const component = new nBug(options)
    component.loadElement(el)
    return component
  }

  static fromId(id, options) {
    return nBug.fromElement(document.getElementById(id), options)
  }

  loadElement(element) {
    this.logs.element.push(['loadElement', element])
    this.element = element
    return this
  }

  focus() {
    this.logs.element.push(['focus'])
    this.element.focus()
    return this
  }

  placeholder(value = '') {
    this.logs.element.push(['placeholder', value])
    this.setAttribute('placeholder', value)
    return this
  }

  setAttribute(name, value) {
    this.logs.element.push(['setAttribute', name, value])
    this.element.setAttribute(name, value)
    return this
  }

  getAttribute(name) {
    this.logs.element.push(['getAttribute', name])
    return this.element.getAttribute(name)
  }

  removeAttribute(name) {
    this.logs.element.push(['removeAttribute', name])
    this.element.removeAttribute(name)
    return this
  }

  style(name, value = 'default') {
    this.logs.element.push(['style', name, value])

    if (value === 'default') {
      const style = Styles[this.options?.element?.tagName] || Styles['default']
      value = style[name]
    }

    this.element.style[name] = value
    return this
  }

  styleContainer(name, value) {
    this.logs.container.push(['style', name, value])

    if (value === 'default') {
      const style = Styles[this.options?.container?.tagName] || Styles['default']
      value = style[name]
    }

    this.container.style[name] = value
    return this
  }

  id(id) {
    this.logs.element.push(['id', id])
    return this.data(id)
  }

  setText(text) {
    this.logs.element.push(['setText', text])
    if (text) this.element.innerText = text
    return this
  }

  getText() {
    this.logs.element.push(['getText'])
    return this.element.innerText
  }

  clear() {
    this.logs.element.push(['clear'])
    this.element.childNodes.forEach(node => node.remove())
    return this
  }

  erase() {
    this.logs.element.push(['erase'])
    this.element.value = ''
    return this
  }

  append(nBug = new nBug) {
    this.logs.element.push(['append', nBug])
    this.element.append(nBug.render())
    return this
  }

  set(nBug = new nBug) {
    this.logs.element.push(['set', nBug])
    this.element.childNodes.forEach(c => c.remove())
    this.element.append(nBug.render())
    return this
  }

  on(name, func) {
    this.logs.element.push(['on', name])
    this.element.addEventListener(name, func)
    return this
  }

  render() {
    this.logs.element.push(['render'])
    this.container.append(this.element)
    return this.container
  }
}

class nValuable extends nBug {

  disable() {
    this.setAttribute('disabled', true)
    return this
  }

  enable() {
    this.setAttribute('disabled', '')
    return this
  }

  setValue(value) {
    this.element.value = value
    return this
  }

  getValue() {
    return this.element.value
  }

}

class nTextInput extends nValuable {
  constructor() {
    super({
      component: { name: 'text-input' },
      element: { tagName: 'input' }
    })

    this.build()
  }

  build() {
    super.build()

    this.setAttribute('type', 'text')

    this.style('box-shadow', '0 0 0.1rem 0 black')
    this.style('box-sizing', 'border-box')
    this.style('margin', '0 0 0.5rem 0')
    this.style('outline', 'none')
    this.style('font', 'inherit')
    this.style('border', 'none')
    this.style('width', '100%')
    this.style('padding')
  }
}

class nTextarea extends nValuable {
  constructor() {
    super({
      component: { name: 'textarea' },
      element: { tagName: 'textarea' }
    })

    this.build()
  }

  build() {
    super.build()

    this.style('box-shadow', '0 0 0.1rem 0 black')
    this.style('box-sizing', 'border-box')
    this.style('margin', '0 0 0.5rem 0')
    this.style('padding')
    this.style('outline', 'none')
    this.style('font', 'inherit')
    this.style('resize', 'none')
    this.style('border', 'none')
    this.style('width', '100%')
  }

  setRows(rows) {
    this.element.rows = rows
    return this
  }
}

class nFileInput extends nValuable {
  constructor() {
    super({
      component: { name: 'file-input' },
      element: { tagName: 'input' }
    })

    this.build()
  }

  build() {
    super.build()

    this.setAttribute('type', 'file')

    const self = this

    self.on('change', ({ target: { files } }) => {
      Array.from(files).forEach((file) => {
        const { name, size, type } = file

        Api.upload(file, { name, size, type })
          .then((response) => {
            const event = new Event('fileloaded')
            event.file = { name, size, type, id: response.get('id') }
            self.element.dispatchEvent(event)
          })
          .catch((error) => {
            const event = new Event('fileerror')
            event.error = error
            self.element.dispatchEvent(event)
          })
          .finally(() => self.element.dispatchEvent(new Event('uploadend')))

        self.element.dispatchEvent(new Event('uploadstart'))
      })
    })
  }

  multiple() {
    this.setAttribute('multiple', true)
    return this
  }

  accept(accept = '*/*') {
    this.setAttribute('accept', accept)
    return this
  }
}

class nText extends nValuable {
  constructor() {
    super({
      component: { name: 'text' },
    })
  }
}

class nSmallText extends nValuable {
  constructor() {
    super({
      component: { name: 'small-text' },
    })

    this.style('font-size', '0.75rem')
  }
}

class nTextError extends nBug {
  constructor() {
    super({
      component: { name: 'text-error' },
    })

    this.build()
  }

  build() {
    super.build()

    this.style('margin-bottom', '0.5rem')
    this.style('color', 'red')
  }
}

class nLabel extends nBug {
  constructor() {
    super({
      component: { name: 'label' },
    })

    this.build()
  }

  build() {
    super.build()

    this.style('margin-bottom', '0.5rem')
  }
}

class nH1 extends nText {
  constructor() {
    super({
      component: { name: 'h1' },
    })

    this.build()
  }

  build() {
    super.build()

    this.styleContainer('display', 'inline-block')
    this.styleContainer('width', '100%')

    this.style('font-size', '3rem')
    this.style('margin-bottom')
    this.style('text-align')
  }
}

class nH2 extends nH1 {
  constructor() {
    super({
      component: { name: 'h2' },
    })

    this.build()
  }

  build() {
    super.build()

    this.style('font-size', '1.5rem')
  }
}

class nH3 extends nH2 {
  constructor() {
    super({
      component: { name: 'h3' },
    })

    this.build()
  }

  build() {
    super.build()

    this.style('font-size', '1.25rem')
  }
}

class nButton extends nBug {
  constructor() {
    super({
      component: { name: 'button' },
      element: { tagName: 'button' }
    })

    this.build()
  }

  build() {
    super.build()

    this.style('display', 'inline-block')
    this.style('margin', '0 0 0.5rem 0')
    this.style('padding')
    this.style('cursor', 'pointer')
    this.style('outline', 'none')
    this.style('font', 'inherit')
    this.style('background-color', '#dddddd')
    this.style('border', 'none')
    this.style('width', '100%')
  }
}

class nLink extends nBug {
  constructor() {
    super({
      component: { name: 'link' },
      element: { tagName: 'a' }
    })

    this.build()
  }

  build() {
    super.build()

    this.styleContainer('text-align')

    this.style('text-decoration', 'none')
    this.style('display', 'inline-block')
  }

  href(url) {
    this.element.href = url
    return this
  }
}

class nButtonLink extends nLink {
  constructor() {
    super({
      component: { name: 'button-link' },
    })

    this.build()
  }

  build() {
    super.build()

    this.styleContainer('width', '100%')

    this.style('background-color', '#cccccc')
    this.style('cursor', 'pointer')
    this.style('padding')
    this.style('color', '#000')
    this.style('width', '100%')
  }
}

class nFlex extends nBug {
  constructor() {
    super({
      component: { name: 'flex' },
    })

    this.build()
  }

  build() {
    super.build()

    this.style('display', 'flex')
    this.style('justify-content', 'space-between')
  }
}

class nImage extends nBug {
  constructor() {
    super({
      component: { name: 'image' },
      element: { tagName: 'img' }
    })

    this.build()
  }

  build() {
    super.build()

    this.style('max-width', '100%')
  }

  src(src) {
    return this.setAttribute('src', src)
  }

  imageId(id) {
    this.id = id
    return this.src(`http://0.0.0.0/files/${id}/file`)
  }

  alt(alt) {
    this.setAttribute('alt', alt)
    return this
  }
}

class nSelect extends nValuable {
  optionBugs = []

  constructor() {
    super({
      component: { name: 'select' },
      element: { tagName: 'select' }
    })

    this.build()
  }

  build() {
    super.build()

    this.style('box-shadow', '0 0 0.1rem 0 black')
    this.style('background-color', '#ffffff')
    this.style('box-sizing', 'border-box')
    this.style('margin', '0 0 0.5rem 0')
    this.style('outline', 'none')
    this.style('font', 'inherit')
    this.style('border', 'none')
    this.style('padding')
    this.style('width')
  }

  appendOption({ key = '', value }) {
    this.optionBugs.push({ key, value })
    const option = document.createElement('option')
    option.value = key
    option.innerText = value
    this.element.append(option)

    return this
  }

  loadFromURL(url) {
    const self = this

    Ajax.post([url])
      .then((response) => response.get('list').map((item) => self.appendOption(item)))
      .catch((error) => {
        const event = new Event('error')
        event.error = error
        self.element.dispatchEvent(event)
      })

    return self
  }
}

class nNotation extends nBug {
  collection = new nBug()
  input = new nTextInput()

  phrases = []

  constructor() {
    super({
      component: { name: 'notation' },
    })

    this.build()
  }

  build() {
    super.build()

    const self = this

    self.input.on('keyup', (event) => {
      event.preventDefault()

      switch (event.keyCode.toString()) {
        case '188':
        case '13':
          self.addPhrase(self.input.getValue())
          break;
      }
    })
    self.append(self.input)

    self.collection.style('clear', 'both')
    self.append(self.collection)
  }

  addPhrase(phrase) {
    this.phrases.push(phrase)

    const el = new nBug()

    el.style('margin', '0.5rem 0.5rem 0.5rem 0')
    el.style('background-color', '#dddddd')
    el.style('border-radius', '0.1rem')
    el.style('display', 'inline')
    el.style('padding', '0.5rem')
    el.style('float', 'left')

    el.setText(phrase.replace(',', ''))

    this.collection.append(el)
    this.input.erase()
  }

  getValue() {
    return this.phrases
  }
}
