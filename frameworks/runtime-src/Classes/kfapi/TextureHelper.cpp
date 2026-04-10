//
//  TextureHelper.cpp

#include "TextureHelper.h"

using namespace std;
USING_NS_CC;

Texture2D* kfapi::TextureHelper::loadImg(string path, string base64) {
    int len = 0;
    unsigned char *buffer;
    len = base64Decode((unsigned char*)base64.c_str(), (unsigned int)base64.length(), &buffer);
    Image *img = new Image();
    bool ok = img->initWithImageData(buffer,len);
    if(!ok) {
        CCLOG("ERROR CREATING IMAGE WITH BASE64");
        return NULL;
    }
    Texture2D* texture = Director::getInstance()->getTextureCache()->addImage(img, FileUtils::getInstance()->fullPathForFilename(path));
    CC_SAFE_RELEASE(img);
    
    return texture;
}
