#  简历助手 (Resume Editor)

本地运行的，轻量简历制作编辑器，无需刷新页面，即可实时预览简历修改。


- **Node.js** v20.19+ 或 v22.12+ 
- **npm** (或 yarn / pnpm)





进入项目根目录：

执行以下指令即可

npm install

npm run dev
打开浏览器访问   http://localhost:5173/

## ⬆️ 如何上传到 GitHub (How to deploy to GitHub)

如果您希望将这个项目上传到您自己的 GitHub 仓库中，只需要经过几个简单的步骤：

### 1. 在 GitHub 创建新仓库
登录您的 GitHub 账号，点击右上角 `+` -> `New repository`。
填写一个仓库名称（例如 `resume-editor`），**不需要**勾选生成 README.md 等文件，是一个空仓库即可。创建好后会生成一个仓库的 URL（例如 `https://github.com/您的用户名/resume-editor.git`）。

### 2. 在本地初始化 Git (如果还未初始化)
在该项目的根目录下（即 `d:\download\简历助手`），右键打开终端（PowerShell / CMD 等），依序执行以下命令：
```bash
git init
git add .
git commit -m "feat: init resume editor project"
```

### 3. 关联 GitHub 并上传代码
执行下面这几行命令将本地代码推送到刚才建好的远端 GitHub 仓库中：
```bash
# 将主分支名设置为 main
git branch -M main
# 填写刚才创建的那个 Github 仓库的地址
git remote add origin https://github.com/您的用户名/仓库名.git
# 推送所有代码！
git push -u origin main
```
上传成功后，在您的 GitHub 页面刷新一下，就可以看到全部项目代码了！
