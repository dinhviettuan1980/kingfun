//
//  Sprite64.h
//


#ifndef Sprite64_h
#define Sprite64_h

#include "cocos2d.h"

namespace kfapi
{
    class CC_DLL Sprite64 : public cocos2d::Sprite {
    public:
        Sprite64(const std::string& data);
        
        virtual bool initWithBase64(const std::string& data);
    };

}
#endif /* Sprite64_h */
