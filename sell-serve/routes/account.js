var express = require('express');
var router = express.Router();
var multer = require('multer'); // 上传的模块
// 引入数据库模块链接
const conn = require("./db/conn");
// 测试
router.get("/", (req, res) => {
    res.send("路由已通")
})

// 统一处理跨域问题
router.all('*', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')//跨域
    res.header("Access-Control-Allow-Headers", "authorization"); // 允许前端携带的头部信息
    next()
})
// 引入jwt
const jwt = require('jsonwebtoken');
// expressJwt 用于验证token的有效性
const expressJwt = require('express-jwt');
// 秘钥
const secretKey = 'itsource';

// 使用中间件验证token合法性
router.use(expressJwt ({
    secret:  secretKey 
}).unless({
    path: ['/account/checklogin', '/account/upload']  // 不需要验证token的地址
}))

// 拦截器
router.use(function (err, req, res, next) {
    // 如果用户的请求 没有携带token 那么错误类型是 UnauthorizedError
    if (err.name === 'UnauthorizedError') {   
        // 如果前端请求不带token 返回错误
        res.status(401).send('无效的token...');
    }
})

// 验证用户身份
router.post('/checklogin', (req, res) => {
    let { account, password } = req.body;
    if (!(account && password)) {
        res.send({ code: 5001, msg: "参数错误!" })
        return;
    }

    const sql = `select * from users where account="${account}" and password="${password}"`;
    conn.query(sql, (err, data) => {
        if (err) throw err;
        if (data.length) {

            // 取出用户信息
            const userInfo = { ...data[0] };
            //生成token
            const token = jwt.sign(userInfo, secretKey, {
                expiresIn: 60 * 60 * 2 // token过期时间
            })
            let role = data[0].groups === '超级管理员' ? 'super' : 'general';
            res.send({ code: 0, msg: '欢迎你，登录成功',token,role})
        } else {
            res.send({ code: 1, msg: '登录失败，请检查用户名或密码' })
        }
    })
})

// 添加账号接口
router.post("/accountadd", (req, res) => {
    // 接收前端参数
    let { account, password, groups } = req.body;
    // 防止前端参数传送不完整
    if (!(account && password && groups)) {
        res.send({ code: 5001, msg: "请求参数错误！" });
        return
    }
    // 操作数据库
    // 1.准备sql
    const sql = `insert into users(account,password,groups,imgUrl) values("${account}", "${password}", "${groups}","default.jpg")`;
    // 执行sql
    conn.query(sql, (err, data) => {
        if (err) throw err;
        if (data.affectedRows > 0) {
            res.send({ code: 0, msg: "添加账号成功了(QwQ)" })
        } else {
            res.send({ code: 1, msg: "添加账号失败了QaQ" })
        }
    })
})

// 获取用户账号列表
router.get("/accountlist", (req, res) => {
    // 接收参数(当前页面，当前页面数据条数)
    let { currentPage, pageSize } = req.query;
    // 判断传递参数是否完整
    if (!(currentPage && pageSize)) {
        res.send({ code: 5001, msg: "请求参数错误！" })
        return
    }
    // 操作数据库
    let sql = `select * from users order by ctime desc`;
    // 执行sql
    let total;
    // 后端返回给前端两个参数（当前页面数据，数据总条数）
    conn.query(sql, (err, data) => {
        if (err) throw err;
        // 计算总条数
        total = data.length;
        // 拼接分页sql
        let n = (currentPage - 1) * pageSize;
        // // 跳过n条数据获取数据
        sql += ` limit ${n}, ${pageSize}`;
        // 执行分页
        conn.query(sql, (err, data) => {
            if (err) throw err;
            res.send({ total, data })//响应数据给前端
        })
    })
})

// 删除用户
router.get("/accountdel", (req, res) => {

    // 获取前端参数
    let { id } = req.query;
    // 判断是否有参数
    if (!id) {
        res.send({ code: 5001, msg: "注意传递参数喔！" })
        return
    }
    // 操作数据库
    const sql = `delete from users where id = ${id}`;
    conn.query(sql, (err, data) => {
        if (err) throw err;
        if (data.affectedRows > 0) {
            res.send({ code: 0, msg: "删除用户成功" })
        } else {
            res.send({ code: 1, msg: "删除用户失败" })
        }
    })
})

