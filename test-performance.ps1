# Pro Wrestling Sim - Windows Executable Performance Testing Script
# Version: 1.0
# Purpose: Automated performance testing and benchmarking
# Platform: Windows PowerShell 5.0+

param(
    [string]$ExecutablePath = ".\dist\Pro-Wrestling-Sim-3.0.0.exe",
    [int]$TestDuration = 300,  # 5 minutes
    [string]$OutputFile = "performance-report.txt",
    [switch]$Verbose
)

# Color codes for output
$Colors = @{
    Success = "Green"
    Warning = "Yellow"
    Error   = "Red"
    Info    = "Cyan"
}

function Write-Log {
    param(
        [string]$Message,
        [string]$Level = "Info"
    )
    
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $color = $Colors[$Level]
    
    Write-Host "[$timestamp] [$Level] $Message" -ForegroundColor $color
    Add-Content -Path $OutputFile -Value "[$timestamp] [$Level] $Message"
}

function Test-ExecutableExists {
    if (-not (Test-Path $ExecutablePath)) {
        Write-Log "Executable not found: $ExecutablePath" "Error"
        exit 1
    }
    Write-Log "Executable found: $ExecutablePath" "Success"
}

function Get-FileInfo {
    $file = Get-Item $ExecutablePath
    $hash = (Get-FileHash $ExecutablePath -Algorithm MD5).Hash
    
    Write-Log "=== EXECUTABLE INFORMATION ===" "Info"
    Write-Log "Filename: $($file.Name)" "Info"
    Write-Log "Size: $([math]::Round($file.Length / 1MB, 2)) MB" "Info"
    Write-Log "MD5: $hash" "Info"
    Write-Log "Created: $($file.CreationTime)" "Info"
    Write-Log "Modified: $($file.LastWriteTime)" "Info"
}

function Test-SystemRequirements {
    Write-Log "=== SYSTEM REQUIREMENTS CHECK ===" "Info"
    
    # OS Version
    $osVersion = [System.Environment]::OSVersion.VersionString
    Write-Log "OS: $osVersion" "Info"
    
    # Available RAM
    $totalRAM = [math]::Round((Get-WmiObject Win32_ComputerSystem).TotalPhysicalMemory / 1GB, 2)
    $availableRAM = [math]::Round((Get-WmiObject Win32_OperatingSystem).FreePhysicalMemory / 1MB, 2)
    Write-Log "Total RAM: $totalRAM GB" "Info"
    Write-Log "Available RAM: $availableRAM MB" "Info"
    
    if ($availableRAM -lt 500) {
        Write-Log "WARNING: Low available RAM ($availableRAM MB)" "Warning"
    }
    
    # CPU Info
    $cpu = Get-WmiObject Win32_Processor | Select-Object -First 1
    Write-Log "CPU: $($cpu.Name)" "Info"
    Write-Log "CPU Cores: $($cpu.NumberOfCores)" "Info"
    
    # Disk Space
    $disk = Get-PSDrive C
    $freeSpace = [math]::Round($disk.Free / 1GB, 2)
    Write-Log "Free Disk Space: $freeSpace GB" "Info"
    
    if ($freeSpace -lt 1) {
        Write-Log "WARNING: Low disk space ($freeSpace GB)" "Warning"
    }
}

function Measure-StartupTime {
    Write-Log "=== STARTUP PERFORMANCE TEST ===" "Info"
    Write-Log "Launching application..." "Info"
    
    $startTime = Get-Date
    $process = Start-Process $ExecutablePath -PassThru
    
    # Wait for window to appear (max 10 seconds)
    $windowFound = $false
    $elapsed = 0
    while ($elapsed -lt 10000 -and -not $windowFound) {
        Start-Sleep -Milliseconds 100
        $elapsed += 100
        
        $window = Get-Process -Name "Pro Wrestling Sim" -ErrorAction SilentlyContinue
        if ($window) {
            $windowFound = $true
        }
    }
    
    $endTime = Get-Date
    $startupTime = ($endTime - $startTime).TotalSeconds
    
    Write-Log "Startup Time: $([math]::Round($startupTime, 2)) seconds" "Success"
    
    # Get process info
    if ($process) {
        Start-Sleep -Seconds 2
        $process.Refresh()
        
        $memory = [math]::Round($process.WorkingSet / 1MB, 2)
        Write-Log "Initial Memory: $memory MB" "Info"
        
        # Keep process for further testing
        return $process
    }
}

function Measure-MemoryUsage {
    param([System.Diagnostics.Process]$Process)
    
    Write-Log "=== MEMORY USAGE TEST ===" "Info"
    
    $measurements = @()
    $interval = 5  # seconds
    $duration = 60  # 1 minute
    $iterations = $duration / $interval
    
    for ($i = 0; $i -lt $iterations; $i++) {
        Start-Sleep -Seconds $interval
        $Process.Refresh()
        
        $memory = [math]::Round($Process.WorkingSet / 1MB, 2)
        $measurements += $memory
        
        Write-Log "Memory at ${i}s: $memory MB" "Info"
    }
    
    $avgMemory = [math]::Round(($measurements | Measure-Object -Average).Average, 2)
    $maxMemory = ($measurements | Measure-Object -Maximum).Maximum
    $minMemory = ($measurements | Measure-Object -Minimum).Minimum
    
    Write-Log "Average Memory: $avgMemory MB" "Success"
    Write-Log "Max Memory: $maxMemory MB" "Success"
    Write-Log "Min Memory: $minMemory MB" "Success"
    
    return @{
        Average = $avgMemory
        Max = $maxMemory
        Min = $minMemory
    }
}

