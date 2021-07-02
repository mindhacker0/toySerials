const webpack = require('webpack');
// console.log(webpack);
module.exports={
    entry:{
        main:'./main.js'
    },
    devtool:'cheap-module-source-map',
    module:{
       rules:[{
           test:/\.js$/,
           use:{
                loader:'babel-loader',
                options:{
                    presets:['@babel/preset-env'],
                    plugins:['@babel/plugin-transform-react-jsx']
                }
           }
       }]
    },
    mode:"development",
    optimization:{
        minimize:false
    },
}