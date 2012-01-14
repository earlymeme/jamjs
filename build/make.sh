#- Versions
CORE_VERSION='01';

#- Compiler path
CLOSURE_PATH='closure_compile.py';

#compile the lib
$CLOSURE_PATH "../src/main.js" "../js/jsgame."$CORE_VERSION".js"

#- ~Result
#closure_compile.py ../src/main.js ../js/jsgame.01.js
# or
#closure_compile.py ..\src\main.js ..\js\jsgame.01.js