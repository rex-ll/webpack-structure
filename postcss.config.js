module.exports = {
	plugins: [
		require('autoprefixer')({
			browsers: ['> 1%', 'last 5 versions', 'not ie <= 9'],//自动增加猴嘴
		}),
        require('postcss-import')() //监控less中import .css文件的变化
	]
}