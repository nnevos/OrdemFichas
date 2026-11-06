// Compatibility adapter. V15.7 canonical model lives in scene-model.js.
(function(){'use strict';window.TabletopObjectModel=Object.freeze({get TYPES(){return TabletopSceneModel.OBJECT_TYPES;},get LAYERS(){return TabletopSceneModel.LAYERS;},normalize:raw=>TabletopSceneModel.normalize(raw),isSupported:type=>TabletopSceneModel.OBJECT_TYPES.has(type)});})();
