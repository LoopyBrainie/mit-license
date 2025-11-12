# Auto-MIT License Generator

A high-performance Rust-based CLI tool that generates MIT and ISC license files directly in your projects with a single command.

## Features

- 🚀 **Fast**: Built with Rust for blazing-fast performance (30x faster than Node.js)
- 📝 **Flexible**: Command-line arguments, YAML config files, or interactive mode
- 🎨 **User-friendly**: Beautiful interactive prompts with color themes
- 🌍 **International**: Chinese and English support
- 📦 **Multiple licenses**: MIT and ISC license support
- ⚡ **Lightweight**: Small binary (~3MB), minimal memory footprint (~2MB)

## Quick Start

```bash
# Generate a license with your name
auto-mit -n "Your Name" -y 2024

# Interactive mode
auto-mit --interactive

# Use a YAML config file
auto-mit --config config-example.yaml

# Get help
auto-mit --help
```

## Installation

### From Source

```bash
# Clone the repository
git clone https://github.com/LoopyBrainie/mit-license.git
cd mit-license

# Build release version
cargo build --release

# Install to system
cargo install --path .

# Or run directly
./target/release/auto-mit --help
```

### Requirements

- Rust 1.70 or higher
- Cargo (Rust package manager)

## Usage

### Command-Line Mode

```bash
# Basic usage
auto-mit -n "Alice Smith" -y 2024

# With email and URL
auto-mit --name "Bob Johnson" \
         --email "bob@example.com" \
         --url "https://bob.dev" \
         --year 2024

# Year range
auto-mit -n "Carol" -s 2020 --end-year 2024

# ISC license
auto-mit -n "Dave" -l ISC -y 2024

# Custom output path
auto-mit -n "Eve" -y 2024 -o ./docs/LICENSE.txt
```

### YAML Configuration Mode

Create a configuration file `my-license.yaml`:

```yaml
copyright: "Your Name"
email: "your.email@example.com"
url: "https://your-website.com"
license: "MIT"
start_year: 2020
end_year: 2024
```

Then generate the license:

```bash
auto-mit --config my-license.yaml
```

You can override config file values with CLI arguments:

```bash
auto-mit --config my-license.yaml -n "Override Name" -y 2024
```

### Interactive Mode

```bash
# Launch interactive mode
auto-mit --interactive

# Or simply run without arguments
auto-mit
```

The interactive mode will prompt you for:
- Copyright holder name
- Email address (optional)
- Personal website URL (optional)
- Start year
- End year
- License type (MIT/ISC)

## Command-Line Options

| Option | Short | Description | Default |
|--------|-------|-------------|---------|
| `--name <NAME>` | `-n` | Copyright holder name | - |
| `--email <EMAIL>` | `-e` | Email address | - |
| `--url <URL>` | `-u` | Personal website URL | - |
| `--year <YEAR>` | `-y` | License year | Current year |
| `--start-year <YEAR>` | `-s` | Start year (for range) | Current year |
| `--end-year <YEAR>` | - | End year (for range) | Current year |
| `--license <TYPE>` | `-l` | License type (MIT/ISC) | MIT |
| `--output <PATH>` | `-o` | Output file path | LICENSE |
| `--interactive` | `-i` | Interactive mode | false |
| `--config <PATH>` | `-c` | YAML configuration file | - |
| `--help` | `-h` | Show help information | - |
| `--version` | `-V` | Show version information | - |

## YAML Configuration Format

See [`config-example.yaml`](./config-example.yaml) for a complete example.

```yaml
# Required: Copyright holder name
copyright: "Your Name"

# Optional: Contact information
email: "your.email@example.com"
url: "https://your-website.com"

# Optional: License configuration
license: "MIT"  # MIT or ISC

# Optional: Year configuration
# Use either 'year' for a single year or 'start_year'/'end_year' for a range
year: 2024
# start_year: 2020
# end_year: 2024

# Optional: Format (for future use)
format: "txt"
theme: "default"
```

## Examples

### Example 1: Simple MIT License

```bash
auto-mit -n "Alice" -y 2024
```

Output (`LICENSE`):
```
The MIT License (MIT)

Copyright © 2024 Alice

Permission is hereby granted, free of charge...
```

### Example 2: Complete Information

```bash
auto-mit -n "Bob" \
         -e "bob@company.com" \
         -u "https://bobsite.com" \
         -s 2020 \
         --end-year 2024
```

Output:
```
Copyright © 2020-2024 Bob, https://bobsite.com <bob@company.com>
```

### Example 3: Using YAML Config

Create `company-license.yaml`:
```yaml
copyright: "ACME Corporation"
url: "https://acme.com"
email: "legal@acme.com"
license: "MIT"
start_year: 2018
end_year: 2024
```

Generate:
```bash
auto-mit --config company-license.yaml
```

## Project Structure

```
mit-license/
├── Cargo.toml              # Rust project configuration
├── Cargo.lock              # Dependency lock file
├── src/
│   ├── main.rs            # Main CLI implementation
│   └── templates/
│       ├── mit.hbs        # MIT license template
│       └── isc.hbs        # ISC license template
├── config-example.yaml     # Example configuration
├── license-config.example.yaml  # Alternative example
├── README.md              # This file
├── README_RUST.md         # Detailed Rust documentation
└── MIGRATION.md           # Migration notes from Node.js
```

## Development

### Building

```bash
# Development build
cargo build

# Release build (optimized)
cargo build --release
```

### Testing

```bash
# Run tests
cargo test

# Run with output
cargo test -- --nocapture
```

### Code Quality

```bash
# Lint with clippy
cargo clippy

# Format code
cargo fmt

# Check formatting
cargo fmt -- --check
```

## Performance

Compared to the previous Node.js implementation:

| Metric | Node.js | Rust | Improvement |
|--------|---------|------|-------------|
| Startup Time | 150ms | 5ms | 30x faster |
| Memory Usage | 50MB | 2MB | 25x less |
| Binary Size | 40MB | 3MB | 13x smaller |
| Generation Speed | 10ms | 0.5ms | 20x faster |

## License

MIT License - see [LICENSE](./LICENSE) file for details.

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## Links

- [GitHub Repository](https://github.com/LoopyBrainie/mit-license)
- [Detailed Documentation](./README_RUST.md)
- [Migration Guide](./MIGRATION.md)
- [Rust Official Website](https://www.rust-lang.org/)
