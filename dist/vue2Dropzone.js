!function(e,o){"object"==typeof exports&&"undefined"!=typeof module?module.exports=o():"function"==typeof define&&define.amd?define(o):e.vue2Dropzone=o()}(this,function(){"use strict";var e={getSignedURL:function(e,o,n){e.name,e.type;return new Promise(function(e,t){var i=new XMLHttpRequest;i.open("POST",o),i.onload=function(){200==i.status?e(JSON.parse(i.response)):t(i.statusText)},i.onerror=function(e){console.error("Network Error : Could not send request to AWS (Maybe CORS errors)"),t(e)},Object.entries(n).forEach(function(e){var o=e[0],n=e[1];i.setRequestHeader(o,n)}),i.send()})},sendFile:function(e,o,n){var t=new FormData;return this.getSignedURL(e,o,n).then(function(o){var n=o.signature;return Object.keys(n).forEach(function(e){t.append(e,n[e])}),t.append("file",e),new Promise(function(e,n){var i=new XMLHttpRequest;i.open("POST",o.postEndpoint),i.onload=function(){if(201==i.status){var o=(t=(new window.DOMParser).parseFromString(i.response,"text/xml")).firstChild.children[0].innerHTML;e({success:!0,message:o})}else{var t=(new window.DOMParser).parseFromString(i.response,"text/xml"),r=t.firstChild.children[0].innerHTML;n({success:!1,message:r+". Request is marked as resolved when returns as status 201"})}},i.onerror=function(e){var o=(new window.DOMParser).parseFromString(i.response,"text/xml").firstChild.children[1].innerHTML;n({success:!1,message:o})},i.send(t)})}).catch(function(e){return e})}};return{render:function(){var e=this,o=e.$createElement;return(e._self._c||o)("div",{ref:"dropzoneElement",class:{"vue-dropzone dropzone":e.includeStyling},attrs:{id:e.id}})},staticRenderFns:[],props:{id:{type:String,required:!0},options:{type:Object,required:!0},includeStyling:{type:Boolean,default:!0,required:!1},awss3:{type:Object,required:!1,default:null},destroyDropzone:{type:Boolean,default:!0,required:!1}},data:function(){return{isS3:!1,wasQueueAutoProcess:!0}},computed:{dropzoneSettings:function(){var e={thumbnailWidth:200,thumbnailHeight:200};return Object.keys(this.options).forEach(function(o){e[o]=this.options[o]},this),null!==this.awss3&&(e.autoProcessQueue=!1,this.isS3=!0,void 0!==this.options.autoProcessQueue&&(this.wasQueueAutoProcess=this.options.autoProcessQueue)),e}},methods:{manuallyAddFile:function(e,o){var n=this;e.manuallyAdded=!0,this.dropzone.emit("addedfile",e),o&&this.dropzone.emit("thumbnail",e,o);for(var t=e.previewElement.querySelectorAll("[data-dz-thumbnail]"),i=0;i<t.length;i++)t[i].style.width=n.dropzoneSettings.thumbnailWidth+"px",t[i].style.height=n.dropzoneSettings.thumbnailHeight+"px",t[i].style["object-fit"]="contain";this.dropzone.emit("complete",e),this.dropzone.options.maxFiles&&this.dropzone.options.maxFiles--,this.dropzone.files.push(e),this.$emit("vdropzone-file-added-manually",e)},setOption:function(e,o){this.dropzone.options[e]=o},removeAllFiles:function(e){this.dropzone.removeAllFiles(e)},processQueue:function(){var e=this,o=this.dropzone;this.isS3&&!this.wasQueueAutoProcess?this.getQueuedFiles().forEach(function(o){e.getSignedAndUploadToS3(o)}):this.dropzone.processQueue(),this.dropzone.on("success",function(){o.options.autoProcessQueue=!0}),this.dropzone.on("queuecomplete",function(){o.options.autoProcessQueue=!1})},init:function(){return this.dropzone.init()},destroy:function(){return this.dropzone.destroy()},updateTotalUploadProgress:function(){return this.dropzone.updateTotalUploadProgress()},getFallbackForm:function(){return this.dropzone.getFallbackForm()},getExistingFallback:function(){return this.dropzone.getExistingFallback()},setupEventListeners:function(){return this.dropzone.setupEventListeners()},removeEventListeners:function(){return this.dropzone.removeEventListeners()},disable:function(){return this.dropzone.disable()},enable:function(){return this.dropzone.enable()},filesize:function(e){return this.dropzone.filesize(e)},accept:function(e,o){return this.dropzone.accept(e,o)},addFile:function(e){return this.dropzone.addFile(e)},removeFile:function(e){this.dropzone.removeFile(e)},getAcceptedFiles:function(){return this.dropzone.getAcceptedFiles()},getRejectedFiles:function(){return this.dropzone.getRejectedFiles()},getFilesWithStatus:function(){return this.dropzone.getFilesWithStatus()},getQueuedFiles:function(){return this.dropzone.getQueuedFiles()},getUploadingFiles:function(){return this.dropzone.getUploadingFiles()},getAddedFiles:function(){return this.dropzone.getAddedFiles()},getActiveFiles:function(){return this.dropzone.getActiveFiles()},getSignedAndUploadToS3:function(o){var n=this;e.sendFile(o,this.awss3.signingURL,this.awss3.headers).then(function(e){e.success?(o.s3ObjectLocation=e.message,setTimeout(function(){return n.dropzone.processFile(o)}),n.$emit("vdropzone-s3-upload-success",e.message)):"undefined"!=typeof message?n.$emit("vdropzone-s3-upload-error",e.message):n.$emit("vdropzone-s3-upload-error","Network Error : Could not send request to AWS. (Maybe CORS error)")}).catch(function(e){alert(e)})},setAWSSigningURL:function(e){this.isS3&&(this.awss3.signingURL=e)}},mounted:function(){if(!this.$isServer||!this.hasBeenMounted){this.hasBeenMounted=!0;var e=require("dropzone");e.autoDiscover=!1,this.dropzone=new e(this.$refs.dropzoneElement,this.dropzoneSettings);var o=this;this.dropzone.on("thumbnail",function(e,n){o.$emit("vdropzone-thumbnail",e,n)}),this.dropzone.on("addedfile",function(e){o.duplicateCheck&&this.files.length&&this.files.forEach(function(n){n.name===e.name&&(this.removeFile(e),o.$emit("duplicate-file",e))},this),o.$emit("vdropzone-file-added",e),o.isS3&&o.wasQueueAutoProcess&&o.getSignedAndUploadToS3(e)}),this.dropzone.on("addedfiles",function(e){o.$emit("vdropzone-files-added",e)}),this.dropzone.on("removedfile",function(e){o.$emit("vdropzone-removed-file",e),e.manuallyAdded&&o.dropzone.options.maxFiles++}),this.dropzone.on("success",function(e,n){o.$emit("vdropzone-success",e,n),o.isS3&&o.wasQueueAutoProcess&&o.setOption("autoProcessQueue",!1)}),this.dropzone.on("successmultiple",function(e,n){o.$emit("vdropzone-success-multiple",e,n)}),this.dropzone.on("error",function(e,n,t){o.$emit("vdropzone-error",e,n,t)}),this.dropzone.on("errormultiple",function(e,n,t){o.$emit("vdropzone-error-multiple",e,n,t)}),this.dropzone.on("sending",function(e,n,t){o.isS3&&t.append("s3ObjectLocation",e.s3ObjectLocation),o.$emit("vdropzone-sending",e,n,t)}),this.dropzone.on("sendingmultiple",function(e,n,t){o.$emit("vdropzone-sending-multiple",e,n,t)}),this.dropzone.on("complete",function(e){o.$emit("vdropzone-complete",e)}),this.dropzone.on("completemultiple",function(e){o.$emit("vdropzone-complete-multiple",e)}),this.dropzone.on("canceled",function(e){o.$emit("vdropzone-canceled",e)}),this.dropzone.on("canceledmultiple",function(e){o.$emit("vdropzone-canceled-multiple",e)}),this.dropzone.on("maxfilesreached",function(e){o.$emit("vdropzone-max-files-reached",e)}),this.dropzone.on("maxfilesexceeded",function(e){o.$emit("vdropzone-max-files-exceeded",e)}),this.dropzone.on("processing",function(e){o.$emit("vdropzone-processing",e)}),this.dropzone.on("processing",function(e){o.$emit("vdropzone-processing",e)}),this.dropzone.on("processingmultiple",function(e){o.$emit("vdropzone-processing-multiple",e)}),this.dropzone.on("uploadprogress",function(e,n,t){o.$emit("vdropzone-upload-progress",e,n,t)}),this.dropzone.on("totaluploadprogress",function(e,n,t){o.$emit("vdropzone-total-upload-progress",e,n,t)}),this.dropzone.on("reset",function(){o.$emit("vdropzone-reset")}),this.dropzone.on("queuecomplete",function(){o.$emit("vdropzone-queue-complete")}),this.dropzone.on("drop",function(e){o.$emit("vdropzone-drop",e)}),this.dropzone.on("dragstart",function(e){o.$emit("vdropzone-drag-start",e)}),this.dropzone.on("dragend",function(e){o.$emit("vdropzone-drag-end",e)}),this.dropzone.on("dragenter",function(e){o.$emit("vdropzone-drag-enter",e)}),this.dropzone.on("dragover",function(e){o.$emit("vdropzone-drag-over",e)}),this.dropzone.on("dragleave",function(e){o.$emit("vdropzone-drag-leave",e)}),o.$emit("vdropzone-mounted")}},beforeDestroy:function(){this.destroyDropzone&&this.dropzone.destroy()}}});
//# sourceMappingURL=vue2Dropzone.js.map
