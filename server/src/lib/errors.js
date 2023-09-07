/* eslint-disable max-classes-per-file */
class HTTPError extends Error {}

class BadRequestError extends HTTPError {
  constructor(message) {
    super(message);
    this.name = 'BadRequestError';
    this.statusCode = 400;
  }
}

class ServerError extends HTTPError {
  constructor(message) {
    super(message);
    this.name = 'ServerError';
    this.statusCode = 500;
  }
}

export { BadRequestError, ServerError, HTTPError };
