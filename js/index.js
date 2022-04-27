// 获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！')
            }
            let data = res.data;
            // 调用 renderAvatar 渲染用户的头像
            renderAvatar(data)

            $('#image').attr('src', data.user_pic)
            $('#images').attr('src', data.user_pic)
        }
    })
}

// 渲染用户的头像
function renderAvatar(user) {
    // 1. 获取用户的名称
    var name = user.nickname || user.username
    // 2. 设置欢迎的文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    // 3. 按需渲染用户的头像
    if (user.user_pic !== null) {
        // 3.1 渲染图片头像
        $('.topImg')
            .attr('src', user.user_pic)
            .show()
        $('.text-avatar').hide()
    } else {
        // 3.2 渲染文本头像
        $('.topImg').hide()
        var first = name[0].toUpperCase()
        $('.text-avatar')
            .html(first)
            .show()
    }
}

// 获取文章分类的列表
function initArtCateList() {
    $.ajax({
        method: 'GET',
        url: '/my/article/cates',
        success: function (res) {
            // 失败
            if (res.status !== 0) {
                return layer.msg(res.message)
            }
            // 模板渲染
            var htmlStr = template('tpl-table', res)
            $('#artCate tbody').html(htmlStr)
        }
    })
}


var art_state = '已发布';
// 分页
var laypage = layui.laypage

