import { BuildMode, BuildOptions } from "../types/types";
import { removeDataTestIdBabelPlugin } from "./removeDataTestIdBabelPlugin";

export function buildBabelLoader(options: BuildOptions) {
  const isDev = options.mode === BuildMode.DEVELOPMENT;
  const isProd = options.mode === BuildMode.PRODUCTION;
  const plugins = [];

  if (isProd) {
    plugins.push(
      [
        removeDataTestIdBabelPlugin, // кастомный плагин для бабеля, чтоб удалять не нужные дата атрибуты
        {
          props: ["data-testid"]
        }
      ]
    )
  }

  return {
    test: /\.tsx?$/, //обрабатывает ts и tsx
    exclude: /node_modules/,
    use: {
      loader: "babel-loader",
      // options можно вынести в отдельный файл babel.config.json, можно писать здесь
      options: {
        presets: [
          '@babel/preset-env',
          "@babel/preset-typescript", // для обработки TS
          ["@babel/preset-react", { runtime: isDev ? "automatic" : "classic" }] // для обработки React
        ],
        plugins: plugins.length ? plugins : undefined,
      }
    }
  }
}