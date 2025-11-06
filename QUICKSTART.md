# ⚡ 快速启动指南

## 🚀 三步启动

### 步骤 1: 安装依赖

```bash
cd /root/Home
pip install -r requirements.txt
```

或使用虚拟环境：

```bash
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 步骤 2: 启动服务

**方式 A: 使用启动脚本 (推荐)**
```bash
./run.sh
```

**方式 B: 直接运行**
```bash
python3 app.py
```

### 步骤 3: 访问界面

打开浏览器访问: http://127.0.0.1:59127

## 🧪 测试服务

在另一个终端窗口运行测试脚本：

```bash
# 确保服务已启动
python3 test_server.py
```

## 📊 数据更新

系统会自动读取 `data/data.json` 文件，当智能家居中枢更新此文件后：
- 网页会在10秒内自动刷新
- 或点击页面右上角的 "🔄 刷新" 按钮手动刷新

## 🔧 常用命令

```bash
# 启动服务
python3 app.py

# 后台运行
nohup python3 app.py > server.log 2>&1 &

# 查看日志
tail -f server.log

# 停止服务
pkill -f app.py

# 测试 API
curl http://127.0.0.1:59127/health
curl http://127.0.0.1:59127/api/home/status
curl http://127.0.0.1:59127/api/home/summary
```

## 📱 移动设备访问

如果要在同一网络的其他设备上访问：

1. 找到服务器 IP 地址：
   ```bash
   ip addr show  # Linux
   ipconfig      # Windows
   ```

2. 在其他设备浏览器访问：
   ```
   http://[服务器IP]:59127
   ```
   例如: `http://192.168.1.100:59127`

## ⚙️ 自定义配置

### 修改端口

编辑 `app.py` 最后一行：
```python
app.run(host='0.0.0.0', port=59127, debug=True)
```

### 修改刷新间隔

编辑 `static/script.js` 中的：
```javascript
autoRefreshInterval = setInterval(loadData, 10000);  // 10秒
```

### 添加新房间

编辑 `data/data.json`，参考现有格式添加新房间数据。

## 📞 获取帮助

- 查看完整文档: [README.md](README.md)
- 上传到 GitHub: [UPLOAD_GUIDE.md](UPLOAD_GUIDE.md)
- 报告问题: https://github.com/ClaraCora/Home/issues

---

💡 提示: 首次运行推荐使用测试数据，确保系统正常后再连接实际的智能家居中枢。

