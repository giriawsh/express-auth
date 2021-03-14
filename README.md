# EXPRESS-AUTH
基于express+mongodb的登陆注册加密验证，涉及bcrypt/jsonwebtoken包的基础使用

## 步骤总结
1. 限定用户名唯一

在Schema中添加unique:true, 在options中添加useCreateIndex:true

2. 密码加密

安装bcrypt, 添加set函数进行hashSync(val, 10);加密

3. 用户登陆

如果用户名不存在return res.status(422)

4. 用户存在

利用compare.Sync({密码明文，数据库密文})进行解密

5. 生成token

使用jsonwebtoken包，jwt.sign({id}, SECRET);

生成的token加入到请求头Authorization: Bearer token中

6. 验证token

jwt.verify(token, SECRET)。可以将此步放置到中间件中，通过next()使用于每个接口中。