#include "jsb_kfapi_auto.hpp"
#include "scripting/js-bindings/manual/cocos2d_specifics.hpp"
#include "Sprite64.h"
#include "TextureHelper.h"
#include "kfUtils.h"

template<class T>
static bool dummy_constructor(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS_ReportError(cx, "Constructor for the requested class is not available, please refer to the API reference.");
    return false;
}

static bool empty_constructor(JSContext *cx, uint32_t argc, jsval *vp) {
    return false;
}

static bool js_is_native_obj(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    args.rval().setBoolean(true);
    return true;
}
JSClass  *jsb_kfapi_Sprite64_class;
JSObject *jsb_kfapi_Sprite64_prototype;

bool js_kfapi_Sprite64_initWithBase64(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    kfapi::Sprite64* cobj = (kfapi::Sprite64 *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_kfapi_Sprite64_initWithBase64 : Invalid Native Object");
    if (argc == 1) {
        std::string arg0;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_kfapi_Sprite64_initWithBase64 : Error processing arguments");
        bool ret = cobj->initWithBase64(arg0);
        JS::RootedValue jsret(cx);
        jsret = BOOLEAN_TO_JSVAL(ret);
        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "js_kfapi_Sprite64_initWithBase64 : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_kfapi_Sprite64_constructor(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    std::string arg0;
    ok &= jsval_to_std_string(cx, args.get(0), &arg0);
    JSB_PRECONDITION2(ok, cx, false, "js_kfapi_Sprite64_constructor : Error processing arguments");
    kfapi::Sprite64* cobj = new (std::nothrow) kfapi::Sprite64(arg0);

    js_type_class_t *typeClass = js_get_type_from_native<kfapi::Sprite64>(cobj);

    // link the native object with the javascript object
    JS::RootedObject jsobj(cx, jsb_ref_create_jsobject(cx, cobj, typeClass, "witch::Sprite64"));
    args.rval().set(OBJECT_TO_JSVAL(jsobj));
    if (JS_HasProperty(cx, jsobj, "_ctor", &ok) && ok)
        ScriptingCore::getInstance()->executeFunctionWithOwner(OBJECT_TO_JSVAL(jsobj), "_ctor", args);
    return true;
}


extern JSObject *jsb_cocos2d_Sprite_prototype;

void js_register_kfapi_Sprite64(JSContext *cx, JS::HandleObject global) {
    jsb_kfapi_Sprite64_class = (JSClass *)calloc(1, sizeof(JSClass));
    jsb_kfapi_Sprite64_class->name = "Sprite64";
    jsb_kfapi_Sprite64_class->addProperty = JS_PropertyStub;
    jsb_kfapi_Sprite64_class->delProperty = JS_DeletePropertyStub;
    jsb_kfapi_Sprite64_class->getProperty = JS_PropertyStub;
    jsb_kfapi_Sprite64_class->setProperty = JS_StrictPropertyStub;
    jsb_kfapi_Sprite64_class->enumerate = JS_EnumerateStub;
    jsb_kfapi_Sprite64_class->resolve = JS_ResolveStub;
    jsb_kfapi_Sprite64_class->convert = JS_ConvertStub;
    jsb_kfapi_Sprite64_class->flags = JSCLASS_HAS_RESERVED_SLOTS(2);

    static JSPropertySpec properties[] = {
        JS_PS_END
    };

    static JSFunctionSpec funcs[] = {
        JS_FN("initWithBase64", js_kfapi_Sprite64_initWithBase64, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JSFunctionSpec *st_funcs = NULL;

    JS::RootedObject parent_proto(cx, jsb_cocos2d_Sprite_prototype);
    jsb_kfapi_Sprite64_prototype = JS_InitClass(
        cx, global,
        parent_proto,
        jsb_kfapi_Sprite64_class,
        js_kfapi_Sprite64_constructor, 0, // constructor
        properties,
        funcs,
        NULL, // no static properties
        st_funcs);

    JS::RootedObject proto(cx, jsb_kfapi_Sprite64_prototype);
    JS::RootedValue className(cx, std_string_to_jsval(cx, "Sprite64"));
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::TrueHandleValue);
    // add the proto and JSClass to the type->js info hash table
    jsb_register_class<kfapi::Sprite64>(cx, jsb_kfapi_Sprite64_class, proto, parent_proto);
}

JSClass  *jsb_kfapi_TextureHelper_class;
JSObject *jsb_kfapi_TextureHelper_prototype;

bool js_kfapi_TextureHelper_loadImg(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    if (argc == 2) {
        std::string arg0;
        std::string arg1;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        ok &= jsval_to_std_string(cx, args.get(1), &arg1);
        JSB_PRECONDITION2(ok, cx, false, "js_kfapi_TextureHelper_loadImg : Error processing arguments");

        cocos2d::Texture2D* ret = kfapi::TextureHelper::loadImg(arg0, arg1);
        jsval jsret = JSVAL_NULL;
        if (ret) {
        jsret = OBJECT_TO_JSVAL(js_get_or_create_jsobject<cocos2d::Texture2D>(cx, (cocos2d::Texture2D*)ret));
    } else {
        jsret = JSVAL_NULL;
    };
        args.rval().set(jsret);
        return true;
    }
    JS_ReportError(cx, "js_kfapi_TextureHelper_loadImg : wrong number of arguments");
    return false;
}


void js_register_kfapi_TextureHelper(JSContext *cx, JS::HandleObject global) {
    jsb_kfapi_TextureHelper_class = (JSClass *)calloc(1, sizeof(JSClass));
    jsb_kfapi_TextureHelper_class->name = "TextureHelper";
    jsb_kfapi_TextureHelper_class->addProperty = JS_PropertyStub;
    jsb_kfapi_TextureHelper_class->delProperty = JS_DeletePropertyStub;
    jsb_kfapi_TextureHelper_class->getProperty = JS_PropertyStub;
    jsb_kfapi_TextureHelper_class->setProperty = JS_StrictPropertyStub;
    jsb_kfapi_TextureHelper_class->enumerate = JS_EnumerateStub;
    jsb_kfapi_TextureHelper_class->resolve = JS_ResolveStub;
    jsb_kfapi_TextureHelper_class->convert = JS_ConvertStub;
    jsb_kfapi_TextureHelper_class->flags = JSCLASS_HAS_RESERVED_SLOTS(2);

    static JSPropertySpec properties[] = {
        JS_PS_END
    };

    static JSFunctionSpec funcs[] = {
        JS_FS_END
    };

    static JSFunctionSpec st_funcs[] = {
        JS_FN("loadImg", js_kfapi_TextureHelper_loadImg, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    jsb_kfapi_TextureHelper_prototype = JS_InitClass(
        cx, global,
        JS::NullPtr(),
        jsb_kfapi_TextureHelper_class,
        dummy_constructor<kfapi::TextureHelper>, 0, // no constructor
        properties,
        funcs,
        NULL, // no static properties
        st_funcs);

    JS::RootedObject proto(cx, jsb_kfapi_TextureHelper_prototype);
    JS::RootedValue className(cx, std_string_to_jsval(cx, "TextureHelper"));
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::FalseHandleValue);
    // add the proto and JSClass to the type->js info hash table
    jsb_register_class<kfapi::TextureHelper>(cx, jsb_kfapi_TextureHelper_class, proto, JS::NullPtr());
}

JSClass  *jsb_kfapi_kfUtils_class;
JSObject *jsb_kfapi_kfUtils_prototype;

bool js_kfapi_kfUtils_cleanScript(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    if (argc == 0) {
        kfapi::kfUtils::cleanScript();
        args.rval().setUndefined();
        return true;
    }
    JS_ReportError(cx, "js_kfapi_kfUtils_cleanScript : wrong number of arguments");
    return false;
}


void js_register_kfapi_kfUtils(JSContext *cx, JS::HandleObject global) {
    jsb_kfapi_kfUtils_class = (JSClass *)calloc(1, sizeof(JSClass));
    jsb_kfapi_kfUtils_class->name = "kfUtils";
    jsb_kfapi_kfUtils_class->addProperty = JS_PropertyStub;
    jsb_kfapi_kfUtils_class->delProperty = JS_DeletePropertyStub;
    jsb_kfapi_kfUtils_class->getProperty = JS_PropertyStub;
    jsb_kfapi_kfUtils_class->setProperty = JS_StrictPropertyStub;
    jsb_kfapi_kfUtils_class->enumerate = JS_EnumerateStub;
    jsb_kfapi_kfUtils_class->resolve = JS_ResolveStub;
    jsb_kfapi_kfUtils_class->convert = JS_ConvertStub;
    jsb_kfapi_kfUtils_class->flags = JSCLASS_HAS_RESERVED_SLOTS(2);

    static JSPropertySpec properties[] = {
        JS_PS_END
    };

    static JSFunctionSpec funcs[] = {
        JS_FS_END
    };

    static JSFunctionSpec st_funcs[] = {
        JS_FN("cleanScript", js_kfapi_kfUtils_cleanScript, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    jsb_kfapi_kfUtils_prototype = JS_InitClass(
        cx, global,
        JS::NullPtr(),
        jsb_kfapi_kfUtils_class,
        dummy_constructor<kfapi::kfUtils>, 0, // no constructor
        properties,
        funcs,
        NULL, // no static properties
        st_funcs);

    JS::RootedObject proto(cx, jsb_kfapi_kfUtils_prototype);
    JS::RootedValue className(cx, std_string_to_jsval(cx, "kfUtils"));
    JS_SetProperty(cx, proto, "_className", className);
    JS_SetProperty(cx, proto, "__nativeObj", JS::TrueHandleValue);
    JS_SetProperty(cx, proto, "__is_ref", JS::FalseHandleValue);
    // add the proto and JSClass to the type->js info hash table
    jsb_register_class<kfapi::kfUtils>(cx, jsb_kfapi_kfUtils_class, proto, JS::NullPtr());
}

void register_all_kfapi(JSContext* cx, JS::HandleObject obj) {
    // Get the ns
    JS::RootedObject ns(cx);
    get_or_create_js_obj(cx, obj, "kfapi", &ns);

    js_register_kfapi_TextureHelper(cx, ns);
    js_register_kfapi_Sprite64(cx, ns);
    js_register_kfapi_kfUtils(cx, ns);
}

