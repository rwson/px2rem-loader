### px2rem-loader

将css中的px单位转换为rem输出

####useage: 

    //  webpack.config.js
    
    {
            test: /\.css$/,
            loader: 'style-loader!css-loader!px2rem-loader?base=37.5&scale=2&minSize=1&ignore=border|margin|padding'
        }

参数说明:


参数名 | 意义 | 类型 | 默认值
---|---|---
base | 基数 | Number | 37.5
scale | 缩放比,最终计算出的rem大小等于 （原来设定的px值 / base / scale） | Number | 2
minSize | 最小单位,当设置的px值小于该值时忽略计算 | Number | 1
ignore | 忽略的样式规则,如有多个,用竖杠分隔 | String | []
