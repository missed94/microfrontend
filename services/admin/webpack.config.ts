import path from "path";
import { BuildMode, BuildPaths, BuildPlatform, buildWebpack } from "@packages/build-config";
import webpack from "webpack";
import packageJson from "./package.json";

interface EnvVars {
  mode?: BuildMode;
  port?: number;
  analyzer?: boolean;
  platform?: BuildPlatform;
}

export default (env: EnvVars) => {
  const paths: BuildPaths = {
    entry: path.resolve(__dirname, "src", "index.tsx"),
    html: path.resolve(__dirname, "public", "index.html"),
    output: path.resolve(__dirname, "build"),
    src: path.resolve(__dirname, "src"),
    public: path.resolve(__dirname, "public"),
  }

  const config: webpack.Configuration = buildWebpack({
    port: env.port ?? 3002,
    paths,
    mode: env.mode,
    analyzer: env.analyzer ?? false,
    platform: env.platform ?? BuildPlatform.DESKTOP,
  });

  config.plugins.push(new webpack.container.ModuleFederationPlugin({
    name: "admin",
    filename: "remoteEntry.js", // название файла
    exposes: {
      "./Router": "./src/router/Router.tsx" // то что мы передаем на верх
    },
    shared: { // здесь указываем какие либы у нас общие и каки шарим
      ...packageJson.dependencies,
      react: {
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
