#!/bin/bash
# 智能家居监控系统启动脚本

echo "========================================"
echo "智能家居监控系统"
echo "========================================"

# 检查 Python 是否安装
if ! command -v python3 &> /dev/null; then
    echo "❌ 错误: 未找到 Python3，请先安装 Python3"
    exit 1
fi

# 检查是否存在虚拟环境
if [ ! -d "venv" ]; then
    echo "📦 创建虚拟环境..."
    python3 -m venv venv
fi

# 激活虚拟环境
echo "🔧 激活虚拟环境..."
source venv/bin/activate

# 安装依赖
echo "📥 安装依赖包..."
pip install -r requirements.txt -q

# 检查数据文件
if [ ! -f "data/data.json" ]; then
    echo "⚠️  警告: data/data.json 文件不存在"
fi

# 启动服务
echo "🚀 启动服务..."
echo "========================================"
python3 app.py

