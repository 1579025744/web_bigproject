$(function () {
    // 点击‘去注册账号’的链接
    $('#link_reg').on('click', function () {
        $('.login_box').hide();
        $('.reg_box').show();
    })
    // 点击‘去登录’的链接
    $('#link_login').on('click', function () {
        $('.login_box').show();
        $('.reg_box').hide();
    })

    // 从layUI中获取form对象
    var form = layui.form
    // 从layUI中获取layer对象-导入layer
    var layer = layui.layer
    // 通过form.verify()函数自定义校验规则
    form.verify({
        // 自定义一个叫pwd校验规则
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        //   校验密码是否一致的规则
        repwd: function (value) {
            // 通过形参拿到的是  确认密码框中的内容
            // 还需要拿到密码框中的内容
            // 然后进行等于的判断
            // 如果哦判断失败，则return一个提示信息即可
            // 通过name
            var pwd = $('.reg_box [name=password]').val();
            if (pwd !== value) {
                return '两次密码不一致！'
            }
        }
    })


    // 监听注册表单的提交事件
    $('#form_reg').on('submit', function (e) {
        // 阻止默认的提交行为
        e.preventDefault();
        // 发起Ajax的POST请求  url data  function
        var data = {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val()
        } //创建data对象
        $.post('/api/reguser', data, function (res) {
            // 如果注册失败
            if (res.status !== 0) {
                // return console.log(res.message);
                return layer.msg(res.message);//弹出层
            }
            // 否则成功
            // console.log('注册成功！');
            layer.msg('注册成功,请登录！');

            // 模拟人的点击行为   注册成功之后跳转到登录页面
            $('#link_login').click()

        })
    })


    // 监听登录提交事件
    $('#form_login').submit(function (e) {
        // 阻止默认的提交行为
        e.preventDefault();
        $.ajax({
            url: '/api/login',
            method: 'POST',
            // 快速获取表单中的数据
            data: $(this).serialize(),
            success: function (res) {
                // 如果登录失败
                if (res.status != 0) {
                    return layer.msg('登录失败！');
                } else {
                    // 否则成功
                    layer.msg('登录成功！');
                    console.log(res);//Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZC…xMjl9.b55XeXGtLdWqxawACfJs8pwlUCgTMG_aClVhh23YeEs
                    // 将登录成功的token 字符串，保存到localStorage中
                    localStorage.setItem('token', res.token);

                    // 跳转跳转到后台主页面
                    location.href = '../html/index.html'
                }
            }
        })
    })


})