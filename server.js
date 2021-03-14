const express = require('express');
const {User} = require('./models');
const jwt = require('jsonwebtoken');
const app = express();
const SECRET = 'djo1ij2eijoqi';
app.use(express.json());
app.get('/api/users', async (req, res) => {
    const users = await User.find();
    res.send(users)
});
app.post('/api/register', async (req, res) => {
    // console.log(req.body);
    const user = await User.create({
        username: req.body.username,
        password: req.body.password
    })
    res.send(user);
});
app.post('/api/login', async (req, res) => {
    // console.log(req.body);
    const user = await User.findOne({
        username: req.body.username
    })
    if(!user){
        return res.status(422).send({
            message: '用户名不存在'
        });//客户端提交数据有问题
    }
    const isPasswordValid = require('bcrypt').compareSync(
        req.body.password,
        user.password
    )
    if (!isPasswordValid) {
        return res.status(422).send({
            message: '密码无效'
        })
    };
    //生成token
    const token = jwt.sign({
        id: String(user._id),//密码不要放进来，放一个唯一的东西就可以了
    }, SECRET);

    res.send({
        user,
        token
    });
});
const auth = async (req, res, next) => {
    const raw = String(req.headers.authorization).split(' ').pop();
    const {id} = jwt.verify(raw, SECRET);
    req.user = await User.findById(id);//这里需要添加一些错误处理，不执行next
    next();
}

app.get('/api/profile', auth, async (req, res) => {
    res.send(req.user);
})
// app.get('/api/orders', auth, async (req, res) => {
//     const orders = await Order.find().where({
//         user: req.user
//     });
//     res.send(orders);
// })
app.listen(3001, () => {
    console.log(3001);
})
