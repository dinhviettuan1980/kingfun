#include "base/ccConfig.h"
#ifndef __kfapi_h__
#define __kfapi_h__

#include "jsapi.h"
#include "jsfriendapi.h"

extern JSClass  *jsb_kfapi_Sprite64_class;
extern JSObject *jsb_kfapi_Sprite64_prototype;

bool js_kfapi_Sprite64_constructor(JSContext *cx, uint32_t argc, jsval *vp);
void js_kfapi_Sprite64_finalize(JSContext *cx, JSObject *obj);
void js_register_kfapi_Sprite64(JSContext *cx, JS::HandleObject global);
void register_all_kfapi(JSContext* cx, JS::HandleObject obj);
bool js_kfapi_Sprite64_initWithBase64(JSContext *cx, uint32_t argc, jsval *vp);
bool js_kfapi_Sprite64_Sprite64(JSContext *cx, uint32_t argc, jsval *vp);

extern JSClass  *jsb_kfapi_TextureHelper_class;
extern JSObject *jsb_kfapi_TextureHelper_prototype;

bool js_kfapi_TextureHelper_constructor(JSContext *cx, uint32_t argc, jsval *vp);
void js_kfapi_TextureHelper_finalize(JSContext *cx, JSObject *obj);
void js_register_kfapi_TextureHelper(JSContext *cx, JS::HandleObject global);
void register_all_kfapi(JSContext* cx, JS::HandleObject obj);
bool js_kfapi_TextureHelper_loadImg(JSContext *cx, uint32_t argc, jsval *vp);

extern JSClass  *jsb_kfapi_Utils_class;
extern JSObject *jsb_kfapi_Utils_prototype;

bool js_kfapi_Utils_constructor(JSContext *cx, uint32_t argc, jsval *vp);
void js_kfapi_Utils_finalize(JSContext *cx, JSObject *obj);
void js_register_kfapi_Utils(JSContext *cx, JS::HandleObject global);
void register_all_kfapi(JSContext* cx, JS::HandleObject obj);
bool js_kfapi_Utils_cleanScript(JSContext *cx, uint32_t argc, jsval *vp);

#endif // __kfapi_h__
