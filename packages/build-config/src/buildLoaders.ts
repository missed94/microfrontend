import { ModuleOptions } from "webpack";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import ReactRefreshTypeScript from "react-refresh-typescript";
import { BuildMode, BuildOptions } from "./types/types";
import { buildBabelLoader } from "./babel/buildBabelLoader";

export function buildLoaders(options: BuildOptions): ModuleOptions["rules"] {
  const isDev = options.mode === BuildMode.DEVELOPMENT;

  const svgLoader = {
    test: /\.svg$/i,
    use: [
      {
        loader: "@svgr/webpack", // создает над иконкой оболочку, теперь иконки спользуются как компоненты
        options: {
          icon: true, // чтоб работать с иконками как с шрифтом
          svgoConfig: {
            plugins: [
              {
                name: "convertColors", // чтоб можно было менять цвет через color
                params: {
                  currentColor: true,
                }
              }
            ]
          }
        }
      },
    ],
  }


  const assetsLoader = { // loader для картинок
    test: /\.(png|jpg|jpeg|gif)$/i,
    type: 'asset/resource',
  };


  const cssLoaderWithModule = { // для работы с css модулями
    loader: "css-loader",
    options: {
      modules: {
        localIdentName: isDev ? "[path][name]__[local]" : "[hash:base64:8]"
        //вид наименованя css классов для конкретного типа сборки,
        // в первом случае название класса состоит из связки путь до файла(src-components-App-module) + искомый css класс(className)
        // = src-components-fileName-module__className
        // во втором случае генерируется абракадабра
      },
    }
  };

  const scssLoader = {
    test: /\.s[ac]ss$/i,
    use: [ //если хотим использовать несклько лоадеров то пишем их в массиве use
      // создает 'style' из JS строк + добавляет в билд
      isDev ? "style-loader" : MiniCssExtractPlugin.loader,
      // переводит CSS в CommonJs
      cssLoaderWithModule,
      // компилит Sass в CSS
      "sass-loader"
    ],
  };

  const tsLoader = { // настройки для TS, так же ts-loader умеет работать с JSX, если бы не использовали TS нужен был бы babel-loader
    test: /\.tsx?$/, //обрабатывает ts и tsx
    loader: "ts-loader", // название лоадера
    options: {
      //исключает ошибки ts из сборки, сборка не будет падать если есть ошибки ts,
      // можно исползовать для разработки
      transpileOnly: isDev,
      //участвует в процессе, в котором можно изменять код без перезагрузки страницы
      getCustomTransformers: () => ({
        before: [isDev && ReactRefreshTypeScript()].filter(Boolean),
      })
    },
    exclude: /node_modules/, // то что не обрабатывается
  }

  const babelLoader = buildBabelLoader(options);

  return [
    svgLoader,
    assetsLoader,
    scssLoader,
    tsLoader,
    //babelLoader,
  ];
}