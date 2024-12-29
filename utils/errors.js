const ERROR_CODES = {
  BAD_REQUEST: 400, // Invalid data passed
  NOT_FOUND: 404, // Resource not found
  SERVER_ERROR: 500, // Default server error
};

const ERROR_MESSAGES = {
  BAD_REQUEST: "Bad request in data or syntax.",
  NOT_FOUND: "The request was sent to a non-existent address.",
  SERVER_ERROR: "An error has occurred on the server.",
  INVALID_ID_FORMAT: "Invalid ID format.",
  MISSING_OWNER: "Owner ID is missing from the request.",
  MISSING_FIELDS: "Missing required fields: name, weather, imageUrl.",
};

module.exports = { ERROR_CODES, ERROR_MESSAGES };
