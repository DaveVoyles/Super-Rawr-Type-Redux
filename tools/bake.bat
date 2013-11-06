@echo off


:: Path to impact.js and your game's main .js

SET IMPACT_LIBRARY= C:\Users\dvoyle200\SkyDrive\Development\web\impact\lib\impact\impact.js


 
SET GAME=C:\Users\dvoyle200\SkyDrive\Development\web\impact\lib\game\main.js


:: Output file
SET OUTPUT_FILE=game.min.js


:: Change CWD to Impact's base dir and bake!
cd C:/Users/dvoyle200/SkyDrive/Development/web/impact

C:\wamp\bin\php\php5.3.13\php.exe tools/bake.php %IMPACT_LIBRARY% %GAME% %OUTPUT_FILE%

pause
