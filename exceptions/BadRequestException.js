class BadRequestException extends Error {
    constructor(message) {
        super();
        this.message = message;
      }
}

module.exports = BadRequestException;
