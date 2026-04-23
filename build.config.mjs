import pkg from "./package.json" with { type: "json" };

/**
 * @type {import("electron-builder").Configuration}
 * @see https://www.electron.build/configuration
 */
export default {
  npmRebuild: false,

  appId: pkg.name,
  productName: pkg.description,

  mac: {
    target: [{ target: "default", arch: "universal" }],
    type: "distribution",
    hardenedRuntime: true,
    entitlements: "build-resources/entitlements.mac.plist",
    entitlementsInherit: "build-resources/entitlements.mac.plist",
    gatekeeperAssess: false,
    identity: null,
  },
  dmg: {
    contents: [
      { x: 130, y: 220 },
      { x: 410, y: 220, type: "link", path: "/Applications" },
    ],
  },
  win: {
    target: ["nsis"],
  },
  nsis: {
    oneClick: false,
    perMachine: false,
    allowElevation: true,
    allowToChangeInstallationDirectory: true,
  },
  linux: {
    target: ["AppImage"],
    category: "Development",
  },
  protocols: [
    {
      name: pkg.description,
      schemes: [pkg.name],
    },
  ],
};