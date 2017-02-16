# 关于
Promise封装Zepto/jQuery的$.ajax，可通过链式的方式处理请求流程，而无需通过回调。

# 实现思路
在实际业务中进行接口请求时，我们不止关心请求本身是否成功，更关心当请求成功的前提下，接口对应的后台业务操作是否成功。  
故本模块主要针对请求成功、请求失败、业务操作成功、业务操作失败进行封装。

- 请求成功：对应$.ajax的success
- 请求失败：对应$.ajax的error
- 业务操作成功：对应$.ajax success时，接口业务逻辑成功
- 业务操作失败：对应$.ajax success时，接口业务逻辑失败

## 接口规范
```
{
    code:200,
    msg:'success',
    data:{}
}
```
规定模块按以上结构识别接口返回值：

- code：状态码，目前认为`code=200`为接口业务操作成功，此外为失败。code配置可在文件`./code.js`中设置。
- msg：接口业务操作成功/失败时的信息，可用于前端回显
- data：接口业务操作成功时返回的数据

以上接口结构可根据项目实际需求进行修改或扩展

# 使用
- 本模块依赖Zepto或jQuery，使用前请先引入
- 本模块基于es6编写，使用前确认代码可以对相关语法进行编译
- 本模块用到Promise，使用前注意兼容性要求

```
import http from './http.js';

const URL = '....';

http({
    url:URL,
    data:{
        // data need receive
    }
}).then(res=>{
    // 接口业务操作成功
    // todo 
}).catch(res=>{
    // 接口业务失败
    // todo
});

```

# API
http(cfg);
cfg字段兼容$.ajax(option)中option所有配置。并对以下事件进行了封装：

| 字段           | 说明             | 是否必填     | 默认值|
|:---           |:--------         |:------      |:------|
| success       | 请求成功后解析返回值前执行    | 否           | 无|
| error         | 请求失败时执行               | 否          | 无|

http(cfg)返回一个Promise对象。

- resolve：接口业务操作成功时执行
- reject：接口业务操作失败时执行

# 建议
此模块建议作为底层方法，结合业务层进行二次封装，作为全局http处理函数。以下给出简单封装方式：
```
http: (userConf) => {
        const _conf = $.extend(true, {
            data: {
                token: tools.token.get()
            },
            isSuccessShow: userConf.type === 'POST',    // 添加字段（默认post接口成功时，弹窗提示：xxx操作成功）
            error: () => {
                Modal.error('请求失败', {
                    onClose: (destory) => {
                        destory();
                    }
                });
            }
        }, userConf);
        // 调用底层http模块
        return http(_conf)
            .then(resp => {
                return new Promise((res, rej) => {
                    if (_conf.isSuccessShow === true) {
                        return new Promise((res, rej) => {
                            Modal.success(`操作成功。`, {
                                onClose: (destory) => {
                                    destory();
                                    res(resp);
                                }
                            });
                        });
                    } else {
                        res(resp);
                    }
                });
            }).catch(resp => {
                return new Promise((res, rej) => {
                    Modal.error(`操作失败。信息：${resp.msg || '无'}`, {
                        onClose: (destory) => {
                            destory();
                            rej(resp);
                        }
                    });
                });
            });
    }

```
当各子页面调用此模块时，直接根据接口返回值进行链式处理即可。   
如登录：
```
return tools.http({
    type: 'POST',
    url: tools.getUrlContent('/login'),
    data: {
        userName,
        password
    },
    isSuccessShow: false
}).then(resp => {
    window.location.href = '/';
});
```
