#!/usr/bin/env node

import {fileURLToPath} from 'node:url'
import path, {dirname} from 'node:path'
import fs from 'node:fs/promises'
import process from 'node:process'
import readline from 'node:readline'
import {renderFile} from 'ejs'
import {htmlUnescape} from 'escape-goat'
import stripHtml from 'html-text'

const directoryName = dirname(fileURLToPath(import.meta.url))
const currentYear = new Date().getFullYear()

function createReadlineInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })
}

function question(rl, prompt) {
  return new Promise(resolve => {
    rl.question(prompt, answer => {
      resolve(answer)
    })
  })
}

async function getInteractiveInput() {
  const rl = createReadlineInterface()

  console.log('请输入以下信息来生成 LICENSE 文件：\n')

  const copyright = await question(rl, '版权所有者姓名 (必填): ')
  const email = await question(rl, '电子邮件 (可选，按回车跳过): ')
  const url = await question(rl, '个人网站 URL (可选，按回车跳过): ')
  const startYear = await question(rl, `起始年份 (可选，默认为 ${currentYear}): `)
  const endYear = await question(rl, `结束年份 (可选，默认为 ${currentYear}): `)
  const licenseType = await question(rl, '许可证类型 (MIT/ISC，默认为 MIT): ')

  rl.close()

  return {
    copyright: copyright || 'Copyright Holder',
    email: email || null,
    url: url || null,
    startYear: startYear ? Number.parseInt(startYear, 10) : currentYear,
    endYear: endYear ? Number.parseInt(endYear, 10) : currentYear,
    license: (licenseType || 'MIT').toUpperCase(),
  }
}

function parseArgs() {
  const args = process.argv.slice(2)
  const options = {
    copyright: null,
    email: null,
    url: null,
    startYear: currentYear,
    endYear: currentYear,
    license: 'MIT',
    output: './LICENSE',
    interactive: false,
  }

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    const nextArg = args[i + 1]

    switch (arg) {
      case '-n':
      case '--name':
        options.copyright = nextArg
        i++
        break
      case '-e':
      case '--email':
        options.email = nextArg
        i++
        break
      case '-u':
      case '--url':
        options.url = nextArg
        i++
        break
      case '-y':
      case '--year':
        options.startYear = Number.parseInt(nextArg, 10)
        options.endYear = Number.parseInt(nextArg, 10)
        i++
        break
      case '-s':
      case '--start-year':
        options.startYear = Number.parseInt(nextArg, 10)
        i++
        break
      case '--end-year':
        options.endYear = Number.parseInt(nextArg, 10)
        i++
        break
      case '-l':
      case '--license':
        options.license = nextArg.toUpperCase()
        i++
        break
      case '-o':
      case '--output':
        options.output = nextArg
        i++
        break
      case '-i':
      case '--interactive':
        options.interactive = true
        break
      case '-h':
      case '--help':
        showHelp()
        process.exit(0)
      default:
        if (!arg.startsWith('-') && !options.copyright) {
          // Assume it's the copyright name if not provided yet
          options.copyright = arg
        }

        break
    }
  }

  return options
}

function showHelp() {
  console.log(`
MIT License 文件生成器

用法:
  mit-license [选项]
  mit-license -n "Your Name" -y 2024
  mit-license --interactive

选项:
  -n, --name <name>         版权所有者姓名 (必填，除非使用交互模式)
  -e, --email <email>       电子邮件地址 (可选)
  -u, --url <url>          个人网站 URL (可选)
  -y, --year <year>        许可证年份 (默认: ${currentYear})
  -s, --start-year <year>  起始年份 (可选)
  --end-year <year>        结束年份 (可选)
  -l, --license <type>     许可证类型 (MIT 或 ISC，默认: MIT)
  -o, --output <file>      输出文件路径 (默认: ./LICENSE)
  -i, --interactive        交互式模式
  -h, --help              显示帮助信息

示例:
  mit-license -n "张三" -y 2024
  mit-license --name "John Doe" --email "john@example.com" --url "https://example.com"
  mit-license --interactive
  mit-license -n "李四" -s 2020 --end-year 2024 -l ISC
`)
}

async function generateLicense(options) {
  const {copyright, email, url, startYear, endYear, license, output} = options

  if (!copyright) {
    console.error('错误: 必须提供版权所有者姓名。使用 -n 或 --name 参数，或使用 --interactive 模式。')
    process.exit(1)
  }

  // Build copyright info
  let copyrightInfo = copyright
  if (url) {
    copyrightInfo = `${copyright}, ${url}`
  }

  if (email) {
    copyrightInfo += ` <${email}>`
  }

  // Build year range
  let year = startYear
  if (startYear !== endYear) {
    year = `${startYear}-${endYear}`
  }

  const info = `${year} ${copyrightInfo}`

  try {
    // Render the license template
    const templatePath = path.join(directoryName, '..', 'licenses', `${license}.ejs`)
    const content = await renderFile(templatePath, {
      info,
      theme: 'default',
      gravatar: '',
    })

    // Extract text content from the article
    const {articleContent} = content.match(/<article>(?<articleContent>.*)<\/article>/ms).groups
    const licenseText = htmlUnescape(stripHtml(articleContent)).trim()

    // Write to file
    await fs.writeFile(output, licenseText, 'utf8')

    console.log(`✓ LICENSE 文件已成功生成: ${output}`)
    console.log(`  许可证类型: ${license}`)
    console.log(`  版权信息: ${info}`)
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error(`错误: 不支持的许可证类型 "${license}"。目前支持: MIT, ISC`)
    } else {
      console.error('生成 LICENSE 文件时出错:', error.message)
    }

    process.exit(1)
  }
}

async function main() {
  let options = parseArgs()

  if (!options.interactive && !options.copyright) {
    console.log('未提供版权所有者姓名，启动交互模式...\n')
    const interactiveOptions = await getInteractiveInput()
    options = {...options, ...interactiveOptions}
  } else if (options.interactive) {
    const interactiveOptions = await getInteractiveInput()
    options = {...options, ...interactiveOptions}
  }

  await generateLicense(options)
}

main().catch(error => {
  console.error('发生错误:', error)
  process.exit(1)
})
