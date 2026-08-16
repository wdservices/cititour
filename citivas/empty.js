function NoopComponent() {
  return null;
}

function createIconSet() {
  return NoopComponent;
}

function createIconSetFromIcoMoon() {
  return NoopComponent;
}

function createIconSetFromFontello() {
  return NoopComponent;
}

var stubs = {
  default: NoopComponent,
  createIconSet: createIconSet,
  createIconSetFromIcoMoon: createIconSetFromIcoMoon,
  createIconSetFromFontello: createIconSetFromFontello,
  createMultiStyleIconSet: function () { return NoopComponent; },
  createButton: function () { return NoopComponent; },
  createHeaderButton: function () { return NoopComponent; },
  createHeaderButtons: function () { return NoopComponent; },
  Item: NoopComponent,
  HiddenItem: NoopComponent,
  OverflowMenu: NoopComponent,
  IconButton: NoopComponent,
  withNavigation: function (C) { return C; },
  withNavigationFocus: function (C) { return C; },
  Ionicons: NoopComponent,
  MaterialIcons: NoopComponent,
  MaterialCommunityIcons: NoopComponent,
  FontAwesome: NoopComponent,
  FontAwesome5: NoopComponent,
  FontAwesome6: NoopComponent,
  Feather: NoopComponent,
  AntDesign: NoopComponent,
  Entypo: NoopComponent,
  EvilIcons: NoopComponent,
  SimpleLineIcons: NoopComponent,
  Octicons: NoopComponent,
  Zocial: NoopComponent,
  Foundation: NoopComponent,
  Fontisto: NoopComponent,
};

stubs.default = NoopComponent;

module.exports = stubs;
