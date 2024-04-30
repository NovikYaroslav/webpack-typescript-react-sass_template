import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';

type Mode = 'production' | 'development';

interface EnvVariables {
  mode: Mode
}

export default (env: any) => {
  const config: webpack.Configuration = {
    //  режим сборки production сжатый без дополнений.  development более развернутый с коментариями и дополнениями
    mode: env.mode || 'development',
    // папка входа (из какого файла буду браться файлы для сборки)
    entry: path.resolve(__dirname, 'src', 'index.ts'),
    // папка вывода (куда и как будет собирться сборка)
    output: {
      path: path.resolve(__dirname, 'build'),
      // название для файла сборки name-дефолтное название + contenthash сахар на основе содержания входного файла
      filename: '[name].[contenthash].js',
      // чистит папку билд от предыдущих файлов сборки
      clean: true,
    },
    plugins: [
      // плагин для создания html файла в сборке
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'public', 'index.html'),
      }),
      //   плагин для отображения прогресса сборки в процентах (не рекомендуется для продакшена)
      new webpack.ProgressPlugin(),
    ],
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
  };
  
  return config
  
};
