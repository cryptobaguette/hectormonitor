// tslint:disable max-classes-per-file

export class InvalidAddressError extends Error {
  constructor(message: string = 'Invalid address') {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class NoDataAddressError extends Error {
  constructor(message: string = 'Address returns no data for the pool') {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ApiError extends Error {
  constructor(message: string = 'Api returned an error') {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
