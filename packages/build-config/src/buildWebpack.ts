import webpack from "webpack";
import { buildDevServer } from "./buildDevServer";
import { buildLoaders } from "./buildLoaders";
import { buildPlugins } from "./buildPlugins";
import { buildResolvers } from "./buildResolvers";
import { BuildMode, BuildOptions } from "./types/types";

export function buildWebpack(options: BuildOptions): webpack.Configuration {
  const { mode, paths } = options;
  const isDev = mode === BuildMode.DEVELOPMENT;
  return {
      mode: mode ?? BuildMode.DEVELOPMENT, // production or development
      entry: paths.entry, // точка входа в приложение (можно указать несколько)
      output: { // здесь указывается в какую папку и под каким название сохряняется бандл (то куда сохраняется бандл)
        path: paths.output,
        filename: "[name].[contenthash].js",
        clean: true, // для того чтоб файлы перезаписывались при каждой сборке
      },
      plugins: buildPlugins(options), //для сборки отдельных файлов html, css и тд
      module: {
        rules: buildLoaders(options), //loaders (важен порядок!)
      },
      resolve: buildResolvers(options), // указываем расширения которые необходимо обработать
      devtool: isDev ? "inline-source-map" : "source-map", // для адекватного дебагинга, есть возможность увидеть код как он написан, а не скомпиленный
      devServer: isDev ? buildDevServer(options) : undefined, // для обновления в реалтайме
    }
}