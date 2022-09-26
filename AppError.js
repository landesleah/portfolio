class AppError extends Error { // Error is default class in express
    constructor(message, status) {
        super();
        this.message = message;
        this.status = status
    }
}

module.exports = AppError