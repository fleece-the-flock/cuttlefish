# 百度墨斗鱼平台

## 项目介绍

首先通过请求[百度墨斗鱼平台](https://cuttlefish.baidu.com)的接口来获取问题数据，然后再通过 [chatgpt-api](https://github.com/transitive-bullshit/chatgpt-api) 项目所提供的服务实现回答问题。最后把回答的结果以纯文本的形式保存在用户端。

## 准备工作

### 获取接口所需要的 cookie

在登录百度墨斗鱼平台后，打开浏览器的开发者工具，找到 `Network` 选项卡，然后刷新页面。找到 `https://cuttlefish.baidu.com/user/interface/getquerypacklist` 的请求，点击 `Cookies` 选项卡，找到 `cookie` 包括 `BDUSS`、`BDUSS_BFESS`、`BAIDUID`、`BAIDUID_BFESS` 以及 `AB_SR`，并复制其值。最后，把这些值填入项目根目录 `.env` 文件中。如果没有这个文件，可以自己创建一个。

### 获取 chatgpt 服务所需要的 OpenAI API key

把 chatgpt 服务所需要的 OpenAI API key 填入项目根目录 `.env` 文件中，例如 `OPENAI_API_KEY=你自己的 API KEY`。如果没有这个文件，可以自己创建一个。


### 安装依赖

```bash
$ pnpm install
```


## 使用

### 启动服务

```bash
$ pnpm start
```

## License

[MIT](LICENSE)
