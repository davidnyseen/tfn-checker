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
dotnet publish -c Release -o ./publish

Compress-Archive -Path ./publish/* -DestinationPath ./publish.zip -Force
az webapp deploy --resource-group $RESOURCE_GROUP --name $APP_NAME --src-path ./publish.zip --type zip

Remove-Item ./publish -Recurse -Force
Remove-Item ./publish.zip -Force
Set-Location -Path ..

Write-Host "API is at: https://$APP_NAME.azurewebsites.net"
