const path = require('path');
module.exports = {
    mode: 'development',

    output: {
        path: path.join(__dirname, '../src/html')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_module/,
                use: {loader: 'babel-loader'}
            },
            // png, jpeg loader
            {
                test: /\.(png|jpeg)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name]-[sha512:hash:base64:7].[ext]',
                        outputPath: 'images'
                    }
                }],

            },
            {
                test: /\.(css)$/,
                exclude: /node_module/,
                use: [
                    {loader: 'style-loader'},
                    {loader: 'css-loader'}
                ]
            }
        ]
    }
};