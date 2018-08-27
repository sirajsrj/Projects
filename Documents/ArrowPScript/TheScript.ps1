Install-WindowsFeature -name Web-Server -IncludeManagementTools
Set-NetFirewallProfile -Profile Domain,Public,Private -Enabled False

write-host "==Fetching api key and code from CSV=="

 $csv=Import-Csv C:\Arrow\Documents\ArrowPScript\AccountNew.csv
 $csv| ForEach-Object {
      $name = $_."Computer"
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


$path = "C:\Arrow\src\constants\ipconfig.json"
$myJSONContent = Get-Content $path | ConvertFrom-Json
$myJSONContent.value[0].IP = Invoke-RestMethod http://ipinfo.io/json | Select -exp ip
ConvertTo-Json -InputObject $myJSONContent | set-content $path

cd\
cd Arrow

npm run build
npm start