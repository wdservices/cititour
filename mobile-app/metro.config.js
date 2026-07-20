const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
  'react-native-vector-icons': path.resolve(__dirname, 'node_modules/react-native-vector-icons'),
};

module.exports = config;
