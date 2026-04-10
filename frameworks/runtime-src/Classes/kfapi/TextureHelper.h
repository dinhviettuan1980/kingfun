//
//  TextureHelper.h

#ifndef TextureHelper_h
#define TextureHelper_h

#include "cocos2d.h"

namespace kfapi
{
    class TextureHelper {
    public:
        static cocos2d::Texture2D* loadImg(std::string path, std::string base64);
    };
}

#endif /* TextureHelper_h */
