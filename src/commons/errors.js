
class ApplicationError extends Error {
  constructor(message, code, extras = {}) {
    super(message)
    this.status_code = code
    this.status_message = this.parseStatusMessage(code)
    this.extras = extras
  }

  parseStatusMessage(code) {
    switch (code.toString()) {
      case '403': return 'Forbidden';
    }
  }
}

class DuplicatedError extends ApplicationError {
  constructor(extras = {}) {
    super('Can not duplicate this item.', '403', extras)
  }
}

class NotFoundError extends ApplicationError {
  constructor(message = 'Not found item.', extras = {}) {
    super(message, '404', extras)
  }
}

module.exports = {
  ApplicationError,
  DuplicatedError,
  NotFoundError,
}
