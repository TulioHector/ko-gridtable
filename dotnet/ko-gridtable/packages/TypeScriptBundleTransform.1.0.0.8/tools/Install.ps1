param($installPath, $toolsPath, $package, $project)

$item = $project.ProjectItems.Item("v8").ProjectItems.Item("Noesis.Javascript.x64.dll")
$item.Properties.Item("BuildAction").Value = 0
$item.Properties.Item("CopyToOutputDirectory").Value = 1

$item = $project.ProjectItems.Item("v8").ProjectItems.Item("Noesis.Javascript.x86.dll")
$item.Properties.Item("BuildAction").Value = 0
$item.Properties.Item("CopyToOutputDirectory").Value = 1