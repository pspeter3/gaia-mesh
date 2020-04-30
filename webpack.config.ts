import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import OptimizeCSSAssetsPlugin from "optimize-css-assets-webpack-plugin";
import path from "path";
import TerserJSPlugin from "terser-webpack-plugin";
import webpack from "webpack";

class LangPlugin {
    public static readonly Name = "LangPlugin";

    private lang: string;

    constructor(lang: string) {
        this.lang = lang;
    }

    apply(compiler: webpack.Compiler) {
        compiler.hooks.compilation.tap(LangPlugin.Name, (compilation) => {
            HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tap(
                LangPlugin.Name,
                (data) => {
                    data.html = data.html.replace(
                        "<html",
                        `<html lang="${this.lang}"`
                    );
                    return data;
                }
            );
        });
    }
}

const config: webpack.Configuration = {
    entry: path.join(__dirname, "src", "index.tsx"),
    output: {
        filename: "[name].[chunkhash].js",
        publicPath: "/",
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "ts-loader",
                        options: {
                            compilerOptions: {
                                module: "esnext",
                            },
                        },
                    },
                ],
            },
            {
                test: /\.css?$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    { loader: "css-loader", options: { importLoaders: 1 } },
                    {
                        loader: "postcss-loader",
                        options: {
                            ident: "postcss",
                            plugins: [
                                require("tailwindcss")({
                                    purge: [
                                        path.join(
                                            __dirname,
                                            "src",
                                            "**",
                                            "*.tsx"
                                        ),
                                    ],
                                }),
                                require("autoprefixer"),
                            ],
                        },
                    },
                ],
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "Gaia Mesh",
            scriptLoading: "defer",
            meta: {
                description: "Terrain Generator",
            },
        }),
        new MiniCssExtractPlugin({
            filename: "[name].[contenthash].css",
        }),
        new LangPlugin("en"),
    ],
    optimization: {
        minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
        runtimeChunk: true,
        splitChunks: {
            chunks: "all",
        },
    },
};

export default config;
