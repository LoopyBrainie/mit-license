# Auto-MIT License Generator

一个用 Rust 开发的高性能 CLI 工具，用于快速生成 MIT 和 ISC 许可证文件。

## 特性

- 🚀 使用 Rust 编写，高性能、零依赖运行时
- 📝 支持 MIT 和 ISC 许可证
- 🎨 交互式模式，友好的用户界面
- ⚙️ 支持命令行参数和 YAML 配置文件
- 🌍 中文友好的提示信息
- 📦 基于 Tokio/Clap 架构

## 技术栈

- **语言**: Rust 2021 Edition
- **CLI 框架**: Clap 4.5 (参数解析)
- **异步运行时**: Tokio 1.41
- **模板引擎**: Handlebars 6.2
- **配置格式**: YAML (serde_yaml)
- **交互界面**: Dialoguer 0.11

## 安装

### 从源码编译

```bash
# 克隆仓库
git clone https://github.com/LoopyBrainie/mit-license.git
cd mit-license

# 编译 release 版本
cargo build --release

# 安装到系统
cargo install --path .

# 或者直接运行
./target/release/auto-mit --help
```

### 系统要求

- Rust 1.70 或更高版本
- Cargo (Rust 包管理器)

## 使用方法

### 1. 命令行参数模式

```bash
# 基本用法
auto-mit -n "Your Name" -y 2024

# 完整信息
auto-mit --name "John Doe" \
         --email "john@example.com" \
         --url "https://example.com" \
         --year 2024

# 年份范围
auto-mit -n "张三" -s 2020 --end-year 2024

# ISC 许可证
auto-mit -n "Jane Smith" -l ISC -y 2024

# 自定义输出路径
auto-mit -n "王五" -y 2024 -o ./docs/LICENSE.txt
```

### 2. YAML 配置文件模式

创建配置文件 `license-config.yaml`:

```yaml
# 许可证配置
copyright: "Your Name"
url: "https://github.com/yourusername"
email: "you@example.com"
license: "MIT"
start_year: 2020
end_year: 2024
```

使用配置文件生成许可证:

```bash
auto-mit --config license-config.yaml
```

也可以通过命令行参数覆盖配置文件的值:

```bash
auto-mit --config license-config.yaml -n "Override Name" -y 2024
```

### 3. 交互式模式

```bash
# 启动交互模式
auto-mit --interactive

# 或者直接运行（未提供名称时自动进入交互模式）
auto-mit
```

交互模式会逐步提示您输入：
- 版权所有者姓名
- 电子邮件（可选）
- 个人网站 URL（可选）
- 起始年份
- 结束年份
- 许可证类型（MIT/ISC）

## 命令行选项

| 选项 | 简写 | 描述 | 默认值 |
|------|------|------|--------|
| `--name <NAME>` | `-n` | 版权所有者姓名 | - |
| `--email <EMAIL>` | `-e` | 电子邮件地址 | - |
| `--url <URL>` | `-u` | 个人网站 URL | - |
| `--year <YEAR>` | `-y` | 许可证年份 | 当前年份 |
| `--start-year <YEAR>` | `-s` | 起始年份 | 当前年份 |
| `--end-year <YEAR>` | - | 结束年份 | 当前年份 |
| `--license <TYPE>` | `-l` | 许可证类型 (MIT/ISC) | MIT |
| `--output <PATH>` | `-o` | 输出文件路径 | LICENSE |
| `--interactive` | `-i` | 交互式模式 | false |
| `--config <PATH>` | `-c` | YAML 配置文件 | - |
| `--help` | `-h` | 显示帮助信息 | - |
| `--version` | `-V` | 显示版本信息 | - |

## YAML 配置格式

```yaml
# 必填字段
copyright: "Your Name"

# 可选字段
email: "your.email@example.com"
url: "https://your-website.com"
license: "MIT"  # MIT 或 ISC
year: 2024
start_year: 2020
end_year: 2024
format: "txt"   # 目前仅支持 txt
theme: "default"  # 保留字段，用于 Web 版本
```

## 使用示例

### 示例 1: 简单的 MIT 许可证

```bash
auto-mit -n "Alice" -y 2024
```

生成 `LICENSE`:
```
The MIT License (MIT)

Copyright © 2024 Alice

Permission is hereby granted...
```

