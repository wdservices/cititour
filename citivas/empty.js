// Stub module — redirects @expo/vector-icons and react-native-vector-icons
// since this app uses lucide-react-native exclusively.
module.exports = new Proxy({}, { get: () => (() => null) });
