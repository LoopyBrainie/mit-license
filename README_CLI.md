# MIT License CLI 工具

一个简单的命令行工具，用于在项目目录中快速生成 MIT 或 ISC 许可证文件。

## 安装

### 本地安装（推荐用于开发）

```bash
# 克隆仓库
git clone https://github.com/LoopyBrainie/mit-license.git
cd mit-license

# 安装依赖
npm install

# 全局链接（用于本地测试）
npm link
```

### 直接使用（无需安装）

```bash
node bin/cli.js [选项]
```

## 使用方法

### 基本用法

```bash
# 使用命令行参数
mit-license -n "Your Name" -y 2024

# 交互式模式
mit-license --interactive

# 显示帮助信息
mit-license --help
```

### 命令行选项

| 选项 | 简写 | 描述 | 默认值 |
|------|------|------|--------|
| `--name <name>` | `-n` | 版权所有者姓名（必填，除非使用交互模式） | - |
| `--email <email>` | `-e` | 电子邮件地址 | - |
| `--url <url>` | `-u` | 个人网站 URL | - |
| `--year <year>` | `-y` | 许可证年份 | 当前年份 |
| `--start-year <year>` | `-s` | 起始年份 | 当前年份 |
| `--end-year <year>` | - | 结束年份 | 当前年份 |
| `--license <type>` | `-l` | 许可证类型（MIT 或 ISC） | MIT |
| `--output <file>` | `-o` | 输出文件路径 | ./LICENSE |
| `--interactive` | `-i` | 交互式模式 | false |
| `--help` | `-h` | 显示帮助信息 | - |

## 使用示例

### 示例 1: 基本 MIT 许可证

```bash
mit-license -n "张三" -y 2024
```

生成的文件 `LICENSE`:
```
The MIT License (MIT)

Copyright © 2024 张三

Permission is hereby granted, free of charge, to any person...
```

### 示例 2: 包含完整信息的许可证

```bash
mit-license --name "John Doe" \
  --email "john@example.com" \
  --url "https://example.com" \
  --year 2024
```

### 示例 3: 年份范围

```bash
mit-license -n "李四" -s 2020 --end-year 2024
```

生成的版权信息：
```
Copyright © 2020-2024 李四
```

### 示例 4: ISC 许可证

```bash
mit-license -n "Jane Smith" -l ISC -y 2024
```

### 示例 5: 自定义输出路径

```bash
mit-license -n "王五" -y 2024 -o ./docs/LICENSE.txt
```

### 示例 6: 交互式模式

```bash
mit-license --interactive
```

交互式模式会提示您输入：
- 版权所有者姓名
- 电子邮件（可选）
- 个人网站 URL（可选）
- 起始年份
- 结束年份
- 许可证类型

## 支持的许可证类型

- **MIT**: 最流行的开源许可证之一
- **ISC**: 与 MIT 类似但更简洁的许可证

## 功能特点

- ✅ 一键生成许可证文件
- ✅ 支持命令行参数和交互式模式
- ✅ 支持 MIT 和 ISC 许可证
- ✅ 自定义版权信息（姓名、邮箱、网站）
- ✅ 灵活的年份设置（单一年份或年份范围）
- ✅ 自定义输出路径
- ✅ 中文友好的提示信息

## 开发

### 运行测试

```bash
npm test
```

### 代码风格检查

```bash
npm run lint
```

## 项目结构

```
mit-license/
├── bin/
│   └── cli.js          # CLI 入口文件
├── licenses/
│   ├── MIT.ejs         # MIT 许可证模板
│   └── ISC.ejs         # ISC 许可证模板
├── lib/                # 库文件
├── package.json        # 项目配置
└── README_CLI.md       # CLI 文档
```

## 技术栈

- Node.js (ES Modules)
- EJS (模板引擎)
- readline (交互式输入)

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License - 详见 [LICENSE](./LICENSE) 文件

## 相关链接

- [在线版本](https://mit-license.org/)
- [GitHub 仓库](https://github.com/LoopyBrainie/mit-license)