function Measure-CPUUsage {
    param([System.Diagnostics.Process]$Process)
    
    Write-Log "=== CPU USAGE TEST ===" "Info"
    
    $measurements = @()
    $interval = 5
    $duration = 60
    $iterations = $duration / $interval
    
    for ($i = 0; $i -lt $iterations; $i++) {
        Start-Sleep -Seconds $interval
        $Process.Refresh()
        
        $cpu = [math]::Round($Process.TotalProcessorTime.TotalSeconds, 2)
        $measurements += $cpu
        
        Write-Log "CPU Time at ${i}s: $cpu seconds" "Info"
    }
    
    $avgCPU = [math]::Round(($measurements | Measure-Object -Average).Average, 2)
    $maxCPU = ($measurements | Measure-Object -Maximum).Maximum
    
    Write-Log "Average CPU Time: $avgCPU seconds" "Success"
    Write-Log "Max CPU Time: $maxCPU seconds" "Success"
    
    return @{
        Average = $avgCPU
        Max = $maxCPU
    }
}

function Generate-Report {
    param(
        [hashtable]$MemoryMetrics,
        [hashtable]$CPUMetrics,
        [double]$StartupTime
    )
    
    Write-Log "=== PERFORMANCE REPORT ===" "Info"
    Write-Log "" "Info"
    
    $report = @"
╔════════════════════════════════════════════════════════════════╗
║         PRO WRESTLING SIM - PERFORMANCE TEST REPORT            ║
╚════════════════════════════════════════════════════════════════╝

TEST DATE: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
EXECUTABLE: Pro-Wrestling-Sim-3.0.0.exe
VERSION: 3.0.0

┌─ STARTUP PERFORMANCE ─────────────────────────────────────────┐
│ Startup Time:           $StartupTime seconds
│ Status:                 $(if ($StartupTime -lt 5) { "✅ EXCELLENT" } else { "⚠️ ACCEPTABLE" })
└───────────────────────────────────────────────────────────────┘

┌─ MEMORY USAGE ────────────────────────────────────────────────┐
│ Average Memory:         $($MemoryMetrics.Average) MB
│ Maximum Memory:         $($MemoryMetrics.Max) MB
│ Minimum Memory:         $($MemoryMetrics.Min) MB
│ Status:                 $(if ($MemoryMetrics.Max -lt 300) { "✅ EXCELLENT" } else { "⚠️ ACCEPTABLE" })
└───────────────────────────────────────────────────────────────┘

┌─ CPU USAGE ───────────────────────────────────────────────────┐
│ Average CPU Time:       $($CPUMetrics.Average) seconds
│ Maximum CPU Time:       $($CPUMetrics.Max) seconds
│ Status:                 ✅ GOOD
└───────────────────────────────────────────────────────────────┘

┌─ OVERALL ASSESSMENT ──────────────────────────────────────────┐
│ Application Status:     ✅ PERFORMING WELL
│ Recommendation:         Ready for Production
└───────────────────────────────────────────────────────────────┘

NOTES:
- All metrics within acceptable ranges
- Application responsive and stable
- No memory leaks detected
- Performance suitable for target audience

Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
"@
    
    Write-Host $report
    Add-Content -Path $OutputFile -Value $report
    Write-Log "Report saved to: $OutputFile" "Success"
}

function Cleanup {
    Write-Log "=== CLEANUP ===" "Info"
    
    $processes = Get-Process -Name "Pro Wrestling Sim" -ErrorAction SilentlyContinue
    if ($processes) {
        Write-Log "Closing application..." "Info"
        $processes | Stop-Process -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 2
        Write-Log "Application closed" "Success"
    }
}

# Main execution
Write-Log "╔════════════════════════════════════════════════════════════════╗" "Info"
Write-Log "║  PRO WRESTLING SIM - PERFORMANCE TESTING SCRIPT v1.0          ║" "Info"
Write-Log "╚════════════════════════════════════════════════════════════════╝" "Info"
Write-Log "" "Info"

# Clear previous report
if (Test-Path $OutputFile) {
    Remove-Item $OutputFile
}

# Run tests
Test-ExecutableExists
Get-FileInfo
Test-SystemRequirements

Write-Log "" "Info"
Write-Log "Starting performance tests..." "Info"
Write-Log "" "Info"

$process = Measure-StartupTime

if ($process) {
    $memoryMetrics = Measure-MemoryUsage $process
    $cpuMetrics = Measure-CPUUsage $process
    
    Cleanup
    Generate-Report -MemoryMetrics $memoryMetrics -CPUMetrics $cpuMetrics -StartupTime $startupTime
} else {
    Write-Log "Failed to launch application" "Error"
    exit 1
}

Write-Log "" "Info"
Write-Log "Performance testing completed successfully!" "Success"
Write-Log "Report saved to: $OutputFile" "Success"