// 批量删除用户
router.get("/batchdel", (req, res) => {
    // 获取参数,获得的是字符串
    let { onSelection } = req.query;
    // 转为数组对象
    onSelection = JSON.parse(onSelection)
    // 判断参数是否完整
    if (!onSelection.length) {
        res.send({ code: 5001, msg: "注意传递参数喔" })
        return
    }
    // 操作数据库
    const sql = `delete from users where id in (${onSelection.join(',')})`;
    // 执行sql
    conn.query(sql, (err, data) => {
        if (err) throw err;
        if (data.affectedRows > 0) {
            res.send({ code: 0, msg: "批量删除用户成功QwQ" })
        } else {
            res.send({ code: 1, msg: "批量删除用户失败" })
        }
    })
})

// 编辑数据
router.post("/editaccount", (req, res) => {
    // 获取前端数据
    let { account, id, groups } = req.body;
    // 判断参数是有正确
    if (!id) {
        res.send({ code: 5001, msg: "参数有错误哦" })
        return
    }
    // 操作数据库
    const sql = `update users set account="${account}", groups="${groups}" where id=${id}`;
    conn.query(sql, (err, data) => {
        if (err) throw err;
        if (data.affectedRows > 0) {
            res.send({ code: 0, msg: "修改用户信息成功QwQ" })
        } else {
            res.send({ code: 1, msg: "修改用户信息失败QaQ" })
        }

    })
})

/* 验证旧密码是否正确 */
router.get('/checkoldpwd', (req, res) => {
	let { oldPwd } = req.query;

	if (!oldPwd) {
		res.send({code: 5001, msg: "参数错误!"})
		return;
	}

	if (oldPwd === req.user.password) {
		res.send({code: '00', msg: '旧密码正确'})
	} else {
		res.send({code: "11", msg: '原密码错误'})
	}
})

/* 修改密码 */
router.post('/passwordedit', (req, res) => {
	let { newPwd } = req.body;

	if ( !newPwd ) {
		res.send({code: 5001, msg: "参数错误!"})
		return;
	}

	const sql = `update users set password="${newPwd}" where id=${req.user.id}`;
	conn.query(sql, (err, data) => {
		if (err) throw err;
		if (data.affectedRows > 0) {
			res.send({code: 0, msg: '修改密码成功，请重新登录!'})
		} else {
			res.send({code: 1, msg: '修改密码失败!'})
		}
	})
})

// 上传图片移动目录 重命名
var storage = multer.diskStorage({
    destination: 'public/upload/account', // 
    filename: function (req, file, cb) {
        // 处理文件格式
        var fileFormat =(file.originalname).split(".");  

        // 获取当前时间戳 用于重命名 
        var filename = new Date().getTime();  
        cb(null, filename + "." + fileFormat[fileFormat.length - 1]); // 拼接文件名
    }
});
// 上传对象
var upload = multer({
    storage
});
// 头像上传
router.post('/upload', upload.single('file'), (req, res) => {
	let { filename } = req.file;
	res.send({ code: 0, msg:"上传成功!", imgUrl: filename })
})


/* 保存用户头像 */
router.get('/avataredit', (req, res) => {
	let { imgUrl } = req.query;

	if ( !imgUrl ) {
		res.send({code: 5001, msg: "参数错误!"})
		return;
	} 

	const sql = `update users set imgUrl="${imgUrl}" where id=${req.user.id}`;

	console.log(sql)
	conn.query(sql, (err, data) => {
		if (err) throw err;

		if (data.affectedRows > 0) {
			res.send({code: 0, msg: '修改头像成功!'})
		} else {
			res.send({code: 1, msg: '修改头像失败!'})
		}
	})
})


/* 个人中心 获取账号信息 */
router.get('/accountinfo', (req, res) => {

	const sql = `select * from users where id=${req.user.id}`;
	conn.query(sql, (err, data) => {
		if (err) throw err;
		if (data.length) {
			res.send({ accountInfo: data[0] })
		}
	})
})


module.exports = router;