class UnauthorizedException extends Error {
    constructor(message) {
        super();
        this.message = message;
      }
}

module.exports = UnauthorizedException;
