# Path to the problematic package
$packagePath = "node_modules\tp-react-native-bluetooth-printer\android\src\main"

# Remove the 'package' attribute from AndroidManifest.xml
(Get-Content "$packagePath\AndroidManifest.xml") | Where-Object { $_ -notmatch 'package="cn.jystudio.bluetooth"' } | Set-Content "$packagePath\AndroidManifest.xml"

# Add 'namespace' in build.gradle
$buildGradle = "$packagePath\..\build.gradle"
if (-not (Select-String -Pattern 'namespace "cn.jystudio.bluetooth"' $buildGradle)) {
    Add-Content $buildGradle 'android {'
    Add-Content $buildGradle '    namespace "cn.jystudio.bluetooth"'
    Add-Content $buildGradle '}'
}

Write-Host "Fix applied: package attribute removed and namespace added."