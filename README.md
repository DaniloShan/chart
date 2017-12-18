# redpacket

### install nvm & install yarn & update node

```bash
$ curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.6/install.sh | bash
$ brew install yarn # https://yarnpkg.com/zh-Hans/docs/install
$ nvm install v8
$ nvm use v8 # nvm use --delete-prefix v8
$ node -v
$ # v8.9.1
```

### 本地开发

```bash
$ yarn install # or npm i
$ npm run dev
$ open http://localhost:7001/
```

### 部署

```bash
$ npm start
$ npm stop
```

### 内置指令

- 使用 `npm run lint` 来做代码风格检查。
- 使用 `npm test` 来执行单元测试。
- 使用 `npm run autod` 来自动检测依赖更新，详细参见 [autod](https://www.npmjs.com/package/autod) 。
