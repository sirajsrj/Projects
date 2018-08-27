============================Local to BLOB==================================================
#Script to upload files from Local storage to Blob Storage

#Author: Lipsa Das, Chandan Madan Rao Kari

$Location = "West India"
$resourceGroupName = "wipro-rg"
$storageaccountname = "csvuploadsa"

 New-AzureRmStorageAccount -ResourceGroupName $resourceGroupName -AccountName $storageaccountname -Location $Location -SkuName "Standard_GRS"
$storageKeys = Get-AzureRmStorageAccountKey -ResourceGroupName $resourceGroupName -Name $storageaccountname
$StorageAccountKey = $storageKeys.value[0]
$ctx = New-AzureStorageContext -StorageAccountName $storageaccountname -StorageAccountKey $StorageAccountKey
         $ContainerName = "csvuploadsacontainer"
         New-AzureStorageContainer -Name $ContainerName -Context $ctx -Permission Blob
         $localFileDirectory = "D:\CSVUpload\"
         $BlobName = "AccountNew.csv" 
         $localFile = $localFileDirectory + $BlobName 
         Set-AzureStorageBlobContent -File $localFile -Container $ContainerName -Blob $BlobName -Context $ctx