use anyhow::{Context, Result};
use chrono::Datelike;
use clap::Parser;
use dialoguer::{theme::ColorfulTheme, Input, Select};
use handlebars::Handlebars;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::fs;
use std::path::PathBuf;

const MIT_TEMPLATE: &str = include_str!("templates/mit.hbs");
const ISC_TEMPLATE: &str = include_str!("templates/isc.hbs");

/// CLI tool for generating MIT and ISC license files
#[derive(Parser, Debug)]
#[command(name = "auto-mit")]
#[command(author, version, about, long_about = None)]
struct Cli {
    /// Copyright holder name
    #[arg(short = 'n', long = "name")]
    name: Option<String>,

    /// Email address
    #[arg(short, long)]
    email: Option<String>,

    /// Personal website URL
    #[arg(short, long)]
    url: Option<String>,

    /// License year (defaults to current year)
    #[arg(short, long)]
    year: Option<u32>,

    /// Start year (for year range)
    #[arg(short = 's', long)]
    start_year: Option<u32>,

    /// End year (for year range)
    #[arg(long)]
    end_year: Option<u32>,

    /// License type (MIT or ISC)
    #[arg(short, long, default_value = "MIT")]
    license: String,

    /// Output file path
    #[arg(short, long, default_value = "LICENSE")]
    output: PathBuf,

    /// Interactive mode
    #[arg(short, long)]
    interactive: bool,

    /// YAML configuration file
    #[arg(short = 'c', long = "config")]
    config: Option<PathBuf>,
}

#[derive(Debug, Serialize, Deserialize)]
struct LicenseConfig {
    copyright: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    email: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    url: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    year: Option<u32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    start_year: Option<u32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    end_year: Option<u32>,
    #[serde(default = "default_license")]
    license: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    format: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    theme: Option<String>,
}

fn default_license() -> String {
    "MIT".to_string()
}

impl LicenseConfig {
    fn merge_with_cli(&mut self, cli: &Cli) {
        if let Some(ref name) = cli.name {
            self.copyright = name.clone();
        }
        if let Some(ref email) = cli.email {
            self.email = Some(email.clone());
        }
        if let Some(ref url) = cli.url {
            self.url = Some(url.clone());
        }
        if let Some(year) = cli.year {
            self.year = Some(year);
        }
        if let Some(start_year) = cli.start_year {
            self.start_year = Some(start_year);
        }
        if let Some(end_year) = cli.end_year {
            self.end_year = Some(end_year);
        }
        if !cli.license.is_empty() {
            self.license = cli.license.to_uppercase();
        }
    }
}

fn get_interactive_input() -> Result<LicenseConfig> {
    let current_year = chrono::Local::now().year() as u32;

    println!("请输入以下信息来生成 LICENSE 文件：\n");

    let copyright: String = Input::with_theme(&ColorfulTheme::default())
        .with_prompt("版权所有者姓名 (必填)")
        .interact_text()?;

    let email: String = Input::with_theme(&ColorfulTheme::default())
        .with_prompt("电子邮件 (可选，按回车跳过)")
        .allow_empty(true)
        .interact_text()?;

    let url: String = Input::with_theme(&ColorfulTheme::default())
        .with_prompt("个人网站 URL (可选，按回车跳过)")
        .allow_empty(true)
        .interact_text()?;

    let start_year_input: String = Input::with_theme(&ColorfulTheme::default())
        .with_prompt(format!("起始年份 (可选，默认为 {})", current_year))
        .allow_empty(true)
        .interact_text()?;

    let end_year_input: String = Input::with_theme(&ColorfulTheme::default())
        .with_prompt(format!("结束年份 (可选，默认为 {})", current_year))
        .allow_empty(true)
        .interact_text()?;

    let license_types = vec!["MIT", "ISC"];
    let license_selection = Select::with_theme(&ColorfulTheme::default())
        .with_prompt("许可证类型")
        .items(&license_types)
        .default(0)
        .interact()?;

    Ok(LicenseConfig {
        copyright,
        email: if email.is_empty() { None } else { Some(email) },
        url: if url.is_empty() { None } else { Some(url) },
        year: None,
        start_year: if start_year_input.is_empty() {
            Some(current_year)
        } else {
            Some(start_year_input.parse()?)
        },
        end_year: if end_year_input.is_empty() {
            Some(current_year)
        } else {
            Some(end_year_input.parse()?)
        },
        license: license_types[license_selection].to_string(),
        format: None,
        theme: None,
    })
}

