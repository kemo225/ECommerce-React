@echo off
REM Navigate to project directory
cd /d "c:\Users\NVIDIA PLUS\OneDrive - South Valley University\Desktop\React Project 1.worktrees\agents-trips-module-integration-react-ts\reactproject"

echo Creating directories...
echo.

REM Create src/schemas
if exist "src\schemas" (
    echo [EXISTING] src\schemas
) else (
    mkdir "src\schemas"
    echo [CREATED] src\schemas
)

REM Create src/components/forms
if exist "src\components\forms" (
    echo [EXISTING] src\components\forms
) else (
    mkdir "src\components\forms"
    echo [CREATED] src\components\forms
)

REM Create src/components/ui
if exist "src\components\ui" (
    echo [EXISTING] src\components\ui
) else (
    mkdir "src\components\ui"
    echo [CREATED] src\components\ui
)

REM Create src/utils
if exist "src\utils" (
    echo [EXISTING] src\utils
) else (
    mkdir "src\utils"
    echo [CREATED] src\utils
)

REM Create src/pages/AdminDashboard/TripsAdmin/CreateTrip
if exist "src\pages\AdminDashboard\TripsAdmin\CreateTrip" (
    echo [EXISTING] src\pages\AdminDashboard\TripsAdmin\CreateTrip
) else (
    mkdir "src\pages\AdminDashboard\TripsAdmin\CreateTrip"
    echo [CREATED] src\pages\AdminDashboard\TripsAdmin\CreateTrip
)

REM Create src/pages/AdminDashboard/TripsAdmin/EditTrip
if exist "src\pages\AdminDashboard\TripsAdmin\EditTrip" (
    echo [EXISTING] src\pages\AdminDashboard\TripsAdmin\EditTrip
) else (
    mkdir "src\pages\AdminDashboard\TripsAdmin\EditTrip"
    echo [CREATED] src\pages\AdminDashboard\TripsAdmin\EditTrip
)

echo.
echo Directory creation complete.
pause
