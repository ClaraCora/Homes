// 智能家居监控系统 - 前端脚本

// 全局变量
let homeData = null;
let autoRefreshInterval = null;

// 设备类型图标映射
const deviceIcons = {
    'tv': '📺',
    'air_conditioner': '❄️',
    'light': '💡',
    'refrigerator': '🧊',
    'exhaust_fan': '🌀'
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('智能家居监控系统初始化...');
    loadData();
    
    // 设置自动刷新（每10秒）
    autoRefreshInterval = setInterval(loadData, 10000);
});

// 刷新数据
function refreshData() {
    console.log('手动刷新数据...');
    loadData();
}

// 加载数据
async function loadData() {
    try {
        // 获取完整数据
        const response = await fetch('/api/home/status');
        homeData = await response.json();
        
        // 获取摘要数据
        const summaryResponse = await fetch('/api/home/summary');
        const summaryData = await summaryResponse.json();
        
        // 更新界面
        updateSummary(summaryData);
        drawHomeMap(homeData);
        updateRoomDetails(homeData);
        updateTimestamp(homeData.timestamp || new Date().toISOString());
        
        console.log('数据加载成功');
    } catch (error) {
        console.error('加载数据失败:', error);
        showError('数据加载失败，请检查后端服务是否运行');
    }
}

// 更新摘要信息
function updateSummary(data) {
    if (data.error) {
        console.error('摘要数据错误:', data.error);
        return;
    }
    
    // 更新门窗状态
    document.getElementById('windows-open').textContent = data.windows.open;
    document.getElementById('windows-total').textContent = data.windows.total;
    document.getElementById('doors-open').textContent = data.doors.open;
    document.getElementById('doors-total').textContent = data.doors.total;
    
    // 更新电器状态
    document.getElementById('appliances-on').textContent = data.appliances.on;
    document.getElementById('appliances-total').textContent = data.appliances.total;
    
    // 更新环境数据
    document.getElementById('avg-temp').textContent = data.environment.avg_temperature + ' °C';
    document.getElementById('avg-humidity').textContent = data.environment.avg_humidity + ' %';
}

// 绘制家居平面图
function drawHomeMap(data) {
    if (!data || !data.rooms) {
        console.error('无效的家居数据');
        return;
    }
    
    const svg = document.getElementById('home-map');
    svg.innerHTML = ''; // 清空现有内容
    
    // 创建房间组
    Object.entries(data.rooms).forEach(([roomId, roomData]) => {
        const roomGroup = createRoomGroup(roomId, roomData);
        svg.appendChild(roomGroup);
    });
}

// 创建房间组
function createRoomGroup(roomId, roomData) {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', 'room');
    g.setAttribute('data-room-id', roomId);
    
    const pos = roomData.position;
    const roomWidth = 200;
    const roomHeight = 180;
    
    // 房间矩形
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('class', 'room-rect');
    rect.setAttribute('x', pos.x - roomWidth / 2);
    rect.setAttribute('y', pos.y - roomHeight / 2);
    rect.setAttribute('width', roomWidth);
    rect.setAttribute('height', roomHeight);
    rect.setAttribute('rx', 10);
    g.appendChild(rect);
    
    // 房间名称
    const nameText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    nameText.setAttribute('class', 'room-text');
    nameText.setAttribute('x', pos.x);
    nameText.setAttribute('y', pos.y - 60);
    nameText.textContent = roomData.name;
    g.appendChild(nameText);
    
    // 温度
    const tempText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    tempText.setAttribute('class', 'temp-text');
    tempText.setAttribute('x', pos.x);
    tempText.setAttribute('y', pos.y - 30);
    tempText.textContent = `🌡️ ${roomData.temperature}°C`;
    g.appendChild(tempText);
    
    // 湿度
    const humidityText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    humidityText.setAttribute('class', 'humidity-text');
    humidityText.setAttribute('x', pos.x);
    humidityText.setAttribute('y', pos.y - 10);
    humidityText.textContent = `💧 ${roomData.humidity}%`;
    g.appendChild(humidityText);
    
    // 绘制窗户
    if (roomData.windows) {
        roomData.windows.forEach((window, index) => {
            const windowIcon = createDeviceIcon(
                pos.x - 80 + index * 40,
                pos.y + 40,
                window.status === 'open' ? '🪟✅' : '🪟❌',
                window.name,
                window.status
            );
            g.appendChild(windowIcon);
        });
    }
    
    // 绘制门
    if (roomData.doors) {
        roomData.doors.forEach((door, index) => {
            const doorIcon = createDeviceIcon(
                pos.x - 80 + index * 40,
                pos.y + 70,
                door.status === 'open' ? '🚪✅' : '🚪❌',
                door.name,
                door.status
            );
            g.appendChild(doorIcon);
        });
    }
    
    // 绘制电器
    if (roomData.appliances) {
        roomData.appliances.forEach((appliance, index) => {
            const icon = deviceIcons[appliance.type] || '⚡';
            const statusIcon = appliance.status === 'on' ? '✅' : '❌';
            const applianceIcon = createDeviceIcon(
                pos.x - 80 + (index % 4) * 40,
                pos.y + 10,
                icon + statusIcon,
                appliance.name,
                appliance.status
            );
            g.appendChild(applianceIcon);
        });
    }
    
    return g;
}

