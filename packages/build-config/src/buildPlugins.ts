import webpack, { Configuration, DefinePlugin } from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { BuildMode, BuildOptions } from "./types/types";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import path from "path";
import CopyPlugin from "copy-webpack-plugin";

export function buildPlugins(options: BuildOptions): Configuration["plugins"] {
  const isDev = options.mode === BuildMode.DEVELOPMENT;
  const isProd = options.mode === BuildMode.PRODUCTION;

  const plugins: Configuration["plugins"] = [
    new HtmlWebpackPlugin({
      template: options.paths.html, // plugin для сборки html, подставляет нужные скрипты в результате сборки
      favicon: path.resolve(options.paths.public, "favicon.ico") }), // фавиконка
    new DefinePlugin({
      __PLATFORM__: JSON.stringify(options.platform), // plugin для использования каких либо переменных из окружения webpack будь то env или еще что либл
    }),
  ]

  if (isProd) {
    plugins.push(
      new MiniCssExtractPlugin({ // плагин для сборки стилей в отдельный файла
        filename: 'css/[name].[contenthash:8].css', // кофигурация имени файла и в какую папку его складывать
        chunkFilename: 'css/[name].[contenthash:8].css'
      }),
    );
    plugins.push(
      // плагин для того чтоб при билде папка loacales переносилась в папку build/dist
      new CopyPlugin({
        patterns: [
          {
            from: path.resolve(options.paths.public, "locales"),
            to: path.resolve(options.paths.output, "locales"),
          }
        ]
      })
    );
  }

  if (isDev) {
    plugins.push(new webpack.ProgressPlugin()); // для того чтоб видеть прогресс сборки - процент
    //plugins.push(new ForkTsCheckerWebpackPlugin()); // выносит проверку типов в отдельный процесс не нагружая сборку
    plugins.push(new ReactRefreshWebpackPlugin()); // позволяет изменять SPA без перезагрузки страницы
  }

  if(options.analyzer) {
    plugins.push(new BundleAnalyzerPlugin()); // для того чтоб анализировать бандл и его чанки
  }

  return plugins;
}