$ErrorActionPreference = 'Stop'

$packageName = 'auto-mit'
$toolsDir = "$(Split-Path -parent $MyInvocation.MyCommand.Definition)"
$url64 = 'https://github.com/LoopyBrainie/mit-license/releases/download/__VERSION__/auto-mit-x86_64-pc-windows-msvc.zip'

$packageArgs = @{
  packageName    = $packageName
  unzipLocation  = $toolsDir
  url64bit       = $url64
  checksum64     = '__CHECKSUM__'
  checksumType64 = 'sha256'
}

Install-ChocolateyZipPackage @packageArgs
