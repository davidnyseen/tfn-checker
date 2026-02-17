$RESOURCE_GROUP = "tfn-checker-rg"
$LOCATION = "australiaeast"
$APP_NAME = "tfn-checker-api"
$GITHUB_USERNAME = "davidnyseen"

az login

az group create --name $RESOURCE_GROUP --location $LOCATION

az deployment group create `
  --resource-group $RESOURCE_GROUP `
  --template-file ./infra/main.bicep `
  --parameters appName=$APP_NAME `
  --parameters allowedOrigin="https://$GITHUB_USERNAME.github.io"

Set-Location -Path ./api

# Clean up any leftover artifacts from previous runs
Remove-Item -Path ./publish -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path ./publish.zip -Force -ErrorAction SilentlyContinue

dotnet publish -c Release -o ./publish

# Create zip with forward slashes (required for Linux/rsync on Azure)
Add-Type -Assembly System.IO.Compression.FileSystem
$publishPath = (Resolve-Path ./publish).Path
$zipPath = (Resolve-Path .).Path + "/publish.zip"
$zip = [System.IO.Compression.ZipFile]::Open($zipPath, [System.IO.Compression.ZipArchiveMode]::Create)
Get-ChildItem -Path $publishPath -Recurse -File | ForEach-Object {
    $entryName = $_.FullName.Substring($publishPath.Length + 1).Replace('\', '/')
    [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $_.FullName, $entryName)
}
$zip.Dispose()

az webapp deploy --resource-group $RESOURCE_GROUP --name $APP_NAME --src-path ./publish.zip --type zip

Remove-Item ./publish -Recurse -Force
Remove-Item ./publish.zip -Force
Set-Location -Path ..

Write-Host "API is at: https://$APP_NAME.azurewebsites.net"
