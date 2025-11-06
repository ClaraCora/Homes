# 📤 GitHub 上传指南

## 准备工作

在上传到 GitHub 之前，请确保：

1. ✅ 已创建 GitHub 账号
2. ✅ 已创建仓库 `Home` (https://github.com/ClaraCora/Home)
3. ✅ 本地已安装 Git

## 上传步骤

### 方法一：使用命令行 (推荐)

在项目目录下执行以下命令：

```bash
# 1. 进入项目目录
cd /root/Home

# 2. 初始化 Git 仓库
git init

# 3. 添加所有文件
git add .

# 4. 创建第一次提交
git commit -m "🎉 初始提交: 智能家居监控系统"

# 5. 添加远程仓库
git remote add origin https://github.com/ClaraCora/Home.git

# 6. 推送到 GitHub（首次推送）
git branch -M main
git push -u origin main
```

### 方法二：使用 GitHub Desktop

1. 打开 GitHub Desktop
2. 选择 `File` -> `Add Local Repository`
3. 选择项目文件夹 `/root/Home`
4. 填写提交信息
5. 点击 `Publish repository`

### 方法三：使用 GitHub 网页

1. 进入 https://github.com/ClaraCora/Home
2. 点击 `uploading an existing file`
3. 将所有文件拖拽上传
4. 填写提交信息并提交

## 后续更新

当 `data/data.json` 更新后，如需更新到 GitHub：

```bash
cd /root/Home
git add data/data.json
git commit -m "更新设备数据"
git push
```

## 注意事项

⚠️ **重要**: `.gitignore` 文件已配置，以下内容不会上传到 GitHub：
- Python 缓存文件 (`__pycache__/`)
- 虚拟环境 (`venv/`)
- IDE 配置文件
- 日志文件

如果您希望保持 `data/data.json` 为本地文件（不上传到 GitHub），可以在 `.gitignore` 中添加：

```
data/data.json
```

## 验证上传成功

上传后访问 https://github.com/ClaraCora/Home 查看：
- ✅ 所有源代码文件
- ✅ README.md 正确显示
- ✅ 项目结构完整

## GitHub Pages 部署（可选）

如果想让其他人直接访问网页（不运行后端）：

注意：本项目需要后端支持，GitHub Pages 仅能托管静态页面，不适合此项目的完整部署。建议使用：
- Heroku
- PythonAnywhere
- Railway
- Vercel (需要配置 serverless 函数)

等支持 Python 后端的平台。

