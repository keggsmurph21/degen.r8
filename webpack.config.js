const path = require("path");

module.exports = {
    mode: "development",
    entry: {
        lobby: "./src/Client/Page/Lobby.ts",
        room: "./src/Client/Page/Room.ts",
    },
    devtool: "inline-source-map",
    module: {
        rules: [{
            test: /\.ts$/,
            use: "ts-loader",
            exclude: /node_modules/,
        }],
    },
    resolve: {
        extensions: [".js", ".ts"],
    },
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, "dist")
    },
};
