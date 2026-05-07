# Stop the Docker Java backend if it's running
docker stop rentmanagement-backend-java-1 2>$null

# Kill any local process on port 5000 (usually Node backend)
$portProcess = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue
if ($portProcess) {
    Write-Host "Stopping existing process on port 5000 (PID: $($portProcess.OwningProcess))..." -ForegroundColor Yellow
    Stop-Process -Id $portProcess.OwningProcess -Force -ErrorAction SilentlyContinue
}

# Load environment variables from .env
if (Test-Path ".env") {
    Get-Content ".env" | ForEach-Object {
        if ($_ -match "^(?<key>[^#\s][^=]+)=(?<value>.*)$") {
            $key = $Matches.key.Trim()
            if ($key -eq "TZ") { continue } # Skip TZ to avoid Postgres error
            
            $value = $Matches.value.Trim().Trim('"').Trim("'")
            if ($key -eq "DATABASE_URL" -and $value -match "^postgresql://") {
                if ($value -match "postgresql://(?<user>[^:]+):(?<pass>[^@]+)@(?<rest>[^?]+)(?<params>.*)$") {
                    $rest = $Matches.rest
                    $params = $Matches.params
                    if ($params -eq "") { $params = "?" } else { $params += "&" }
                    $value = "jdbc:postgresql://" + $rest + $params + "options=-c%20timezone=UTC"
                } else {
                    $value = $value -replace "^postgresql://", "jdbc:postgresql://"
                }
            }
            Set-Content -Path env:\$key -Value $value
            Write-Host "Set $key"
        }
    }
    Write-Host "Loaded environment variables from .env" -ForegroundColor Green
}

# Go to the Java backend directory
cd apps/backend-java

# Check if Maven is available
$mvnPath = Get-Command mvn -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Definition
if (!$mvnPath) {
    $localMvn = "$PSScriptRoot\tools\maven\apache-maven-3.9.9\bin\mvn.cmd"
    if (Test-Path $localMvn) {
        $mvnPath = $localMvn
        Write-Host "Using local Maven found at $mvnPath" -ForegroundColor Cyan
    } else {
        Write-Host "Maven (mvn) is not found in your PATH or tools directory." -ForegroundColor Red
        Write-Host "Please install Maven or ensure the tools/maven directory exists."
        exit
    }
}

# Set TimeZone for the JVM to avoid Postgres driver issues
$env:MAVEN_OPTS = "-Duser.timezone=UTC"
$env:JAVA_TOOL_OPTIONS = "-Duser.timezone=UTC"

# Run the application
& $mvnPath spring-boot:run
