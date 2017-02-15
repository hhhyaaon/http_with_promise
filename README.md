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
规定模块按以上接口识别接口返回值：

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

TBC...
