function formatErrorMessages(errors) {
  if (!errors) return 'Có lỗi xảy ra';

  // Lấy tất cả message trong object
  let messages = [];
  for (const key in errors) {
    if (Array.isArray(errors[key])) {
      messages.push(...errors[key]);
    } else {
      messages.push(errors[key]);
    }
  }
  return messages.join('\n'); // ghép lại thành 1 string
}

export default formatErrorMessages;
