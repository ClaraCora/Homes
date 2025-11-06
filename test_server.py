#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
快速测试脚本 - 验证服务是否正常
"""

import requests
import json
import time

BASE_URL = "http://127.0.0.1:59127"

def test_health():
    """测试健康检查接口"""
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=5)
        if response.status_code == 200:
            print("✅ 健康检查通过")
            print(f"   响应: {response.json()}")
            return True
        else:
            print(f"❌ 健康检查失败: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ 健康检查异常: {e}")
        return False

def test_status():
    """测试状态接口"""
    try:
        response = requests.get(f"{BASE_URL}/api/home/status", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print("✅ 状态接口正常")
            print(f"   房间数量: {len(data.get('rooms', {}))}")
            return True
        else:
            print(f"❌ 状态接口失败: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ 状态接口异常: {e}")
        return False

def test_summary():
    """测试摘要接口"""
    try:
        response = requests.get(f"{BASE_URL}/api/home/summary", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print("✅ 摘要接口正常")
            print(f"   房间数: {data.get('room_count')}")
            print(f"   窗户: {data.get('windows', {}).get('total')} (开启: {data.get('windows', {}).get('open')})")
            print(f"   电器: {data.get('appliances', {}).get('total')} (运行: {data.get('appliances', {}).get('on')})")
            print(f"   平均温度: {data.get('environment', {}).get('avg_temperature')}°C")
            return True
        else:
            print(f"❌ 摘要接口失败: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ 摘要接口异常: {e}")
        return False

if __name__ == '__main__':
    print("=" * 50)
    print("智能家居监控系统 - 接口测试")
    print("=" * 50)
    print("⚠️  请确保服务已启动 (python3 app.py)")
    print("等待3秒后开始测试...\n")
    time.sleep(3)
    
    results = []
    results.append(test_health())
    print()
    results.append(test_status())
    print()
    results.append(test_summary())
    
    print("\n" + "=" * 50)
    if all(results):
        print("🎉 所有测试通过！系统运行正常！")
        print(f"🌐 访问 {BASE_URL} 查看界面")
    else:
        print("⚠️  部分测试失败，请检查服务状态")
    print("=" * 50)

