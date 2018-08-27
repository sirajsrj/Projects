#Download Csv From Blob To Local storage after entering VM

#Author: Lipsa Das, Chandan Madan Rao Kari

#Login to your subscription
Login-AzureRmAccount
#Declare destination
$resourceGroup = "wipro-rg"
$location = "West India"
$storageAccount = Get-AzureRmStorageAccount -ResourceGroupName $resourceGroup -Name "csvuploadsa" 
$ctx = $storageAccount.Context 
Get-AzureStorageBlobContent -Blob "AccountNew.csv" `
-Container "csvuploadsacontainer" `
-Destination "D:\CSVUpload" `
-Context $ctx
 