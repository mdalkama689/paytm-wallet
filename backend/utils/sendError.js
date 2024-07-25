const sendErrorResponse = (res, statusCode, message) => {
  return res.status(statusCode, {
    succes: false,
    message,
  });
};

export default sendErrorResponse;
