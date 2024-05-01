import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import type { Configuration as DevServerConfiguration } from 'webpack-dev-server';

type Mode = 'production' | 'development';

interface EnvVariables {
  mode: Mode
  port: number
}

export default (env: any) => {
  const devMode = env.mode === 'development'
  const config: webpack.Configuration = {
// Production build mode: compressed without extras. Development mode: more verbose with comments and extras.
    mode: env.mode || 'development',
// Input directory (where files for compilation will be taken from).
    entry: path.resolve(__dirname, 'src', 'index.tsx'),
// Output directory (where and how the build will be assembled).
    output: {
      path: path.resolve(__dirname, 'build'),
// Name for the build file: default name + content hash based on the input file content.
      filename: 'js/[name].[contenthash].js',
// Clean the build directory from previous build files.
      clean: true,
    },
    plugins: [
// Plugin for creating an HTML file in the build.
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'public', 'index.html'),
      }),
// Plugin for creating an CSS file in the build.
     devMode ? false : new MiniCssExtractPlugin({filename: 'css/[name].[contenthash].css', chunkFilename: 'css/[name].[contenthash].css'}) ,
// Plugin for displaying build progress in percentages (not recommended for production. slows down the build).
      devMode ?  false : new webpack.ProgressPlugin(),

    ],
    module: {
      rules: [
        // styles loaders. keep the sequence of the lowers!
        {
          test: /\.s[ac]ss$/i,
          use: [
            // extract styles into separate css file in build folder
            devMode ? 'style-loader' :  MiniCssExtractPlugin.loader,
            // Translates CSS into CommonJS
            "css-loader",
            // Compiles Sass to CSS
            "sass-loader",
          ],
        },
            // allow not to implement babel loader to work with react
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
// Error tracking settings for development.
    devtool: devMode ? 'inline-source-map' : false,
// Settings for a live server depending on the port passed through the console via -- --env port=****.
    devServer: devMode ? {
      port: env.port ?? 3003,
      open: true
    } : undefined
  };
  
  return config
  
};
