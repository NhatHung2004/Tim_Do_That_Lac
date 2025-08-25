const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Nếu bạn cần cấu hình thêm cho các thư mục watchman, alias, v.v.
// config.resolver.resolveRequest = (context, moduleName, platform) => {
//   // Custom resolver logic if needed
//   return context.defaultResolveRequest(context, moduleName, platform);
// };

module.exports = config;