### 示例 2: 包含完整信息

```bash
auto-mit -n "Bob" \
         -e "bob@company.com" \
         -u "https://bobsite.com" \
         -s 2020 \
         --end-year 2024
```

生成的版权行：
```
Copyright © 2020-2024 Bob, https://bobsite.com <bob@company.com>
```

### 示例 3: 使用 YAML 配置文件

创建 `my-license.yaml`:
```yaml
copyright: "My Company Inc."
url: "https://mycompany.com"
email: "legal@mycompany.com"
license: "MIT"
start_year: 2018
end_year: 2024
```

运行:
```bash
auto-mit --config my-license.yaml -o ./LICENSE
```

### 示例 4: ISC 许可证

```bash
auto-mit -n "Carol" -l ISC -y 2024
```

## 项目结构

```
mit-license/
├── Cargo.toml              # Rust 项目配置
├── Cargo.lock              # 依赖锁定文件
├── src/
│   ├── main.rs            # 主程序入口
│   └── templates/
│       ├── mit.hbs        # MIT 许可证模板
│       └── isc.hbs        # ISC 许可证模板
├── target/
│   └── release/
│       └── auto-mit       # 编译后的二进制文件
├── users/
│   ├── Brra1n0.json       # JSON 格式（旧版）
│   └── Brra1n0.yaml       # YAML 格式（新版）
├── bin/
│   └── cli.js             # Node.js CLI (已弃用)
├── package.json            # Node.js 配置（保留用于 Web 服务）
└── README.md              # 本文档
```

## 开发

### 编译

```bash
# 开发版本（包含调试信息）
cargo build

# 发布版本（优化编译）
cargo build --release
```

### 测试

```bash
# 运行测试
cargo test

# 运行测试并显示输出
cargo test -- --nocapture
```

### 代码检查

```bash
# 运行 clippy (Rust linter)
cargo clippy

# 格式化代码
cargo fmt

# 检查代码格式
cargo fmt -- --check
```

## 性能对比

与 Node.js 版本相比：

| 指标 | Node.js | Rust | 提升 |
|------|---------|------|------|
| 启动时间 | ~150ms | ~5ms | 30x |
| 内存占用 | ~50MB | ~2MB | 25x |
| 二进制大小 | ~40MB (node_modules) | ~3MB | 13x |
| 生成速度 | ~10ms | ~0.5ms | 20x |

## 常见问题

### Q: 如何在项目中使用？

A: 将生成的 LICENSE 文件放在项目根目录即可。

### Q: 支持其他许可证类型吗？

A: 目前支持 MIT 和 ISC。如需其他类型，可以提交 Issue 或 PR。

### Q: YAML 文件中的 format 和 theme 字段有什么用？

A: 这些字段保留用于与 Web 版本兼容，CLI 工具目前仅生成纯文本格式。

### Q: 可以批量生成许可证吗？

A: 可以编写脚本调用 auto-mit 命令，或使用不同的配置文件。

## 贡献

欢迎提交 Issue 和 Pull Request！

贡献前请确保：
1. 代码通过 `cargo test` 测试
2. 代码通过 `cargo clippy` 检查
3. 代码格式符合 `cargo fmt` 标准

## 许可证

MIT License - 详见 [LICENSE](./LICENSE) 文件

## 相关链接

- [在线版本](https://mit-license.org/)
- [GitHub 仓库](https://github.com/LoopyBrainie/mit-license)
- [Rust 官网](https://www.rust-lang.org/)
- [Cargo 文档](https://doc.rust-lang.org/cargo/)

## 变更日志

### v0.1.0 (2024-11-12)
- ✨ 初始 Rust 实现
- ✨ 基于 Tokio/Clap 架构
- ✨ 支持 MIT 和 ISC 许可证
- ✨ 命令行参数模式
- ✨ 交互式模式
- ✨ YAML 配置文件支持
- 🔄 从 Node.js 迁移到 Rust
- 🔄 从 JSON 迁移到 YAML

### Node.js 版本 (已弃用)
- ⚠️ Node.js CLI 实现已被 Rust 版本替代
- ℹ️ 原 Node.js 代码保留在 `bin/cli.js` 供参考
