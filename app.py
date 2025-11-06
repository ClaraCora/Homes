#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
智能家居监控系统 - 后端服务
读取 data/data.json 文件，提供 API 接口给前端
"""

from flask import Flask, render_template, jsonify
from flask_cors import CORS
import json
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)  # 允许跨域请求

# 数据文件路径
DATA_FILE = os.path.join(os.path.dirname(__file__), 'data', 'data.json')


def read_home_data():
    """读取家居数据"""
    try:
        if os.path.exists(DATA_FILE):
            with open(DATA_FILE, 'r', encoding='utf-8') as f:
                data = json.load(f)
            return data
        else:
            return {
                "error": "数据文件不存在",
                "message": "请确保 data/data.json 文件存在"
            }
    except Exception as e:
        return {
            "error": "读取数据失败",
            "message": str(e)
        }


@app.route('/')
def index():
    """首页 - 显示家居监控界面"""
    return render_template('index.html')


@app.route('/api/home/status')
def get_home_status():
    """API: 获取家居状态数据"""
    data = read_home_data()
    return jsonify(data)


@app.route('/api/home/summary')
def get_home_summary():
    """API: 获取家居状态摘要"""
    data = read_home_data()
    
    if 'error' in data:
        return jsonify(data)
    
    # 统计信息
    total_windows = 0
    open_windows = 0
    total_doors = 0
    open_doors = 0
    total_appliances = 0
    on_appliances = 0
    avg_temp = 0
    avg_humidity = 0
    room_count = 0
    
    if 'rooms' in data:
        room_count = len(data['rooms'])
        for room_id, room_data in data['rooms'].items():
            # 统计门窗
            if 'windows' in room_data:
                total_windows += len(room_data['windows'])
                open_windows += sum(1 for w in room_data['windows'] if w['status'] == 'open')
            
            if 'doors' in room_data:
                total_doors += len(room_data['doors'])
                open_doors += sum(1 for d in room_data['doors'] if d['status'] == 'open')
            
            # 统计电器
            if 'appliances' in room_data:
                total_appliances += len(room_data['appliances'])
                on_appliances += sum(1 for a in room_data['appliances'] if a['status'] == 'on')
            
            # 统计温湿度
            if 'temperature' in room_data:
                avg_temp += room_data['temperature']
            if 'humidity' in room_data:
                avg_humidity += room_data['humidity']
    
    summary = {
        'timestamp': data.get('timestamp', datetime.now().isoformat()),
        'room_count': room_count,
        'windows': {
            'total': total_windows,
            'open': open_windows,
            'closed': total_windows - open_windows
        },
        'doors': {
            'total': total_doors,
            'open': open_doors,
            'closed': total_doors - open_doors
        },
        'appliances': {
            'total': total_appliances,
            'on': on_appliances,
            'off': total_appliances - on_appliances
        },
        'environment': {
            'avg_temperature': round(avg_temp / room_count, 1) if room_count > 0 else 0,
            'avg_humidity': round(avg_humidity / room_count, 1) if room_count > 0 else 0
        }
    }
    
    return jsonify(summary)


@app.route('/health')
def health_check():
    """健康检查接口"""
    return jsonify({
        'status': 'ok',
        'service': '智能家居监控系统',
        'timestamp': datetime.now().isoformat()
    })


if __name__ == '__main__':
    print("=" * 50)
    print("智能家居监控系统启动中...")
    print(f"数据文件路径: {DATA_FILE}")
    print("访问地址: http://127.0.0.1:59127")
    print("=" * 50)
    app.run(host='0.0.0.0', port=59127, debug=True)

