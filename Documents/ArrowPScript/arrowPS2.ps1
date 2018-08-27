
# Author: SirajAnand@WiproDigital

#Disabling Self Signed Certificates

function Ignore-SelfSignedCerts
{
try
{
Write-Host "Adding TrustAllCertsPolicy type." -ForegroundColor White
Add-Type -TypeDefinition @"
using System.Net;
using System.Security.Cryptography.X509Certificates;
public class TrustAllCertsPolicy : ICertificatePolicy
{
public bool CheckValidationResult(
ServicePoint srvPoint, X509Certificate certificate,
WebRequest request, int certificateProblem)
{
return true;
}
}
"@
Write-Host "TrustAllCertsPolicy type added." -ForegroundColor White
}
catch
{
Write-Host $_ -ForegroundColor "Yellow"
}
[System.Net.ServicePointManager]::CertificatePolicy = New-Object TrustAllCertsPolicy
}
Ignore-SelfSignedCerts;

[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12;

# nodejs
$version = "8.9.4-x64"
$url = "https://nodejs.org/dist/v8.9.4/node-v$version.msi"

# git
$git_version = "2.9.2"
$git_url = "https://github.com/git-for-windows/git/releases/download/v$git_version.windows.1/Git-$git_version-64-bit.exe"

# npm packages
$gulp_version = ">=1.2.2 <1.3.0"

# extras
$vsc_exe = "$PSScriptRoot\vsc.exe"
$vsc_url = "https://go.microsoft.com/fwlink/?LinkID=623230"


# activate / desactivate any install
$install_node = $TRUE
$install_git = $TRUE
$install_gulp = $TRUE
$install_jspm = $TRUE
$install_eslint = $TRUE

write-host "`n----------------------------"
write-host " system requirements checking  "
write-host "----------------------------`n"

### require administator rights

if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
   write-Warning "This setup needs admin permissions. Please run this file as admin."
   break
}

### nodejs version check

if (Get-Command node -errorAction SilentlyContinue) {
    $current_version = (node -v)
}

if ($current_version) {
    write-host "[NODE] nodejs $current_version already installed"
    $confirmation = read-host "Are you sure you want to replace this version ? [y/N]"
    if ($confirmation -ne "y") {
        $install_node = $FALSE
    }
}

write-host "`n"

### git install

if ($install_git) {
    if (Get-Command git -errorAction SilentlyContinue) {
        $git_current_version = (git --version)
    }

    if ($git_current_version) {
        write-host "[GIT] $git_current_version detected. Proceeding ..."
    } else {
        $git_exe = "$PSScriptRoot\git-installer.exe"

        write-host "No git version dectected"

        $download_git = $TRUE

        if (Test-Path $git_exe) {
            $confirmation = read-host "Local git install file detected. Do you want to use it ? [Y/n]"
            if ($confirmation -eq "n") {
                $download_git = $FALSE
            }
        }

        if ($download_git) {
            write-host "downloading the git for windows installer"

            $start_time = Get-Date
            $wc = New-Object System.Net.WebClient
            $wc.DownloadFile($git_url, $git_exe)
            write-Output "git installer downloaded"
            write-Output "Time taken: $((Get-Date).Subtract($start_time).Seconds) second(s)"
        }

        write-host "proceeding with git install ..."
        write-host "running $git_exe"
        start-Process $git_exe -Wait
        write-host "git installation done"
    }
}


if ($install_node) {

    ### download nodejs msi file
    # warning : if a node.msi file is already present in the current folder, this script will simply use it

    write-host "`n----------------------------"
    write-host "  nodejs msi file retrieving  "
    write-host "----------------------------`n"

    $filename = "node.msi"
    $node_msi = "$PSScriptRoot\$filename"

    $download_node = $TRUE

    if (Test-Path $node_msi) {
        $confirmation = read-host "Local $filename file detected. Do you want to use it ? [Y/n]"
        if ($confirmation -eq "n") {
            $download_node = $FALSE
        }
    }

    if ($download_node) {
        write-host "[NODE] downloading nodejs install"
        write-host "url : $url"
        $start_time = Get-Date
        $wc = New-Object System.Net.WebClient
        $wc.DownloadFile($url, $node_msi)
        write-Output "$filename downloaded"
        write-Output "Time taken: $((Get-Date).Subtract($start_time).Seconds) second(s)"
    } else {
        write-host "using the existing node.msi file"
    }

    ### nodejs install

    write-host "`n----------------------------"
    write-host " nodejs installation  "
    write-host "----------------------------`n"

    write-host "[NODE] running $node_msi"
    Start-Process $node_msi -Wait

    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

} else {
    write-host "Proceeding with the previously installed nodejs version ..."
}

