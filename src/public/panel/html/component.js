const elBody = nBug.fromElement(document.body)
elBody.style('margin', '0')
elBody.style('padding', '0')
elBody.style('font-size', '18px')
elBody.style('background-color', '#eeeeee')

class PageTitleComponent extends nH1 {
  link = new nLink()

  constructor() {
    super({
      component: { name: 'page-title-component' },
    })

    this.link.style('color')
    this.append(this.link)
  }

  titleLink(title, link = '') {
    this.link.setText(title)
    this.link.href(link)
    return this
  }
}

class PageSubtitleComponent extends nH2 {
  constructor() {
    super({
      component: { name: 'page-subtitle-component' },
    })
  }

  subtitle(subtitle) {
    this.setText(subtitle)
    return this
  }
}

class nContainerComponent extends nBug {
  top = new nBug()
  left = new nBug()
  right = new nBug()
  bottom = new nBug()

  constructor() {
    super({
      component: { name: 'container-component' },
    })

    this.build()
  }

  build() {
    super.build()

    this.style('margin', '0 auto')
    this.style('width', '60rem')

    super.append(this.top)

    const middle = new nFlex()

    this.left.styleContainer('width', '69%')
    this.left.style('width', '100%')
    middle.append(this.left)

    this.right.styleContainer('width', '30%')
    this.right.style('width', '100%')
    middle.append(this.right)

    super.append(middle)

    super.append(this.bottom)
  }

  append() {
    throw new Error('Can not do this.')
  }
}

class nTextInputComponent extends nBug {
  label = new nLabel()
  input = new nTextInput()
  error = new nTextError()

  constructor() {
    super({
      component: { name: 'text-input-component' },
    })

    this.build()
  }

  build() {
    super.build()

    super.append(this.label)
    super.append(this.input)
    super.append(this.error)
  }

  loading() {
    this.input.setAttribute('disabled', true)
  }

  notLoading() {
    this.input.removeAttribute('disabled')
  }
}

class nTextareaComponent extends nBug {
  label = new nLabel()
  textarea = new nTextarea()
  error = new nTextError()

  constructor() {
    super({
      component: { name: 'textarea-component' },
    })

    this.build()
  }

  build() {
    super.build()

    super.append(this.label)
    super.append(this.textarea)
    super.append(this.error)
  }
}

class nImageThumbComponent extends nBug {
  image = new nImage()
  title = new nText()
  subtitle = new nText()

  constructor() {
    super({
      component: { name: 'image-thumb-component' },
    })

    this.build()
  }

  build() {
    super.build()

    this.style('background-color')
    this.style('margin-bottom')
    this.style('text-align')
    this.style('box-sizing')
    this.style('padding')

    this.title.style('text-align')
    this.subtitle.style('text-align')

    this.append(this.image)
    this.append(this.title)
    this.append(this.subtitle)
  }

  src(src) {
    return this.image.src(src)
  }

  getValue() {
    return this.image.id()
  }
}

class nImageGalleryComponent extends nBug {
  image_ids = []

  constructor() {
    super({
      component: { name: 'image-gallery-component' },
    })

    this.build()
  }

  build() {
    super.build()
  }

  append(id, title, subtitle) {
    this.image_ids.push(id)

    const thumb = new nImageThumbComponent()

    thumb.title.setText(title)
    thumb.subtitle.setText(subtitle)
    thumb.image.imageId(id)

    return super.append(thumb)
  }

  getValue() {
    return this.image_ids.join(' ')
  }
}

class nUploadComponent extends nBug {
  button = new nButton()
  file_input = new nFileInput()
  info = new nSmallText()
  error = new nTextError()
  gallery = new nImageGalleryComponent()

  constructor() {
    super({
      component: { name: 'upload-component' },
    })

    this.build()
  }

  build() {
    super.build()

    const self = this

    self.button.setText('Adicionar arquivos')
    self.button.on('click', () => self.file_input.element.click())

    self.info.style('text-align')
    self.info.style('margin', '0 0 0.5rem 0')
    self.info.setText('Max.: 1MB; Ext.: jpg, png, webm')

    self.file_input.style('display', 'none')
    self.file_input.on('fileloaded', ({ file }) => self.gallery.append(file.id, file.name, file.id))
    self.file_input.on('fileerror', ({ error }) => self.error.setText(error.getMessage()))

    let button_text = ''
    self.file_input.on('uploadstart', () => {
      button_text = self.button.getText()
      self.button.setText('Loading...')
    })
    self.file_input.on('uploadend', () => {
      self.button.setText(button_text)
    })

    self.append(self.button)
    self.append(self.info)
    self.append(self.error)
    self.append(self.gallery)
  }

  getValue() {
    return this.gallery.getValue()
  }

  clear() {
    this.error.clear()
    this.gallery.clear()
  }

}

class nCenterFormComponent extends nBug {
  title = new nH1()
  subtitle = new nH2()
  form = new nBug()
  error = new nTextError()
  button = new nButton()
  link = new nLink()

  constructor() {
    super({
      component: { name: 'center-form-component' },
    })

    this.build()
  }

  build() {
    super.build()

    this.styleContainer('margin', '0.5rem auto')
    this.styleContainer('width', '30rem')

    this.style('display', 'inline-block')
    this.style('width', '100%')
    this.style('padding')

    this.append(this.title)
    this.append(this.subtitle)
    this.append(this.form)
    this.append(this.error)
    this.append(this.button)

    this.link.styleContainer('text-align', 'center')
    this.append(this.link)
  }
}

class nSelectComponent extends nTextInput {
  label = new nLabel()
  select = new nSelect()
  error = new nTextError()

  constructor() {
    super({
      component: { name: 'select-component' },
    })

    this.build()
  }

  build() {
    this.append(this.label)
    this.append(this.select)
    this.append(this.error)
  }

  loadFromURL(url) {
    return this.select.loadFromURL(url)
  }
}

class nNotationComponent extends nBug {
  label = new nLabel()
  notation = new nNotation()
  error = new nTextError()

  constructor() {
    super({
      component: { name: 'notation-component' },
    })

    this.build()
  }

  build() {
    const self = this

    self.append(self.label)

    self.notation.on('keyup', () => self.error.clear())
    self.append(self.notation)

    self.append(self.error)
  }
}
