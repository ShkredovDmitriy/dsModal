const paths = require('./_lib/paths');
const { merge } = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');

const commonConfig = merge([
  {
    // Set the mode to development or production
    mode: 'production',

    // Entery point
    entry: [paths.src + '/app/main.ts'],

    // Output js
    output: {
      path: paths.dist,
      filename: 'js/main.min.js?[hash]',
    },
  }
]);

// Clean output folder
const clearBuildFolder = merge([
  {
    plugins: [
      new CleanWebpackPlugin(),
    ],
  }
]);

// Typescript loader
const typescriptLoader = merge([
  {
    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: [/node_modules/, /config/],
          use: 'ts-loader',
        },
      ],
    },
  }
]);

// Transform pug to html
const exportHTMLfiles = merge([
  {
    plugins: [
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: paths.src + '/pages/index.pug',
        inject: true,
      }),
    ],
    module: {
      rules: [
       {
          test: /\.pug$/,
          loader: 'pug-loader',
        },
      ],
    },
  }
]);

// copy static files to output folder
const copyStaticFiles = merge([
  {
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          {
            from: paths.images,
            to: 'images',
          },
        ],
      }),
    ],
    module: {
      rules: [
        {
          test: /\.(jpg|jpeg|png|svg)$/, type: 'asset/resource'
        },
        {
          test: [/\.woff$/, /\.woff2$/, /\.eot$/, /\.ttf$/],
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            publicPath: 'docs',
            outputPath: './fonts',
          },
        },
      ],
    },
  }
]);

// export, minimize, autoprefix css to main.min.css
const exportCssToMainMinCss = merge([
  {
    plugins: 
      [new MiniCssExtractPlugin({
        filename: './css/main.min.css?[hash]',
      }),
    ],
    module: {
      rules: [
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            {
              loader: 'style-loader',
            },
            {
              loader: 'css-loader',
              options: { sourceMap: false, }
            },
            {
              loader: 'sass-loader',
              options: { sourceMap: false }
            },
          ],
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                publicPath: paths.project,
              },
            },
            {
              loader: 'css-loader',
            },
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [
                    autoprefixer()
                  ],
                },
                sourceMap: true
              }
            },
            {
              loader: 'sass-loader',
              options: { sourceMap: false, },
            },
          ],
        },
      ],
    },
  }
]);

const resolveTypescript = merge([
  {
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".json"],
    },
  }
]);

// copy files to package
const copyFilesToPackage = merge([
  {
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          {
            from: 'docs/css/',
            to: '../pack/dsModal.min.css',
          },
          {
            from: 'docs/js/',
            to: '../pack/dsModal.min.js',
          },
          {
            from: 'package-pack.json',
            to: '../pack/package.json',
          },
          {
            from: 'README.md',
            to: '../pack/README.md',
          },
        ],
      }),
    ],
  }
]);

module.exports = env => {
  return merge([
    commonConfig, 
    clearBuildFolder,
    typescriptLoader,
    exportHTMLfiles,
    copyStaticFiles,
    exportCssToMainMinCss,
    resolveTypescript,
    copyFilesToPackage
  ]);
};