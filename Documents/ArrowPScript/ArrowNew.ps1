Login-AzureRmAccount

$xl = new-object -comobject excel.application
$xl.visible = $true
$Workbook = $xl.workbooks.open(“C:\Arrow\AccountNew.csv”)
$Worksheets = $Workbooks.worksheets
$Workbook.SaveAs(“C:\Arrow\AccountNew.xls”,1)
$Workbook.Saved = $True
$xl.Quit()

#resource group, location and storage account declaration

$storageaccountname = "arrowsa" `

$file = "C:\Arrow\AccountNew.xls"
$sheetName = "AccountNew"
$objExcel = New-Object -ComObject Excel.Application
$workbook = $objExcel.Workbooks.Open($file)
$sheet = $workbook.Worksheets.Item($sheetName)
$objExcel.Visible=$false
$rowMax = ($sheet.UsedRange.Rows).count
$rowName, $colName= 1,6
$rowPass,$colPass = 1,7
$rowUser, $colUser= 1,8
$rowSubnet, $colSubnet= 1,9
$rowVnet, $colVnet= 1,10
$rowNSG, $colNSG= 1,11
$rowNSGRule, $colNSGRule= 1,12
$rowNic, $colNic= 1,13
$rowComp, $colComp = 1,14
$rowIP, $colIP = 1,15
$a=@()
$b=@()
$c=@()
$d=@()
$e=@()
$f=@()
$g=@()
$h=@()
$i=@()

for ($m=1; $m -le $rowMax-7; $m++)
{
$Name = [string]$sheet.Cells.Item($rowName+$m,$colName).text
[ValidateNotNullOrEmpty()]$Password = $sheet.Cells.Item($rowPass+$m,$colPass).text
$User = [string]$sheet.Cells.Item($rowUser+$m,$colUser).text
$Sub = [string]$sheet.Cells.Item($rowSubnet+$m,$colSubnet).text
$Vnet = [string]$sheet.Cells.Item($rowVnet+$m,$colVnet).text
$NSG = [string]$sheet.Cells.Item($rowNSG+$m,$colNSG).text
$NSGR = [string]$sheet.Cells.Item($rowNSGRule+$m,$colNSGRule).text
$Nic = [string]$sheet.Cells.Item($rowNic+$m,$colNic).text
$Comp = [string]$sheet.Cells.Item($rowComp+$m,$colComp).text
$a += ,$Name
$b += ,$User
$c += ,$Password
$d += ,$Sub
$e += ,$Vnet
$f += ,$NSG
$g += ,$NSGR
$h += ,$Nic
$i += ,$Comp
}
$objExcel.quit()

[System.Reflection.Assembly]::LoadWithPartialName('Microsoft.VisualBasic') | Out-Null
$RG = [Microsoft.VisualBasic.Interaction]::InputBox("Enter a Resource Group name", "Resource Group")

$location = [Microsoft.VisualBasic.Interaction]::InputBox("Enter a Azure Location", "Location")

Stop-AzureRmVM -ResourceGroupName $RG -Name "ArrowVM" -Force
Set-AzureRmVM -ResourceGroupName $RG -Name "ArrowVM" -Generalized
$vm = Get-AzureRmVM -Name "ArrowVM" -ResourceGroupName $RG
$image = New-AzureRmImageConfig -Location $location -SourceVirtualMachineId $vm.ID 
New-AzureRmImage -Image $image -ImageName "Image" -ResourceGroupName $RG

for($n=0; $n -le $rowMax-8;$n++){
$name = $a[$n]
$pass = $c[$n]
$user = $b[$n]
$pass2 = ConvertTo-SecureString -String $pass -AsPlainText -Force
$ArrowCreds = New-Object Management.Automation.PSCredential ($user, $pass2)
$Subnet = $d[$n]
$Vnetwork = $e[$n]
$NSGroup = $f[$n]
$NSGRule = $g[$n]
$Nic1 = $h[$n]
$Computer = $i[$n]


#$ACS = [Microsoft.VisualBasic.Interaction]::InputBox("Enter a ACS", "Key")

#$ACN = [Microsoft.VisualBasic.Interaction]::InputBox("Enter a ACN", "Key")


$subnetConfig = New-AzureRmVirtualNetworkSubnetConfig `
    -Name $Subnet `
    -AddressPrefix 192.168.1.0/24

$vnet = New-AzureRmVirtualNetwork `
    -ResourceGroupName $RG `
    -Location $location `
    -Name $Vnetwork `
    -AddressPrefix 192.168.0.0/16 `
    -Subnet $subnetConfig

$pip = New-AzureRmPublicIpAddress `
    -ResourceGroupName $RG `
    -Location $location `
    -Name "arrowpublicdns$(Get-Random)" `
    -AllocationMethod Static `
    -IdleTimeoutInMinutes 4

  $nsgRuleRDP = New-AzureRmNetworkSecurityRuleConfig `
    -Name $NSGRule `
    -Protocol Tcp `
    -Direction Inbound `
    -Priority 1000 `
    -SourceAddressPrefix * `
    -SourcePortRange * `
    -DestinationAddressPrefix * `
    -DestinationPortRange 80,3002,3389 `
    -Access Allow

  $nsg = New-AzureRmNetworkSecurityGroup `
    -ResourceGroupName $RG `
    -Location $location `
    -Name $NSGroup `
    -SecurityRules $nsgRuleRDP

$nic = New-AzureRmNetworkInterface `
    -Name $Nic1 `
    -ResourceGroupName $RG `
    -Location $location `
    -SubnetId $vnet.Subnets[0].Id `
    -PublicIpAddressId $pip.Id `
    -NetworkSecurityGroupId $nsg.Id

$vmConfig = New-AzureRmVMConfig `
    -VMName $name `
    -VMSize Standard_D1_v2 | Set-AzureRmVMOperatingSystem -Windows `
        -ComputerName $Computer `
        -Credential $ArrowCreds

# Here is where we create a variable to store information about the image
$image = Get-AzureRmImage `
    -ImageName "Image" `
    -ResourceGroupName $RG

# Here is where we specify that we want to create the VM from and image and provide the image ID
$vmConfig = Set-AzureRmVMSourceImage -VM $vmConfig -Id $image.Id

$vmConfig = Add-AzureRmVMNetworkInterface -VM $vmConfig -Id $nic.Id

New-AzureRmVM `
    -ResourceGroupName $RG `
    -Location $location `
    -VM $vmConfig

}
for($p=0; $p -le $rowMax-8;$p++){
Set-AzureRmVMCustomScriptExtension -ResourceGroupName $RG `
    -VMName $a[$p] `
    -Location $Location `
    -FileUri "https://arrowsa.blob.core.windows.net/script/ExScript.ps1" `
    -Run 'ExScript.ps1' `
    -Name DeScriptExtension

}