### npm packages install

write-host "`n----------------------------"
write-host " npm packages installation  "
write-host "----------------------------`n"

if (Get-Command gulp -errorAction SilentlyContinue) {
    $gulp_prev_v = (gulp -v)
}

if ($gulp_prev_v) {
    write-host "[GULP] Gulp is already installed :"
    write-host $gulp_prev_v

    $confirmation = read-host "Are you sure you want to replace this version ? [y/N]"
    if ($confirmation -ne "y") {
        $install_gulp = $FALSE
    }
}

if ($install_gulp) {
    write-host "Installing gulp-cli"
    npm install --global gulp-cli@"$gulp_version"
}

if (Get-Command jspm -errorAction SilentlyContinue) {
    $jspm_prev_v = (jspm -v)
}

if ($jspm_prev_v) {
    write-host "[JSPM] jspm is already installed :"
    write-host $jspm_prev_v

    $confirmation = read-host "Are you sure you want to replace this version ? [y/N]"
    if ($confirmation -ne "y") {
        $install_jspm = $FALSE
    }
}

if ($install_jspm) {
    write-host "Installing jspm globally"
    npm install --global jspm
}


if (Get-Command eslint -errorAction SilentlyContinue) {
    $eslint_prev_v = (eslint -v)
}

if ($eslint_prev_v) {
    write-host "[ESLINT] eslint is already installed :"
    write-host $eslint_prev_v

    $confirmation = read-host "Are you sure you want to replace this version ? [y/N]"
    if ($confirmation -ne "y") {
        $install_eslint = $FALSE
    }
}

if ($install_eslint) {
    write-host "Installing eslint globally"
    npm install --global eslint
}

### extras

write-host "`n----------------------------"
write-host " extra tools "
write-host "----------------------------`n"

$confirmation = read-host "[VSC] Do you want to install VS Code ? [y/N]"
if ($confirmation -eq "y") {

    $download_vsc = $TRUE

    if (Test-Path $vsc_exe) {
        $confirmation = read-host "Local VS Code install file detected. Do you want to use it ? [Y/n]"
        if ($confirmation -eq "n") {
            $download_vsc = $FALSE
        }
    }

    if ($download_vsc) {
        $start_time = Get-Date
        $wc = New-Object System.Net.WebClient
        $wc.DownloadFile($vsc_url, $vsc_exe)
        write-Output "Visual Studio Code installer downloaded"
        write-Output "Time taken: $((Get-Date).Subtract($start_time).Seconds) second(s)"
    }

    write-host "starting VSC install ..."
    Start-Process $vsc_exe -Wait
    write-host "VSC installed !"
}

### clean

write-host "`n----------------------------"
write-host " system cleaning "
write-host "----------------------------`n"

$confirmation = read-host "Delete install files ? [y/N]"
if ($confirmation -eq "y") {
    if ($node_msi -and (Test-Path $node_msi)) {
        rm $node_msi
    }
    if ($git_exe -and (Test-Path $git_exe)) {
        rm $git_exe
    }
    if ($vsc_exe -and (Test-Path $vsc_exe)) {
        rm $vsc_exe
    }
}

$LocalTempDir = $env:TEMP; $ChromeInstaller = "ChromeInstaller.exe"; (new-object System.Net.WebClient).DownloadFile('http://dl.google.com/chrome/install/375.126/chrome_installer.exe', "$LocalTempDir\$ChromeInstaller"); & "$LocalTempDir\$ChromeInstaller" /silent /install; $Process2Monitor =  "ChromeInstaller"; Do { $ProcessesFound = Get-Process | ?{$Process2Monitor -contains $_.Name} | Select-Object -ExpandProperty Name; If ($ProcessesFound) { "Still running: $($ProcessesFound -join ', ')" | Write-Host; Start-Sleep -Seconds 2 } else { rm "$LocalTempDir\$ChromeInstaller" -ErrorAction SilentlyContinue -Verbose } } Until (!$ProcessesFound)