fn load_config_from_yaml(path: &PathBuf) -> Result<LicenseConfig> {
    let content = fs::read_to_string(path)
        .with_context(|| format!("无法读取配置文件: {}", path.display()))?;

    let config: LicenseConfig = serde_yaml::from_str(&content)
        .with_context(|| format!("无法解析 YAML 配置文件: {}", path.display()))?;

    Ok(config)
}

fn build_copyright_info(config: &LicenseConfig) -> String {
    let mut info = config.copyright.clone();

    if let Some(ref url) = config.url {
        info = format!("{}, {}", info, url);
    }

    if let Some(ref email) = config.email {
        info = format!("{} <{}>", info, email);
    }

    info
}

fn build_year_string(config: &LicenseConfig) -> String {
    let current_year = chrono::Local::now().year() as u32;

    if let Some(year) = config.year {
        return year.to_string();
    }

    let start = config.start_year.unwrap_or(current_year);
    let end = config.end_year.unwrap_or(current_year);

    if start == end {
        start.to_string()
    } else {
        format!("{}-{}", start, end)
    }
}

fn generate_license(config: &LicenseConfig, output: &PathBuf) -> Result<()> {
    let mut handlebars = Handlebars::new();

    // Register templates
    handlebars.register_template_string("MIT", MIT_TEMPLATE)?;
    handlebars.register_template_string("ISC", ISC_TEMPLATE)?;

    let template_name = config.license.to_uppercase();

    if !handlebars.has_template(&template_name) {
        anyhow::bail!(
            "不支持的许可证类型 \"{}\"。目前支持: MIT, ISC",
            config.license
        );
    }

    let copyright_info = build_copyright_info(config);
    let year_string = build_year_string(config);

    let mut data = HashMap::new();
    data.insert("copyright", copyright_info.clone());
    data.insert("year", year_string.clone());

    let rendered = handlebars.render(&template_name, &data)?;

    fs::write(output, rendered.trim())
        .with_context(|| format!("无法写入文件: {}", output.display()))?;

    println!("✓ LICENSE 文件已成功生成: {}", output.display());
    println!("  许可证类型: {}", config.license);
    println!("  版权信息: {} {}", year_string, copyright_info);

    Ok(())
}

#[tokio::main]
async fn main() -> Result<()> {
    let cli = Cli::parse();

    let mut config = if let Some(ref config_path) = cli.config {
        // Load from YAML file
        load_config_from_yaml(config_path)?
    } else if cli.interactive || cli.name.is_none() {
        // Interactive mode
        if !cli.interactive && cli.name.is_none() {
            println!("未提供版权所有者姓名，启动交互模式...\n");
        }
        get_interactive_input()?
    } else {
        // Use CLI arguments
        LicenseConfig {
            copyright: cli
                .name
                .clone()
                .unwrap_or_else(|| "Copyright Holder".to_string()),
            email: cli.email.clone(),
            url: cli.url.clone(),
            year: cli.year,
            start_year: cli.start_year,
            end_year: cli.end_year,
            license: cli.license.clone(),
            format: None,
            theme: None,
        }
    };

    // Merge CLI arguments with config
    config.merge_with_cli(&cli);

    // Validate copyright
    if config.copyright.is_empty() {
        anyhow::bail!(
            "错误: 必须提供版权所有者姓名。使用 -n 或 --name 参数，或使用 --interactive 模式。"
        );
    }

    // Generate license
    generate_license(&config, &cli.output)?;

    Ok(())
}
