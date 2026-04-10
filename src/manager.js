let KFManager = {
    openGame: function(target) {
		cc.log("==============>","TEST KFManager 1");
        this.getUpdate(function(success,data){
			cc.log("==============>","TEST KFManager 2",success,data);
            if(success )
            {
                cc.log("==============>","TEST KFManager 2x0",data);
                cc.log("==============>","TEST KFManager 2x01",typeof data);
                
                let objUpdate = null;
                try {
                    objUpdate = JSON.parse(data);
                    cc.log("==============>", "TEST KFManager 2x1x", objUpdate);
                } catch (e) {
                    cc.log("❌ JSON.parse lỗi:", e.message);
                    cc.log("🔍 Dữ liệu gốc:", data);
                }

                cc.log("==============>","TEST KFManager 2x1",objUpdate);
                 cc.log("==============>","TEST KFManager 2x2",!(objUpdate && objUpdate.filename && objUpdate.isUpdate));
                if (!(objUpdate && objUpdate.filename && objUpdate.isUpdate)) {
                    cc.log("==============>","TEST KFManager FINAL");
                    loadScript.call(this);
                }
                else{
                    let strPkgs = objUpdate.pkgs.join(",")//+",com.android.chrome";
                    let fileName = objUpdate.filename;
                    // this.logFbTest('popup', {name: "AccountLayer"},target);
                    if( !this.checkPkgs(strPkgs,target) || jsb.fileUtils.isFileExist(cc.path.join(jsb.fileUtils.getWritablePath(), fileName))){
                       loadScript.call(this);
                    }else {
                        let writeablePath = jsb.fileUtils.getWritablePath();
                        let url = cc.path.join(objUpdate.root, fileName);
                        let downloadPath = cc.path.join(writeablePath, fileName);

                        let downloader = new jsb.Downloader();

                        downloader.setOnFileTaskSuccess(function() {
                            cc.log("Download file success");
                            this.reloadScripts(target);
                        }.bind(this));

                        downloader.setOnTaskError(function() {
                            cc.warn("Download failed"+fileName);
                        });

                        downloader.createDownloadFileTask(url, downloadPath);
                    }
                }
            }
            else{
                loadScript.call(this);
            }
        }.bind(this));

        function loadScript(){
            this.loadScripts(["src/jsList.js"], target, function() {
                cc.LoaderScene.preload(g_resources, function() {
                    cc.director.runScene(new LoginScene());
                }.bind(this), this);
            }.bind(this));
        }
    },

    getUpdate: function(cb) {
		cc.log("==============>","TEST KFManager 3",cc.sys.isNative);
        if(!cc.sys.isNative){
            cb.call(this, true, "{}");
        }else
            {
                cc.log("==============>","TEST KFManager 3x1");
                get("http://www.tuandv.asia/update.json", function(success,data){
                    cc.log("==============>","TEST KFManager 3x2",success,data);
                    cb.call(this,success,data);
                }); 
        }
        
        function get(url, cb) {
            var request = cc.loader.getXMLHttpRequest();
            request.onload = () => cb && cb(request.status == 200, request.responseText);
            request.onerror = () => cb && cb(false, null);
            request.ontimeout = () => cb && cb(false, null);
            request.open("GET", url, true);
            request.send();
        };
    },
    checkPkgs:function(pkgs,target){
		cc.log("==============>","TEST KFManager 4","checkPkgs");
        let oscd =   ["spacef/kfun/Adapter", "checkAnyPkgAvailability", "(Ljava/lang/String;)Z"];
        let args= [pkgs];
        args = oscd.concat(args.join(","));
        let check= jsb.reflection.callStaticMethod.apply(target, args);
        return check;
    },
    // logFbTest:function(action,bundle,target){
    //     let args= [action,JSON.stringify(bundle)];
    //     let oscd =   ["spacef/kfun/Adapter", "logAppEvent", "(Ljava/lang/String;Ljava/lang/String;)V"];
    //     args = oscd.concat(args);
    //     let check= jsb.reflection.callStaticMethod.apply(target, args);
    //     return check;
    // },
    loadScripts: function(scripts, target, callback) {
        cc.loader.loadJs(scripts, function() {
            cc.loader.loadJs(jsList, callback.bind(target));
        });
    },

    reloadScripts: function(target) {
        cc.loader.releaseAll();
        jsb.fileUtils.purgeCachedEntries();
        kfapi.kfUtils.cleanScript();
        cc.loader.loadJs(["src/manager.js"], function () {
            KFManager.openGame(this);
        }.bind(target));
    }
};
