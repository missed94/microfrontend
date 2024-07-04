import type { Configuration as DevServerConfiguration } from "webpack-dev-server";
import { BuildOptions } from "./types/types";

export function buildDevServer(options: BuildOptions): DevServerConfiguration {
  return {
    port: options.port ?? 3000,
    open: true,
    historyApiFallback: true, // для корректной работы роутера (ecли раздавать статику через nginx то надо делать проксирование на Index.html)
    hot: true, // позволяет обновлять код без перезагрузки страницы в случае с Фреймворками лучше использовать отдельный плагин
  }
}