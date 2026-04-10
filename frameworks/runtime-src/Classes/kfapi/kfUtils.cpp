//
//  kfUtils.cpp
//

#include "kfUtils.h"

#include "scripting/js-bindings/manual/ScriptingCore.h"

void kfapi::kfUtils::cleanScript() {
    ScriptingCore::getInstance()->cleanAllScript();
}
