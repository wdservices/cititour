const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

const emptyModule = path.resolve(__dirname, 'empty.js');

// Force all @expo/vector-icons and react-native-vector-icons imports
// to an empty stub — this app uses lucide-react-native exclusively.
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (
    moduleName.startsWith('@expo/vector-icons') ||
    moduleName.startsWith('react-native-vector-icons')
  ) {
    return { filePath: emptyModule, type: 'sourceFile' };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
