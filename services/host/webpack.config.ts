import path from "path";
import { BuildMode, BuildPaths, BuildPlatform, buildWebpack } from "@packages/build-config";
import webpack from "webpack";
import packageJson from "./package.json";

interface EnvVars {
  mode?: BuildMode;
  port?: number;
  analyzer?: boolean;
  platform?: BuildPlatform;
  SHOP_REMOTE_URL?: string;
  ADMIN_REMOTE_URL?: string;
}

export default (env: EnvVars) => {
  const paths: BuildPaths = {
    entry: path.resolve(__dirname, "src", "bootstrap.tsx"),
    html: path.resolve(__dirname, "public", "index.html"),
    output: path.resolve(__dirname, "build"),
    src: path.resolve(__dirname, "src"),
    public: path.resolve(__dirname, "public"),
  }

  const config: webpack.Configuration = buildWebpack({
    port: env.port ?? 3000,
    paths,
    mode: env.mode,
    analyzer: env.analyzer ?? false,
    platform: env.platform ?? BuildPlatform.DESKTOP,
  });

  const SHOP_REMOTE_URL = env.SHOP_REMOTE_URL ?? "http://localhost:3001"
  const ADMIN_REMOTE_URL = env.ADMIN_REMOTE_URL ?? "http://localhost:3002"

  config.plugins.push(new webpack.container.ModuleFederationPlugin({
    name: "host",
    filename: "remoteEntry.js",
    remotes: { // пути до сервисов
      shop: `shop@${SHOP_REMOTE_URL}/remoteEntry.js`,
      admin: `admin@${ADMIN_REMOTE_URL}/remoteEntry.js`,
    },
    shared: { // здесь указываем какие либы у нас общие и каки шарим
      ...packageJson.dependencies,
      "react": {
        eager: true, // это говорит о том что библиотеку нужно подгрузить сразу (противоположно lazy loading)
        requiredVersion: packageJson.dependencies["react"],
      },
      "react-router-dom": {
        eager: true,
        requiredVersion: packageJson.dependencies["react-router-dom"],
      },
      "react-dom": {
        eager: true,
        requiredVersion: packageJson.dependencies["react-dom"],
      },
    }
  }))

  return config;
}
