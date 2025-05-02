export const sendGetResponse = async (res, data) => {
  res.status(200).json({
    status: 'success',
    data: data,
  });
};

export const sendCreateResponse = async (res, message) => {
  res.status(201).json({
    status: 'success',
    message: message,
  });
};

export const sendUpdateResponse = async (res, result) => {
  res.status(200).json({
    status: 'success',
    data: result,
  });
};

export const sendDeleteResponse = async (res) => {
  res.status(200).json({
    status: 'success',
    message: 'Successfully deleted',
  });
};
