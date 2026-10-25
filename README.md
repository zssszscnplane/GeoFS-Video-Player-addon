# GeoFS Video Player Addon — New User Tutorial

> Plugin: GeoFS-Video-Player-addon  
> Project: https://github.com/zssszscnplane/GeoFS-Video-Player-addon  

---

## Table of Contents

- [1. Introduction](#1-introduction)
- [2. Install a Userscript Manager](#2-install-a-userscript-manager)
- [3. Install the Addon](#3-install-the-addon)
- [4. How to Use](#4-how-to-use)
- [5. Notes](#5-notes)
- [6. FAQ](#6-faq)
- [7. Links](#7-links)

---

## 1. Introduction

**GeoFS Video Player** is a video player addon designed for the **GeoFS flight simulator**.

After installation, you can watch videos while flying, including:

- Local video files

The addon is distributed as a **User Script**, so it requires a userscript manager.

---

## 2. Install a Userscript Manager

Because the addon is a userscript, you need to install a userscript manager first. **Tampermonkey** is recommended.

### Steps

1. Open the Tampermonkey website:  
   https://www.tampermonkey.net/

2. The website will usually detect your browser, such as Chrome, Edge, or Firefox.

3. Click the download or install button for your browser.

4. Follow the browser extension store instructions to complete installation.

5. After installation, the Tampermonkey icon will appear in your browser toolbar.

> Tip: On Edge or Chrome, you can also search for “Tampermonkey” directly in the extension store.

---

## 3. Install the Addon

After installing the userscript manager, you can install the GeoFS Video Player addon.


### Method 1: Manual Installation

1. Click the Tampermonkey icon in your browser toolbar.

2. Open the **Dashboard**.

3. Click **“Add a new script”**.

4. Copy all code from the `user.js` file and paste it into the editor.

5. Save the script.

### Method 2: Paste into the Browser Console (Not Recommended for Long-Term Use)

Use this only for temporary testing.

> Warning: The console method stops working after refreshing the page. Some websites may restrict execution. Never paste unknown code.



---

## 4. How to Use

After installation, follow these steps.

### 4.1 Open GeoFS

Open GeoFS in your browser and enter the game:

https://www.geo-fs.com

### 4.2 Find the Video Player Panel

After entering the flight interface, the video player control panel should appear automatically.

Because the addon may be updated frequently, the player position may vary. It usually appears in a corner of the screen, such as the side or bottom. Look for a collapsible player window.

### 4.3 Load a Video

#### Play Local Videos

1. Click the **“Open File”** or similar button in the player.

2. Select a local video file from your computer.

3. Confirm and play.

Now you can fly and watch videos at the same time.

---

## 5. Notes

- **Browser compatibility**: The addon is mainly designed for desktop browsers. Mobile browsers may have limited userscript support and may not work properly.

- **Performance**: Running GeoFS and a video player at the same time uses more system resources. If the game lags, lower the video quality or close other background programs.

- **Updates**: Tampermonkey usually checks for updates automatically. You can also update manually in the Tampermonkey dashboard.

- **Feedback**: If you find bugs or have suggestions, submit an Issue on the GitHub project page.

- **Online video limits**: Some platforms may restrict playback due to region, copyright, or embed limitations.

---

## 6. FAQ

### Q1: The player does not appear in GeoFS after installation. What should I do?

Try the following:

1. Refresh the GeoFS page.
2. Make sure the addon is enabled in Tampermonkey.
3. Check whether the script has been updated to the latest version.
4. Disable other browser extensions that may conflict, then try again.

### Q2: Clicking “Raw” does not open the installation page. What should I do?

Use manual installation:

1. Copy all code from `user.js`.
2. Open the Tampermonkey dashboard.
3. Click “Add a new script”.
4. Paste the code and save.

### Q3: Can I play local videos?

Yes. Use the “Open File” or similar button in the player to select a local video.

### Q4: Can I play Bilibili or YouTube videos?

Usually you can paste the video link into the player. However, availability depends on platform restrictions and the current version of the addon.

---

## 7. Links

- Plugin Project:  
  https://github.com/zssszscnplane/GeoFS-Video-Player-addon

- Tampermonkey Website:  
  https://www.tampermonkey.net/

- GeoFS Website:  
  https://www.geo-fs.com/


---

---

# GeoFS Video Player 插件新用户教程

> 插件：GeoFS-Video-Player-addon  
> 项目地址：https://github.com/zssszscnplane/GeoFS-Video-Player-addon  
> 用途：在 GeoFS 飞行模拟器中播放本地视频

---

## 目录

- [一、插件简介](#一插件简介)
- [二、安装用户脚本管理器](#二安装用户脚本管理器)
- [三、安装插件](#三安装插件)
- [四、开始使用](#四开始使用)
- [五、注意事项](#五注意事项)
- [六、常见问题](#六常见问题)
- [七、相关链接](#七相关链接)

---

## 一、插件简介

**GeoFS Video Player** 是一个为 **GeoFS 飞行模拟器** 设计的视频播放器插件。

安装后，你可以在驾驶飞机的同时观看视频，包括：

- 本地视频文件

该插件以“用户脚本”形式发布，因此需要配合脚本管理器使用。

---

## 二、安装用户脚本管理器

由于该插件是用户脚本，需要先安装脚本管理器。推荐使用 **Tampermonkey（篡改猴）**。

### 安装步骤

1. 打开 Tampermonkey 官网：  
   https://www.tampermonkey.net/

2. 网站通常会自动识别你的浏览器，例如 Chrome、Edge 或 Firefox。

3. 点击对应浏览器的“下载”或“安装”按钮。

4. 按照浏览器扩展商店的提示完成安装。

5. 安装成功后，浏览器工具栏中会出现 Tampermonkey 图标。

> 提示：如果你使用 Edge 或 Chrome，也可以直接在浏览器扩展商店中搜索“Tampermonkey”进行安装。

---

## 三、安装插件

用户脚本管理器安装完成后，就可以安装 GeoFS Video Player 插件。


### 方法一：手动复制脚本安装

如果方法一无法自动触发安装，可以使用手动方式：

1. 点击浏览器工具栏中的 Tampermonkey 图标。

2. 进入“管理面板”。

3. 点击“添加新脚本”。

4. 将 `user.js` 文件中的全部代码复制粘贴进去。

5. 保存脚本。


## 二、临时方式：粘贴到浏览器控制台（不推荐长期使用）

如果你只是想临时测试，可以粘贴到浏览器开发者工具的控制台里运行。

> 警告：控制台方式刷新页面后就会失效；部分网站可能限制执行；不要粘贴不明来源代码。


---

## 四、开始使用

插件安装完成后，按照以下步骤使用。

### 4.1 打开 GeoFS

在浏览器中访问 GeoFS 并进入游戏：

https://www.geo-fs.com

### 4.2 查找视频播放器界面

成功进入飞行界面后，视频播放器控制面板通常会自动出现。

由于插件可能持续更新，播放器位置可能有所不同。它一般会出现在屏幕的某个角落，例如侧边或底部。你可以寻找一个可折叠的播放器窗口。

### 4.3 加载视频

#### 播放本地视频

1. 点击播放器上的“打开文件”或类似按钮。

2. 从电脑中选择本地视频文件。

3. 确认后即可播放。

现在，你就可以一边飞行，一边观看视频了。

---

## 五、注意事项

- **浏览器兼容性**：该插件主要针对桌面端浏览器设计。移动设备浏览器对用户脚本支持有限，可能无法正常使用。

- **性能影响**：同时运行 GeoFS 和视频播放器会占用更多系统资源。如果游戏卡顿，可以尝试降低视频清晰度或关闭其他后台程序。

- **脚本更新**：Tampermonkey 通常会自动检查并更新脚本。你也可以在 Tampermonkey 管理面板中手动更新。

- **问题反馈**：如果遇到 Bug 或有功能建议，可以前往 GitHub 项目页面提交 Issue。

- **网络视频限制**：部分在线视频平台可能受到地区、版权或嵌入播放限制，导致无法播放。

---

## 六、常见问题

### Q1：安装后 GeoFS 中没有出现播放器怎么办？

可以尝试：

1. 刷新 GeoFS 页面。
2. 确认 Tampermonkey 中插件已启用。
3. 检查脚本是否已更新到最新版本。
4. 关闭其他可能冲突的浏览器扩展后重试。

### Q2：点击 Raw 后没有跳转安装页面怎么办？

可以使用手动安装方法：

1. 复制 `user.js` 全部代码。
2. 打开 Tampermonkey 管理面板。
3. 点击“添加新脚本”。
4. 粘贴代码并保存。

### Q3：可以播放本地视频吗？

可以。使用播放器中的“打开文件”或类似按钮选择本地视频即可。


---

## 七、相关链接

- 插件项目地址：  
  https://github.com/zssszscnplane/GeoFS-Video-Player-addon

- Tampermonkey 官网：  
  https://www.tampermonkey.net/

- GeoFS 官网：  
  https://www.geo-fs.com/
