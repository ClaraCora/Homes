# 🏠 智能家居监控系统

一个基于 Python Flask 和原生 JavaScript 的智能家居可视化监控系统，用于实时显示家居设备状态、温湿度等信息。

## 📋 项目简介

本系统通过读取本地 JSON 数据文件，在网页上以可视化的方式展示：
- 🚪 门窗开关状态
- 💡 电器设备运行状态
- 🌡️ 各房间温度
- 💧 各房间湿度
- 🗺️ 家居平面图实时监控

## 🎯 功能特性

- ✅ **实时监控**: 自动每10秒刷新数据
- ✅ **可视化平面图**: SVG 绘制的家居平面图
- ✅ **设备状态展示**: 门窗、电器状态一目了然
- ✅ **环境监测**: 温湿度实时显示
- ✅ **响应式设计**: 支持桌面和移动端
- ✅ **美观现代**: 渐变色彩和动画效果

## 📁 项目结构

```
Home/
├── app.py                 # Flask 后端服务
├── requirements.txt       # Python 依赖包
├── run.sh                # 启动脚本
├── .gitignore            # Git 忽略文件配置
├── README.md             # 项目文档
├── data/                 # 数据目录
│   └── data.json         # 家居设备数据（由智能中枢写入）
├── static/               # 静态资源
│   ├── style.css         # 样式文件
│   └── script.js         # 前端脚本
└── templates/            # 模板文件
    └── index.html        # 主页模板
```

## 🚀 快速开始

### 环境要求

- Python 3.7+
- pip (Python 包管理器)

### 安装步骤

1. **克隆项目**
   ```bash
   git clone https://github.com/ClaraCora/Home.git
   cd Home
   ```

2. **方式一: 使用启动脚本（推荐）**
   ```bash
   ./run.sh
   ```

3. **方式二: 手动启动**
   ```bash
   # 创建虚拟环境（可选但推荐）
   python3 -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   
   # 安装依赖
   pip install -r requirements.txt
   
   # 启动服务
   python3 app.py
   ```

4. **访问系统**
   
   打开浏览器访问: `http://127.0.0.1:59127`

## 📊 数据格式

系统读取 `data/data.json` 文件，智能家居中枢需按以下格式写入数据：

```json
{
  "timestamp": "2025-11-06T10:30:00",
  "rooms": {
    "room_id": {
      "name": "房间名称",
      "position": {"x": 150, "y": 150},
      "temperature": 22.5,
      "humidity": 55,
      "windows": [
        {
          "id": "win_1",
          "name": "窗户名称",
          "status": "open/closed",
          "position": {"x": 150, "y": 250}
        }
      ],
      "doors": [
        {
          "id": "door_1",
          "name": "门名称",
          "status": "open/closed",
          "position": {"x": 150, "y": 100}
        }
      ],
      "appliances": [
        {
          "id": "appliance_1",
          "name": "设备名称",
          "type": "tv/air_conditioner/light/refrigerator/exhaust_fan",
          "status": "on/off",
          "position": {"x": 150, "y": 150}
        }
      ]
    }
  }
}
```

### 字段说明

- `timestamp`: 数据更新时间（ISO 8601 格式）
- `rooms`: 房间集合对象
  - `room_id`: 房间唯一标识符
  - `name`: 房间显示名称
  - `position`: 房间在平面图中的位置坐标
  - `temperature`: 温度（℃）
  - `humidity`: 湿度（%）
  - `windows`: 窗户数组
  - `doors`: 门数组
  - `appliances`: 电器设备数组

### 设备状态

- 门窗状态: `open` (开启) / `closed` (关闭)
- 电器状态: `on` (运行) / `off` (关闭)

### 支持的电器类型

| 类型 | type 值 | 图标 |
|-----|---------|------|
| 电视 | `tv` | 📺 |
| 空调 | `air_conditioner` | ❄️ |
| 灯 | `light` | 💡 |
| 冰箱 | `refrigerator` | 🧊 |
| 排气扇 | `exhaust_fan` | 🌀 |

## 🌐 API 接口

### 1. 获取家居完整状态

**请求**
```
GET /api/home/status
```

**响应**
```json
{
  "timestamp": "2025-11-06T10:30:00",
  "rooms": { ... }
}
```

### 2. 获取状态摘要

**请求**
```
GET /api/home/summary
```

**响应**
```json
{
  "timestamp": "2025-11-06T10:30:00",
  "room_count": 4,
  "windows": {
    "total": 4,
    "open": 2,
    "closed": 2
  },
  "doors": {
    "total": 3,
    "open": 1,
    "closed": 2
  },
  "appliances": {
    "total": 8,
    "on": 5,
    "off": 3
  },
  "environment": {
    "avg_temperature": 23.0,
    "avg_humidity": 61.3
  }
}
```

### 3. 健康检查

**请求**
```
GET /health
```

**响应**
```json
{
  "status": "ok",
  "service": "智能家居监控系统",
  "timestamp": "2025-11-06T10:30:00"
}
```

## 🎨 界面预览

系统界面包含以下部分：

1. **顶部导航栏**: 显示标题、更新时间和刷新按钮
2. **摘要面板**: 四个卡片展示门窗、电器、温度、湿度总览
3. **家居平面图**: SVG 可视化展示各房间和设备状态
4. **房间详情**: 侧边栏列表显示每个房间的详细信息

### 颜色说明

- 🟢 绿色: 开启/运行状态
- 🔴 红色: 关闭状态
- 🔵 蓝色: 温湿度信息

## 🔧 配置说明

### 修改端口

编辑 `app.py` 文件的最后一行：

```python
app.run(host='0.0.0.0', port=59127, debug=True)
```

将 `port=59127` 改为你想要的端口号。

### 修改数据刷新间隔

编辑 `static/script.js` 文件：

```javascript
// 设置自动刷新（每10秒）
autoRefreshInterval = setInterval(loadData, 10000);
```

将 `10000` (毫秒) 改为你想要的刷新间隔。

## 📝 开发说明

### 添加新的设备类型

1. 在 `static/script.js` 的 `deviceIcons` 对象中添加图标映射：

```javascript
const deviceIcons = {
    'tv': '📺',
    'your_device': '🔥',  // 添加你的设备
};
```

2. 在数据文件中使用对应的 `type` 值。

### 自定义样式

编辑 `static/style.css` 文件来修改界面样式、颜色、布局等。

## 🐛 常见问题

### 1. 页面显示"数据加载失败"

**原因**: 后端服务未启动或数据文件不存在

**解决**:
- 确保运行了 `python3 app.py`
- 检查 `data/data.json` 文件是否存在

### 2. 平面图显示不正常

**原因**: 数据格式不正确或坐标值超出范围

**解决**:
- 检查 JSON 格式是否正确
- 确保 position 坐标在 0-600 范围内

### 3. 设备图标不显示

**原因**: 设备类型未定义或状态字段缺失

**解决**:
- 确保 `type` 字段值在支持的类型列表中
- 确保所有设备都有 `status` 字段

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 👤 作者

ClaraCora

## 🔗 相关链接

- GitHub: [https://github.com/ClaraCora/Home](https://github.com/ClaraCora/Home)
- Flask 文档: [https://flask.palletsprojects.com/](https://flask.palletsprojects.com/)

## 📮 联系方式

如有问题或建议，欢迎通过 GitHub Issues 联系。

---

⭐ 如果这个项目对你有帮助，请给它一个 Star！

