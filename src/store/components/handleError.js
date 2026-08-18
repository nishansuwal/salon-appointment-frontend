const handleError = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  return error.message || 'An error occurred!'
}

export default handleError;