$(function () {
    // 调用 getUserInfo 获取用户基本信息
    getUserInfo()

    // 从layUI中获取form对象
    var form = layui.form
    // 从layUI中获取layer对象-导入layer
    var layer = layui.layer
    // 通过form.verify()函数自定义校验规则
    form.verify({
        // 自定义一个叫校验规则
        nickname: function (value) {
            if (value.length >= 6) {
                return '昵称长度必须在1~6个字符之间！'
            }
        },
        // 自定义一个叫pwd校验规则
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        //   校验密码是否一致的规则
        samePwd: function (value) {
            // 通过形参拿到的是  确认密码框中的内容
            // 还需要拿到密码框中的内容
            // 然后进行等于的判断
            // 如果哦判断失败，则return一个提示信息即可
            // 通过name
            var pwd = $('[name=oldPwd]').val();
            if (pwd === value) {
                return '新旧密码不能相同！'
            }
        },
        rePwd: function (value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码不一致'
            }
        }
    })

    initUserInfo()

    // 初始化用户信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: (res) => {
                // 状态值不等于0失败
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败')
                }
                // console.log(res);
                // 成功
                //给表单赋值---调用form.val('filter', object);快速为表单赋值 / 取值
                //formUserInfo 即 class="layui-form" 所在元素属性 lay-filter="" 对应的值
                form.val("formUserInfo", res.data);

            }
        })
    }

    // 点击‘重置’，表单数据重置--初始化
    $('#btnReset').on('click', function (e) {
        // 阻止表单默认提交行为
        e.preventDefault();
        // console.log(1);
        initUserInfo();
    })


    // 监听表单的提交---更新用户信息
    $('.userInfo').on('submit', function (e) {
        // 阻止表单默认提交行为
        e.preventDefault();
        // console.log(1);
        // 发起ajax请求
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            // 快速获取表单的值
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败！')
                }
                layer.msg('更新用户信息成功！')

                // 调用父页面的方法，重新渲染用户头像和用户信息
                window.parent.getUserInfo() //子页面调用父页面的方法window.parent
            }

        })
    })


    // 点击按钮，实现退出功能
    $('#btnLogout').on('click', function () {
        // 提示用户是否确认退出
        layer.confirm('确定退出登录?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            //do something
            // 1. 清空本地存储中的 token
            localStorage.removeItem('token')
            // 2. 重新跳转到登录页面
            window.location.href = '../html/login.html'

            // 关闭 confirm 询问框
            layer.close(index)
        })
    })

    // 点击切换
    $('.silder a').on('click', function () {
        let id = $(this).attr('data-id')
        console.log($(this).attr('data-id'));
        $('#' + id).show().siblings('.layui-body').hide();

        if (id === 'checkImg') {
            // 修改头像
            // 1.1 获取裁剪区域的 DOM 元素
            var $image = $('#image')
            // 1.2 配置选项
            const options = {
                // 纵横比
                aspectRatio: 1,
                // 指定预览区域
                preview: '.img-preview'
            }
            // 1.3 创建裁剪区域
            $image.cropper(options)
        } else if (id === 'artPub') {
            // 覆盖初始化
            $(images).attr('src', "/images/cover.jpg")

            // 选择文件
            // 1. 初始化图片裁剪器
            var $image2 = $('#images')

            // 2. 裁剪选项
            var options2 = {
                aspectRatio: 400 / 280,
                preview: '.img-preview'
            }

            // 3. 初始化裁剪区域
            $image2.cropper(options2)

        }

    })

    // 监听表单的提交---更新密码
    $('.resPwd').on('submit', function (e) {
        // 阻止表单默认提交行为
        e.preventDefault();
        // console.log(1);
        // 发起ajax请求
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            // 快速获取表单的值
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新密码失败！')

                }
                layui.layer.msg('更新密码成功！请重新登录')
                // 1--清空token  2--跳转到登录页面
                // localStorage.removeItem('token');
                // location.href = '../html/user/login.html'


                // 重置表单
                $('.layui-form')[0].reset()
            }
        })
    })




    // 监听‘上传’按钮的点击事件
    $('#btnChooseImg').on('click', function () {
        $('#file').click();
    })

    // 为文件选择框绑定change事件
    $('#file').on('change', function (e) {
        // console.log(e.target.files);
        // 1.拿到获取用户选择的文件
        let filelist = e.target.files
        // 如果图片长度===0，提示选择图片
        if (filelist.length === 0) {
            return layer.msg('请选择照片！')
        }

        // 1.拿到用户选择的文件
        let file = e.target.files[0]
        // 2.根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(file)
        // 修改头像
        // 1.1 获取裁剪区域的 DOM 元素
        var $image = $('#image')
        // 1.2 配置选项
        const options = {
            // 纵横比
            aspectRatio: 1,
            // 指定预览区域
            preview: '.img-preview'
        }
        // 1.3 创建裁剪区域
        $image.cropper(options)
        // 3.先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域：
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // '确定'按钮点击事件
    $('#btnUpload').on('click', function () {
        // console.log('2121');
        // 1.1 获取裁剪区域的 DOM 元素
        var $image = $('#image')
        // 1.要拿到用户裁剪之后的头像
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        // 2.调用接口，把头像上传到服务器
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更换头像失败！')
                }
                layer.msg('更换头像成功！')
                getUserInfo()
            }

        })
    })





    // 文章分类
    initArtCateList()


    // 为添加类别按钮绑定点击事件
    var indexAdd = null
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        })
    })


    // 通过代理的形式，为 form-add 表单绑定 submit 事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        // console.log(1);
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            // 快速获取表单数据
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败！')
                }
                // 渲染页面
                initArtCateList()
                // 2.提示成功
                layer.msg('新增分类成功！')
                // 根据索引，关闭对应的弹出层
                layer.close(indexAdd)
            }
        })
    })

    // 通过代理的形式，为 btn-edit 按钮绑定点击事件
    var indexEdit = null
    $('tbody').on('click', '.btn-edit', function () {
        // 弹出一个修改文章分类信息的层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })

        let id = $(this).attr('data-id')
        // console.log(id);
        // 发起请求获取对应分类的数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                // 获取id 来 传递值
                form.val('form-edit', res.data)
            }
        })
    })

    // 通过代理的形式，为‘修改’分类的表单绑定 submit 事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类数据失败！')
                }
                // 提示成功
                layer.msg('更新分类数据成功！')
                // 关闭
                layer.close(indexEdit)
                // 重新渲染
                initArtCateList()
            }
        })
    })

    // 通过代理的形式，为‘删除’按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id')
        // 提示用户是否要删除
        layer.confirm('确认删除?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败！')
                    }
                    // 提示成功
                    layer.msg('删除分类成功！')
                    // 关闭弹出框
                    layer.close(index)
                    // 重新渲染
                    initArtCateList()
                }
            })
        })
    })




    initCate()
    // 初始化富文本编辑器
    initEditor()

    // 定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败！')
                }
                // 调用模板引擎，渲染分类的下拉菜单
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // 一定要记得调用 form.render() 方法
                form.render()
            }
        })
    }


    // 为选择封面的按钮，绑定点击事件处理函数
    $('#addBtnImg').on('click', function () {
        $('#coverFile').click()
        // console.log('yes');
    })


    // 监听 coverFile 的 change 事件，获取用户选择的文件列表
    $('#coverFile').on('change', function (e) {
        // 获取到文件的列表数组
        let files = e.target.files
        // 判断用户是否选择了文件
        if (files.length === 0) {
            return layer.msg('请选择图片文件！')
        }
        // 根据文件，创建对应的 URL 地址
        var newImgURL = URL.createObjectURL(files[0])
        // 1. 初始化图片裁剪器
        var $image2 = $('#images')

        // 2. 裁剪选项
        var options2 = {
            aspectRatio: 400 / 280,
            preview: '.img-preview'
        }

        // 3. 初始化裁剪区域
        $image2.cropper(options2)
        // 为裁剪区域重新设置图片
        $image2
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options2) // 重新初始化裁剪区域
        console.log($image2);
    })


    // 为存为草稿按钮，绑定点击事件处理函数
    $('#btnSave2').on('click', function () {
        art_state = '草稿'
        console.log(art_state);
    })

    // 为表单绑定 submit 提交事件
    $('#form-pub').on('submit', function (e) {
        // 1. 阻止表单的默认提交行为
        e.preventDefault()
        // 2. 基于 form 表单，快速创建一个 FormData 对象
        let fd = new FormData($(this)[0])
        // 3. 将文章的发布状态，存到 fd 中
        fd.append('state', art_state)

        fd.forEach(function (i, index) {
            console.log(i, index);
        })

        // 1. 初始化图片裁剪器
        var $image2 = $('#images')
        // 4. 将封面裁剪过后的图片，输出为一个文件对象
        $image2
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                // 6. 发起 ajax 数据请求
                // publishArticle(fd)
                $.ajax({
                    method: 'POST',
                    url: '/my/article/add',
                    data: fd,
                    // 注意：如果向服务器提交的是 FormData 格式的数据，
                    // 必须添加以下两个配置项
                    contentType: false,
                    processData: false,
                    success: function (res) {
                        if (res.status !== 0) {
                            return layer.msg('发布文章失败！')
                        }
                        layer.msg('发布文章成功！')
                        // 发布文章成功后，跳转到文章列表页面
                        // location.href = '/art_list.html'
                    }
                })
            })
    })

    // 定义一个发布文章的方法
    // function publishArticle(fd) {
    // }






    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    // 定义一个查询的参数对象，将来请求数据的时候，
    // 需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    }

    initListTable()
    initListCate()

    // 获取文章列表数据的方法
    function initListTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                // 使用模板引擎渲染页面的数据
                let htmlStr = template('tpl-table-list', res)
                $('#artList_tbody').html(htmlStr)
                // 调用渲染分页的方法
                renderPage(res.total)
            }
        })
    }

    // 初始化文章分类的方法
    function initListCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！')
                }
                // 调用模板引擎渲染分类的可选项
                let htmlStr = template('tpl-cate-list', res)
                $('[name=cate_id]').html(htmlStr)
                // 通过 layui 重新渲染表单区域的UI结构
                form.render()
            }
        })
    }


    // 为筛选表单绑定 submit 事件
    $('#form-searchs').on('submit', function (e) {
        e.preventDefault()
        // 获取表单中选中项的值
        let cate_id = $('[name=cate_id]').val()
        let state = $('[name=state]').val()
        // 为查询参数对象 q 中对应的属性赋值
        q.cate_id = cate_id
        q.state = state
        // 根据最新的筛选条件，重新渲染表格的数据
        initListTable()
        // 
    })

    // 定义渲染分页的方法
    function renderPage(total) {
        // 调用 laypage.render() 方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox', // 分页容器的 Id  -- 是ID，不用加 # 号
            count: total, // 数据总数，从服务端得到
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum, // 设置默认被选中的分页
            // 
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 分页发生切换的时候，触发 jump 回调
            // 触发 jump 回调的方式有两种：
            // 1. 点击页码的时候，会触发 jump 回调
            // 2. 只要调用了 laypage.render() 方法，就会触发 jump 回调
            jump: function (obj, first) {
                // 可以通过 first 的值，来判断是通过哪种方式，触发的 jump 回调
                // 如果 first 的值为 true，证明是方式2触发的
                // 否则就是方式1触发的
                // console.log(first)
                // console.log(obj.curr)
                // 把最新的页码值，赋值到 q 这个查询参数对象中
                q.pagenum = obj.curr
                // 把最新的条目数，赋值到 q 这个查询参数对象的 pagesize 属性中
                q.pagesize = obj.limit
                // 根据最新的 q 获取对应的数据列表，并渲染表格
                // initTable()
                if (!first) {
                    initListTable()
                }
            }
        })
    }

    // 通过代理的形式，为'删除'按钮绑定点击事件处理函数
    $('#artList_tbody').on('click', '.list-btn-delete', function () {
        // 获取删除按钮的个数
        let len = $('.btn-delete').length
        console.log(len)
        // 获取到文章的 id
        let id = $(this).attr('data-id')
        // console.log(id);
        // 询问用户是否要删除数据
        layer.confirm('确认删除?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    // console.log(res);
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')
                    // 当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据
                    // 如果没有剩余的数据了,则让页码值 -1 之后,
                    // 再重新调用 initTable 方法
                    // 4
                    if (len === 1) {
                        // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
                        // 页码值最小必须是 1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initListTable()
                }
            })
            // 
            layer.close(index)
        })
    })

    // 通过代理的形式，为 'a'按钮绑定点击事件
    $('#artList').on('click', '.a_btnTan', function () {
        let id2 = $('.a_btnTan').attr('data-id')
        console.log(id2);
        // 发起请求获取对应的数据
        $.ajax({
            method: 'GET',
            url: '/my/article/' + id2,
            success: function (res) {
                console.log(res);
                let tmp = template('wenzhangxq', res.data)
                console.log(res.data);
                console.log(tmp);
                // 弹出一个修改文章分类信息的层
                Addtpl = layer.open({
                    type: 1,
                    area: ['65%', '85%'],
                    title: '预浏览文章',
                    content: $('#tanchuang').html(tmp) //弹出框的内容展示
                })
            }
        })

        // 注意：data是对象，不用遍历
    })




})