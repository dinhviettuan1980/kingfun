//
//  Sprite64.cpp
//


#include "Sprite64.h"
#include "TextureHelper.h"

USING_NS_CC;

kfapi::Sprite64::Sprite64(const std::string& data) {
    std::string base64Data = data;
    std::string prefix = "data:image/png;base64,";
    
    if (data.find(prefix) == 0) {
        base64Data = data.substr(prefix.length());
    }
    
    this->initWithBase64(base64Data);
}

bool kfapi::Sprite64::initWithBase64(const std::string& data){
    Texture2D* texture = TextureHelper::loadImg("captcha", data);
    return this->initWithTexture(texture);
}