// 创建设备图标
function createDeviceIcon(x, y, icon, name, status) {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', 'device-icon');
    
    // 背景圆圈
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', x);
    circle.setAttribute('cy', y);
    circle.setAttribute('r', 15);
    circle.setAttribute('fill', status === 'on' || status === 'open' ? '#c8e6c9' : '#ffcdd2');
    circle.setAttribute('stroke', status === 'on' || status === 'open' ? '#4CAF50' : '#f44336');
    circle.setAttribute('stroke-width', 2);
    g.appendChild(circle);
    
    // 图标文字
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', x);
    text.setAttribute('y', y + 5);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('font-size', '14');
    text.textContent = icon;
    g.appendChild(text);
    
    // 添加标题（鼠标悬停时显示）
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    title.textContent = `${name} (${status === 'on' || status === 'open' ? '开启' : '关闭'})`;
    g.appendChild(title);
    
    return g;
}

// 更新房间详情
function updateRoomDetails(data) {
    if (!data || !data.rooms) {
        return;
    }
    
    const detailsContainer = document.getElementById('room-details');
    detailsContainer.innerHTML = '';
    
    Object.entries(data.rooms).forEach(([roomId, roomData]) => {
        const roomDetail = createRoomDetail(roomId, roomData);
        detailsContainer.appendChild(roomDetail);
    });
}

// 创建房间详情卡片
function createRoomDetail(roomId, roomData) {
    const div = document.createElement('div');
    div.className = 'room-detail';
    
    let html = `
        <h3>${roomData.name}</h3>
        <div class="room-detail-item">
            <span class="item-label">温度</span>
            <span class="item-value">${roomData.temperature}°C</span>
        </div>
        <div class="room-detail-item">
            <span class="item-label">湿度</span>
            <span class="item-value">${roomData.humidity}%</span>
        </div>
    `;
    
    // 门窗状态
    if (roomData.windows && roomData.windows.length > 0) {
        html += '<div class="device-list"><strong>窗户:</strong>';
        roomData.windows.forEach(window => {
            const statusClass = window.status === 'open' ? 'status-open' : 'status-closed';
            html += `
                <div class="device-item">
                    <span class="device-name">${window.name}</span>
                    <span class="device-status ${window.status}">${window.status === 'open' ? '开启' : '关闭'}</span>
                </div>
            `;
        });
        html += '</div>';
    }
    
    if (roomData.doors && roomData.doors.length > 0) {
        html += '<div class="device-list"><strong>门:</strong>';
        roomData.doors.forEach(door => {
            const statusClass = door.status === 'open' ? 'status-open' : 'status-closed';
            html += `
                <div class="device-item">
                    <span class="device-name">${door.name}</span>
                    <span class="device-status ${door.status}">${door.status === 'open' ? '开启' : '关闭'}</span>
                </div>
            `;
        });
        html += '</div>';
    }
    
    // 电器状态
    if (roomData.appliances && roomData.appliances.length > 0) {
        html += '<div class="device-list"><strong>电器:</strong>';
        roomData.appliances.forEach(appliance => {
            const icon = deviceIcons[appliance.type] || '⚡';
            html += `
                <div class="device-item">
                    <span class="device-name">${icon} ${appliance.name}</span>
                    <span class="device-status ${appliance.status}">${appliance.status === 'on' ? '运行中' : '关闭'}</span>
                </div>
            `;
        });
        html += '</div>';
    }
    
    div.innerHTML = html;
    return div;
}

// 更新时间戳
function updateTimestamp(timestamp) {
    const date = new Date(timestamp);
    const formattedTime = date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    document.getElementById('update-time').textContent = `更新时间: ${formattedTime}`;
}

// 显示错误信息
function showError(message) {
    const detailsContainer = document.getElementById('room-details');
    detailsContainer.innerHTML = `
        <div style="color: #f44336; padding: 20px; text-align: center;">
            <h3>❌ ${message}</h3>
            <p style="margin-top: 10px;">请确保后端服务正在运行</p>
        </div>
    `;
}

// 页面卸载时清除定时器
window.addEventListener('beforeunload', function() {
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
    }
});

