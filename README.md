# grunt-font-manager

> 更易用的字体图标管理方案

##  字体管理
### 使用iconfont.cn管理字体图标存在以下弊端
1.  在不同的项目中会使用相同的备注名称，不利于项目管理，如
>   star.svg上传后备注为“星星”
>   在项目1中，“用户评价”图标为star.svg，项目2中“等级排名”图标为star.svg，但是备注都显示为“星星”，
>   且无法在项目里修改
1.  为方便后期修改扩展，同一个项目中两个图标类名不同，但图标相同。使用iconfont.cn管理
需要再次上传一个相同的svg才行。如
>   任务删除 ifont-task-del 清空邮箱 ifont-email-clean 
1.  iconfont.cn不支持只更新svg信息，svg修改后，需要重新上传，然后添加到项目，
同时从项目里删除旧图标，另外需要保持新旧图标的class和unicode信息一致，操作繁琐。
1.  项目中可能会使用其他ttf中的图形，需要提取ttf中指定字符的svg，然后上传到项目中才可以实现ttf合并

### 使用方法

1. 建立如下文件结构
```text
|--font
    |--svg/
        |--*.svg
    |--fonts/
        |--*.ttf
    |--font.json
```
font.json内容如下
```js
{
    "fontName":"ifontxlds",
    "fonts":[
        {
          "name":"task_level",
          "unicode":"f000",
          "file":"svg/task_level.svg",
          "note":"任务优先级"
        },
        {
          "name":"task_save",
          "unicode":"f001",
          "file":"./fonts/iconfont.ttf#f005",
          "note":"保存任务"
        }
    ]
}
```

1. 配置grunt
```js
     grunt.initConfig({
            fontmanager : {
                xlds:{
                    options:{
                        svgPath:'./font/svg/'
                    },
                    files:[{
                        src:'font/font.json',
                        dest:'css/fonts/'
                    }]
                }
            }
     });
```
### 运行机制
程序基于font-carrier，先将font.json中的ttf字形抽取出来转换为svg存入配置的svg目录，文件名为class.svg
（若对应的svg已经存在，不会进行覆盖），然后将svg目录中图标转换为4种字体文件
### Options

#### svgPath
Type: `String`  
Default: './font/svg/'

设置svg图标路径，ttf中的字形将会抽取出svg存入该目录

### 注意
unicode编码只支持UCS-2 参考[javascript unicode详解](http://www.ruanyifeng.com/blog/2014/12/unicode.html)
对于\u{f0020}的字符，请先将其转为svg字体，在json配置中使用name引用svg字体

### 开发规划

1. 添加可视化json配置编辑页面