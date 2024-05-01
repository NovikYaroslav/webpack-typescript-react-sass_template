import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
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
    entry: path.resolve(__dirname, 'src', 'index.ts'),
// Output directory (where and how the build will be assembled).
    output: {
      path: path.resolve(__dirname, 'build'),
// Name for the build file: default name + content hash based on the input file content.
      filename: '[name].[contenthash].js',
// Clean the build directory from previous build files.
      clean: true,
    },
    plugins: [
// Plugin for creating an HTML file in the build.
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'public', 'index.html'),
      }),
// Plugin for displaying build progress in percentages (not recommended for production. slows down the build).
      devMode ? new webpack.ProgressPlugin() : false,
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
