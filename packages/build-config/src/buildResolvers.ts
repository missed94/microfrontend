import { Configuration } from "webpack";
import { BuildOptions } from "./types/types";

export function buildResolvers(options: BuildOptions): Configuration["resolve"] {
  return {
    extensions: ['.tsx', '.ts', '.js'], // указываем расширения которые необходимо обработать
    alias: {
      "@": options.paths.src, // сокращенные импорты заменяем все ./src на @/*
    }
  }
}