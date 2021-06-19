class ConflictException extends Error {
    constructor(message) {
        super();
        this.message = message;
      }
}

module.exports = ConflictException;