function Download-Json {

param ([string] $url)

  $downloader = new-object System.Net.WebClient

  , $downloader.DownloadString($url) |ConvertFrom-Json

}

function Download-File {

param ([string] $url, [string] $file)

  $downloader = new-object System.Net.WebClient

  , $downloader.DownloadFile($url, $file)

}

$PBIExe = "C:\Program Files\Microsoft Power BI Desktop\bin\PBIDesktop.exe"

$install = $false

$PBIConfig = Download-Json "http://download.microsoft.com/download/9/B/A/9BAEFFEF-1A68-4102-8CDF-5D28BFFE6A61/PBIDesignerConfig.json"

   

if (test-path $PBIExe) {

    $installedVersion = [version]$(gi $PBIExe).VersionInfo.FileVersion

 

    $currentVersion = [version]$($PBIConfig.release.x64 | where {$_.key -eq "ClientUpdateVersion"}).value

    if ($currentVersion.Major -gt $installedVersion.Major -or$currentVersion.Minor -gt $installedVersion.Minor -or $currentVersion.Build -gt $installedVersion.Build) {$install=$true}

}

else{$install=$true}

 

if ($install){

    $msiPath = "$env:temp\PowerBI.msi"

  

    $download=$true

    if (test-path $msiPath ){

        #Code to check if one needs to download the msi

    }

 

    if ($download){Download-File 'http://go.microsoft.com/fwlink/?LinkID=521662' $msiPath}

   

    msiexec /i $msiPath ACCEPT_EULA=1 /passive }

write-host "Done !"

#setting configuration

write-host "==Setting git configuration=="

git config --global user.name 'arrow'
git config --global user.email 'sean@arrow.com'
git config --global push.default simple
Install-Module -Name posh-git -Force
Get-Module -Name posh-git -ListAvailable
Set-Location -Path $env:SystemDrive\
Clear-Host
$Error.Clear()

#getting git module

write-host "==Install git module to VM=="

Import-Module -Name posh-git -ErrorAction SilentlyContinue
if (-not($Error[0])) {
    $DefaultTitle = $Host.UI.RawUI.WindowTitle
    $GitPromptSettings.BeforeText = '('
    $GitPromptSettings.BeforeForegroundColor = [ConsoleColor]::Cyan
    $GitPromptSettings.AfterText = ')'
    $GitPromptSettings.AfterForegroundColor = [ConsoleColor]::Cyan
    function prompt {
        if (-not(Get-GitDirectory)) {
            $Host.UI.RawUI.WindowTitle = $DefaultTitle
            "PS $($executionContext.SessionState.Path.CurrentLocation)$('>' * ($nestedPromptLevel + 1)) "
        }
        else {
            $realLASTEXITCODE = $LASTEXITCODE
            Write-Host 'PS ' -ForegroundColor Green -NoNewline
            Write-Host "$($executionContext.SessionState.Path.CurrentLocation) " -ForegroundColor Yellow -NoNewline
            Write-VcsStatus
            $LASTEXITCODE = $realLASTEXITCODE
            return "`n$('$' * ($nestedPromptLevel + 1)) "
        }
    }
}
else {
    Write-Warning -Message 'Unable to load the Posh-Git PowerShell Module'
}

#git clone

write-host "==Cloning custom application=="

git clone https://git.arrowconnect.io/kronos/ms-miramonti.git Arrow -q
Set-Location -Path .\


#reading csv file
write-host "==Fetching api key and code from CSV=="

 $csv=Import-Csv C:\Arrow\Documents\ArrowPScript\AccountNew.csv
 $csv| ForEach-Object {
      $name = $_."VM Name"
      $new = $env:COMPUTERNAME
   if($name -eq $new){
      $code =  $_."code"
      $apiKey = $_."apiKey"
      $tenantKey = $_."TenantKey"}
 }



#path too config file

write-host "==Editing config file by user-apikey and others=="

$pathToJson = "C:\Arrow\config\config.json"
$myJSONContent = Get-Content $pathToJson | ConvertFrom-Json
$myJSONContent.value[0].API_KEY = $apiKey
$myJSONContent.value[0].APP_CODE = $code
$myJSONContent.value[0].TENANT_KEY = $tenantKey
ConvertTo-Json -InputObject $myJSONContent | set-content $pathToJson

cd Arrow

write-host "Installing npm on application"
npm install
#starting the application
npm start
