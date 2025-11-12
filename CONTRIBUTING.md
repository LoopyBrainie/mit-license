# Contributing to Auto-MIT

Thank you for your interest in contributing to Auto-MIT! This guide will help you get started.

## Development Setup

### Prerequisites
- Rust 1.70 or higher
- Cargo (comes with Rust)

### Getting Started

```bash
# Clone the repository
git clone https://github.com/LoopyBrainie/mit-license.git
cd mit-license

# Build the project
cargo build

# Run tests
cargo test

# Run the CLI
cargo run -- --help
```

## Making Changes

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes
4. Run tests and linting:
   ```bash
   cargo test
   cargo clippy
   cargo fmt
   ```
5. Commit your changes with clear messages
6. Push to your fork
7. Open a Pull Request

## Code Style

- Follow Rust standard style (enforced by `rustfmt`)
- Run `cargo fmt` before committing
- Ensure `cargo clippy` passes without warnings
- Write tests for new features

## Pull Request Guidelines

- Keep PRs focused on a single feature or fix
- Update documentation if needed
- Ensure all tests pass
- Follow the existing code structure

## Questions?

Open an issue for questions or discussions about contributing.
