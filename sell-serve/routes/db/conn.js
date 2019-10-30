// 引入模块 
const mysql = require('mysql')
	
// 创建连接对象
const conn = mysql.createConnection({
   host: 'localhost',
   user: 'root',   // 你自己数据库的用户名
   password: 'root', // 自己数据库的密码
   database: 'sell'   // 你自己数据库的名字
})
	
// 连接
conn.connect()
console.log('数据库已经连接 ....')

module.exports = conn;


/*
  NodeJS 导入和导出 （后端）
    导入： var 变量 = require('xx')
    导出:  module.exports = 要导出的数据


  ES6 导入和导出 (前端)
    // 方式1
    导入: import { xx } from 'xx'
    导出：export
   
    导入: import 变量 from 'xx'
    导出：export default
*/
	